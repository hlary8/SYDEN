const mongoose = require('mongoose');

/**
 * Notification schema for system notifications
 * ADDED: Sept 2026 - Notification system for farmer approvals and admin alerts
 */
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['farmer_approval', 'farmer_rejection', 'farmer_edited', 'farmer_expiry', 'admin_alert', 'new_application', 'new_produce', 'new_seed'],
    default: 'admin_alert'
  },
  title: String,
  message: String,
  link: String,
  read: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
});

module.exports = mongoose.model('Notification', NotificationSchema);
