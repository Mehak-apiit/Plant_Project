import Product from "../models/productModel.js";

// CREATE PRODUCT (ADMIN ONLY)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};