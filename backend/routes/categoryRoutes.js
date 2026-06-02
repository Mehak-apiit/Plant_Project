import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CREATE CATEGORY
router.post("/", protect, admin, createCategory);

// GET ALL CATEGORIES
router.get("/", getCategories);

// GET SINGLE CATEGORY
router.get("/:id", getCategoryById);

// UPDATE CATEGORY
router.put("/:id", protect, admin, updateCategory);

// DELETE CATEGORY
router.delete("/:id", protect, admin, deleteCategory);

export default router;