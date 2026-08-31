const mongoose = require('mongoose');

const farmActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  headline: { type: String },
  body: { type: String },
  photos: [{ url: String, publicId: String }],
  company: { type: String, enum: ['DeeFresh','Syden','DeLeon','None'], default: 'None' },
  tags: [String],
  relatedTo: { type: String, enum: ['livestock','veterinary','land','produce','general'], default: 'general' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FarmActivity', farmActivitySchema);
