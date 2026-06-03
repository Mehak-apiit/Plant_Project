import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getFlashSaleProducts,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import {admin} from "../middleware/roleMiddleware.js"

const router = express.Router();

router.post("/", protect, admin, createProduct);

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/flash", getFlashSaleProducts);

router.get("/:id", getSingleProduct);

router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;