import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Button, Card, Searchbar, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type Fruit = {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  description?: string;
};

const sampleFruits: Fruit[] = [
  {
    id: 1,
    name: 'Cam Sành',
    type: 'Cam',
    price: 25000,
    image: 'https://cdn.tgdd.vn/Files/2021/11/16/1399091/cach-phan-biet-cac-loai-cam-va-chon-cam-ngon-202111161615489715.jpg',
    description: 'Cam sành ngọt, mọng nước, cung cấp vitamin C dồi dào.',
  },
  {
    id: 2,
    name: 'Táo Mỹ',
    type: 'Táo',
    price: 35000,
    image: 'https://cdn.tgdd.vn/Files/2020/07/22/1272412/tim-hieu-ve-tao-my-va-cach-chon-tao-my-ngon-202007221648474212.jpg',
    description: 'Táo Mỹ giòn, ngọt thanh, nhiều chất xơ và vitamin A.',
  },
  {
    id: 3,
    name: 'Nho Đen Úc',
    type: 'Nho',
    price: 45000,
    image: 'https://cdn.tgdd.vn/Files/2020/03/04/1239030/nhung-loi-ich-bat-ngo-cua-qua-nho-den-202003041116034530.jpg',
    description: 'Nho đen giàu chất chống oxy hóa, tốt cho tim mạch.',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const filteredFruits = sampleFruits.filter(
    (f) =>
      (!filter || f.type === filter) &&
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Danh sách trái cây 🍎" />
        <Appbar.Action icon="cart" onPress={() => navigation.navigate('Cart')} />
      </Appbar.Header>

      <Searchbar
        placeholder="Tìm kiếm theo tên..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        {['Tất cả', 'Cam', 'Táo', 'Nho'].map((t) => (
          <Button
            key={t}
            mode={filter === t || (t === 'Tất cả' && !filter) ? 'contained' : 'outlined'}
            onPress={() => setFilter(t === 'Tất cả' ? null : t)}
            style={{ marginHorizontal: 4 }}
          >
            {t}
          </Button>
        ))}
      </View>

      <FlatList
        data={filteredFruits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={{ marginHorizontal: 10, marginBottom: 10 }}
            onPress={() => navigation.navigate('FruitDetail', { fruit: item })}
          >
            <Card.Cover source={{ uri: item.image }} />
            <Card.Title title={item.name} subtitle={`${item.price.toLocaleString()} đ`} />
          </Card>
        )}
      />
    </View>
  );
}
