import Vendor from "../models/vendorModel.js";
import User from "../models/userModel.js";

// 🟢 APPLY AS VENDOR
export const applyVendor = async (req, res) => {
  try {
    const {
      shopName,
      shopSlug,
      shopDescription
    } = req.body;

    // check already vendor
    const existing = await Vendor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Already a vendor" });
    }

    const vendor = await Vendor.create({
      user: req.user._id,
      shopName,
      shopSlug,
      shopDescription
    });

    res.status(201).json({
      message: "Vendor application submitted",
      vendor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 GET MY VENDOR PROFILE
export const getMyVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id }).populate("user");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 UPDATE VENDOR
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    Object.assign(vendor, req.body);

    await vendor.save();

    res.json({
      message: "Vendor updated",
      vendor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 ADMIN APPROVE / REJECT
export const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = status;
    await vendor.save();

    res.json({
      message: `Vendor ${status}`,
      vendor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};