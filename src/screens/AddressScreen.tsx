import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Button, Card, TextInput, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AddressScreen() {
  const navigation = useNavigation<any>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // null = thêm mới

  const load = async () => {
    const data = await AsyncStorage.getItem('addresses');
    setAddresses(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const saveAddress = async () => {
    const { fullName, phone, street, city } = form;

    // 🧩 Validate dữ liệu nhập
    if (!fullName || fullName.trim().length < 3) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên hợp lệ (tối thiểu 3 ký tự).');
      return;
    }
    if (!phone || !/^\d{9,11}$/.test(phone.trim())) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (chỉ gồm số, 9-11 chữ số).');
      return;
    }
    if (!street || street.trim().length < 5) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đường / số nhà hợp lệ (tối thiểu 5 ký tự).');
      return;
    }
    if (!city || city.trim().length < 2) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thành phố hợp lệ.');
      return;
    }

    let newList = [...addresses];

    if (editingIndex !== null) {
      // ✅ chỉnh sửa
      newList[editingIndex] = form;
      setEditingIndex(null);
      Alert.alert('Thành công', 'Đã cập nhật địa chỉ.');
    } else {
      // ✅ thêm mới
      newList.push(form);
      Alert.alert('Thành công', 'Đã lưu địa chỉ mới.');
    }

    setAddresses(newList);
    await AsyncStorage.setItem('addresses', JSON.stringify(newList));
    await AsyncStorage.setItem('lastAddress', JSON.stringify(form));
    setForm({ fullName: '', phone: '', street: '', city: '' });
  };

  const choose = async (addr: any) => {
    await AsyncStorage.setItem('lastAddress', JSON.stringify(addr));
    navigation.goBack();
  };

  const editAddress = (index: number) => {
    setForm(addresses[index]);
    setEditingIndex(index);
  };

  const deleteAddress = (index: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const newAddresses = [...addresses];
          const removed = newAddresses.splice(index, 1)[0];
          setAddresses(newAddresses);
          await AsyncStorage.setItem('addresses', JSON.stringify(newAddresses));

          // Nếu xóa địa chỉ đang dùng làm lastAddress, xóa luôn
          const lastAddressRaw = await AsyncStorage.getItem('lastAddress');
          const lastAddress = lastAddressRaw ? JSON.parse(lastAddressRaw) : null;
          if (lastAddress && JSON.stringify(lastAddress) === JSON.stringify(removed)) {
            await AsyncStorage.removeItem('lastAddress');
          }

          // Nếu đang edit địa chỉ vừa xóa, reset form
          if (editingIndex === index) {
            setForm({ fullName: '', phone: '', street: '', city: '' });
            setEditingIndex(null);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>


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
              <Button onPress={() => editAddress(i)}>Sửa</Button>
              <Button onPress={() => deleteAddress(i)} color="red">
                Xóa
              </Button>
            </Card.Actions>
          </Card>
        ))}

        <Card style={{ padding: 12 }}>
          <Card.Title title={editingIndex !== null ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'} />
          <Card.Content>
            <TextInput
              label="Họ tên"
              value={form.fullName}
              onChangeText={t => setForm({ ...form, fullName: t })}
            />
            <TextInput
              label="Số điện thoại"
              value={form.phone}
              onChangeText={t => setForm({ ...form, phone: t })}
              keyboardType="phone-pad"
            />
            <TextInput
              label="Đường"
              value={form.street}
              onChangeText={t => setForm({ ...form, street: t })}
            />
            <TextInput
              label="Thành phố"
              value={form.city}
              onChangeText={t => setForm({ ...form, city: t })}
            />
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={saveAddress}>
              {editingIndex !== null ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
});
