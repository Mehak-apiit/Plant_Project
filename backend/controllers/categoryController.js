import Category from "../models/categoryModel.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;

    // 1. Check duplicate name
    const existingName = await Category.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    // 2. Check duplicate slug
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // 3. Create category
    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const categories = await Category.find({
      ...keyword,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET CATEGORY BY ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description || category.description;
    category.image = image || category.image;
    category.isActive =
      isActive !== undefined ? isActive : category.isActive;

    const updated = await category.save();

    res.json({
      message: "Category updated",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOFT DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isDeleted = true;
    await category.save();

    res.json({ message: "Category deleted (soft)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};