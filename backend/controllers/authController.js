import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK IF USER EXISTS
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // CREATE THE USER
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK USER EXISTS
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // CHECK PASSWORD
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};