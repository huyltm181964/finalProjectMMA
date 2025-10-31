# Order & Review Feature — Structure and Implementation Guide

This document describes the added files, folder structure, and step-by-step instructions to integrate and test the order history, order detail, review flow, and product detail screens in this React Native project.

## Files added

- `src/types.ts` (updated): added `Order`, `OrderItem`, `Review` types and new routes in `AppStackParamList`:
  - `OrderHistory`, `OrderDetail`, `ProductDetail`, `Review`.
- `src/data/mockProducts.ts`: basic product list and helpers: `getProductById`, `getProducts`, `addReviewToProduct`, `getAverageRating`.
- `src/data/mockOrders.ts`: basic orders list and helpers: `getOrdersForUser`, `getOrderById`, `markItemReviewed` (also updates product reviews).
- `src/screens/OrderHistoryScreen.tsx`: list user orders; navigate to `OrderDetail`.
- `src/screens/OrderDetailScreen.tsx`: show order lines; navigate to `ProductDetail` or `Review`.
- `src/screens/ReviewScreen.tsx`: small rating+comment form; submits in-memory review and marks item as reviewed.
- `src/screens/ProductDetailScreen.tsx`: shows product details, reviews and average rating.
- `src/screens/index.ts` (updated): exports the new screens for easier imports.

## Folder structure (relevant parts)

```
src/
  data/
    mockProducts.ts
    mockOrders.ts
  screens/
    OrderHistoryScreen.tsx
    OrderDetailScreen.tsx
    ReviewScreen.tsx
    ProductDetailScreen.tsx
    index.ts
  types.ts (updated)
```

## How the pieces connect (contract)

- Inputs: navigation params
  - `OrderDetail` expects `{ orderId: string }`
  - `ProductDetail` expects `{ productId: string }`
  - `Review` expects `{ orderId?: string; productId?: string }`
- Data: in-memory mock data in `src/data/*` modules. These are synchronous helpers for demo and testing.
- Outputs: UI screens display lists/objects; submitting a review updates product reviews and marks the order item as reviewed.

## Step-by-step integration & testing

1. Add routes to navigation
   - Open `src/navigation/index.tsx` and inside `AppNavigator` add:

```tsx
  <AppStack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Lịch sử đơn hàng' }} />
  <AppStack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Chi tiết đơn hàng' }} />
  <AppStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
  <AppStack.Screen name="Review" component={ReviewScreen} options={{ title: 'Đánh giá' }} />
```

   - Make sure you import the screens (either via `import { OrderHistoryScreen } from '../screens'` or direct path import).

2. Export screens from `src/screens/index.ts` (already done). If you prefer named imports, import the new screens into navigation.

3. Run the app and navigate
   - Start the project (Metro/bundler) and login with an existing user or adjust `useAuth` to return a mock user.
   - Open `OrderHistory` (you may add a button in `Profile` or `Home` to navigate there during testing):
     - `navigation.navigate('OrderHistory')`.

4. Test flows
   - OrderHistory: tap an order → goes to OrderDetail.
   - OrderDetail: tap "Chi tiết" → ProductDetail.
   - From OrderDetail tap "Đánh giá" → Review screen; submit rating.
   - After submit the order item becomes reviewed (in-memory) and product reviews include the new review.

5. Persisting data (next steps)
   - Replace the mock data modules with API calls.
   - Ensure the server endpoints support adding reviews and marking items as reviewed.
   - Update screens to call APIs and handle loading/error states.

## Edge cases & notes

- Empty lists: components render `ListEmptyComponent` messages.
- Concurrency: in-memory updates are not persisted across app restarts.
- Auth: demo flows assume `userId='u1'`; wire to your auth context `useAuth()` to get the real user id.

## Quick tips for improvement

- Add a small loading spinner when fetching data.
- Add optimistic UI updates and error rollback when using a real API.
- Add unit tests for helpers in `src/data/` (e.g., markItemReviewed updates both order and product reviews).

## How to extend

- If you already have a product detail (`FruitDetailScreen`), you can merge the product detail logic or route both to same component.
- Add types to API client to map `Order` and `Review` objects between server and client.

---

If you want, I can now:
- wire these new screens into `src/navigation/index.tsx` for you; or
- update `ProfileScreen` or `HomeScreen` to add a navigation entry to `OrderHistory` so you can reach it during testing.

Tell me which of those you'd like me to do next and I'll update the code accordingly.
