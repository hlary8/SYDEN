const createError = require('http-errors');
const Comment = require('../models/Comment');
const Inquiry = require('../models/Inquiry');
const ProduceOrder = require('../models/ProduceOrder');
const LandView = require('../models/LandView');
const mongoose = require('mongoose');

/**
 * GET /api/v1/users/:id/activity
 * Protected: user or admin
 */
async function activity(req, res, next) {
  try {
    const { id } = req.params;
    if (!req.user) return next(createError(401, 'Unauthorized'));
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) return next(createError(403, 'Forbidden'));

    const objectId = mongoose.Types.ObjectId(id);

    const [inquiries, comments, orders, landViews] = await Promise.all([
      Inquiry.find({ user: objectId }).populate('listing', 'title slug').lean(),
      Comment.find({ author: objectId }).lean(),
      ProduceOrder.find({ user: objectId }).populate('produce', 'name slug').lean(),
      LandView.find({ user: objectId }).distinct('land')
    ]);

    const activities = [];
    for (const iq of inquiries) activities.push({ type: 'inquiry', date: iq.createdAt, summary: `Inquired about ${iq.listing?.title || 'a listing'}`, ref: { collection: 'inquiries', id: iq._id }, brand: 'DeLeon' });
    for (const c of comments) activities.push({ type: 'comment', date: c.createdAt, summary: c.content.slice(0, 120), ref: { collection: 'comments', id: c._id, targetType: c.targetType, targetId: c.targetId }, brand: c.targetType === 'livestock' ? 'Syden' : (c.targetType === 'produce' ? 'DeeFresh' : 'DeLeon') });
    for (const o of orders) activities.push({ type: 'order', date: o.createdAt, summary: `${o.status} ${o.quantity}${o.unit} of ${o.produce?.name || 'produce'}`, ref: { collection: 'orders', id: o._id }, brand: 'DeeFresh' });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Badges
    const badgeSet = [];
    if (landViews.length >= 10) badgeSet.push('Land Scout');
    const livestockComments = comments.filter((c) => c.targetType === 'livestock').length;
    if (livestockComments >= 5) badgeSet.push('Farm Friend');
    const preorders = orders.filter((o) => o.status === 'pre-ordered').length;
    if (preorders > 0) badgeSet.push('Seed Saver');

    const payload = { activity: activities, badges: badgeSet };
    res.json(payload);
  } catch (err) { next(err); }
}

module.exports = { activity };
