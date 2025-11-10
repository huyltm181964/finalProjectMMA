import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Button, Card, Text, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../data/mockProducts';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('COD');

  const loadData = async () => {
    const cartData = await AsyncStorage.getItem('cart');
    setCart(cartData ? JSON.parse(cartData) : []);
    const lastAddress = await AsyncStorage.getItem('lastAddress');
    setAddress(lastAddress ? JSON.parse(lastAddress) : null);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  const { user } = useAuth();

  const placeOrder = async () => {
    if (!address) {
      Alert.alert('Thiếu địa chỉ', 'Vui lòng chọn hoặc nhập địa chỉ giao hàng.');
      return;
    }

    // normalize order to match app Order shape
    const products = getProducts();
    const order = {
      id: `order_${Date.now()}`,
      userId: user?.username ?? 'u1',
      createdAt: new Date().toISOString(),
      items: cart.map((it, idx) => {
        // try to preserve a canonical productId that matches mockProducts
        let pid = (it as any).productId || (it.id != null ? `p_${it.id}` : undefined);
        // try matching by name if we don't have a productId
        if (!pid) {
          const found = products.find((p) => p.name === it.name);
          if (found) pid = found.id;
        }

        return {
          id: it.id?.toString() ?? `oi_${Date.now()}_${idx}`,
          productId: pid ?? it.name,
          name: it.name,
          price: it.price,
          quantity: it.quantity || 1,
          image: it.image,
        };
      }),
      total,
      address,
      paymentMethod,
      status: 'pending',
    };

    try {
      const data = await AsyncStorage.getItem('orders');
      const orders = data ? JSON.parse(data) : [];
      orders.push(order);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      // clear cart
      await AsyncStorage.removeItem('cart');
      Alert.alert('Đặt hàng thành công', 'Đơn hàng của bạn đã được lưu.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (e) {
      console.error('placeOrder', e);
      Alert.alert('Lỗi', 'Không thể lưu đơn hàng.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Thanh toán" />
      </Appbar.Header>

      <View style={styles.container}>
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Tổng đơn" subtitle={`${total.toLocaleString()} đ`} />
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Địa chỉ giao hàng" />
          <Card.Content>
            {address ? (
              <View>
                <Text>{address.fullName}</Text>
                <Text>{address.phone}</Text>
                <Text>{address.street}</Text>
                <Text>{address.city}</Text>
              </View>
            ) : (
              <Text>Chưa có địa chỉ</Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Address')}>Chọn / Thêm địa chỉ</Button>
          </Card.Actions>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Phương thức thanh toán" />
          <Card.Content>
            <RadioButton.Group onValueChange={v => setPaymentMethod(v)} value={paymentMethod}>
              <RadioButton.Item label="Thanh toán khi nhận hàng (COD)" value="COD" />
              {/* Có thể thêm phương thức khác ở tương lai */}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={placeOrder} style={{ marginTop: 12 }}>
          Đặt hàng
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
});
