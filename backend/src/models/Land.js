const mongoose = require('mongoose');

/**
 * Land listing model for DELEON ENTERPRiSES.
 */
const ImageSchema = new mongoose.Schema({ url: String, publicId: String, caption: String }, { _id: false });

const LandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  narrative: { type: String, maxlength: 500 },
  price: { type: Number, required: true },
  sizeAcres: Number,
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' },
    mapboxId: String
  },
  images: [ImageSchema],
  features: [String],
  status: { type: String, enum: ['available','pending','sold'], default: 'available' },
  adminNotes: { type: String, select: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Land', LandSchema);
