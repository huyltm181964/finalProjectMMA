import { Review } from '../types';

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
    image: undefined,
    reviews: [],
  },
  {
    id: 'p_tao',
    name: 'Táo Mỹ',
    price: 35000,
    description: 'Táo Mỹ giòn, ngọt thanh, nhiều chất xơ và vitamin A.',
    image: undefined,
    reviews: [],
  },
  {
    id: 'p_nho',
    name: 'Nho Đen Úc',
    price: 45000,
    description: 'Nho đen giàu chất chống oxy hóa, tốt cho tim mạch.',
    image: undefined,
    reviews: [],
  },
];

export function getProducts() {
  return products;
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id) || null;
}

export function addReviewToProduct(review: Review) {
  const p = products.find((x) => x.id === review.productId);
  if (!p) return false;
  if (!p.reviews) p.reviews = [];
  p.reviews.push(review);
  return true;
}

export function getAverageRating(productId: string) {
  const p = getProductById(productId);
  if (!p || !p.reviews || p.reviews.length === 0) return 0;
  const sum = p.reviews.reduce((s, r) => s + r.rating, 0);
  return sum / p.reviews.length;
}

export default products;
