import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

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
    const newCart = [...cart, fruit];
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
    alert('Đã thêm vào giỏ hàng!');
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
        <Button
          mode="contained"
          icon="cart"
          style={{ marginTop: 16 }}
          onPress={addToCart}
        >
          Thêm vào giỏ hàng
        </Button>
      </ScrollView>
    </View>
  );
}
