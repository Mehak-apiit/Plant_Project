import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/orderModel.js";

// CREATE PAYMENT ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: order.totalPrice * 100,
      currency: "INR",
      receipt: order._id.toString(),
    };

    const paymentOrder = await razorpay.orders.create(options);

    res.json(paymentOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};