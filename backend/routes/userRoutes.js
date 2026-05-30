import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADMIN: GET ALL USERS
router.get("/", protect, admin, getAllUsers);

export default router;