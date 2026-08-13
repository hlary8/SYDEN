const mongoose = require('mongoose');

/**
 * ProduceOrder model for DeeFresh pre-orders.
 */
const ProduceOrderSchema = new mongoose.Schema({
  produce: { type: mongoose.Schema.Types.ObjectId, ref: 'Produce', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'kg' },
  status: { type: String, enum: ['pre-ordered','fulfilled','cancelled'], default: 'pre-ordered' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProduceOrder', ProduceOrderSchema);
