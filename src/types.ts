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
};
