import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

  type AuthContextType = {
  user: User | null;
  loading: boolean;
  // register can accept an object { data, options } or the plain data shape
  register: (payload: any) => Promise<{ ok: boolean; message?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'username' | 'password'>> & { password?: string }) => Promise<{ ok: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (stored) setUser(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // allow caller to control whether to auto-login after registration
  type RegisterOptions = { autoLogin?: boolean };
  const register: AuthContextType['register'] = async (payload: any) => {
    const opts: RegisterOptions = payload?.options || {};
    const data = payload?.data || payload;
    const username = data.username?.trim();
    const password = data.password?.trim();
    const { fullName, email, phone, avatarUri } = data;

    if (!username || !password) return { ok: false, message: 'Vui lòng nhập username và password' };

    // Username: 3-20 ký tự, chỉ chữ cái/số/_.
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return { ok: false, message: 'Username phải 3-20 ký tự, chỉ gồm chữ, số hoặc _' };
    }

    // Password: >= 6 ký tự, phải có chữ, số và ký tự đặc biệt.
    if (
      password.length < 6 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return { ok: false, message: 'Mật khẩu tối thiểu 6 ký tự và phải gồm chữ, số và ký tự đặc biệt' };
    }

    // Email (tùy chọn) nếu có thì phải hợp lệ.
    if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim())) {
      return { ok: false, message: 'Email không hợp lệ' };
    }

    // Phone (tùy chọn) nếu có thì chỉ số với độ dài 9-11.
    if (phone && !/^\d{9,11}$/.test(phone.trim())) {
      return { ok: false, message: 'Số điện thoại không hợp lệ (chỉ gồm số, 9-11 chữ số)' };
    }

    const usersRaw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const users: User[] = JSON.parse(usersRaw);
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, message: 'Username đã tồn tại' };
    }
    const newUser: User = { username, password, fullName, email, phone, avatarUri };
    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    if (opts.autoLogin !== false) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    }
    return { ok: true };
  };

  const login: AuthContextType['login'] = async (username, password) => {
    const usersRaw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const users: User[] = JSON.parse(usersRaw);
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!found) return { ok: false, message: 'Sai username hoặc password' };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    setUser(found);
    return { ok: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const updateProfile: AuthContextType['updateProfile'] = async (updates) => {
    if (!user) return { ok: false, message: 'Chưa đăng nhập' };
    const usersRaw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const users: User[] = JSON.parse(usersRaw);
    const idx = users.findIndex(u => u.username === user.username);
    if (idx === -1) return { ok: false, message: 'Không tìm thấy user' };

    const updated: User = {
      ...users[idx],
      ...updates,
      password: updates.password ?? users[idx].password,
    };

    users[idx] = updated;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    setUser(updated);
    return { ok: true };
  };

  const value = useMemo(() => ({ user, loading, register, login, logout, updateProfile }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
