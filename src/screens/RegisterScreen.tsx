import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Alert } from 'react-native';
import { Button, HelperText, Text, TextInput, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';


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
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string; email?: string; phone?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const next: { username?: string; password?: string; email?: string; phone?: string } = {};
    const u = username.trim();
    const p = password.trim();
    if (!u) next.username = 'Vui lòng nhập username';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(u)) next.username = '3-20 ký tự, chữ/số/_';

    if (!p) next.password = 'Vui lòng nhập mật khẩu';
    else if (p.length < 6 || !/[A-Za-z]/.test(p) || !/[0-9]/.test(p) || !/[^A-Za-z0-9]/.test(p)) next.password = 'Tối thiểu 6 ký tự, gồm chữ, số và kí tự đặc biệt';

    if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim())) next.email = 'Email không hợp lệ';
    if (phone && !/^\d{9,11}$/.test(phone.trim())) next.phone = 'Chỉ số, 9-11 chữ số';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const strength = useMemo(() => {
    const p = password.trim();
    const hasLetter = /[A-Za-z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    const lenBonus = p.length >= 8 ? 1 : 0;
    const score = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0) + lenBonus; // 0..4
    const progress = score / 4;
    const label = score <= 1 ? 'Yếu' : score === 2 ? 'Trung bình' : score === 3 ? 'Khá' : 'Mạnh';
    const color = score <= 1 ? '#EF4444' : score === 2 ? '#F59E0B' : score === 3 ? '#10B981' : '#16A34A';
    return { progress, label, color, show: p.length > 0 };
  }, [password]);

  const onSubmit = async () => {
    setError(null);
    if (!validate()) return;
    setLoading(true);
    const res = await register({ data: { username: username.trim(), password, fullName, email, phone }, options: { autoLogin: false } });
    setLoading(false);
    if (!res.ok) setError(res.message || 'Đăng ký thất bại');
    else {
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng đăng nhập.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  };

  return (
    <LinearGradient colors={["#f7f2ff", "#eef5ff"]} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.card}>
          <Text variant="headlineLarge" style={styles.title}>Tạo tài khoản ✨</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Đăng ký để tham gia</Text>

          <TextInput label="Họ và tên" value={fullName} onChangeText={setFullName} style={styles.input} left={<TextInput.Icon icon="account" />} />
          <TextInput label="Email" value={email} onChangeText={(t) => { setEmail(t); setFieldErrors(s => ({ ...s, email: undefined })); }} keyboardType="email-address" style={styles.input} left={<TextInput.Icon icon="email" />} />
          {!!fieldErrors.email && <HelperText type="error">{fieldErrors.email}</HelperText>}
          <TextInput label="Số điện thoại" value={phone} onChangeText={(t) => { setPhone(t); setFieldErrors(s => ({ ...s, phone: undefined })); }} keyboardType="phone-pad" style={styles.input} left={<TextInput.Icon icon="phone" />} />
          {!!fieldErrors.phone && <HelperText type="error">{fieldErrors.phone}</HelperText>}
          <TextInput label="Username" value={username} onChangeText={(t) => { setUsername(t); setFieldErrors(s => ({ ...s, username: undefined })); }} autoCapitalize="none" style={styles.input} left={<TextInput.Icon icon="account-circle" />} />
          {!!fieldErrors.username && <HelperText type="error">{fieldErrors.username}</HelperText>}
          <TextInput label="Password" value={password} onChangeText={(t) => { setPassword(t); setFieldErrors(s => ({ ...s, password: undefined })); }} secureTextEntry={!showPassword} style={styles.input} left={<TextInput.Icon icon="lock" />} right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(s => !s)} />} />
          {strength.show && (
            <View style={{ gap: 6 }}>
              <ProgressBar progress={strength.progress} color={strength.color} />
              <Text style={{ color: strength.color }}>Độ mạnh: {strength.label}</Text>
            </View>
          )}
          {!!fieldErrors.password && <HelperText type="error">{fieldErrors.password}</HelperText>}
          {!!error && <HelperText type="error">{error}</HelperText>}

          <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading} style={styles.button} contentStyle={styles.buttonContent}>
            Register
          </Button>
          <View style={styles.socialRow}>
            {/* placeholders for social icons, can use IconButton like in Login */}
          </View>
          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            I Have A Account ? Login
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'center' },
  overlay: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24, gap: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10 },
  title: { fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#666', marginBottom: 8, textAlign: 'center' },
  input: { marginBottom: 8, borderRadius: 10 },
  button: { marginTop: 8, borderRadius: 30, backgroundColor: '#00A8B5' },
  buttonContent: { height: 44 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6 },
});
