import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// CREATE ORDER (USER)
export const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, shippingAddress } = req.body;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.product"
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const checkout = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product"
    );

    console.log("CART FOUND:", cart);

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    console.log(cart.cartItems[0].product);

    const totalPrice = cart.cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user._id,
      orderItems: cart.cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
    });

    cart.cartItems = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ORDER BY ID (USER)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product")
      .populate("user", "name email");

    // 1. check order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. security check (VERY IMPORTANT)
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};