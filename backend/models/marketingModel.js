import mongoose, { Schema } from 'mongoose';

const bannerSchema = new Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  image: { type: String, required: true },
  link: { type: String, default: '' },
  position: {
    type: String,
    enum: ['home_hero', 'home_middle', 'sidebar'],
    default: 'home_hero'
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

bannerSchema.index({ isActive: 1 });

const flashSaleSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

flashSaleSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

const newsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Banner = mongoose.model('Banner', bannerSchema);
export const FlashSale = mongoose.model('FlashSale', flashSaleSchema);
export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
