import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import coupenRoutes from "./routes/couponRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import marketingRoutes from "./routes/marketingRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// DB CONNECTION
connectDB();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupen", coupenRoutes);
app.use("/api/support",supportRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/settings", settingRoutes);


// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// TEST THE ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});