import express from "express";
import { registerUser, loginUser, verifyEmail} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);

// PROTECTED ROUTE
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});
// ONLY ADMIN ROUTE
router.get("/admin-test", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin 🔥",
    user: req.user,
  });
});

export default router;