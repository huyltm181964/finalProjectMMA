import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (payload: Omit<User, 'avatarUri'> & { avatarUri?: string }) => Promise<{ ok: boolean; message?: string }>; 
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

  const register: AuthContextType['register'] = async (payload) => {
    const { username, password, fullName, email, phone, avatarUri } = payload;
    if (!username || !password) return { ok: false, message: 'Vui lòng nhập username và password' };

    const usersRaw = (await AsyncStorage.getItem(USERS_KEY)) || '[]';
    const users: User[] = JSON.parse(usersRaw);
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, message: 'Username đã tồn tại' };
    }
    const newUser: User = { username, password, fullName, email, phone, avatarUri };
    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
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
