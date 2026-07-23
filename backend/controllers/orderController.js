import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";

// Generate Order Number
const generateOrderNumber = () => {
  return "ORD-" + Date.now();
};

// CHECKOUT (MAIN API)
export const checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    let subtotal = 0;

    const orderItems = cart.items.map((item) => {
      subtotal += item.product.price * item.quantity;

      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        vendor: item.product.vendor,
      };
    });

    let discount = 0;
    let couponDoc = null;

    // 🎟️ APPLY COUPON
    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode, isActive: true });

      if (couponDoc) {
        const now = new Date();
        if (now < couponDoc.startDate || now > couponDoc.endDate) {
          return res.status(400).json({ message: "Coupon expired or not started" });
        }
        if (subtotal < couponDoc.minOrderAmount) {
          return res.status(400).json({ message: `Minimum order amount ₹${couponDoc.minOrderAmount} not met` });
        }
        if (couponDoc.usageCount >= couponDoc.maxUsageLimit) {
          return res.status(400).json({ message: "Coupon usage limit reached" });
        }

        if (couponDoc.discountType === "percentage") {
          discount = (subtotal * couponDoc.discountAmount) / 100;
          if (couponDoc.maxDiscountAmount > 0) {
            discount = Math.min(discount, couponDoc.maxDiscountAmount);
          }
        } else {
          discount = couponDoc.discountAmount;
        }

        // Prevent discount from exceeding subtotal + shipping
        discount = Math.min(discount, subtotal);
      }
    }

    const tax = 0;
    const shippingFee = 50;

    const totalAmount = subtotal + tax + shippingFee - discount;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      orderItems,
      subtotal,
      tax,
      shippingFee,
      discount,
      totalAmount,
      couponUsed: couponDoc?._id,
      shippingAddress,
      paymentMethod,
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  USER ORDERS
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

//  SINGLE ORDER (USER)
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Not found" });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json(order);
};

// ADMIN: ALL ORDERS
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
};

//  UPDATE STATUS
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Not found" });

  order.status = req.body.status;
  await order.save();

  res.json(order);
};