import React, { useMemo, useState } from 'react';
import { View, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { Appbar, Button, Card, Searchbar, Text, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type Fruit = {
  id: number;
  name: string;
  type: string;
  price: number;
  image?: string;
  images?: string[];
  description?: string;
};

const sampleFruits: Fruit[] = [
  {
    id: 1,
    name: 'Cam Sành',
    type: 'Cam',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200&auto=format&fit=crop&fm=jpg',
    description: 'Cam sành ngọt, mọng nước, cung cấp vitamin C dồi dào.',
  },
  {
    id: 2,
    name: 'Táo Mỹ',
    type: 'Táo',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop&fm=jpg',
    description: 'Táo Mỹ giòn, ngọt thanh, nhiều chất xơ và vitamin A.',
  },
  {
    id: 3,
    name: 'Nho Đen Úc',
    type: 'Nho',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1502741126161-b048400d0857?q=80&w=1200&auto=format&fit=crop&fm=jpg',
      'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&auto=format&fit=crop&fm=jpg',
    ],
    description: 'Nho đen giàu chất chống oxy hóa, tốt cho tim mạch.',
  },
];

const PLACEHOLDER = 'https://via.placeholder.com/800x500.png?text=Fruit+Image';

// ===== Component hiển thị từng trái cây =====
function FruitCard({
  item,
  onPressDetail,
  onAddToCart,
}: {
  item: Fruit;
  onPressDetail: () => void;
  onAddToCart: () => void;
}) {
  const candidates = item.images && item.images.length > 0 ? item.images : [item.image ?? PLACEHOLDER];
  const [coverIndex, setCoverIndex] = useState(0);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const coverUri = candidates[Math.min(coverIndex, candidates.length - 1)] ?? PLACEHOLDER;
  const avatarUri = candidates[Math.min(avatarIndex, candidates.length - 1)] ?? PLACEHOLDER;

  const handleCoverError = () => {
    setLoading(false);
    if (coverIndex < candidates.length - 1) setCoverIndex(coverIndex + 1);
  };

  const handleAvatarError = () => {
    if (avatarIndex < candidates.length - 1) setAvatarIndex(avatarIndex + 1);
  };

  return (
    <Card style={{ marginHorizontal: 10, marginBottom: 10 }} onPress={onPressDetail}>
      <View style={{ width: '100%', height: 180, backgroundColor: '#eee' }}>
        <Image
          source={{ uri: coverUri }}
          style={{
            width: '100%',
            height: '100%',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          resizeMode="cover"
          onLoadEnd={() => setLoading(false)}
          onError={handleCoverError}
        />
        {loading && (
          <View
            style={{
              position: 'absolute',
              inset: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>

      <Card.Title
        title={item.name}
        subtitle={`${item.price.toLocaleString()} đ • ${item.type}`}
        left={(props) => (
          <Avatar.Image {...props} size={36} source={{ uri: avatarUri }} onError={handleAvatarError} />
        )}
      />

      {item.description ? (
        <Card.Content>
          <Text variant="bodyMedium" numberOfLines={2}>
            {item.description}
          </Text>
        </Card.Content>
      ) : null}

      <Card.Actions>
        <Button onPress={onPressDetail}>Xem chi tiết</Button>
        <Button mode="contained-tonal" onPress={onAddToCart}>
          Thêm vào giỏ
        </Button>
      </Card.Actions>
    </Card>
  );
}

// ====== Trang chủ ======
export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [cart, setCart] = useState<Fruit[]>([]); // 👉 lưu giỏ hàng tạm

  const filteredFruits = useMemo(
    () =>
      sampleFruits.filter(
        (f) =>
          (!filter || f.type === filter) &&
          f.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, filter]
  );

  // Hàm thêm vào giỏ
  // Hàm thêm vào giỏ hàng
  const handleAddToCart = async (fruit: Fruit) => {
    try {
      const stored = (await AsyncStorage.getItem('cart')) || '[]';
      const existingCart: any[] = JSON.parse(stored);

      const fruitToAdd = {
        ...fruit,
        image: fruit.image || (fruit.images && fruit.images[0]) || PLACEHOLDER,
        quantity: 1,
      };

      const index = existingCart.findIndex((f) => f.id === fruit.id);
      if (index !== -1) {
        existingCart[index].quantity = (existingCart[index].quantity || 1) + 1;
      } else {
        existingCart.push(fruitToAdd);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(existingCart));
      Alert.alert('✅ Thành công', `${fruit.name} đã được thêm vào giỏ hàng!`);
    } catch (e) {
      console.error('addToCart', e);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng.');
    }
  };



  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Danh sách trái cây 🍎" />
        <Appbar.Action icon="history" onPress={() => navigation.navigate('OrderHistory')} />
        <Appbar.Action
          icon="cart"
          onPress={() => navigation.navigate('Cart', { cart })}
        />
      </Appbar.Header>

      <Searchbar
        placeholder="Tìm kiếm theo tên..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        {['Tất cả', 'Cam', 'Táo', 'Nho'].map((t) => (
          <Button
            key={t}
            mode={filter === t || (t === 'Tất cả' && !filter) ? 'contained' : 'outlined'}
            onPress={() => setFilter(t === 'Tất cả' ? null : t)}
            style={{ marginHorizontal: 4, marginBottom: 6 }}
          >
            {t}
          </Button>
        ))}
      </View>

      <FlatList
        data={filteredFruits}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          <FruitCard
            item={item}
            onPressDetail={() => navigation.navigate('FruitDetail', { fruit: item })}
            onAddToCart={() => handleAddToCart(item)}
          />
        )}
      />
    </View>
  );
}
