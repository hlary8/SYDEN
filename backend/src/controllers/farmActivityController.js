const createError = require('http-errors');
const FarmActivity = require('../models/FarmActivity');

async function listActivities(req, res, next) {
  try {
    const filter = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.relatedTo) filter.relatedTo = req.query.relatedTo;
    const items = await FarmActivity.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

async function getActivity(req, res, next) {
  try {
    const item = await FarmActivity.findById(req.params.id);
    if (!item) return next(createError(404, 'Activity not found'));
    return res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function createActivity(req, res, next) {
  try {
    const payload = {
      title: req.body.title,
      headline: req.body.headline,
      body: req.body.body,
      photos: Array.isArray(req.body.photos) ? req.body.photos.slice(0,4) : [],
      company: req.body.company || 'None',
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      relatedTo: req.body.relatedTo || 'general',
      createdBy: req.user && req.user._id
    };

    const created = await FarmActivity.create(payload);

    // Emit real-time update
    try { req.app && req.app.get && req.app.get('io') && req.app.get('io').emit('farmActivity:created', created); } catch (e) { console.warn('emit failed', e); }

    return res.status(201).json({ success: true, data: created });
  } catch (err) { next(err); }
}

async function updateActivity(req, res, next) {
  try {
    const updates = {};
    ['title','headline','body','company','relatedTo'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    if (req.body.photos) updates.photos = Array.isArray(req.body.photos) ? req.body.photos.slice(0,4) : [];
    if (req.body.tags) updates.tags = Array.isArray(req.body.tags) ? req.body.tags : [];

    const updated = await FarmActivity.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return next(createError(404, 'Activity not found'));
    try { req.app && req.app.get && req.app.get('io') && req.app.get('io').emit('farmActivity:updated', updated); } catch (e) {}
    return res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

async function deleteActivity(req, res, next) {
  try {
    const removed = await FarmActivity.findByIdAndDelete(req.params.id);
    if (!removed) return next(createError(404, 'Activity not found'));
    try { req.app && req.app.get && req.app.get('io') && req.app.get('io').emit('farmActivity:deleted', { id: req.params.id }); } catch (e) {}
    return res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { listActivities, getActivity, createActivity, updateActivity, deleteActivity };
