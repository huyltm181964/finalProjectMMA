import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { markItemReviewed } from '../data/mockOrders';

type Props = NativeStackScreenProps<AppStackParamList, 'Review'>;

const ReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId, productId } = route.params || {};
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  function submit() {
    if (!productId || !orderId) {
      alert('Thiếu thông tin sản phẩm/đơn hàng để gửi đánh giá.');
      return;
    }

    // simple id generator to avoid crypto/uuid issues in React Native environment
    const id = `r_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const review = {
      id,
      productId,
      userId: 'u1',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    const ok = markItemReviewed(orderId, productId, review as any);
    if (!ok) {
      alert('Không thể lưu đánh giá — vui lòng thử lại.');
      return;
    }

    navigation.goBack();
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
        placeholder="Viết nhận xét (tùy chọn)"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        multiline
      />
      <Button title="Gửi đánh giá" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginVertical: 12, minHeight: 80 },
});

export default ReviewScreen;
