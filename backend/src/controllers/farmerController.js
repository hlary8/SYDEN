const FarmerRequest = require('../models/FarmerRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

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
      const notif = await Notification.create({
        recipient: admin._id,
        type: 'farmer_approval',
        title: 'New Farmer Application',
        message: `${req.user.username} has applied to become a farmer.`,
        link: '/admin/farmers',
        data: { requestId: request._id, userId: req.user._id }
      });
      try { require('../utils/notificationEmitter').emitNotification(req.app, admin._id.toString(), notif); } catch (e) {}
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
    try { require('../utils/notificationEmitter').emitNotification(req.app, request.user._id.toString(), { recipient: request.user._id, type: 'farmer_approval', title: 'Application Approved!', message: 'Your farmer application has been approved. You can now list produce on DeeFresh.', link: '/deefresh' }); } catch (e) {}

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
    try { require('../utils/notificationEmitter').emitNotification(req.app, request.user._id.toString(), { recipient: request.user._id, type: 'farmer_rejection', title: 'Application Not Approved', message: `Your farmer application was not approved. Reason: ${rejectionReason || 'Not specified'}. You can reapply after 30 days.`, link: '/deefresh/farmers' }); } catch (e) {}

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
    const farmers = await User.find({
      role: 'farmer',
      'farmerProfile.isApproved': true,
      'farmerProfile.isSuspended': { $ne: true }
    })
      .select('username _id farmerProfile email')
      .sort({ username: 1 });

    const filtered = farmers.filter((farmer) => {
      const profile = farmer.farmerProfile || {};
      const isComplete = Boolean(
        profile.farmName &&
        profile.farmLocation &&
        profile.farmPhoto?.url &&
        (profile.farmDescription || profile.story || (Array.isArray(profile.activities) && profile.activities.length))
      );
      return isComplete;
    });

    res.json({ success: true, farmers: filtered });
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

// ADMIN: Directly create an approved farmer record
exports.createApprovedFarmer = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return next(createError(403, 'Admin only'));
    }

    const { farmName, location, contactPhone, description, profilePhoto, story, activities, gallery, isSuspended } = req.body;
    const normalizedActivities = Array.isArray(activities)
      ? activities.filter(Boolean).slice(0, 5)
      : (typeof activities === 'string' ? [activities.trim()].filter(Boolean) : []);
    const normalizedGallery = Array.isArray(gallery)
      ? gallery.filter(item => item && item.url).slice(0, 3)
      : [];

    const suspended = typeof isSuspended === 'boolean' ? isSuspended : true;
    const hasRequiredPublicFields = Boolean(
      farmName &&
      location &&
      profilePhoto &&
      (description || story || normalizedActivities.length)
    );
    const nextSuspended = suspended || !hasRequiredPublicFields;

    const baseUsername = farmName ? farmName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'farmer' : 'farmer';
    const username = `${baseUsername}-${Date.now()}`;
    const email = `${baseUsername}-${Date.now()}@deefresh.local`; 
    const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

    const baseProfile = {
      farmName,
      farmLocation: location,
      farmDescription: description || '',
      story: story || '',
      activities: normalizedActivities,
      gallery: normalizedGallery,
      farmPhoto: profilePhoto ? { url: profilePhoto, publicId: '' } : undefined,
      contactPhone,
      isApproved: true,
      isSuspended: nextSuspended
    };

    let newFarmer = await User.findOne({ username: baseUsername });
    if (!newFarmer) {
      newFarmer = await User.create({
        username,
        email,
        passwordHash,
        role: 'farmer',
        farmerProfile: baseProfile
      });
    } else {
      newFarmer = await User.findByIdAndUpdate(
        newFarmer._id,
        {
          role: 'farmer',
          farmerProfile: baseProfile
        },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Farmer added successfully',
      data: {
        _id: newFarmer._id,
        farmName: newFarmer.farmerProfile?.farmName || farmName,
        location: newFarmer.farmerProfile?.farmLocation || location,
        contactPhone: newFarmer.farmerProfile?.contactPhone || contactPhone,
        description: newFarmer.farmerProfile?.farmDescription || description || '',
        profilePhoto: newFarmer.farmerProfile?.farmPhoto?.url || profilePhoto || null,
        role: newFarmer.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// PATCH: Update farmer profile (admin or owner)
exports.updateFarmerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(createError(404, 'Farmer not found'));

    const canManage = req.user && (req.user.role === 'admin' || req.user._id.toString() === user._id.toString());
    if (!canManage) return next(createError(403, 'Forbidden'));

    const incoming = req.body || {};
    const currentProfile = user.farmerProfile || {};
    const nextProfile = {
      ...currentProfile,
      farmName: incoming.farmName || currentProfile.farmName || user.username,
      farmLocation: incoming.location || incoming.farmLocation || currentProfile.farmLocation || '',
      farmDescription: incoming.description || incoming.farmDescription || currentProfile.farmDescription || '',
      story: incoming.story || currentProfile.story || '',
      activities: Array.isArray(incoming.activities)
        ? incoming.activities.filter(Boolean).slice(0, 5)
        : (typeof incoming.activities === 'string' && incoming.activities.trim()
            ? [incoming.activities.trim()]
            : (Array.isArray(currentProfile.activities) ? currentProfile.activities : [])),
      gallery: Array.isArray(incoming.gallery)
        ? incoming.gallery.filter(item => item && item.url).slice(0, 3)
        : (Array.isArray(currentProfile.gallery) ? currentProfile.gallery.slice(0, 3) : []),
      farmPhoto: incoming.profilePhoto ? { url: incoming.profilePhoto, publicId: '' } : (currentProfile.farmPhoto || null),
      contactPhone: incoming.contactPhone || currentProfile.contactPhone || '',
      isApproved: typeof incoming.isApproved === 'boolean' ? incoming.isApproved : (currentProfile.isApproved ?? false),
      isSuspended: typeof incoming.isSuspended === 'boolean'
        ? incoming.isSuspended
        : (currentProfile.isSuspended ?? true)
    };

    const hasRequiredPublicFields = Boolean(
      nextProfile.farmName &&
      nextProfile.farmLocation &&
      nextProfile.farmPhoto?.url &&
      (nextProfile.farmDescription || nextProfile.story || nextProfile.activities?.length)
    );

    if (hasRequiredPublicFields) {
      nextProfile.isSuspended = false;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role: user.role === 'admin' ? 'farmer' : user.role,
        farmerProfile: nextProfile,
        ...(user.role === 'admin' ? { role: 'farmer' } : {})
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Farmer profile updated',
      data: {
        _id: updatedUser._id,
        farmName: updatedUser.farmerProfile?.farmName,
        location: updatedUser.farmerProfile?.farmLocation,
        contactPhone: updatedUser.farmerProfile?.contactPhone,
        description: updatedUser.farmerProfile?.farmDescription,
        story: updatedUser.farmerProfile?.story,
        activities: updatedUser.farmerProfile?.activities,
        gallery: updatedUser.farmerProfile?.gallery,
        profilePhoto: updatedUser.farmerProfile?.farmPhoto?.url || null,
        isSuspended: !!updatedUser.farmerProfile?.isSuspended,
        isApproved: !!updatedUser.farmerProfile?.isApproved
      }
    });
  } catch (err) {
    next(err);
  }
};
