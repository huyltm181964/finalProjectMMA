import React, { useEffect, useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Appbar, Button, Card, Dialog, Portal, Text, TextInput, IconButton, Switch } from 'react-native-paper';
import { getAllCategories, ensureSeedCategories } from '../../data/adminCategories';
import * as ImagePicker from 'expo-image-picker';
import { AdminProduct, deleteAdminProduct, getAllAdminProducts, upsertAdminProduct } from '../../data/adminProducts';
import { getProducts } from '../../data/mockProducts';

export default function AdminProductsScreen() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<Partial<AdminProduct>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const load = async () => {
    const admin = await getAllAdminProducts();
    setItems(admin.length ? admin : getProducts());
  };

  useEffect(() => {
    load();
    (async () => { await ensureSeedCategories(); setCategories(await getAllCategories()); })();
  }, []);

  const openCreate = () => {
    setEditing(null);
  setForm({ id: '', name: '', price: 0, image: '', description: '', categoryId: categories[0]?.id, discountPercent: 0, featured: false, wideImage: '' });
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
      categoryId: form.categoryId,
      discountPercent: Number(form.discountPercent || 0),
      featured: !!form.featured,
      wideImage: form.wideImage,
    });
    setVisible(false);
    await load();
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, base64: false });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setForm(s => ({ ...s, image: res.assets![0].uri }));
    }
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
        renderItem={({ item }) => {
          const hasDiscount = item.discountPercent && item.discountPercent > 0;
          const finalPrice = hasDiscount ? Math.round((item.price||0) * (1 - (item.discountPercent||0)/100)) : (item.price||0);
          return (
            <Card style={{ marginBottom: 12, overflow: 'hidden' }}>
              {item.image ? <Card.Cover source={{ uri: item.image }} /> : null}
              <Card.Title
                title={item.name}
                subtitle={hasDiscount
                  ? `Giá: ${finalPrice.toLocaleString()} đ (Giảm ${item.discountPercent}%, gốc ${(item.price||0).toLocaleString()} đ)`
                  : `Giá: ${(item.price||0).toLocaleString()} đ`}
                right={(props)=>(item.featured ? <Text style={{ color:'#d32f2f', fontSize:18, fontWeight:'bold', marginRight:12 }}>★</Text> : null)}
              />
              <Card.Content>
                {item.categoryId && <Text style={{ fontStyle:'italic', marginBottom:4 }}>Thể loại: {categories.find(c=>c.id===item.categoryId)?.name || item.categoryId}</Text>}
                {item.wideImage ? <Text style={{ fontSize:12, color:'#666' }}>Có ảnh banner</Text> : null}
                {item.description ? <Text style={{ marginTop:4 }}>{item.description}</Text> : null}
              </Card.Content>
              <Card.Actions>
                <Button mode="contained-tonal" onPress={() => openEdit(item)}>Sửa</Button>
                <Button mode="outlined" onPress={() => remove(item.id)} style={{ marginLeft: 6 }}>Xoá</Button>
              </Card.Actions>
            </Card>
          );
        }}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Dialog.Title>
          <Dialog.Content>
            <TextInput label="ID" value={String(form.id||'')} onChangeText={(t)=>setForm(s=>({...s,id:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Tên" value={String(form.name||'')} onChangeText={(t)=>setForm(s=>({...s,name:t}))} style={{ marginBottom:8 }} />
            <TextInput label="Giá (vnd)" value={String(form.price||'')} onChangeText={(t)=>setForm(s=>({...s,price: Number(t||0)}))} keyboardType="numeric" style={{ marginBottom:8 }} />
            <TextInput label="Khuyến mại %" value={String(form.discountPercent||'')} onChangeText={(t)=>setForm(s=>({...s,discountPercent: Number(t||0)}))} keyboardType="numeric" style={{ marginBottom:8 }} />
            <View style={{ flexDirection:'row', alignItems:'center', marginBottom:8 }}>
              <Text style={{ flex:1 }}>Nổi bật</Text>
              <Switch value={!!form.featured} onValueChange={(v)=>setForm(s=>({...s,featured:v}))} />
            </View>
            <TextInput
              label="Thể loại"
              value={categories.find(c=>c.id===form.categoryId)?.name || ''}
              right={<TextInput.Icon icon="menu-down" />}
              onFocus={()=>{/* could open picker dialog later */}}
              style={{ marginBottom:8 }}
              editable={false}
            />
            {/* simple category picker list */}
            <View style={{ flexDirection:'row', flexWrap:'wrap', marginBottom:8 }}>
              {categories.map(c => (
                <Button key={c.id} mode={c.id===form.categoryId? 'contained':'outlined'} style={{ margin:4 }} onPress={()=>setForm(s=>({...s,categoryId:c.id}))}>{c.name}</Button>
              ))}
            </View>
            <TextInput label="Ảnh (URL)" value={String(form.image||'')} onChangeText={(t)=>setForm(s=>({...s,image:t}))} style={{ marginBottom:8 }} right={<TextInput.Icon icon="image" onPress={pickImage} />} />
            {form.image ? (
              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Image source={{ uri: String(form.image) }} style={{ width: 200, height: 120, borderRadius: 8 }} />
              </View>
            ) : null}
            <TextInput label="Ảnh rộng (banner URL)" value={String(form.wideImage||'')} onChangeText={(t)=>setForm(s=>({...s,wideImage:t}))} style={{ marginBottom:8 }} />
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
