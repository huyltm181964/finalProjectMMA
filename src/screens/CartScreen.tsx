import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { Appbar, Button, Card, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type CartItem = {
  id?: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigation = useNavigation<any>();

  const loadCart = async () => {
    try {
      const data = await AsyncStorage.getItem('cart');
      if (data) setCart(JSON.parse(data));
      else setCart([]);
    } catch (e) {
      console.error('loadCart', e);
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    try {
      setCart(newCart);
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('saveCart', e);
    }
  };

  const clearCart = async () => {
    await AsyncStorage.removeItem('cart');
    setCart([]);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, (newCart[index].quantity || 1) + delta);
    saveCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    saveCart(newCart);
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }
    navigation.navigate('Checkout');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCart);
    return unsubscribe;
  }, [navigation]);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Giỏ hàng 🛒" />
        <Appbar.Action icon="delete" onPress={() => {
          Alert.alert('Xoá giỏ hàng', 'Bạn có chắc muốn xoá toàn bộ giỏ hàng?', [
            { text: 'Huỷ', style: 'cancel' },
            { text: 'Xoá', style: 'destructive', onPress: clearCart },
          ]);
        }} />
      </Appbar.Header>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Text>Giỏ hàng trống</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item, index }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={`${item.price.toLocaleString()} đ`} />
              {item.image ? <Card.Cover source={{ uri: item.image }} /> : null}

              <Card.Actions style={styles.actions}>
                <View style={styles.qtyRow}>
                  <IconButton icon="minus" mode="contained" size={20} onPress={() => updateQuantity(index, -1)} />
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <IconButton icon="plus" mode="contained" size={20} onPress={() => updateQuantity(index, 1)} />
                </View>

                <View style={styles.rightActions}>
                  <Text style={styles.subtotalText}>{((item.price || 0) * (item.quantity || 1)).toLocaleString()} đ</Text>
                  <IconButton icon="delete" onPress={() => removeItem(index)} />
                </View>
              </Card.Actions>
            </Card>
          )}
        />
      )}

      <View style={styles.footer}>
        <View>
          <Text>Tổng: {total.toLocaleString()} đ</Text>
        </View>
        <Button mode="contained" onPress={goToCheckout} style={styles.checkoutButton}>
          Thanh toán
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { margin: 10 },
  actions: { justifyContent: 'space-between', alignItems: 'center' },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyText: { marginHorizontal: 8, minWidth: 24, textAlign: 'center' },
  rightActions: { flexDirection: 'row', alignItems: 'center' },
  subtotalText: { marginRight: 8, fontWeight: '600' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButton: { minWidth: 140 },
});
