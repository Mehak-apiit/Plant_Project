import Product from "../models/productModel.js";

// CREATE PRODUCT (ADMIN ONLY)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    let query = { isDeleted: false };

    // FILTERS
    if (req.query.category) query.category = req.query.category;
    if (req.query.subCategory) query.subCategory = req.query.subCategory;
    if (req.query.vendor) query.vendor = req.query.vendor;
    if (req.query.isFeatured) query.isFeatured = req.query.isFeatured;
    if (req.query.isPremium) query.isPremium = req.query.isPremium;

    // PRICE FILTER
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = req.query.minPrice;
      if (req.query.maxPrice) query.price.$lte = req.query.maxPrice;
    }

    // SEARCH
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    let productsQuery = Product.find(query)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name");

    // SORT
    if (req.query.sort) {
      productsQuery = productsQuery.sort(req.query.sort);
    }

    // PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    productsQuery = productsQuery.skip(skip).limit(limit);

    const products = await productsQuery;

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subCategory")
      .populate("vendor");

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//UPDATE PRODUCT (ADMIN ONLY)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//DELETE PRODUCT (ADMIN ONLY)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// THESE ARE SPECIAL APIS
export const getFeaturedProducts = async (req, res) => {
  const data = await Product.find({ isFeatured: true, isDeleted: false });
  res.json(data);
};

export const getFlashSaleProducts = async (req, res) => {
  const data = await Product.find({ isFlashSale: true, isDeleted: false });
  res.json(data);
};