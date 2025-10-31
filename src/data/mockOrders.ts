import { Order, OrderItem, Review } from '../types';
import { addReviewToProduct } from './mockProducts';

// Make orders reference the product ids/names from mockProducts (Cam Sành, Táo Mỹ, Nho Đen Úc)
const orders: Order[] = [
  {
    id: 'o1',
    userId: 'u1',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'oi1', productId: 'p_cam', name: 'Cam Sành', price: 25000, quantity: 2 },
      { id: 'oi2', productId: 'p_tao', name: 'Táo Mỹ', price: 35000, quantity: 1 },
    ],
    total: 2 * 25000 + 1 * 35000,
    status: 'delivered',
  },
  {
    id: 'o2',
    userId: 'u1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    items: [
      { id: 'oi3', productId: 'p_nho', name: 'Nho Đen Úc', price: 45000, quantity: 1 },
    ],
    total: 1 * 45000,
    status: 'delivered',
  },
];

export function getOrdersForUser(userId: string) {
  return orders.filter((o) => o.userId === userId);
}

export function getOrderById(id: string) {
  return orders.find((o) => o.id === id) || null;
}

export function markItemReviewed(orderId: string, productId: string, review: Review) {
  const o = getOrderById(orderId);
  if (!o) return false;
  const item = o.items.find((it) => it.productId === productId);
  if (!item) return false;
  item.reviewed = true;
  // persist to product reviews as well
  addReviewToProduct(review);
  return true;
}

export default orders;
