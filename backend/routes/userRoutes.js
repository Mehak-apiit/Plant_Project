import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";
import { deleteUser,updateUserRole } from "../controllers/userController.js";

const router = express.Router();

// ADMIN: GET ALL USERS
router.get("/", protect, admin, getAllUsers);

// DELETE USER (ADMIN)
router.delete("/:id", protect, admin, deleteUser);



// UPDATE ROLE (ADMIN)
router.put("/:id/role", protect, admin, updateUserRole);
export default router;