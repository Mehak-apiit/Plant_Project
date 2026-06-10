import mongoose, { Schema } from 'mongoose';

// Notification Schema
const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['info', 'order', 'payment', 'vendor', 'support'],
    default: 'info'
  },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, read: 1 });

// DeliveryMethod Schema
const deliveryMethodSchema = new Schema({
  name: { type: String, required: true, unique: true },
  cost: { type: Number, required: true, min: 0 },
  estimatedDays: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// PaymentMethod Schema
const paymentMethodSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Cash on Delivery", "Stripe"
  provider: { type: String, required: true }, // e.g. "cod", "stripe"
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// CMSPage Schema
const cmsPageSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  content: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

cmsPageSchema.index({ slug: 1 });

// Setting Schema (Key-value settings)
const settingSchema = new Schema({
  key: { type: String, required: true, unique: true, uppercase: true, trim: true },
  value: { type: Schema.Types.Mixed, required: true },
  group: { type: String, default: 'General' } // e.g. "General", "AI", "Payment"
}, {
  timestamps: true
});

// WithdrawalRequest Schema
const withdrawalRequestSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  note: { type: String, default: '' },
  transactionDetails: { type: String, default: '' } // Reference ID or receipt
}, {
  timestamps: true
});

withdrawalRequestSchema.index({ vendor: 1 });
withdrawalRequestSchema.index({ status: 1 });

// VisitAnalytics Schema
const visitAnalyticsSchema = new Schema({
  path: { type: String, required: true },
  count: { type: Number, default: 1 },
  date: { type: Date, required: true } // Day level resolution for group by aggregation
}, {
  timestamps: true
});

// Compound unique index for daily aggregation tracking
visitAnalyticsSchema.index({ path: 1, date: 1 }, { unique: true });

export const Notification = mongoose.model('Notification', notificationSchema);
export const DeliveryMethod = mongoose.model('DeliveryMethod', deliveryMethodSchema);
export const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
export const CMSPage = mongoose.model('CMSPage', cmsPageSchema);
export const Setting = mongoose.model('Setting', settingSchema);
export const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
export const VisitAnalytics = mongoose.model('VisitAnalytics', visitAnalyticsSchema);
