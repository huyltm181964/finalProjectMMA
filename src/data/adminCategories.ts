import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

const ADMIN_CATEGORIES_KEY = 'admin_categories';

const defaultCategories: Category[] = [
  { id: 'cat_trai_cay', name: 'Trái cây', createdAt: new Date().toISOString() },
  { id: 'cat_thuc_uong', name: 'Thức uống', createdAt: new Date().toISOString() },
  { id: 'cat_muoi', name: 'Muối', createdAt: new Date().toISOString() },
];

export async function ensureSeedCategories() {
  const raw = await AsyncStorage.getItem(ADMIN_CATEGORIES_KEY);
  if (!raw) {
    await AsyncStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  const list: Category[] = JSON.parse(raw);
  if (!Array.isArray(list) || list.length === 0) {
    await AsyncStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return list;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('getAllCategories', e);
    return [];
  }
}

export async function upsertCategory(c: Category) {
  const list = await getAllCategories();
  const idx = list.findIndex(x => x.id === c.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...c };
  else list.push(c);
  await AsyncStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(list));
}

export async function deleteCategory(id: string) {
  const list = await getAllCategories();
  const next = list.filter(x => x.id !== id);
  await AsyncStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(next));
}

export async function resetCategories() {
  await AsyncStorage.removeItem(ADMIN_CATEGORIES_KEY);
}
