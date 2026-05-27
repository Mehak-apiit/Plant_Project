import User from "../models/userModel.js";
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