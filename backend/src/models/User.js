const mongoose = require('mongoose');

/**
 * User schema for DELEON ENTERPRiSES ecosystem.
 * ADDED: Farmer profile fields for DeeFresh farmer support
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user','farmer','admin'], default: 'user' },
  avatar: { type: String, default: 'default-avatar-url' },
  isVerified: { type: Boolean, default: false },
  // ADDED: Farmer profile fields
  farmerProfile: {
    farmName: String,
    farmLocation: String,
    farmDescription: String,
    farmPhoto: { url: String, publicId: String },
    contactPhone: String,
    isApproved: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: Date
});

module.exports = mongoose.model('User', userSchema);
