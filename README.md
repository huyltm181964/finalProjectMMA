# finalProjectMMA (Expo React Native)

Ứng dụng React Native (Expo) với các màn hình và tính năng:

- Đăng ký tài khoản (lưu vào AsyncStorage, key `users`)
- Đăng nhập (validate `username` + `password`)
- Ghi nhớ người dùng hiện tại (key `currentUser`)
- Hồ sơ cá nhân (Profile)
- Chỉnh sửa thông tin cá nhân (Edit Profile, đổi avatar từ thư viện ảnh, cập nhật mật khẩu)
- Đăng xuất

Giao diện sử dụng `react-native-paper`, điều hướng bằng `@react-navigation/native` + `native-stack`.

## Yêu cầu môi trường

- Node.js >= 20 (nên dùng v20.19.4+ để tránh cảnh báo engine)
- Expo CLI (sử dụng qua `npx`)

## Cài đặt & chạy

Trong thư mục dự án:

```powershell
# Cài dependencies (đã cài tự động khi khởi tạo nhưng có thể chạy lại)
npm install

# Chạy ứng dụng (chọn web hoặc android tuỳ thiết bị)
npm run web
# hoặc
npm run android
```

Nếu chạy web lần đầu bị báo thiếu gói, dự án đã cài sẵn `react-dom` và `react-native-web`.

## Thư viện đã cài

- @react-navigation/native
- @react-navigation/native-stack
- @react-native-async-storage/async-storage
- react-native-paper
- @expo/vector-icons
- react-native-gesture-handler
- react-native-reanimated
- react-native-screens
- react-native-safe-area-context
- expo-image-picker (chọn ảnh đại diện)
- expo-linear-gradient (UI nền gradient nếu cần)

## Cấu trúc thư mục

- `src/context/AuthContext.tsx`: Quản lý đăng ký/đăng nhập/đăng xuất/cập nhật hồ sơ, lưu vào AsyncStorage
- `src/navigation/index.tsx`: Điều hướng giữa Auth stack và App stack tuỳ theo trạng thái đăng nhập
- `src/screens/*`: Các màn hình Login, Register, Profile, EditProfile
- `src/types.ts`: Kiểu dữ liệu `User` và type params cho navigation
- `src/theme.ts`: Chủ đề `react-native-paper`

## Ghi chú

- Dữ liệu người dùng chỉ lưu cục bộ (AsyncStorage), không mã hoá. Không dùng cho môi trường production.
- Khi đổi avatar, ảnh được lưu dưới dạng `uri` từ thư viện ảnh thiết bị.
- Nếu gặp cảnh báo về Node engine khi cài gói, hãy nâng cấp Node LTS 20.x mới nhất.
