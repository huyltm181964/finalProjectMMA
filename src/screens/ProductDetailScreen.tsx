import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { getProductById, getProducts, getAverageRating } from '../data/mockProducts';
// AsyncStorage removed: add-to-cart is no longer available on this screen

type Props = NativeStackScreenProps<AppStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any | null>(null);
  const [avg, setAvg] = useState<number>(0);

  useEffect(() => {
    const load = () => {
      // more robust lookup: accept productId as id string/number, product name, or a full product object
      let p: any = null;
      try {
        const products = getProducts();
        const strip = (s: any) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // if a full product object was passed
        if (productId && typeof productId === 'object') {
          const pAny = productId as any;
          if (pAny.id) {
            p = getProductById(String(pAny.id).toLowerCase().trim());
          }
          if (!p && pAny.name) {
            const key = strip(pAny.name);
            p = products.find((x) => strip(x.name) === key || strip(x.name).includes(key) || key.includes(strip(x.name))) || null;
          }
        } else {
          // try direct id match first
          p = getProductById(String(productId).toLowerCase().trim());
          if (!p) {
            // try matching by name (or partial name)
            const key = strip(productId as any);
            p = products.find((x) => strip(x.name) === key || strip(x.name).includes(key) || key.includes(strip(x.name))) || null;

            // fallback: numeric indices sometimes used in demos (1 -> p_cam, 2 -> p_tao, 3 -> p_nho)
            if (!p && /^[0-9]+$/.test(String(productId))) {
              const map: Record<string, string> = { '1': 'p_cam', '2': 'p_tao', '3': 'p_nho' };
              const mapped = map[String(productId)];
              if (mapped) p = getProductById(mapped);
            }
          }
        }
      } catch (e) {
        console.error('product detail lookup', e);
      }

      console.log('ProductDetailScreen.load -> looking for productId param', productId, 'resolved product=', p);
      setProduct(p);

      // Dùng mockProducts để tính avg và lấy reviews (đã merge persisted)
      if (p) {
        const rating = getAverageRating(p.id);
        setAvg(rating);
        console.log(`ProductDetail: avg rating ${rating} from ${p.reviews?.length || 0} reviews`);
      } else {
        setAvg(0);
      }
    };

    // initial load
    load();

    // reload when the screen gains focus so newly submitted reviews show up
    const unsub = navigation.addListener('focus', () => {
      load();
    });

    return () => {
      unsub && unsub();
    };
  }, [productId, navigation]);

  // addToCart removed from ProductDetailScreen per request

  if (!product) return <View style={styles.container}><Text>Sản phẩm không tìm thấy</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.headerImage} />
      ) : null}

      <View style={{ padding: 16 }}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={{ color: '#666', marginTop: 6 }}>Giá: {product.price.toLocaleString()} đ • Trái cây</Text>
        <Text style={{ marginTop: 12 }}>{product.description}</Text>

        {/* Thêm vào giỏ hàng đã bị loại bỏ khỏi màn hình chi tiết sản phẩm */}

        <Text style={{ marginTop: 20, fontWeight: '700' }}>Đánh giá trung bình: {Math.round(avg)} / 5 ({product.reviews?.length || 0} đánh giá)</Text>

        <View style={{ marginTop: 12 }}>
          {(product.reviews || []).length === 0 ? (
            <Text>Chưa có đánh giá</Text>
          ) : (
            (product.reviews || []).map((item: any) => (
              <View key={item.id} style={styles.review}>
                <Text style={{ fontWeight: '700' }}>Đánh giá: {item.rating} / 5</Text>
                {item.comment ? <Text>{item.comment}</Text> : null}
                <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  review: { padding: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 8 },
  headerImage: { width: '100%', height: 220 },
  // add-to-cart styles removed
});

export default ProductDetailScreen;