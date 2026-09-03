const mongoose = require('mongoose');

/**
 * Livestock model for Syden.
 * ADDED: Enhanced with accordion sections, photo galleries, category strictness
 */
const VeterinaryHistorySchema = new mongoose.Schema({ date: Date, procedure: String, vetName: String, notes: String }, { _id: false });

const ImageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

// ADDED: Accordion sections with content and photos
const AccordionSectionSchema = new mongoose.Schema({
  title: String, // e.g., "Health & Veterinary Care", "Farm Life & Activities", "Pedigree & Lineage"
  content: String, // Rich text or plain text
  photo: { url: String, publicId: String }, // Optional photo for the section
  gallery: [ImageSchema] // Gallery photos for the section
}, { _id: false });

const LivestockSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ADDED: NEVER show MongoDB _id on frontend
  category: { type: String, enum: ['cattle','poultry','goats','sheep','pigs','equine'], required: true }, // ADDED: Strict enum
  breed: String,
  age: String,
  weight: String, // ADDED: Weight field
  healthStatus: { type: String, enum: ['excellent','good','fair','under-treatment'], default: 'good' },
  description: String,
  location: String, // ADDED: Location field
  // ADDED: Cover image for hero section
  coverImage: { url: String, publicId: String },
  // ADDED: Gallery photos (max 4 total including cover image)
  gallery: [ImageSchema],
  // ADDED: Accordion sections instead of hardcoded care instructions
  accordionSections: [AccordionSectionSchema],
  veterinaryHistory: [VeterinaryHistorySchema],
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Livestock', LivestockSchema);
