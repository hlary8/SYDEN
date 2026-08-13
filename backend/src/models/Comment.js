const mongoose = require('mongoose');

/**
 * Comment model for Syden (and cross-brand comments).
 */
const CommentSchema = new mongoose.Schema({
  targetType: { type: String, enum: ['livestock','produce','land'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  isDeleted: { type: Boolean, default: false },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId'
});

module.exports = mongoose.model('Comment', CommentSchema);
