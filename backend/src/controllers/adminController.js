const createError = require('http-errors');
const Land = require('../models/Land');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const ProduceOrder = require('../models/ProduceOrder');
const Notification = require('../models/Notification');
const ContactEnquiry = require('../models/ContactEnquiry');

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

/**
 * ADMIN: List farmer applications (status = Pending)
 */
async function listFarmerApplications(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const query = { 'farmerProfile.status': 'Pending' };
    const apps = await User.find(query)
      .select('-passwordHash')
      .sort({ 'farmerProfile.appliedAt': -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    return res.json({ data: apps });
  } catch (err) { next(err); }
}

/**
 * ADMIN: Approve farmer application
 */
async function approveFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(createError(404, 'User not found'));
    user.farmerProfile = user.farmerProfile || {};
    user.farmerProfile.status = 'Approved';
    user.farmerProfile.isApproved = true;
    user.role = 'farmer';
    await user.save();

    await Notification.create({
      recipient: user._id,
      type: 'farmer_approval',
      title: 'Farmer Application Approved',
      message: 'Your farmer application has been approved. Your farmer profile is now active.',
      link: '/profile'
    });
    try { require('../utils/notificationEmitter').emitNotification(req.app, user._id.toString(), { recipient: user._id, type: 'farmer_approval', title: 'Farmer Application Approved', message: 'Your farmer application has been approved. Your farmer profile is now active.', link: '/profile' }); } catch (e) {}

    return res.json({ data: user });
  } catch (err) { next(err); }
}

/**
 * ADMIN: Reject farmer application
 */
async function rejectFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { $set: { 'farmerProfile.status': 'Rejected', 'farmerProfile.isApproved': false } }, { new: true }).select('-passwordHash');
    if (!user) return next(createError(404, 'User not found'));

    await Notification.create({
      recipient: user._id,
      type: 'farmer_rejection',
      title: 'Farmer Application Rejected',
      message: 'Your farmer application was not approved. You can edit and reapply.',
      link: '/account'
    });
      try { require('../utils/notificationEmitter').emitNotification(req.app, user._id.toString(), { recipient: user._id, type: 'farmer_rejection', title: 'Farmer Application Rejected', message: 'Your farmer application was not approved. You can edit and reapply.', link: '/account' }); } catch (e) {}

    return res.json({ data: user });
  } catch (err) { next(err); }
}

/**
 * ADMIN: Delete farmer application (remove farmerProfile)
 */
async function deleteFarmerApplication(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { $unset: { farmerProfile: '' } }, { new: true }).select('-passwordHash');
    if (!user) return next(createError(404, 'User not found'));
    return res.json({ ok: true });
  } catch (err) { next(err); }
}

/**
 * ADMIN: Edit farmer profile fields
 */
async function editFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    // Only allow updating farmerProfile subfields and basic user fields
    const allowed = {};
    if (updates.username) allowed.username = updates.username;
    if (updates.email) allowed.email = updates.email;
    if (updates.farmerProfile) {
      for (const key of ['farmName','farmLocation','farmDescription','story','activities','company','status','appliedAt','contactPhone']) {
        if (typeof updates.farmerProfile[key] !== 'undefined') {
          allowed[`farmerProfile.${key}`] = updates.farmerProfile[key];
        }
      }
    }

    const user = await User.findByIdAndUpdate(id, { $set: allowed }, { new: true }).select('-passwordHash');
    if (!user) return next(createError(404, 'User not found'));

    // If admin approves via edit (status changed to Approved), ensure role and notification
    if (updates.farmerProfile && updates.farmerProfile.status === 'Approved') {
      user.role = 'farmer';
      user.farmerProfile.isApproved = true;
      await user.save();
      await Notification.create({ recipient: user._id, type: 'farmer_approval', title: 'Farmer Approved', message: 'An admin approved your farmer profile.', link: '/profile' });
    }

    return res.json({ data: user });
  } catch (err) { next(err); }
}

/**
 * ADMIN: List website concerns (contact enquiries from land and vet forms)
 */
async function listWebsiteConcerns(req, res, next) {
  try {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    const data = await ContactEnquiry.find(query).sort({ createdAt: -1 });
    res.json({ data });
  } catch (err) { next(err); }
}

/**
 * ADMIN: Mark website concern as read
 */
async function markWebsiteConcernRead(req, res, next) {
  try {
    const doc = await ContactEnquiry.findByIdAndUpdate(req.params.id, { status: 'read', read: true }, { new: true });
    if (!doc) return next(createError(404, 'Enquiry not found'));
    res.json({ data: doc });
  } catch (err) { next(err); }
}

module.exports = {
  getStats,
  listComments,
  deleteComment,
  updateUserRole,
  activityLogs,
  listInquiries,
  listUsers,
  listFarmerApplications,
  approveFarmer,
  rejectFarmer,
  deleteFarmerApplication,
  editFarmer,
  listWebsiteConcerns,
  markWebsiteConcernRead
};
