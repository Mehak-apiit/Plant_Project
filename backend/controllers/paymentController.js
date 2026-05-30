import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/orderModel.js";

/**
 * CREATE RAZORPAY PAYMENT ORDER
 * (Step 1: frontend se orderId aata hai)
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Find order in DB
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Razorpay instance create
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 3. Payment options
    const options = {
      amount: order.totalPrice * 100, // INR → paise
      currency: "INR",
      receipt: order._id.toString(),
    };

    // 4. Create Razorpay order
    const paymentOrder = await razorpay.orders.create(options);

    // 5. Send response to frontend
    res.json(paymentOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * VERIFY PAYMENT (MOST IMPORTANT)
 * (Step 2: payment success ke baad verify hota hai)
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // 1. Create signature string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // 2. Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // 3. Compare signatures
    if (expectedSignature === razorpay_signature) {

      // 4. Find order
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // 5. Update order as PAID
      order.status = "Paid";
      order.isPaid = true;
      order.paidAt = new Date();

      await order.save();

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed (Invalid signature)",
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};