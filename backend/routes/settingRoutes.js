import express from "express";
import {
  upsertSetting,
  getAllSettings,
  getSettingByKey,
  deleteSetting
} from "../controllers/settingController.js";

import { protect } from "../middleware/authMiddleware.js";
import {admin} from "../middleware/roleMiddleware.js";

const router = express.Router();

// ONLY ADMIN CAN MODIFY
router.post("/", protect, admin, upsertSetting);
router.delete("/:key", protect, admin, deleteSetting);

//  ANY LOGGED IN USER CAN VIEW 
router.get("/", protect, getAllSettings);
router.get("/:key", protect, getSettingByKey);

export default router;