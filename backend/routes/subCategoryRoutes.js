import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createSubCategory);
router.get("/", getSubCategories);
router.get("/:id", getSubCategoryById);

router.put("/:id", protect, admin, updateSubCategory);

router.delete("/:id", protect, admin, deleteSubCategory);

export default router;