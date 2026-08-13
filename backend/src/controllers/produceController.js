const createError = require('http-errors');
const ProduceOrder = require('../models/ProduceOrder');
const Produce = require('../models/Produce');
const { uploadImage } = require('../services/cloudinaryService');
const { nanoid } = require('nanoid');
const fs = require('fs');

/**
 * GET /api/v1/produce - List produce with filters
 */
async function list(req, res, next) {
  try {
    const { category, availability, page = 1, limit = 12 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (availability) query.availability = availability;
    const produce = await Produce.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit, 10));
    res.json({ data: produce });
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/produce/:slug - Get single produce by slug
 */
async function getBySlug(req, res, next) {
  try {
    const produce = await Produce.findOne({ slug: req.params.slug });
    if (!produce) return next(createError(404, 'Not found'));
    res.json({ data: produce });
  } catch (err) { next(err); }
}

/**
 * POST /api/v1/produce/:slug/order - Create a pre-order
 */
async function createOrder(req, res, next) {
  try {
    const { slug } = req.params;
    const { quantity, unit } = req.body;
    if (!quantity || quantity <= 0) return next(createError(400, 'Invalid quantity'));
    
    const produce = await Produce.findOne({ slug });
    if (!produce) return next(createError(404, 'Produce not found'));
    
    const order = await ProduceOrder.create({
      produce: produce._id,
      user: req.user._id,
      quantity,
      unit: unit || produce.unit,
      status: 'pre-ordered',
      createdAt: new Date()
    });
    
    res.status(201).json({ data: order });
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/produce/orders - List user's orders
 */
async function listOrders(req, res, next) {
  try {
    const orders = await ProduceOrder.find({ user: req.user._id }).populate('produce', 'name slug category').sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (err) { next(err); }
}

/**
 * POST /api/v1/produce - Admin create produce
 */
async function create(req, res, next) {
  try {
    const payload = req.body || {};
    const images = [];
    
    // Handle image uploads
    if (req.files && req.files.length) {
      const virusScanner = require('../services/virusScanner');
      for (const f of req.files) {
        try {
          const scan = await virusScanner.scanFile(f.path);
          if (!scan.clean) {
            try { fs.unlinkSync(f.path); } catch (e) { }
            return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
          }
          const result = await uploadImage(f.path, { public_id: `produce/${nanoid()}` });
          images.push({ url: result.url, publicId: result.publicId, alt: payload.name });
          try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
    }
    
    const slug = payload.slug || (payload.name || 'produce').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);
    
    const produce = await Produce.create({
      name: payload.name,
      slug: slug,
      category: payload.category,
      variety: payload.variety,
      description: payload.description,
      pricePerUnit: payload.pricePerUnit,
      unit: payload.unit || 'kg',
      availability: payload.availability || 'in-season',
      images: images.length > 0 ? images : (Array.isArray(payload.images) ? payload.images : []),
      farmerSource: payload.farmerSource,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ data: produce });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/v1/produce/:id - Admin update produce
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updates = { ...payload, updatedAt: new Date() };
    
    // Handle image uploads
    if (req.files && req.files.length) {
      const images = [];
      const virusScanner = require('../services/virusScanner');
      for (const f of req.files) {
        try {
          const scan = await virusScanner.scanFile(f.path);
          if (!scan.clean) {
            try { fs.unlinkSync(f.path); } catch (e) { }
            return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
          }
          const result = await uploadImage(f.path, { public_id: `produce/${nanoid()}` });
          images.push({ url: result.url, publicId: result.publicId, alt: payload.name || 'Produce' });
          try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      updates.images = images;
    }
    
    const produce = await Produce.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!produce) return next(createError(404, 'Produce not found'));
    res.json({ data: produce });
  } catch (err) { next(err); }
}

/**
 * DELETE /api/v1/produce/:id - Admin delete produce
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const produce = await Produce.findByIdAndDelete(id);
    if (!produce) return next(createError(404, 'Produce not found'));
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, createOrder, listOrders, create, update, remove };
