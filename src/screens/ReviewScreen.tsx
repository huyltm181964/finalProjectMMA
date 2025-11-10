import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Review } from '../types';
import { markItemReviewed } from '../data/mockOrders';  // Import để gọi

type Props = NativeStackScreenProps<AppStackParamList, 'Review'>;

const ReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId, productId } = route.params || {};
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function submit() {
    if (!productId || !orderId) {
      Alert.alert('Thiếu thông tin sản phẩm/đơn hàng để gửi đánh giá.');
      return;
    }

    // validation: comment must not be empty
    if (String(comment ?? '').trim().length === 0) {
      Alert.alert('Nhận xét không được để trống');
      return;
    }
    // if there's a validation error set from typing, show alert and block
    if (error) {
      Alert.alert(error);
      return;
    }

    // simple id generator
    const id = `r_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // normalize productId to a string id (handle case where productId may be an object)
    const pAny = productId as any;
    const pid = typeof productId === 'object' ? (String(pAny?.productId ?? pAny?.id ?? '')) : String(productId);

    const review: Review = {
      id,
      productId: pid,  // Raw pid, markItemReviewed sẽ normalize
      userId: 'u1',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      console.log('ReviewScreen.submit -> sending review to markItemReviewed', { orderId, pid, review });

      // Gọi markItemReviewed: Nó handle normalize pid, lưu review vào mockProducts, mark reviewed = true
      const ok = await markItemReviewed(orderId, pid, review);
      if (!ok) {
        Alert.alert('Không thể lưu đánh giá — vui lòng thử lại.');
        return;
      }

      Alert.alert('Cảm ơn bạn đã đánh giá!');
      navigation.goBack();  // OrderDetail reload focus để ẩn nút
    } catch (e) {
      console.error('submit review', e);
      Alert.alert('Lỗi khi gửi đánh giá — vui lòng thử lại.');
    }
  }

  function handleCommentChange(text: string) {
    // enforce max length 100 and detect disallowed characters or consecutive spaces
    const raw = String(text ?? '');
    const sliced = raw.slice(0, 100);

    let cleaned = sliced;
    let foundInvalid = false;

    // remove disallowed chars using Unicode-aware regex when available
    try {
      const unicodeRegex = new RegExp('[^\\p{L}\\p{N}\\s]', 'gu');
      const afterRemove = sliced.replace(unicodeRegex, '');
      if (afterRemove !== sliced) foundInvalid = true;
      cleaned = afterRemove;
    } catch (_e) {
      const afterRemove = sliced.replace(/[^A-Za-z0-9\s]/g, '');
      if (afterRemove !== sliced) foundInvalid = true;
      cleaned = afterRemove;
    }

    // collapse multiple spaces into single space and flag if multiple found
    if (/\s{2,}/.test(sliced)) {
      foundInvalid = true;
    }
    const collapsed = cleaned.replace(/\s{2,}/g, ' ');

    setComment(collapsed);
    if (collapsed.trim().length === 0) {
      setError('Nhận xét không được để trống.');
    } else if (foundInvalid) {
      setError('Chỉ được nhập số và kí tự');
    } else {
      setError('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá sản phẩm</Text>
      <Text>Rating: {rating}</Text>
      <View style={{ flexDirection: 'row', marginVertical: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Button key={n} title={String(n)} onPress={() => setRating(n)} />
        ))}
      </View>
      <TextInput
        placeholder="Viết nhận xét"
        value={comment}
        onChangeText={handleCommentChange}
        style={styles.input}
        multiline
        maxLength={100}
        accessibilityLabel="input-comment"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Gửi đánh giá" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginVertical: 12, minHeight: 80 },
  error: { color: 'red', marginBottom: 8 },
});

export default ReviewScreen;