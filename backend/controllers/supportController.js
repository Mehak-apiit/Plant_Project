import { SupportTicket, SupportReply } from "../models/supportModel.js";

// Generate Ticket Number
const generateTicketNumber = () => {
return "TCK-" + Date.now();
};

// 1. CREATE SUPPORT TICKET
export const createTicket = async (req, res) => {
try {
const { subject, message, category, priority } = req.body;

if (!subject || !message) {
  return res.status(400).json({ message: "Subject and message are required" });
}

const ticket = await SupportTicket.create({
  ticketNumber: generateTicketNumber(),
  user: req.user._id,
  subject,
  message,
  category,
  priority
});

res.status(201).json(ticket);

} catch (error) {
res.status(500).json({ message: error.message });
console.error("Error creating ticket:", error);
}
};

//  2. GET MY TICKETS (USER)
export const getMyTickets = async (req, res) => {
try {
const tickets = await SupportTicket.find({ user: req.user._id })
.sort({ createdAt: -1 });


res.json(tickets);

} catch (error) {
res.status(500).json({ message: error.message });
}
};

//  3. GET SINGLE TICKET
export const getTicketById = async (req, res) => {
try {
const ticket = await SupportTicket.findById(req.params.id)
.populate("user", "name email");


if (!ticket) {
  return res.status(404).json({ message: "Ticket not found" });
}

//  Ownership check
if (ticket.user._id.toString() !== req.user._id.toString() && req.user.role !== "Admin" && req.user.role !== "Super Admin") {
  return res.status(403).json({ message: "Not authorized" });
}

const replies = await SupportReply.find({ ticket: ticket._id })
  .populate("sender", "name email");

res.json({ ticket, replies });


} catch (error) {
res.status(500).json({ message: error.message });
}
};

//  4. ADD REPLY TO TICKET
export const addReply = async (req, res) => {
try {
const { message, attachments } = req.body;


const ticket = await SupportTicket.findById(req.params.id);

if (!ticket) {
  return res.status(404).json({ message: "Ticket not found" });
}

const reply = await SupportReply.create({
  ticket: ticket._id,
  sender: req.user._id,
  message,
  attachments
});

// Update status when admin replies
if (req.user.role === "Admin" || req.user.role === "Super Admin") {
  ticket.status = "in_progress";
}

await ticket.save();

res.status(201).json(reply);


} catch (error) {
res.status(500).json({ message: error.message });
}
};

// 5. ADMIN - GET ALL TICKETS
export const getAllTickets = async (req, res) => {
try {
const tickets = await SupportTicket.find()
.populate("user", "name email")
.sort({ createdAt: -1 });

res.json(tickets);


} catch (error) {
res.status(500).json({ message: error.message });
}
};

//  6. UPDATE TICKET STATUS (ADMIN)
export const updateTicketStatus = async (req, res) => {
try {
const { status } = req.body;


const ticket = await SupportTicket.findById(req.params.id);

if (!ticket) {
  return res.status(404).json({ message: "Ticket not found" });
}

ticket.status = status || ticket.status;

await ticket.save();

res.json(ticket);


} catch (error) {
res.status(500).json({ message: error.message });
}
};
