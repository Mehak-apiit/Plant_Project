import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// USER
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// ADMIN
router.get("/", protect, isAdmin, getAllOrders);

export default router;