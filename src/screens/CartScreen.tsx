import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
  const [cart, setCart] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  const loadCart = async () => {
    const data = await AsyncStorage.getItem('cart');
    if (data) setCart(JSON.parse(data));
  };

  const clearCart = async () => {
    await AsyncStorage.removeItem('cart');
    setCart([]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCart);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Giỏ hàng 🛒" />
        <Appbar.Action icon="delete" onPress={clearCart} />
      </Appbar.Header>

      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Giỏ hàng trống</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card style={{ margin: 10 }}>
              <Card.Title title={item.name} subtitle={`${item.price.toLocaleString()} đ`} />
              <Card.Cover source={{ uri: item.image }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}
