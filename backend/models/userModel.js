import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ["Super Admin", "Admin", "Vendor", "Customer", "Delivery Staff"],
    default: "Customer"
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: {
    type: String,
    select: false
  },

  passwordResetToken: {
    type: String,
    select: false
  },

  passwordResetExpires: {
    type: Date,
    select: false
  },

  refreshToken: {
    type: String,
    select: false
  },

  profileImage: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  addresses: [addressSchema],

  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active"
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});


// 🔐 PASSWORD HASHING
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


// 🔑 PASSWORD COMPARE
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);