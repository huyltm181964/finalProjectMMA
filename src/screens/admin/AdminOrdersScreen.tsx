import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, Button, Card, Chip, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../../types';

const ORDERS_KEY = 'orders';

export default function AdminOrdersScreen() {
  const [items, setItems] = useState<Order[]>([]);

  const load = async () => {
    const raw = (await AsyncStorage.getItem(ORDERS_KEY)) || '[]';
    const list: Order[] = JSON.parse(raw);
    setItems(list as any);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Order['status']) => {
    const raw = (await AsyncStorage.getItem(ORDERS_KEY)) || '[]';
    const list: Order[] = JSON.parse(raw);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      (list[idx] as any).status = status;
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(list));
      await load();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Admin • Đơn hàng" />
      </Appbar.Header>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Card.Title title={`Đơn: ${item.id}`} subtitle={`${new Date(item.createdAt).toLocaleString()}  •  Tổng: ${item.total?.toLocaleString?.() || 0} đ`} />
            <Card.Content>
              <Text>Trạng thái hiện tại: {item.status}</Text>
            </Card.Content>
            <Card.Actions style={{ flexWrap: 'wrap' }}>
              <Chip mode="outlined" style={{ marginRight: 6, marginBottom: 6 }} onPress={() => updateStatus(item.id, 'pending')}>pending</Chip>
              <Chip mode="outlined" style={{ marginRight: 6, marginBottom: 6 }} onPress={() => updateStatus(item.id, 'shipped')}>shipped</Chip>
              <Chip mode="outlined" style={{ marginRight: 6, marginBottom: 6 }} onPress={() => updateStatus(item.id, 'delivered')}>delivered</Chip>
              <Chip mode="outlined" style={{ marginRight: 6, marginBottom: 6 }} onPress={() => updateStatus(item.id, 'cancelled')}>cancelled</Chip>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}
