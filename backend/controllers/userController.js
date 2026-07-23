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


export const deleteUser = async (req, res) => {
  try {
    // 1. USER FIND KARO ID SE
    const user = await User.findById(req.params.id);

    // 2. AGAR USER NAHI MILA
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. USER DELETE KARO
    await user.deleteOne();

    // 4. RESPONSE
    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc   Update user role (Admin)
// @route  PUT /api/users/:id/role
// @access Private/Admin

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // 1. VALIDATION
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!["Customer", "Vendor", "Admin", "Super Admin", "Delivery Staff"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 2. USER FIND
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. UPDATE ROLE
    user.role = role;

    await user.save();

    // 4. RESPONSE
    res.json({
      message: "User role updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};