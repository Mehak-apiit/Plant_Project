import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} from "../controllers/couponController.js";

const router = express.Router();

// Admin
router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

// User
router.post("/apply", applyCoupon);

export default router;