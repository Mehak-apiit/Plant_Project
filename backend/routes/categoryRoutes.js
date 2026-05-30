import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin} from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADMIN ONLY
router.post("/", protect, admin, createCategory);

// PUBLIC
router.get("/", getCategories);

export default router;