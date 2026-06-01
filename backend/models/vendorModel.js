import mongoose, { Schema } from 'mongoose';

const bankDetailsSchema = new Schema({
  accountName: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  bankName: { type: String, default: '' },
  routingNumber: { type: String, default: '' },
  swiftCode: { type: String, default: '' }
}, { _id: false });

const vendorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shopName: { type: String, required: true, unique: true, trim: true },
  shopSlug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  shopDescription: { type: String, default: '' },
  shopLogo: { type: String, default: '' },
  shopCover: { type: String, default: '' },
  shopAddress: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  bankDetails: { type: bankDetailsSchema, default: () => ({}) },
  balance: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  verificationDocuments: [{
    docType: { type: String, default: '' }, // e.g. "Business License", "Tax ID"
    docUrl: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

// Indexes for high performance
vendorSchema.index({ status: 1 });

export const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
