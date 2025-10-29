import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri || '');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền bị từ chối', 'Vui lòng cấp quyền để chọn ảnh');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const onSubmit = async () => {
    setError(null);
    if (password && password !== confirmPass) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    const res = await updateProfile({ fullName, email, phone, avatarUri, password: password || undefined });
    setLoading(false);
    if (!res.ok) setError(res.message || 'Cập nhật thất bại');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Image source={{ uri: avatarUri || 'https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundType=gradientLinear' }} style={styles.avatar} />
        <Button onPress={pickImage}>Chọn ảnh đại diện</Button>
      </View>

      <TextInput label="Họ và tên" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <TextInput label="Mật khẩu mới (tuỳ chọn)" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput label="Xác nhận mật khẩu" value={confirmPass} onChangeText={setConfirmPass} secureTextEntry style={styles.input} />
      {!!error && <HelperText type="error">{error}</HelperText>}

      <Button mode="contained" onPress={onSubmit} loading={loading} style={{ marginTop: 8 }}>
        Lưu thay đổi
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  input: {},
});
