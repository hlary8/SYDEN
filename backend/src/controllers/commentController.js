const Comment = require('../models/Comment');
const createError = require('http-errors');

/**
 * Create a comment and emit over socket.io for real-time
 */
async function createComment(req, res, next) {
  try {
    const { targetType, targetId, content, parentId } = req.body;
    if (!targetType || !targetId || !content) return next(createError(400, 'Missing fields'));
    const doc = await Comment.create({ targetType, targetId, content, parentId: parentId || null, author: req.user._id });
    const io = req.app.get('io');
    io.to(`${targetType}:${targetId}`).emit('newComment', { comment: doc });
    res.status(201).json({ data: doc });
  } catch (err) { next(err); }
}

/**
 * Get nested comments for a target
 */
async function getCommentsForTarget(req, res, next) {
  try {
    const { targetType, targetId } = req.params;
    const comments = await Comment.find({ targetType, targetId, parentId: null, isDeleted: false }).sort({ createdAt: -1 }).populate('replies');
    res.json({ data: comments });
  } catch (err) { next(err); }
}

/**
 * Delete comment - owner or admin
 */
async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(createError(404, 'Not found'));
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') return next(createError(403, 'Forbidden'));
    comment.isDeleted = true;
    comment.deletedBy = req.user._id;
    comment.deletedAt = new Date();
    await comment.save();
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { createComment, getCommentsForTarget, deleteComment };
