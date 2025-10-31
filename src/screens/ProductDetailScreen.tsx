import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { getProductById, getAverageRating } from '../data/mockProducts';

type Props = NativeStackScreenProps<AppStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { productId } = route.params;
  const product = getProductById(productId);

  if (!product) return <View style={styles.container}><Text>Sản phẩm không tìm thấy</Text></View>;

  const avg = getAverageRating(productId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text style={{ marginTop: 8 }}>Giá: ${product.price.toFixed(2)}</Text>
      <Text style={{ marginTop: 8 }}>Đánh giá trung bình: {avg.toFixed(1)} / 5</Text>

      <Text style={{ marginTop: 12, fontWeight: '700' }}>Các đánh giá</Text>
      <FlatList
        data={product.reviews || []}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <View style={styles.review}>
            <Text style={{ fontWeight: '700' }}>Rating: {item.rating} / 5</Text>
            {item.comment ? <Text>{item.comment}</Text> : null}
            <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Chưa có đánh giá</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  review: { padding: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 8 },
});

export default ProductDetailScreen;
