const createError = require('http-errors');
const Land = require('../models/Land');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const ProduceOrder = require('../models/ProduceOrder');

/**
 * GET /api/v1/admin/stats - Aggregated metrics
 */
async function getStats(req, res, next) {
  try {
    const [landCount, commentCount, userCount, inquiryCount, orderCount] = await Promise.all([
      Land.countDocuments({ isDeleted: false }),
      Comment.countDocuments({ isDeleted: false }),
      User.countDocuments(),
      Inquiry.countDocuments(),
      ProduceOrder.countDocuments()
    ]);

    res.json({
      data: {
        lands: landCount,
        comments: commentCount,
        users: userCount,
        inquiries: inquiryCount,
        produceOrders: orderCount
      }
    });
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/admin/comments - All comments with moderation info
 */
async function listComments(req, res, next) {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const query = status === 'deleted' ? { isDeleted: true } : { isDeleted: false };
    const comments = await Comment.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    
    res.json({ data: comments });
  } catch (err) { next(err); }
}

/**
 * DELETE /api/v1/admin/comments/:id - Force delete any comment
 */
async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(id, { isDeleted: true, deletedBy: req.user._id, deletedAt: new Date() }, { new: true });
    if (!comment) return next(createError(404, 'Not found'));
    res.json({ ok: true });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/v1/admin/users/:id/role - Update user role
 */
async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'farmer', 'admin'].includes(role)) {
      return next(createError(400, 'Invalid role'));
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!user) return next(createError(404, 'Not found'));
    res.json({ data: user });
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/admin/activity-logs - Audit trail (TODO: expands with logging)
 */
async function activityLogs(req, res, next) {
  try {
    // Placeholder: in production, query a separate AuditLog collection
    res.json({ data: [] });
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/admin/inquiries - All land inquiries for admin review
 */
async function listInquiries(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const inquiries = await Inquiry.find()
      .populate('listing', 'title slug price')
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    
    res.json({ data: inquiries });
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/admin/users - List all users
 */
async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    
    res.json({ data: users });
  } catch (err) { next(err); }
}

module.exports = {
  getStats,
  listComments,
  deleteComment,
  updateUserRole,
  activityLogs,
  listInquiries,
  listUsers
};
