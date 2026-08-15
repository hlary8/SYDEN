const mongoose = require('mongoose');

/**
 * Notification schema for system notifications
 * ADDED: Sept 2026 - Notification system for farmer approvals and admin alerts
 */
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['farmer_approval', 'farmer_rejection', 'farmer_expiry', 'admin_alert'], default: 'admin_alert' },
  title: String,
  message: String,
  link: String, // URL to navigate to when clicked
  read: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed, // Extra data (e.g., farmerId, requirestId)
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // Auto-delete after 30 days
});

module.exports = mongoose.model('Notification', NotificationSchema);
