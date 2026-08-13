const mongoose = require('mongoose');

/**
 * Livestock model for Syden.
 */
const VeterinaryHistorySchema = new mongoose.Schema({ date: Date, procedure: String, vetName: String, notes: String }, { _id: false });
const FarmActivitySchema = new mongoose.Schema({ title: String, description: String, date: Date, images: [String] }, { _id: false });
const ImageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const LivestockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['cattle','sheep','goats','poultry','equine','exotic'] },
  breed: String,
  age: String,
  healthStatus: String,
  description: String,
  careInstructions: String,
  veterinaryHistory: [VeterinaryHistorySchema],
  images: [ImageSchema],
  isFeatured: { type: Boolean, default: false },
  farmActivities: [FarmActivitySchema],
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Livestock', LivestockSchema);
