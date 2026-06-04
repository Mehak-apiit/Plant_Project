# 🌿 Plant Project — E-commerce Backend API (Node.js + Express + MongoDB)

A production-ready REST API for a plant e-commerce platform. Includes authentication, role-based admin features, product/category/sub-category management, cart + order checkout flow, Razorpay payment verification, and vendor onboarding.

---

## ✨ Features

- **JWT Authentication** (Bearer token)
- **Email verification** + **forgot/reset password**
- **Role-based access control** (Admin / Staff / etc.)
- **Products**: search, filtering, pagination, featured + flash sale
- **Categories & Sub-categories** with slug-based uniqueness
- **Cart**: add/remove items (per user)
- **Orders**: create, my-orders, admin order listing, status updates
- **Razorpay**: create payment order + verify signature (secure)
- **Admin dashboard stats**
- **Vendor workflow**: apply, update, admin approve/reject, list all vendors

---

## 🧰 Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (`jsonwebtoken`)
- **Razorpay**
- **bcryptjs** (password hashing)
- **crypto** (tokens + Razorpay signature verification)

> Note: This repo currently uses `express.json()` and does not require Multer for uploads (even though Multer is common in such stacks).

---

## 📁 Project Structure

- `backend/server.js` — Express app entry point & route mounting
- `backend/config/db.js` — MongoDB connection
- `backend/routes/*` — API routes
- `backend/controllers/*` — Business logic / request handlers
- `backend/models/*` — Mongoose models (schemas)
- `backend/middleware/*` — Auth & role middleware
- `backend/seed/*` — Seed scripts (if used)
- `backend/utils/sendEmail.js` — Email helper

---

## 🚀 Getting Started

### 1) Install dependencies

From project root:

```bash
npm install
```

From backend folder:

```bash
cd backend
npm install
```

### 2) Environment variables

Create a `.env` file inside `backend/`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> Email-related variables depend on `backend/utils/sendEmail.js`. Add whatever that file requires in your `.env`.

### 3) Run the server

Development:

```bash
cd backend
npm run dev
```

Production:

```bash
cd backend
npm start
```

Base URL:

- `http://localhost:5000/` — health check
- API base paths start with `/api/...`

---

## 🔐 Authentication

### Header format

Most protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

JWT is created during login and verified by `backend/middleware/authMiddleware.js`.

### Protected flow (how it works)

- **Auth middleware** reads the token from the `Authorization` header.
- It verifies the token with `process.env.JWT_SECRET`.
- It fetches the user from MongoDB and attaches it to `req.user`.

---

## 🧭 Middleware (Roles)

Role checks are handled in `backend/middleware/roleMiddleware.js`.

- `admin` — allows roles: `Admin` / `admin`
- `isStaff` — allows roles: `staff` / `Staff`
- `isAdminOrStaff` — allows admin + staff

> Controllers/routes in this repo typically use `admin` for admin-only endpoints.

---

## 🧠 Data Models (Mongoose)

### `User` (`backend/models/userModel.js`)

- `name`, `email`
- `password` (hashed; not returned by default)
- `role`: `Super Admin | Admin | Vendor | Customer | Delivery Staff`
- `isEmailVerified`
- `verificationToken`
- `passwordResetToken`, `passwordResetExpires`
- `addresses` (embedded)
- `profileImage`, `phone`
- `status`: active / suspended
- `isDeleted`

### `Category` (`backend/models/categoryModel.js`)

- `name` (unique)
- `slug` (unique, lowercase)
- `image`
- `description`
- `isActive`
- `isDeleted`

### `SubCategory` (`backend/models/subCategoryModel.js`)

- `name`, `slug` (unique)
- `category` (ObjectId ref)
- `description`
- `isActive`

### `Product` (`backend/models/productModel.js`)

- `name`, `slug` (unique)
- `description`, `shortDescription`
- `category`, `subCategory`, `vendor`
- `images[]` (url/publicId/isPrimary)
- pricing + stock
  - `price`, `discountPrice`, `stock`
- SKU + plant metadata
- flags:
  - `isFeatured`, `isPremium`, `isSpecialOffer`, `isFlashSale`
- status controls:
  - `status` (active/draft/disabled), `isActive`, `isDeleted`
- SEO fields

### `Cart` (`backend/models/cartModel.js`)

- `user` (ObjectId ref)
- `cartItems[]` each item:
  - `product` (ObjectId ref)
  - `quantity`

### `Order` (`backend/models/orderModel.js`)

- `user`
- `orderItems[]`: `{ product, quantity }`
- `totalPrice`
- `status`: pending / paid / shipped / delivered
- `shippingAddress` object

### `Vendor` (`backend/models/vendorModel.js`)

- links to a `User` (unique)
- shop fields: name/slug/description/logo/cover/address
- `status`: pending / approved / rejected
- `bankDetails`
- `balance`
- ratings metadata

---

## 📌 API Endpoints

All endpoints return **JSON**.

### Health

- `GET /`
  - Response: `"API is running..."`

---

## 👤 Auth Routes (`/api/auth`)

Controller: `backend/controllers/authController.js`

#### Public

- **POST** `/register`
- **POST** `/login`
- **GET** `/verify-email/:token`
- **POST** `/forgot-password`
- **POST** `/reset-password/:token`

#### Protected

- **GET** `/profile`
  - Middleware: `protect`
  - Returns the authenticated user (attached via `req.user`)

- **GET** `/admin-test`
  - Middleware: `protect` + `admin`
  - Response example: `{ message: "Welcome Admin 🔥", user: ... }`

---

## 🏷️ Category Routes (`/api/categories`)

Controller: `backend/controllers/categoryController.js`

- **POST** `/` *(Admin only)*
- **GET** `/` *(public; supports `?keyword=`)*
- **GET** `/:id`
- **PUT** `/:id` *(Admin only)*
- **DELETE** `/:id` *(soft delete)*

---

## 🧩 Sub-category Routes (`/api/subcategories`)

Controller: `backend/controllers/subCategoryController.js`

- **POST** `/` *(Admin only)*
- **GET** `/` *(public; active only)*
- **GET** `/:id`
- **PUT** `/:id` *(Admin only)*
- **DELETE** `/:id` *(deletes document)*

---

## 🌱 Product Routes (`/api/products`)

Controller: `backend/controllers/productController.js`

- **POST** `/` *(Admin only)*
- **GET** `/`
  - Supports:
    - `category`, `subCategory`, `vendor`
    - `isFeatured`, `isPremium`
    - price range: `minPrice`, `maxPrice`
    - search: `search`
    - pagination: `page` (10 per page)
    - sorting: `sort`
- **GET** `/featured`
- **GET** `/flash`
- **GET** `/:id`
- **PUT** `/:id` *(Admin only)*
- **DELETE** `/:id` *(soft delete via `isDeleted=true`)*

---

## 🛒 Cart Routes (`/api/cart`)

Controller: `backend/controllers/cartController.js`

All routes are **protected**.

- **POST** `/`
  - Add to cart
  - Body: `{ product, quantity }`
- **GET** `/`
  - Returns cart with populated product details
- **DELETE** `/:productId`
  - Removes one item from cart

---

## 🧾 Order Routes (`/api/orders`)

Controller: `backend/controllers/orderController.js`

All user routes are **protected**.

### User

- **POST** `/`
  - Create order from provided `orderItems`, `totalPrice`, `shippingAddress`
- **GET** `/my-orders`
  - Returns orders for the authenticated user
- **POST** `/checkout`
  - Creates order from the user’s **current cart** and clears the cart
  - Body: `{ shippingAddress }`
- **GET** `/:id`
  - Returns order by id with authorization check (user can only view own order)

### Admin

- **GET** `/`
  - Get all orders (optional query: `status`, `page`, `limit`)
- **PUT** `/:id/status`
  - Update order status
  - Body: `{ status }`
- **GET** `/admin/:id`
  - Get order by id (admin)

---

## 💳 Payment Routes (`/api/payment`)

Controller: `backend/controllers/paymentController.js`

Protected routes.

1) **POST** `/create-order`
- Creates a **Razorpay order** for a given order
- Body: `{ orderId }`

2) **POST** `/verify`
- Verifies payment using Razorpay signature (security-critical)
- Body includes:
  - `razorpay_order_id`
  - `razorpay_payment_id`
  - `razorpay_signature`
  - `orderId`

On success, the order is updated:

- `status = "Paid"`
- `isPaid = true`
- `paidAt = new Date()`

---

## 🧑‍💼 Admin Dashboard (`/api/admin`)

Controller: `backend/controllers/adminController.js`

- **GET** `/dashboard` *(Admin only)*
  - Response:
    - `totalOrders`
    - `totalUsers`
    - `totalRevenue`

---

## 👥 User Management (`/api/users`)

Controller: `backend/controllers/userController.js`

Admin only.

- **GET** `/`
  - Returns users without password: `-password`
- **DELETE** `/:id`
  - Soft? (In this controller it uses `deleteOne()` directly)
- **PUT** `/:id/role`
  - Body: `{ role }`
  - Allowed roles: `user`, `admin`, `staff`

---

## 🏪 Vendor Routes (`/api/v1/vendor`)

Controller: `backend/controllers/vendorController.js`

Protected routes.

### User

- **POST** `/apply`
  - Apply as vendor
  - Body: `{ shopName, shopSlug, shopDescription }`

- **GET** `/me`
  - Get my vendor profile

- **PUT** `/update`
  - Update vendor profile (updates via `Object.assign`)

### Admin

- **PUT** `/status/:id`
  - Body: `{ status }` (approve/reject flow)

- **GET** `/all`
  - Returns all vendors (populates `user: name email`)

---

## 📝 Review Routes (`/api/reviews`)

Controller: `backend/controllers/reviewController.js`

- **POST** `/` *(Protected)*
  - Create a review (one review per user per product)
  - Body: `{ product, vendor, rating, reviewText, images }`
    - `rating`: 1 to 5
    - `images`: array of strings (URLs/ids)

- **GET** `/:productId`
  - Get reviews for a product (public; returns only `isApproved: true`)
  - Supports query:
    - `page` (default: 1)
    - `limit` (default: 5)
    - `rating` (optional; filter by rating)

- **PUT** `/:id` *(Protected)*
  - Update your review
  - Body: `{ rating, reviewText, images }`

- **DELETE** `/:id` *(Protected)*
  - Delete your review

> Note: Controller has extra functions for approval/vendor review, but `reviewRoutes.js` currently only exposes the 4 endpoints above.

---

## ❤️ Wishlist Routes (`/api/wishlist`)

Controller: `backend/controllers/wishlistController.js`

All routes are **protected**.

- **POST** `/`
  - Add a product to your wishlist
  - Body: `{ productId }`

- **GET** `/`
  - Get your wishlist (populates `products`)

- **DELETE** `/:productId`
  - Remove a product from your wishlist

---

## 🧾 Dummy Output Examples

### 1) Login success

```json
{
  "message": "Login successful",
  "token": "<JWT>",
  "user": {
    "_id": "...",
    "name": "Plant User",
    "email": "user@example.com",
    "role": "Customer"
  }
}
```

### 2) Product list (paginated)

```json
{
  "success": true,
  "count": 10,
  "products": [
    {
      "_id": "...",
      "name": "Fiddle Leaf Fig",
      "price": 799,
      "category": { "name": "Indoor Plants" },
      "subCategory": { "name": "Ficus" },
      "vendor": { "name": "GreenStore" }
    }
  ]
}
```

### 3) Checkout creates order

```json
{
  "user": "<userId>",
  "orderItems": [
    { "product": "<productId>", "quantity": 2 }
  ],
  "totalPrice": 1598,
  "shippingAddress": {
    "street": "123 Street",
    "city": "Delhi",
    "postalCode": "110001",
    "country": "India"
  },
  "status": "pending"
}
```

### 4) Razorpay verify success

```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

## 🧪 Sample Request Bodies (Dummy)

### Register

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "StrongPassword@123"
}
```

### Login

```json
{
  "email": "rahul@example.com",
  "password": "StrongPassword@123"
}
```

### Add to Cart

```json
{
  "product": "<productId>",
  "quantity": 2
}
```

### Create Order (Manual)

```json
{
  "orderItems": [{
    "product": "<productId>",
    "quantity": 2
  }],
  "totalPrice": 1598,
  "shippingAddress": {
    "address": "House 12",
    "city": "Delhi",
    "postalCode": "110001",
    "country": "India"
  }
}
```

---

## 🧠 Security Notes

- JWT verification happens in `authMiddleware.js`.
- Razorpay signature verification is implemented in `paymentController.js`.
- `getOrderById` includes an authorization check to prevent users from accessing others’ orders.

---

## 📜 License

ISC

