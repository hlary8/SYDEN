const mongoose = require('mongoose');

/**
+ * View tracking for Land (DELEON ENTERPRiSES) to support badge computation.
 */
const LandViewSchema = new mongoose.Schema({
  land: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: String,
  viewedAt: { type: Date, default: Date.now }
});

LandViewSchema.index({ land: 1, user: 1 });

module.exports = mongoose.model('LandView', LandViewSchema);
