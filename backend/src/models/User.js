const mongoose = require('mongoose');

/**
 * User schema for DELEON ENTERPRiSES ecosystem.
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user','farmer','admin'], default: 'user' },
  avatar: { type: String, default: 'default-avatar-url' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: Date
});

module.exports = mongoose.model('User', userSchema);
