import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
   checkout,
   getOrderById,
   getOrderByIdADMIN

} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";


const router = express.Router();

// USER
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.post("/checkout", protect, checkout);
router.get("/:id", protect, getOrderById);



// ADMIN SARE ORDERS DEKH SAKTA HAI
router.get("/", protect, admin, getAllOrders);
// ADMIN ORDER STATUS UPDATE KARSATA HAI
router.put("/:id/status", protect, admin, updateOrderStatus);
// ADMIN KO ORDER DETAILS DEKH SAKTA HAI BY USING THE ORDER ID OF THE PRODUCT
router.get("/admin/:id", protect, admin, getOrderByIdADMIN);

export default router;