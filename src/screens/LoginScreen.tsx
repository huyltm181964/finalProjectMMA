import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

const background = { uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1944&auto=format&fit=crop' };

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    const res = await login(username.trim(), password);
    setLoading(false);
    if (!res.ok) setError(res.message || 'Đăng nhập thất bại');
  };

  return (
    <ImageBackground source={background} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.card}>
          <Text variant="headlineLarge" style={styles.title}>Xin chào 👋</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {!!error && <HelperText type="error">{error}</HelperText>}

          <Button mode="contained" onPress={onSubmit} loading={loading} style={styles.button}>
            Đăng nhập
          </Button>
          <Button mode="text" onPress={() => navigation.navigate('Register')}>
            Chưa có tài khoản? Đăng ký
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
