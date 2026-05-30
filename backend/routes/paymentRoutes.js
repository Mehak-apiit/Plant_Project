import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create Razorpay order
router.post("/create-order", protect, createPaymentOrder);

// 2. Verify payment (IMPORTANT)
router.post("/verify", protect, verifyPayment);

export default router;