import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Order } from '../types';
import { getOrdersForUser } from '../data/mockOrders';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderHistory'>;

const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // demo: current user id u1
    const data = getOrdersForUser('u1');
    setOrders(data);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>
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
            <Text>Tổng: ${item.total.toFixed(2)}</Text>
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
