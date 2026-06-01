import express from "express";
import {
  applyVendor,
  getMyVendor,
  updateVendor,
  updateVendorStatus
} from "../controllers/vendorController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// user routes
router.post("/apply", protect, applyVendor);
router.get("/me", protect, getMyVendor);
router.put("/update", protect, updateVendor);

// admin route
router.put("/status/:id", protect, admin, updateVendorStatus);

export default router;