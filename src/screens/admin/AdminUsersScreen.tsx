import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, Button, Card, Dialog, Portal, RadioButton, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';

const USERS_KEY = 'users';

export default function AdminUsersScreen() {
  const [items, setItems] = useState<User[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});

  const load = async () => {
    const raw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const list: User[] = JSON.parse(raw);
    setItems(list);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (u: User) => {
    setEditing(u);
    setForm(u);
    setVisible(true);
  };

  const save = async () => {
    if (!form?.username) return;
    const raw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const list: User[] = JSON.parse(raw);
    const idx = list.findIndex(x => x.username.toLowerCase() === String(form.username).toLowerCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...form } as User;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(list));
    }
    setVisible(false);
    await load();
  };

  const remove = async (username: string) => {
    const raw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const list: User[] = JSON.parse(raw);
    const next = list.filter(x => x.username !== username);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(next));
    await load();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Admin • Người dùng" />
      </Appbar.Header>

      <FlatList
        data={items}
        keyExtractor={(it) => it.username}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Title title={item.fullName || item.username} subtitle={`${item.email || ''}  •  ${item.role || 'user'}`} />
            <Card.Actions>
              <Button onPress={() => openEdit(item)}>Sửa</Button>
              <Button onPress={() => remove(item.username)}>Xoá</Button>
            </Card.Actions>
          </Card>
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Sửa người dùng</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Họ tên" value={String(form.fullName||'')} onChangeText={(t)=>setForm(s=>({...s,fullName:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Email" value={String(form.email||'')} onChangeText={(t)=>setForm(s=>({...s,email:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Phone" value={String(form.phone||'')} onChangeText={(t)=>setForm(s=>({...s,phone:t}))} style={{ marginBottom:8 }} />
            <Text style={{ marginTop: 8, marginBottom: 4 }}>Role</Text>
            <RadioButton.Group onValueChange={(v)=>setForm(s=>({...s,role:v as any}))} value={form.role || 'user'}>
              <RadioButton.Item label="User" value="user" />
              <RadioButton.Item label="Admin" value="admin" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>setVisible(false)}>Huỷ</Button>
            <Button onPress={save}>Lưu</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
