import express from "express";
import { createPaymentOrder } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createPaymentOrder);

export default router;