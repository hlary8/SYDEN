const mongoose = require('mongoose');

const ContactEnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['land_enquiry', 'vet_enquiry', 'produce_enquiry'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  contactMethod: String,
  message: String,
  landId: mongoose.Schema.Types.ObjectId,
  landName: String,
  animalName: String,
  productName: String,
  enquiryType: String,
  problemDescription: String,
  serviceType: String,
  status: { type: String, enum: ['new', 'read'], default: 'new' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactEnquiry', ContactEnquirySchema);
