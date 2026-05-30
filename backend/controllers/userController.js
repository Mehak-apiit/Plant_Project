import User from "../models/userModel.js";



export const getAllUsers = async (req, res) => {
  try {
    // 1. SAARE USERS FETCH (password hata ke)
    const users = await User.find().select("-password");

    // 2. RESPONSE
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};