const FarmerRequest = require('../models/FarmerRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const createError = require('http-errors');

/**
 * Farmer Management Controller
 * ADDED: Sept 2026 - Complete farmer approval workflow
 */

// POST: User applies to become a farmer
exports.applyAsFarmer = async (req, res, next) => {
  try {
    const { farmName, location, contactPhone } = req.body;

    if (!req.user) return next(createError(401, 'Unauthorized'));

    // Check if already a farmer or has pending request
    const existingRequest = await FarmerRequest.findOne({ 
      user: req.user._id, 
      status: { $in: ['pending', 'approved'] } 
    });

    if (existingRequest) {
      return next(createError(400, 'You already have a pending or approved farmer application'));
    }

    // Check rejection cooldown (30 days)
    const recentRejection = await FarmerRequest.findOne({
      user: req.user._id,
      status: 'rejected',
      rejectedAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    if (recentRejection) {
      return next(createError(400, 'You must wait 30 days after rejection to reapply'));
    }

    // Create new farmer request
    const request = await FarmerRequest.create({
      user: req.user._id,
      farmName,
      location,
      contactPhone,
      status: 'pending'
    });

    // Create admin notification
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        type: 'farmer_approval',
        title: 'New Farmer Application',
        message: `${req.user.username} has applied to become a farmer.`,
        link: '/admin/farmers',
        data: { requestId: request._id, userId: req.user._id }
      });
    }

    res.status(201).json({ success: true, message: 'Application submitted successfully', request });
  } catch (err) {
    next(err);
  }
};

// GET: Admin gets all farmer requests
exports.getAllFarmerRequests = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    // Check expiry and auto-update
    await FarmerRequest.updateMany(
      { status: 'pending', expiresAt: { $lt: new Date() } },
      { status: 'expired' }
    );

    const query = status === 'all' ? {} : { status };
    const requests = await FarmerRequest.find(query)
      .populate('user', 'username email username farmerProfile')
      .sort({ requestedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await FarmerRequest.countDocuments(query);

    res.json({
      success: true,
      requests,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

// PATCH: Admin approves farmer request
exports.approveFarmer = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return next(createError(403, 'Admin only'));
    }

    const request = await FarmerRequest.findByIdAndUpdate(
      requestId,
      { status: 'approved', reviewedAt: new Date(), reviewedBy: req.user._id },
      { new: true }
    ).populate('user');

    if (!request) return next(createError(404, 'Request not found'));

    // Update user role to farmer
    await User.findByIdAndUpdate(request.user._id, { 
      role: 'farmer',
      'farmerProfile.isApproved': true 
    });

    // Create notification for user
    await Notification.create({
      recipient: request.user._id,
      type: 'farmer_approval',
      title: 'Application Approved!',
      message: 'Your farmer application has been approved. You can now list produce on DeeFresh.',
      link: '/deefresh',
      read: false
    });

    // Console log instead of email for now
    console.log(`✓ Farmer approved: ${request.user.email}`);

    res.json({ success: true, message: 'Farmer approved', request });
  } catch (err) {
    next(err);
  }
};

// PATCH: Admin rejects farmer request
exports.rejectFarmer = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return next(createError(403, 'Admin only'));
    }

    const request = await FarmerRequest.findByIdAndUpdate(
      requestId,
      { 
        status: 'rejected', 
        rejectionReason,
        rejectedAt: new Date(),
        reviewedAt: new Date(), 
        reviewedBy: req.user._id 
      },
      { new: true }
    ).populate('user');

    if (!request) return next(createError(404, 'Request not found'));

    // Create notification for user
    await Notification.create({
      recipient: request.user._id,
      type: 'farmer_rejection',
      title: 'Application Not Approved',
      message: `Your farmer application was not approved. Reason: ${rejectionReason || 'Not specified'}. You can reapply after 30 days.`,
      link: '/deefresh/farmers',
      read: false
    });

    console.log(`✗ Farmer rejected: ${request.user.email} - Reason: ${rejectionReason}`);

    res.json({ success: true, message: 'Farmer rejected', request });
  } catch (err) {
    next(err);
  }
};

// DELETE: Admin deletes farmer request and downgrades user if approved
exports.deleteFarmerRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return next(createError(403, 'Admin only'));
    }

    const request = await FarmerRequest.findById(requestId);
    if (!request) return next(createError(404, 'Request not found'));

    // If farmer was approved, downgrade to user
    if (request.status === 'approved') {
      await User.findByIdAndUpdate(request.user._id, { 
        role: 'user',
        'farmerProfile.isApproved': false 
      });
    }

    await FarmerRequest.findByIdAndDelete(requestId);

    res.json({ success: true, message: 'Farmer request deleted' });
  } catch (err) {
    next(err);
  }
};

// GET: Approved farmers list (for dropdown in produce admin form)
exports.getApprovedFarmers = async (req, res, next) => {
  try {
    const farmers = await User.find({ role: 'farmer' })
      .select('username _id farmerProfile.farmName')
      .sort({ username: 1 });

    res.json({ success: true, farmers });
  } catch (err) {
    next(err);
  }
};

// GET: User's own farmer request status
exports.getMyFarmerStatus = async (req, res, next) => {
  try {
    if (!req.user) return next(createError(401, 'Unauthorized'));

    const request = await FarmerRequest.findOne({ user: req.user._id });
    const userRole = req.user.role;

    res.json({
      success: true,
      role: userRole,
      request: request || null,
      isFarmer: userRole === 'farmer'
    });
  } catch (err) {
    next(err);
  }
};
