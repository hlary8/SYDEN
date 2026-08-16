const createError = require('http-errors');
const Land = require('../models/Land');
const LandView = require('../models/LandView');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

function normalizeImages(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * GET /api/v1/lands
 */
async function list(req, res, next) {
  try {
    const { page = 1, limit = 12, near } = req.query;
    const query = { isDeleted: false };
    if (near) {
      const [lng, lat] = near.split(',').map(Number);
      query['location.coordinates'] = { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: parseInt(req.query.maxDist || '10000', 10) } };
    }
    const lands = await Land.find(query).skip((page - 1) * limit).limit(parseInt(limit, 10));
    res.json({ data: lands });
  } catch (err) { next(err); }
}

/**
 * GET by slug
 */
async function getBySlug(req, res, next) {
  try {
    const land = await Land.findOne({ slug: req.params.slug, isDeleted: false });
    if (!land) return next(createError(404, 'Not found'));
    
    // Track view if user is logged in (via Authorization header)
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.split(' ')[1];
        const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret-change-me-in-production';
        const payload = require('jsonwebtoken').verify(token, secret);
        await LandView.create({ land: land._id, user: payload.userId });
      } catch (e) { /* ignore auth errors on view tracking */ }
    }
    
    res.json({ data: land });
  } catch (err) { next(err); }
}

/**
 * Admin create land with Cloudinary image uploads
 */
async function create(req, res, next) {
  try {
    const body = req.body || {};
    const images = [];
    if (req.files && req.files.length) {
      const virusScanner = require('../services/virusScanner');
      for (const f of req.files) {
        const scan = await virusScanner.scanFile(f.path);
        if (!scan.clean) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
        }
        const result = await uploadImage(f.path, { public_id: `lands/${nanoid()}` });
        images.push({ url: result.url, publicId: result.publicId, caption: '' });
        try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
      }
    }
    const normalizedBodyImages = normalizeImages(body.images);
    const finalImages = images.length > 0 ? images : normalizedBodyImages;
    const normalizedPrice = Number(body.price) > 0 ? Number(body.price) : 0;

    const slug = (body.title || 'land').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);
    const doc = await Land.create({ ...body, price: normalizedPrice, images: finalImages, slug, createdBy: req.user ? req.user._id : null });
    res.status(201).json({ data: doc });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    if (req.files && req.files.length) {
      const images = [];
      const virusScanner = require('../services/virusScanner');
      for (const f of req.files) {
        const scan = await virusScanner.scanFile(f.path);
        if (!scan.clean) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
        }
        const result = await uploadImage(f.path, { public_id: `lands/${nanoid()}` });
        images.push({ url: result.url, publicId: result.publicId, caption: '' });
        try { fs.unlinkSync(f.path); } catch (e) { }
      }
      updates.images = images;
    } else if (updates.images) {
      updates.images = normalizeImages(updates.images);
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price) > 0 ? Number(updates.price) : 0;
    }
    updates.updatedAt = new Date();
    const doc = await Land.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return next(createError(404, 'Not found'));
    res.json({ data: doc });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Land.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!doc) return next(createError(404, 'Not found'));
    // optionally cleanup images asynchronously
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function inquire(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    // Persist inquiry for activity timeline
    const Inquiry = require('../models/Inquiry');
    const land = await Land.findById(id);
    if (!land) return next(createError(404, 'Listing not found'));
    const inquiry = await Inquiry.create({ listing: land._id, user: req.user._id, message: message || '' });
    // TODO: enqueue/send email to listing owner; for now return 202
    res.status(202).json({ ok: true, data: inquiry });
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, create, update, remove, inquire };
