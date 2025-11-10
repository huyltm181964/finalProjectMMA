import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Order, OrderItem } from '../types';
import { getOrderById, getOrdersForUser } from '../data/mockOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../data/mockProducts';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderDetail'>;

const OrderDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [orderIndex, setOrderIndex] = useState<number | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      let o = await getOrderById(orderId);

      // fallback: if order came back null or has no items, try reading persisted orders directly
      if (!o || !Array.isArray(o.items) || o.items.length === 0) {
        try {
          const raw = await AsyncStorage.getItem('orders');
          const stored = raw ? JSON.parse(raw) : [];
          const foundStored = (stored || []).find((x: any) => x.id === orderId);
          if (foundStored) {
            const items = (foundStored.items || []).map((it: any, i: number) => ({
              id: it.id?.toString() ?? `${foundStored.id}_it_${i}`,
              productId: it.productId ?? it.id ?? `p_${i}`,
              name: it.name ?? it.title ?? 'Sản phẩm',
              price: Number(it.price ?? it.unitPrice ?? 0),
              quantity: Number(it.quantity ?? it.qty ?? 1),
              image: it.image,
              reviewed: it.reviewed || false,
              review: it.review || undefined,
            }));

            o = {
              id: foundStored.id,
              userId: foundStored.userId ?? 'u1',
              createdAt: foundStored.createdAt ?? foundStored.date ?? new Date().toISOString(),
              items,
              total: Number(foundStored.total ?? items.reduce((s: number, it: any) => s + (it.price || 0) * (it.quantity || 1), 0)),
              status: foundStored.status ?? 'pending',
            } as Order;
          }
        } catch (e) {
          console.error('OrderDetail fallback read', e);
        }
      }

      // enrich items with canonical product data from mockProducts so the display matches Home
      try {
        const products = getProducts();
        const strip = (s: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (o && Array.isArray(o.items)) {
          const items = o.items.map((it) => {
            let pid = it.productId as any;
            if (!pid) {
              const key = strip(it.name || it.productId || '');
              const found = products.find((p) => strip(p.name) === key || strip(p.name).includes(key) || key.includes(strip(p.name)));
              if (found) pid = found.id;
            }

            if (pid && /^[0-9]+$/.test(String(pid))) {
              const num = Number(pid);
              const map: Record<number, string> = { 1: 'p_cam', 2: 'p_tao', 3: 'p_nho' };
              pid = map[num] || pid;
            }

            const prod = products.find((p) => p.id === pid) || null;
            return {
              ...it,
              productId: pid ?? it.productId ?? (prod ? prod.id : it.productId),
              name: it.name ?? prod?.name ?? it.productId ?? 'Sản phẩm',
              price: it.price ?? prod?.price ?? 0,
              image: it.image ?? prod?.image,
            };
          });
          o = { ...o, items } as Order;
        }
      } catch (e) {
        console.error('order item enrichment', e);
      }

      if (mounted) setOrder(o);
      // determine sequential index for display (1-based)
      const uid = user?.username ?? 'u1';
      const all = await getOrdersForUser(uid);
      const idx = all.findIndex((x) => x.id === orderId);
      if (mounted) setOrderIndex(idx >= 0 ? idx + 1 : null);
    };
    // initial load
    load();

    // also reload whenever this screen receives focus (so reviews saved from ReviewScreen are reflected)
    const unsub = navigation.addListener('focus', () => {
      load();
    });

    return () => {
      mounted = false;
      unsub && unsub();
    };
  }, [orderId, user, navigation]);

  if (!order) return <View style={styles.container}><Text>Đang tải...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết đơn {orderIndex ?? order.id}</Text>
      <Text>Ngày: {new Date(order.createdAt).toLocaleString()}</Text>
      <Text>Tổng: {order.total.toLocaleString()} đ</Text>

      <FlatList
        data={order.items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>SL: {item.quantity} • {item.price.toLocaleString()} đ</Text>
              {/* show per-order review if present */}
              {item.review ? (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontWeight: '700' }}>Đánh giá của đơn: {item.review.rating} / 5</Text>
                  {item.review.comment ? <Text>{item.review.comment}</Text> : null}
                  {item.review.createdAt ? <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.review.createdAt).toLocaleString()}</Text> : null}
                </View>
              ) : null}
            </View>
            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Button
                  title="Chi tiết"
                  onPress={() => navigation.navigate('ProductDetail', { productId: ({ id: item.productId, name: item.name, image: item.image, price: item.price } as any) })}
                />
              </View>

              <View style={styles.actionBtn}>
                <Button
                  title={item.reviewed ? 'Đánh giá lại' : 'Đánh giá'}
                  onPress={() => navigation.navigate('Review', { orderId: order.id, productId: item.productId })}
                />
              </View>
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
