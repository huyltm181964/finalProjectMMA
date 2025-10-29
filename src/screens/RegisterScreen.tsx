import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

const background = { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1916&auto=format&fit=crop' };

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!username || !password) {
      setError('Vui lòng nhập username và password');
      return;
    }
    setLoading(true);
    const res = await register({ username: username.trim(), password, fullName, email, phone });
    setLoading(false);
    if (!res.ok) setError(res.message || 'Đăng ký thất bại');
  };

  return (
    <ImageBackground source={background} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.card}>
          <Text variant="headlineLarge" style={styles.title}>Tạo tài khoản ✨</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Nhập thông tin của bạn</Text>

          <TextInput label="Họ và tên" value={fullName} onChangeText={setFullName} style={styles.input} />
          <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
          <TextInput label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
          <TextInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" style={styles.input} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          {!!error && <HelperText type="error">{error}</HelperText>}

          <Button mode="contained" onPress={onSubmit} loading={loading} style={styles.button}>
            Đăng ký
          </Button>
          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            Đã có tài khoản? Đăng nhập
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, gap: 12 },
  title: { fontWeight: '700' },
  subtitle: { color: '#666', marginBottom: 8 },
  input: {},
  button: { marginTop: 8 },
});
