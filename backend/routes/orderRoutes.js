import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,

} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";


const router = express.Router();

// USER
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// ADMIN SARE ORDERS DEKH SAKTA HAI
router.get("/", protect, isAdmin, getAllOrders);
// ADMIN ORDER STATUS UPDATE KARSATA HAI
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;