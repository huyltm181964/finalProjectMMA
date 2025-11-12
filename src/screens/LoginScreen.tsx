import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

// decorative gradient + blobs handled in styles

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <LinearGradient colors={["#ffffff", "#f0fbff"]} style={styles.bg}>
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.card}>
          <Text variant="headlineLarge" style={styles.title}>Login</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Hello Wellcone Back</Text>

          <TextInput
            label="Name"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(s => !s)} />}
            left={<TextInput.Icon icon="lock" />}
          />
          {!!error && <HelperText type="error">{error}</HelperText>}

          <Button mode="contained" onPress={onSubmit} loading={loading} style={styles.button} contentStyle={styles.buttonContent}>
            Login
          </Button>

          <View style={styles.socialRow}>
            <IconButton icon="facebook" size={28} style={styles.socialBtn} />
            <IconButton icon="twitter" size={28} style={styles.socialBtn} />
            <IconButton icon="google" size={28} style={styles.socialBtn} />
            <IconButton icon="linkedin" size={28} style={styles.socialBtn} />
          </View>

          <Button mode="text" onPress={() => navigation.navigate('Register')}>
            I Dont Have A Account ? Register
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'center' },
  topDecoration: { position: 'absolute', top: -30, left: -20, width: 160, height: 100, backgroundColor: '#00A8B5', borderBottomRightRadius: 40, borderBottomLeftRadius: 40, transform: [{ rotate: '-10deg' }] },
  bottomDecoration: { position: 'absolute', bottom: -40, right: -30, width: 200, height: 120, backgroundColor: '#00A8B5', borderTopLeftRadius: 40, borderTopRightRadius: 40, transform: [{ rotate: '12deg' }] },
  overlay: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 28, gap: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12 },
  title: { fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#666', marginBottom: 8, textAlign: 'center' },
  input: { marginBottom: 8, borderRadius: 12 },
  button: { marginTop: 8, borderRadius: 30, backgroundColor: '#00A8B5' },
  buttonContent: { height: 44 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6 },
  socialBtn: { backgroundColor: '#eef6f7' },
});
