import express from "express";
import {
createTicket,
getMyTickets,
getTicketById,
addReply,
getAllTickets,
updateTicketStatus
} from "../controllers/supportController.js";

import { protect} from "../middleware/authMiddleware.js";
import {admin} from "../middleware/roleMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.get("/:id", protect, getTicketById);
router.post("/:id/reply", protect, addReply);

// ADMIN ROUTES
router.get("/", protect, admin, getAllTickets);
router.put("/:id/status", protect, admin, updateTicketStatus);

export default router;
