const createError = require('http-errors');
const Livestock = require('../models/Livestock');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { nanoid } = require('nanoid');
const fs = require('fs');

async function list(req, res, next) {
  try {
    const { category, query = '', featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    const search = query.trim();
    const baseQuery = { ...filter };

    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Livestock.find(baseQuery).sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const item = await Livestock.findById(req.params.id);
    if (!item) return next(createError(404, 'Livestock record not found'));
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

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
          const result = await uploadImage(f.path, { public_id: `livestock/${nanoid()}` });
          images.push({ url: result.url, publicId: result.publicId });
          try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
    }
    
    const item = await Livestock.create({
      name: payload.name,
      category: payload.category,
      breed: payload.breed,
      age: payload.age,
      healthStatus: payload.healthStatus,
      description: payload.description,
      careInstructions: payload.careInstructions,
      veterinaryHistory: Array.isArray(payload.veterinaryHistory) ? payload.veterinaryHistory : [],
      images: images.length > 0 ? images : (Array.isArray(payload.images) ? payload.images : []),
      isFeatured: Boolean(payload.isFeatured),
      farmActivities: Array.isArray(payload.farmActivities) ? payload.farmActivities : [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

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
          const result = await uploadImage(f.path, { public_id: `livestock/${nanoid()}` });
          images.push({ url: result.url, publicId: result.publicId });
          try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      updates.images = images;
    }
    
    const item = await Livestock.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!item) return next(createError(404, 'Livestock record not found'));
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const item = await Livestock.findByIdAndDelete(id);
    if (!item) return next(createError(404, 'Livestock record not found'));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
