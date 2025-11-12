import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboard() {
  const navigation = useNavigation<any>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Admin Dashboard</Text>
      <Button mode="contained" style={{ marginBottom: 12 }} onPress={() => navigation.navigate('AdminProducts')}>Quản lý sản phẩm</Button>
      <Button mode="contained" style={{ marginBottom: 12 }} onPress={() => navigation.navigate('AdminUsers')}>Quản lý người dùng</Button>
      <Button mode="contained" style={{ marginBottom: 12 }} onPress={() => navigation.navigate('AdminOrders')}>Quản lý đơn hàng</Button>
    </View>
  );
}
