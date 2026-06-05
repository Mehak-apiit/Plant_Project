import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountAmount: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0, min: 0 },
  maxDiscountAmount: { type: Number, default: 0, min: 0 }, // Useful for percentage type
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxUsageLimit: { type: Number, default: 100 }, // Global limit
  usageCount: { type: Number, default: 0 },
  limitPerUser: { type: Number, default: 1 }, // Limit of coupon use per individual customer
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
