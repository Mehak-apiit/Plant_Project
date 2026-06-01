import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const verificationToken = crypto.randomBytes(32).toString("hex");
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 TOKEN GENERATE
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    // 🔗 VERIFY LINK
    const verifyLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    // 📩 SEND EMAIL
    await sendEmail(
      email,
      "Verify Your Email",
      `<h2>Hello ${name}</h2>
       <p>Click below to verify your email:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    res.status(201).json({
      message: "User registered. Please check your email to verify.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK USER EXISTS
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // CHECK PASSWORD
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};