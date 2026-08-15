const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({ url: String, publicId: String, alt: String }, { _id: false });

const ProduceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String,
  category: { type: String, enum: ['vegetables','fruits','herbs','grains','dairy','seeds'], required: true },
  variety: String,
  description: String,
  // ADDED: Enhanced nutritional information with all required fields
  nutritionalInfo: {
    calories: Number,
    protein: Number, // grams
    carbs: Number, // grams
    fiber: Number, // grams
    vitamins: String, // text field
  },
  seasonality: String, // "Year-round", "Summer", "Winter", etc.
  storageTips: String,
  farmerSource: {
    name: String, // Will be "DeeFresh" if not set, or approved farmer name
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    partnershipDate: Date,
    introVideoUrl: String
  },
  // ADDED: Multi-photo gallery (max 5)
  coverImage: ImageSchema,
  gallery: [ImageSchema],
  images: [ImageSchema], // compatibility alias for older records and list pages
  availability: { 
    inStock: { type: Boolean, default: true },
    quantity: Number
  },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, enum: ['kg','bunch','crate','bag','lb','oz'], default: 'kg' },
  seedSupply: {
    available: Boolean,
    seedVariety: String,
    supplierNotes: String
  },
  harvestDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produce', ProduceSchema);
