import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Order, OrderItem } from '../types';
import { getOrderById, getOrdersForUser } from '../data/mockOrders';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderDetail'>;

const OrderDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [orderIndex, setOrderIndex] = useState<number | null>(null);

  useEffect(() => {
    const o = getOrderById(orderId);
    setOrder(o);
    // determine sequential index for display (1-based)
    const all = getOrdersForUser('u1');
    const idx = all.findIndex((x) => x.id === orderId);
    setOrderIndex(idx >= 0 ? idx + 1 : null);
  }, [orderId]);

  if (!order) return <View style={styles.container}><Text>Đang tải...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết đơn {orderIndex ?? order.id}</Text>
      <Text>Ngày: {new Date(order.createdAt).toLocaleString()}</Text>
      <Text>Tổng: ${order.total.toFixed(2)}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>Qty: {item.quantity} • ${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Button
                  title="Chi tiết"
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })}
                />
              </View>

              {!item.reviewed && (
                <View style={styles.actionBtn}>
                  <Button
                    title="Đánh giá"
                    onPress={() => navigation.navigate('Review', { orderId: order.id, productId: item.productId })}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  item: { flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
  itemName: { fontWeight: '600' },
  actions: { justifyContent: 'center', alignItems: 'flex-end' },
  actionBtn: { marginVertical: 6, width: 100 },
});

export default OrderDetailScreen;
