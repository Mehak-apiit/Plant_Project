import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADMIN ONLY CREATE PRODUCT
router.post("/", protect, isAdmin, createProduct);

// PUBLIC GET PRODUCTS
router.get("/", getProducts);

export default router;