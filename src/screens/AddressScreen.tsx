import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Button, Card, TextInput, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AddressScreen() {
  const navigation = useNavigation<any>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '' });

  const load = async () => {
    const data = await AsyncStorage.getItem('addresses');
    setAddresses(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const saveAddress = async () => {
    const newList = [...addresses, form];
    await AsyncStorage.setItem('addresses', JSON.stringify(newList));
    await AsyncStorage.setItem('lastAddress', JSON.stringify(form));
    navigation.goBack();
  };

  const choose = async (addr: any) => {
    await AsyncStorage.setItem('lastAddress', JSON.stringify(addr));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Địa chỉ" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        {addresses.map((a, i) => (
          <Card key={i} style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text>{a.fullName}</Text>
              <Text>{a.phone}</Text>
              <Text>{a.street}</Text>
              <Text>{a.city}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => choose(a)}>Chọn</Button>
            </Card.Actions>
          </Card>
        ))}

        <Card style={{ padding: 12 }}>
          <Card.Title title="Thêm địa chỉ mới" />
          <Card.Content>
            <TextInput label="Họ tên" value={form.fullName} onChangeText={t => setForm({ ...form, fullName: t })} />
            <TextInput label="Số điện thoại" value={form.phone} onChangeText={t => setForm({ ...form, phone: t })} keyboardType="phone-pad" />
            <TextInput label="Đường" value={form.street} onChangeText={t => setForm({ ...form, street: t })} />
            <TextInput label="Thành phố" value={form.city} onChangeText={t => setForm({ ...form, city: t })} />
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={saveAddress}>Lưu địa chỉ</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
});
