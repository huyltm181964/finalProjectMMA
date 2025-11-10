import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Order } from '../types';
import { getOrdersForUser } from '../data/mockOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderHistory'>;

const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const uid = user?.username ?? 'u1';
      const data = await getOrdersForUser(uid);
      if (mounted) setOrders(data);
    };

    // load once and also reload when screen gains focus (so newly saved orders appear)
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const clearData = async () => {
    try {
      // clear entire AsyncStorage (only for testing) - you may prefer selective removal
      await AsyncStorage.clear();
      // Or selective: await AsyncStorage.multiRemove(['product_reviews', 'orders', 'cart']);
      Alert.alert('✅ Đã reset data test!');
      // update local state to reflect cleared storage
      setOrders([]);
    } catch (e) {
      console.error('Clear data error', e);
      Alert.alert('Lỗi reset data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>
      <TouchableOpacity onPress={clearData} style={{ backgroundColor: 'red', padding: 10, marginBottom: 12, borderRadius: 6 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>KIỂM TRA DỮ LIỆU ĐẶT LẠI</Text>
      </TouchableOpacity>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            {/* show sequential number instead of raw id */}
            <Text style={styles.orderId}>Đơn hàng: {index + 1}</Text>
            <Text>Ngày: {new Date(item.createdAt).toLocaleString()}</Text>
            <Text>Tổng: {item.total.toLocaleString()} đ</Text>
            <Text>Trạng thái: {item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Không có đơn hàng</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
  orderId: { fontWeight: '700' },
});

export default OrderHistoryScreen;
