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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';

const Tab = createBottomTabNavigator();

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

// We'll expose a bottom-tab navigator with Home / Cart / Profile
function HomeStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <AppStack.Screen name="FruitDetail" component={FruitDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
      <AppStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
      <AppStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} />
      <AppStack.Screen name="Address" component={AddressScreen} options={{ title: 'Địa chỉ' }} />
    </AppStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
      <AppStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Chỉnh sửa hồ sơ' }} />
      <AppStack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Lịch sử đơn hàng' }} />
      <AppStack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Chi tiết đơn hàng' }} />
      <AppStack.Screen name="Review" component={ReviewScreen} options={{ title: 'Đánh giá' }} />
    </AppStack.Navigator>
  );
}
const AppNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="HomeTab"
      component={HomeStackNavigator}
      options={{
        title: 'Home',
        tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="home" color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Cart',
        tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="cart" color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackNavigator}
      options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="account-circle" color={color} size={size} />,
      }}
    />
  </Tab.Navigator>
);

// Admin stack inside a tab
const AdminStack = createNativeStackNavigator();
function AdminStackNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin' }} />
      <AdminStack.Screen name="AdminProducts" component={AdminProductsScreen} options={{ title: 'Sản phẩm' }} />
      <AdminStack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Người dùng' }} />
      <AdminStack.Screen name="AdminOrders" component={AdminOrdersScreen} options={{ title: 'Đơn hàng' }} />
    </AdminStack.Navigator>
  );
}

const AppNavigatorWithAdmin = ({ isAdmin }: { isAdmin: boolean }) => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home', tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="home" color={color} size={size} /> }} />
    <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Cart', tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="cart" color={color} size={size} /> }} />
    <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile', tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="account-circle" color={color} size={size} /> }} />
    {isAdmin && (
      <Tab.Screen name="AdminTab" component={AdminStackNavigator} options={{ title: 'Admin', tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name="shield-account" color={color} size={size} /> }} />
    )}
  </Tab.Navigator>
);

export default function RootNavigation() {
  const { user, loading } = useAuth();

  if (loading) return null; // hoặc có thể render màn hình splash/loading

  return (
    <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App">
            {() => <AppNavigatorWithAdmin isAdmin={(user as any)?.role === 'admin'} />}
          </RootStack.Screen>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
