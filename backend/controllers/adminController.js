import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. TOTAL ORDERS COUNT
    const totalOrders = await Order.countDocuments();

    // 2. TOTAL USERS COUNT
    const totalUsers = await User.countDocuments();

    // 3. TOTAL REVENUE CALCULATE
    const orders = await Order.find();

    const totalRevenue = orders.reduce((acc, order) => {
      return acc + order.totalPrice;
    }, 0);

    // 4. RESPONSE SEND
    res.json({
      totalOrders,
      totalUsers,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};