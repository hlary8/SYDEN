const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({ url: String, publicId: String, alt: String }, { _id: false });

const ProduceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String,
  category: { type: String, enum: ['vegetables','fruits','herbs','grains','dairy','seeds'] },
  variety: String,
  description: String,
  nutritionalInfo: {
    calories: Number,
    vitamins: [String],
    origin: String
  },
  farmerSource: {
    name: String,
    location: String,
    partnershipDate: Date,
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    introVideoUrl: String
  },
  images: [ImageSchema],
  availability: { type: String, enum: ['in-season','out-of-season','pre-order'], default: 'in-season' },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, enum: ['kg','bunch','crate','bag'], default: 'kg' },
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
