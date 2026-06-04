import express from "express";
import {
  createReview,
  getProductReviewsAdvanced,
  deleteReview,
  updateReview
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:productId", getProductReviewsAdvanced);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);

export default router;