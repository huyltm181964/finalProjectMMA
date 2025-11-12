import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, Button, Card, Dialog, FAB, Portal, Text, TextInput, IconButton } from 'react-native-paper';
import { Category, ensureSeedCategories, getAllCategories, upsertCategory, deleteCategory } from '../../data/adminCategories';

export default function AdminCategoriesScreen() {
  const [items, setItems] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');

  const load = async () => {
    await ensureSeedCategories();
    const list = await getAllCategories();
    setItems(list);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setName('');
    setVisible(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setVisible(true);
  };

  const save = async () => {
    if (!name.trim()) return;
    const id = editing?.id || `cat_${Date.now()}`;
    await upsertCategory({ id, name: name.trim(), createdAt: editing?.createdAt || new Date().toISOString() });
    setVisible(false);
    await load();
  };

  const remove = async (id: string) => {
    await deleteCategory(id);
    await load();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Admin • Thể loại" />
      </Appbar.Header>

      <View style={{ padding: 12 }}>
        <TextInput placeholder="Tên thể loại..." value={search} onChangeText={setSearch} left={<TextInput.Icon icon="magnify" />} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Title title={item.name} subtitle={new Date(item.createdAt).toLocaleDateString()} />
            <Card.Actions>
              <IconButton icon="pencil" onPress={() => openEdit(item)} />
              <IconButton icon="delete" onPress={() => remove(item.id)} />
            </Card.Actions>
          </Card>
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{editing ? 'Sửa thể loại' : 'Thêm thể loại'}</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Tên" value={name} onChangeText={setName} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Huỷ</Button>
            <Button onPress={save}>Lưu</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB icon="plus" style={{ position: 'absolute', bottom: 24, right: 24 }} onPress={openCreate} />
    </View>
  );
}
