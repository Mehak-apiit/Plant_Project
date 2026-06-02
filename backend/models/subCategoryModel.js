import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique subcategory per category
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });

// Performance index
subCategorySchema.index({ isActive: 1 });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;