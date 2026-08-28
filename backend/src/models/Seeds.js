const mongoose = require('mongoose');

/**
 * Seeds model for DeeFresh. Tracks seed inventory and distribution.
 * ADDED: Sept 2026 - DeeFresh seed management system
 */
const ImageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const SeedsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seedType: { type: String, enum: ['vegetable', 'fruit', 'herb', 'grain', 'legume', 'other'], required: true },
  variety: String, // e.g., "Hybrid F1", "Heirloom", "Open-pollinated"
  description: String,
  
  // Inventory management
  totalBags: { type: Number, required: true, default: 0 }, // Initial stock
  bagsIssued: { type: Number, default: 0 }, // Distributed to farmers
  bagsRemaining: { type: Number, default: function() { return this.totalBags - this.bagsIssued; } }, // Auto-calculated
  available: { type: Boolean, default: function() { return this.bagsRemaining > 0; } }, // Auto-set based on stock
  
  // Origin & certification
  countryOfOrigin: String,
  isCertified: { type: Boolean, default: false }, // Certified badge
  certificationBody: String, // e.g., "USDA Organic", "FairTrade"
  
  // Photos
  coverImage: ImageSchema,
  gallery: [ImageSchema], // Up to 5 photos
  
  // Growing information
  plantingInstructions: String,
  germinationDays: Number,
  daysToMaturity: Number,
  spacing: String, // e.g., "6 inches apart"
  soilType: String,
  waterRequirements: String,
  sunlightRequirements: String, // Full sun, partial shade, etc.
  
  // Yield & characteristics
  expectedYield: String, // e.g., "500 plants per packet"
  seedsPerBag: Number,
  packetSize: String, // e.g., "50g", "100 seeds"
  
  // Admin tracking
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update bagsRemaining and available fields on save
SeedsSchema.pre('save', function(next) {
  this.bagsRemaining = Math.max(0, this.totalBags - this.bagsIssued);
  this.available = this.bagsRemaining > 0;
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Seeds', SeedsSchema);
