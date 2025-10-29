import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';

const AVATAR_FALLBACK = 'https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundType=gradientLinear';

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatarUri || AVATAR_FALLBACK }} style={styles.avatar} />
        <Text variant="headlineSmall" style={styles.name}>{user.fullName || user.username}</Text>
        <Text variant="bodyMedium" style={{ color: '#666' }}>{user.email || 'Chưa cập nhật email'}</Text>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <List.Section>
          <List.Item title="Họ và tên" description={user.fullName || '-'} left={(props: any) => <List.Icon {...props} icon="account" />} />
          <List.Item title="Username" description={user.username} left={(props: any) => <List.Icon {...props} icon="account-circle" />} />
          <List.Item title="Email" description={user.email || '-'} left={(props: any) => <List.Icon {...props} icon="email" />} />
          <List.Item title="Số điện thoại" description={user.phone || '-'} left={(props: any) => <List.Icon {...props} icon="phone" />} />
        </List.Section>

        <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} style={{ marginVertical: 8 }}>
          Chỉnh sửa thông tin
        </Button>
        <Button mode="outlined" onPress={logout}>
          Đăng xuất
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatar: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#eee' },
  name: { fontWeight: '700' },
});
