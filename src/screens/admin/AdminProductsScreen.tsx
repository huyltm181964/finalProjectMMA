import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, Button, Card, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { AdminProduct, deleteAdminProduct, getAllAdminProducts, upsertAdminProduct } from '../../data/adminProducts';
import { getProducts } from '../../data/mockProducts';

export default function AdminProductsScreen() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<Partial<AdminProduct>>({});

  const load = async () => {
    const admin = await getAllAdminProducts();
    setItems(admin.length ? admin : getProducts());
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ id: '', name: '', price: 0, image: '', description: '' });
    setVisible(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm(p);
    setVisible(true);
  };

  const save = async () => {
    if (!form?.id || !form?.name) return;
    await upsertAdminProduct({
      id: String(form.id),
      name: String(form.name),
      price: Number(form.price || 0),
      image: form.image,
      description: form.description,
      reviews: [],
    });
    setVisible(false);
    await load();
  };

  const remove = async (id: string) => {
    await deleteAdminProduct(id);
    await load();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Admin • Sản phẩm" />
        <Appbar.Action icon="plus" onPress={openCreate} />
      </Appbar.Header>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            {item.image ? <Card.Cover source={{ uri: item.image }} /> : null}
            <Card.Title title={item.name} subtitle={`${(item.price||0).toLocaleString()} đ`} />
            <Card.Actions>
              <Button onPress={() => openEdit(item)}>Sửa</Button>
              <Button onPress={() => remove(item.id)}>Xoá</Button>
            </Card.Actions>
          </Card>
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Dialog.Title>
          <Dialog.Content>
            <TextInput label="ID" value={String(form.id||'')} onChangeText={(t)=>setForm(s=>({...s,id:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Tên" value={String(form.name||'')} onChangeText={(t)=>setForm(s=>({...s,name:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Giá" value={String(form.price||'')} onChangeText={(t)=>setForm(s=>({...s,price: Number(t||0)}))} keyboardType="numeric" style={{ marginBottom:8 }} />
            <TextInput label="Ảnh" value={String(form.image||'')} onChangeText={(t)=>setForm(s=>({...s,image:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Mô tả" value={String(form.description||'')} onChangeText={(t)=>setForm(s=>({...s,description:t}))} multiline />
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
