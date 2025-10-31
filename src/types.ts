export type User = {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUri?: string;
};

// 🔹 Root stack điều hướng giữa AuthStack và AppStack
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

// 🔹 Auth stack: đăng nhập / đăng ký
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// 🔹 App stack: các màn hình trong app chính sau khi login
export type AppStackParamList = {
  Home: undefined; // 🏠 Trang chủ
  FruitDetail: { fruit: any }; // 🍊 Xem chi tiết trái cây
  Cart: undefined; // 🛒 Giỏ hàng
  Checkout: undefined; // 💳 Thanh toán
  Address: undefined; // 🏠 Quản lý địa chỉ
  Profile: undefined; // 👤 Hồ sơ
  EditProfile: undefined; // ✏️ Chỉnh sửa hồ sơ
  // Orders
  OrderHistory: undefined; // 📦 Lịch sử đơn hàng
  OrderDetail: { orderId: string }; // 📄 Chi tiết đơn hàng

  // Product / Review
  ProductDetail: { productId: string };
  Review: { orderId?: string; productId?: string };
};

// 📦 Order related types
export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  reviewed?: boolean;
};

export type Order = {
  id: string;
  userId: string;
  createdAt: string; // ISO date
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
};
