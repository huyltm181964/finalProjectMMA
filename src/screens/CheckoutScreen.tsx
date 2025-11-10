import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Button, Card, Text, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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

  const placeOrder = async () => {
  if (!address) {
    Alert.alert('Thiếu địa chỉ', 'Vui lòng chọn hoặc nhập địa chỉ giao hàng.');
    return;
  }

  // 🧩 Validate chi tiết địa chỉ
  const { fullName, phone, street, city } = address;

  if (!fullName || fullName.trim().length < 3) {
    Alert.alert('Lỗi địa chỉ', 'Vui lòng nhập họ tên người nhận hợp lệ (tối thiểu 3 ký tự).');
    return;
  }

  if (!phone || !/^\d{9,11}$/.test(phone.trim())) {
    Alert.alert('Lỗi địa chỉ', 'Số điện thoại không hợp lệ (chỉ gồm số, 9-11 chữ số).');
    return;
  }

  if (!street || street.trim().length < 5) {
    Alert.alert('Lỗi địa chỉ', 'Vui lòng nhập tên đường / số nhà hợp lệ.');
    return;
  }

  if (!city || city.trim().length < 2) {
    Alert.alert('Lỗi địa chỉ', 'Vui lòng nhập tên thành phố hợp lệ.');
    return;
  }

  // ✅ Nếu tất cả hợp lệ thì tạo đơn
  const order = {
    id: `order_${Date.now()}`,
    items: cart,
    total,
    address,
    paymentMethod,
    date: new Date().toISOString(),
  };

  try {
    const data = await AsyncStorage.getItem('orders');
    const orders = data ? JSON.parse(data) : [];
    orders.push(order);
    await AsyncStorage.setItem('orders', JSON.stringify(orders));
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
