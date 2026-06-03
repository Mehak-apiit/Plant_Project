import mongoose, { Schema } from "mongoose";

const productImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    images: [productImageSchema],

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0 },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    plantType: { type: String, default: "" },
    sunlightRequirement: { type: String, default: "" },
    wateringRequirement: { type: String, default: "" },
    soilType: { type: String, default: "" },
    height: { type: String, default: "" },
    potSize: { type: String, default: "" },
    careInstructions: { type: String, default: "" },

    isFeatured: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isSpecialOffer: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "draft", "disabled"],
      default: "active",
    },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    plantCareDetails: { type: Schema.Types.Mixed, default: {} },

    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },

    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

// INDEXES
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ price: 1 });

export default mongoose.model("Product", productSchema);