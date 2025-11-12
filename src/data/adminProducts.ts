import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from './mockProducts';

const ADMIN_PRODUCTS_KEY = 'admin_products';

export type AdminProduct = Product & {
  categoryId?: string;
  featured?: boolean;
  discountPercent?: number;
  wideImage?: string;
};

export async function getAllAdminProducts(): Promise<AdminProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('getAllAdminProducts', e);
    return [];
  }
}

export async function upsertAdminProduct(p: AdminProduct) {
  const list = await getAllAdminProducts();
  const idx = list.findIndex(x => x.id === p.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...p };
  else list.push(p);
  await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(list));
}

export async function deleteAdminProduct(id: string) {
  const list = await getAllAdminProducts();
  const next = list.filter(x => x.id !== id);
  await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(next));
}

export async function resetAdminProducts() {
  await AsyncStorage.removeItem(ADMIN_PRODUCTS_KEY);
}
