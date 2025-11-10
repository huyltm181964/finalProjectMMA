import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList, Review } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProducts, getProductById } from "../data/mockProducts";

type Props = NativeStackScreenProps<AppStackParamList, "ProductDetail">;

const PRODUCTS_REVIEWS_KEY = "product_reviews";

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any | null>(null);
  const [avg, setAvg] = useState<number>(0);

  // hàm tính rating trung bình từ mảng reviews
  const computeAvg = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return sum / reviews.length;
  };

  const loadProduct = async () => {
    const products = getProducts();

    // Load persisted reviews từ AsyncStorage
    try {
      const raw = await AsyncStorage.getItem(PRODUCTS_REVIEWS_KEY);
      if (raw) {
        const saved: { id: string; reviews?: Review[] }[] = JSON.parse(raw);
        if (Array.isArray(saved)) {
          saved.forEach((s) => {
            const p = products.find((x) => x.id === s.id);
            if (p) p.reviews = s.reviews || [];
          });
        }
      }
    } catch (e) {
      console.error("Failed to load persisted reviews", e);
    }

    // Load product
    let p: any = null;
    if (typeof productId === "object" && productId.id) {
      p = getProductById(productId.id);
    } else {
      p = getProductById(String(productId));
    }

    setProduct(p);
    setAvg(computeAvg(p?.reviews));
  };

  useEffect(() => {
    loadProduct();

    const unsub = navigation.addListener("focus", () => {
      loadProduct(); // reload mỗi khi screen focus
    });
    return () => unsub && unsub();
  }, [productId, navigation]);

  if (!product)
    return (
      <View style={styles.container}>
        <Text>Sản phẩm không tìm thấy</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.headerImage} />
      )}
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={{ color: "#666", marginTop: 6 }}>
          Giá: {product.price.toLocaleString()} đ • Trái cây
        </Text>
        <Text style={{ marginTop: 12 }}>{product.description}</Text>

        <Text style={{ marginTop: 20, fontWeight: "700" }}>
          Đánh giá trung bình: {Math.round(avg)} / 5 (
          {product.reviews?.length || 0} đánh giá)
        </Text>

        <View style={{ marginTop: 12 }}>
          {!product.reviews || product.reviews.length === 0 ? (
            <Text>Chưa có đánh giá</Text>
          ) : (
            product.reviews.map((item: Review) => (
              <View key={item.id} style={styles.review}>
                <Text style={{ fontWeight: "700" }}>
                  Đánh giá: {item.rating} / 5
                </Text>
                {item.comment && <Text>{item.comment}</Text>}
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
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
  title: { fontSize: 20, fontWeight: "800" },
  review: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginTop: 8,
  },
  headerImage: { width: "100%", height: 220 },
});

export default ProductDetailScreen;
