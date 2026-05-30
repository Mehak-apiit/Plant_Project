import express from "express";
import {
  createSubCategory,
  getSubCategories,
} from "../controllers/subCategoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createSubCategory);
router.get("/", getSubCategories);

export default router;