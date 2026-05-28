import SubCategory from "../models/subCategoryModel.js";

// CREATE SUBCATEGORY
export const createSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    const exists = await SubCategory.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: "SubCategory already exists" });
    }

    const subCategory = await SubCategory.create({
      name,
      category,
      description,
    });

    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SUBCATEGORIES
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category");
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};