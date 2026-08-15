const mongoose = require('mongoose');

/**
 * Lightweight Vet micro-profile used by Syden.
 */
const VetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  credentials: String,
  yearsExperience: Number
});

module.exports = mongoose.model('Vet', VetSchema);
