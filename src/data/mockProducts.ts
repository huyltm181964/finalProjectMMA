import { Review } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  reviews?: Review[];
};

// Align product list with HomeScreen sample fruits
const products: Product[] = [
  {
    id: 'p_cam',
    name: 'Cam Sành',
    price: 25000,
    description: 'Cam sành ngọt, mọng nước, cung cấp vitamin C dồi dào.',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200&auto=format&fit=crop&fm=jpg',
    reviews: [],
  },
  {
    id: 'p_tao',
    name: 'Táo Mỹ',
    price: 35000,
    description: 'Táo Mỹ giòn, ngọt thanh, nhiều chất xơ và vitamin A.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop&fm=jpg',
    reviews: [],
  },
  {
    id: 'p_nho',
    name: 'Nho Đen Úc',
    price: 45000,
    description: 'Nho đen giàu chất chống oxy hóa, tốt cho tim mạch.',
    image: 'https://images.unsplash.com/photo-1502741126161-b048400d0857?q=80&w=1200&auto=format&fit=crop&fm=jpg',
    reviews: [],
  },
];

export function getProducts() {
  return products;
}

export function getProductById(id: string) {
  const key = String(id ?? '').toLowerCase().trim();
  return products.find((p) => String(p.id ?? '').toLowerCase().trim() === key) || null;
}

const PRODUCTS_REVIEWS_KEY = 'product_reviews';

// load persisted reviews (if any) and merge into in-memory products
(async () => {
  try {
    const raw = await AsyncStorage.getItem(PRODUCTS_REVIEWS_KEY);
    if (!raw) return;
    const saved: { id: string; reviews?: Review[] }[] = JSON.parse(raw);
    if (!Array.isArray(saved)) return;
    saved.forEach((s) => {
      const p = products.find((x) => String(x.id ?? '').toLowerCase().trim() === String(s.id ?? '').toLowerCase().trim());
      if (p) {
        p.reviews = s.reviews || [];
      }
    });
    console.log('mockProducts -> loaded persisted product reviews', saved.length);
  } catch (e) {
    console.error('mockProducts load persisted reviews', e);
  }
})();

export async function addReviewToProduct(review: Review) {
  const pid = String((review as any).productId ?? '').toLowerCase().trim();
  const p = products.find((x) => String(x.id ?? '').toLowerCase().trim() === pid);
  console.log('addReviewToProduct ->', { pid, found: !!p, review });
  if (!p) return false;
  if (!p.reviews) p.reviews = [];
  p.reviews.push(review);

  // persist reviews map to AsyncStorage so reviews survive app restart
  try {
    const toSave = products.map((x) => ({ id: x.id, reviews: x.reviews || [] }));
    await AsyncStorage.setItem(PRODUCTS_REVIEWS_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('addReviewToProduct -> persist failed', e);
  }

  return true;
}

export function getAverageRating(productId: string) {
  const p = getProductById(String(productId ?? '').toLowerCase().trim());
  if (!p || !p.reviews || p.reviews.length === 0) return 0;
  const sum = p.reviews.reduce((s, r) => s + r.rating, 0);
  return sum / p.reviews.length;
}

export default products;
