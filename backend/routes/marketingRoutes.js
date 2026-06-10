import express from "express";
import {
  createBanner,
  getActiveBanners,
  updateBanner,
  deleteBanner,
  createFlashSale,
  getActiveFlashSales,
  updateFlashSale,
  deleteFlashSale,
  subscribeNewsletter,
  getSubscribers,
  unsubscribe
} from "../controllers/marketingController.js";

import { protect } from "../middleware/authMiddleware.js";
import {admin} from "../middleware/roleMiddleware.js";

const router = express.Router();

// BANNERS
router.post("/banner", protect, admin, createBanner);
router.get("/banner", getActiveBanners);
router.put("/banner/:id", protect, admin, updateBanner);
router.delete("/banner/:id", protect, admin, deleteBanner);

//  FLASH SALES
router.post("/flash-sale", protect, admin, createFlashSale);
router.get("/flash-sale", getActiveFlashSales);
router.put("/flash-sale/:id", protect, admin, updateFlashSale);
router.delete("/flash-sale/:id", protect, admin, deleteFlashSale);

// NEWSLETTER
router.post("/subscribe", subscribeNewsletter);
router.get("/subscribers", protect, admin, getSubscribers);
router.put("/unsubscribe/:id", unsubscribe);

export default router;