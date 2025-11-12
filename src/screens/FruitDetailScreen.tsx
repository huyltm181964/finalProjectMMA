import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Alert } from 'react-native'; // <-- thêm Alert
import { Appbar, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getProducts } from '../data/mockProducts';

export default function FruitDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<any>>();
  const { fruit } = route.params as any;
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('cart').then((data) => {
      if (data) setCart(JSON.parse(data));
    });
  }, []);

  const addToCart = async () => {
    const stored = (await AsyncStorage.getItem('cart')) || '[]';
    const existingCart = JSON.parse(stored);

    // Kiểm tra nếu sản phẩm đã có trong giỏ thì tăng số lượng
    const index = existingCart.findIndex((p: any) => p.id === fruit.id);
    if (index !== -1) {
      existingCart[index].quantity = (existingCart[index].quantity || 1) + 1;
    } else {
      existingCart.push({ ...fruit, quantity: 1 });
    }

    await AsyncStorage.setItem('cart', JSON.stringify(existingCart));
    setCart(existingCart);
    Alert.alert('✅ Đã thêm vào giỏ hàng!'); // <-- dùng Alert.alert
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={fruit.name} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image
          source={{ uri: fruit.image }}
          style={{ width: '100%', height: 250, borderRadius: 8 }}
        />
        <Text variant="titleLarge" style={{ marginTop: 10 }}>
          {fruit.name}
        </Text>
        <Text style={{ color: '#555', marginBottom: 10 }}>Loại: {fruit.type}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          {fruit.price.toLocaleString()} đ
        </Text>
        <Text>{fruit.description}</Text>

        <Button mode="contained" icon="cart" style={{ marginTop: 16 }} onPress={addToCart}>
          Thêm vào giỏ hàng
        </Button>

        <Button
          mode="outlined"
          style={{ marginTop: 12 }}
          onPress={() => {
            const products = getProducts();
            const match = products.find(
              (p) =>
                p.name.toLowerCase().includes(String(fruit.name).toLowerCase()) ||
                String(fruit.name).toLowerCase().includes(p.name.toLowerCase())
            );
            if (match) {
              navigation.navigate('ProductDetail', { productId: match.id });
            } else {
              Alert.alert( // <-- dùng Alert.alert
                'Chưa có đánh giá',
                'Chưa có đánh giá cho sản phẩm này trong dữ liệu mẫu.\nBạn có thể thử luồng: Lịch sử đơn hàng → Chi tiết đơn → Chi tiết sản phẩm.'
              );
            }
          }}
        >
          Xem đánh giá
        </Button>
      </ScrollView>
    </View>
  );
}
