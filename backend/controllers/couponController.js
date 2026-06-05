// ADMIN CREATES A COUPON
import Coupon from "../models/couponModel.js";

export const createCoupon = async (req, res) => {
  try {
    const data = req.body;

    const existing = await Coupon.findOne({ code: data.code });
    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create(data);

    res.status(201).json({
      message: "Coupon created successfully",
      coupon
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET ALL COUPONS
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({ coupons });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//UPDATE A COUPON
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({
      message: "Coupon updated",
      coupon
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE A COUPON
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// APPLY A COUPON
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ message: "Invalid or inactive coupon" });
    }

    const now = new Date();

    if (now < coupon.startDate || now > coupon.endDate) {
      return res.status(400).json({ message: "Coupon expired or not started" });
    }

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({ message: "Minimum order not met" });
    }

    if (coupon.usageCount >= coupon.maxUsageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountAmount) / 100;

      if (coupon.maxDiscountAmount > 0) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountAmount;
    }

    const finalAmount = cartTotal - discount;

    // increment usage
    coupon.usageCount += 1;
    await coupon.save();

    res.json({
      message: "Coupon applied",
      discount,
      finalAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};