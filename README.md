# Plant Project (Node/Express + MongoDB)

A backend API for an e-commerce style application focused on plants (auth, products, categories, sub-categories, cart, orders, payments, and admin).

## Tech Stack

- Node.js (Express)
- MongoDB (via Mongoose)
- JWT Authentication
- Multer (file uploads)
- Razorpay (payments)

## Project Structure

- `backend/server.js` - Express app entry point
- `backend/config/db.js` - MongoDB connection
- `backend/routes/*` - API route definitions
- `backend/controllers/*` - Request handlers/business logic
- `backend/models/*` - Mongoose schemas/models
- `backend/middleware/*` - Auth/role middleware
- `backend/seed/*` - Seed scripts (e.g., admin)

## Getting Started

### 1) Install dependencies

From the project root:

```bash
npm install
```

From the backend folder:

```bash
cd backend
npm install
```

### 2) Configure environment variables

Create a `.env` file in `backend/`.

Example (fill in your real values):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

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

Server should start at:

- `http://localhost:5000/` (basic health message)

## API Base Paths

The server mounts routes under `server.js`:

- Auth: `GET/POST /api/auth`
- Categories: `/api/categories`
- Sub-categories: `/api/subcategories`
- Products: `/api/products`
- Orders: `/api/orders`
- Cart: `/api/cart`
- Payments: `/api/payment`
- Admin: `/api/admin`
- Users: `/api/users`

## Authentication & Authorization

- The API uses JWT (see `jsonwebtoken` dependency).
- Role-based access is implemented via middleware in `backend/middleware/roleMiddleware.js`.

## Seeds

If seed scripts are provided (e.g., `backend/seed/adminSeed.js`), run them to create initial data.

## Notes

- Ensure your MongoDB connection string and JWT/razorpay secrets are set correctly.
- All endpoints accept/return JSON (`express.json()`).

## License

ISC

