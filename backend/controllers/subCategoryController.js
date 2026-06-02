import SubCategory from "../models/subCategoryModel.js";
import Category from "../models/categoryModel.js";

// CREATE SUBCATEGORY
export const createSubCategory = async (req, res) => {
  try {
    const { name, slug, category, description } = req.body;

    // 1. Check category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Check duplicate slug
    const existingSlug = await SubCategory.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // 3. Create subcategory
    const subCategory = await SubCategory.create({
      name,
      slug,
      category,
      description,
    });

    res.status(201).json({
      message: "SubCategory created successfully",
      subCategory,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SUBCATEGORIES
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SUBCATEGORY BY ID
export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id)
      .populate("category", "name slug");

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SUBCATEGORY
export const updateSubCategory = async (req, res) => {
  try {
    const { name, slug, category, description, isActive } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      subCategory.category = category;
    }

    subCategory.name = name || subCategory.name;
    subCategory.slug = slug || subCategory.slug;
    subCategory.description =
      description || subCategory.description;
    subCategory.isActive =
      isActive !== undefined ? isActive : subCategory.isActive;

    const updated = await subCategory.save();

    res.json({
      message: "SubCategory updated",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE SUBCATEGORY
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    await subCategory.deleteOne();

    res.json({ message: "SubCategory deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};