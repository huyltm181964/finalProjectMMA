import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, AuthStackParamList, AppStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  LoginScreen,
  RegisterScreen,
  ProfileScreen,
  EditProfileScreen,
  CheckoutScreen,
  AddressScreen,
  OrderHistoryScreen,
  OrderDetailScreen,
  ReviewScreen,
  ProductDetailScreen,
} from '../screens';

// 👉 import thêm 3 màn hình trái cây
import HomeScreen from '../screens/HomeScreen';
import FruitDetailScreen from '../screens/FruitDetailScreen';
import CartScreen from '../screens/CartScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

// 🔹 Auth Stack (đăng nhập / đăng ký)
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// 🔹 App Stack (sau khi đăng nhập)
const AppNavigator = () => (
  <AppStack.Navigator>
    {/* Trang chủ */}
    <AppStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Trang chủ' }}
    />

    {/* Chi tiết trái cây */}
    <AppStack.Screen
      name="FruitDetail"
      component={FruitDetailScreen}
      options={{ title: 'Chi tiết sản phẩm' }}
    />

    {/* Giỏ hàng */}
    <AppStack.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: 'Giỏ hàng' }}
    />

    {/* Thanh toán */}
    <AppStack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ title: 'Thanh toán' }}
    />

    {/* Địa chỉ */}
    <AppStack.Screen
      name="Address"
      component={AddressScreen}
      options={{ title: 'Địa chỉ' }}
    />

    {/* Hồ sơ cá nhân */}
    <AppStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Hồ sơ' }}
    />

    <AppStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ title: 'Chỉnh sửa hồ sơ' }}
    />

    {/* Orders & product/review screens */}
    <AppStack.Screen
      name="OrderHistory"
      component={OrderHistoryScreen}
      options={{ title: 'Lịch sử đơn hàng' }}
    />
    <AppStack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{ title: 'Chi tiết đơn hàng' }}
    />
    <AppStack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Chi tiết sản phẩm' }}
    />
    <AppStack.Screen
      name="Review"
      component={ReviewScreen}
      options={{ title: 'Đánh giá' }}
    />
  </AppStack.Navigator>
);

export default function RootNavigation() {
  const { user, loading } = useAuth();

  if (loading) return null; // hoặc có thể render màn hình splash/loading

  return (
    <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
