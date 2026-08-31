const mongoose = require('mongoose');

/**
 * Veterinary record attached to a Livestock item
 */
const ImageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const VetRecordSchema = new mongoose.Schema({
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Livestock', required: true },
  serviceType: { type: String, enum: ['Vaccination','Deworming','Check-up','Treatment','Surgery','Other'], default: 'Check-up' },
  dateAdministered: Date,
  nextDueDate: Date,
  medicineName: String,
  dosage: String,
  vetName: String,
  notes: String,
  images: [ImageSchema], // up to 3 images
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VetRecord', VetRecordSchema);
