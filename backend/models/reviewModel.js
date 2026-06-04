import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },

  rating: { type: Number, required: true, min: 1, max: 5 },

  reviewText: { type: String, required: true, trim: true },

  images: [{ type: String }],

  isApproved: { type: Boolean, default: true }

}, {
  timestamps: true
});

// ONE USER → ONE REVIEW PER PRODUCT
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// FAST FILTERING
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ vendor: 1, isApproved: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;