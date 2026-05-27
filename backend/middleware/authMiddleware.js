import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// PROTECT ROUTES
export const protect = async (req, res, next) => {
  try {
    // GET TOKEN FROM HEADER
    const authHeader = req.headers.authorization;

    // CHECK TOKEN EXISTS
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    //  EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    //  VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  GET USER FROM DB
    const user = await User.findById(decoded.id).select("-password");

    // ATTACH USER TO REQUEST
    req.user = user;

    //  NEXT MIDDLEWARE
    next();

  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};