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
 * ADDED: Multi-photo gallery, nutritional fields, farmer source validation
 */
async function create(req, res, next) {
  try {
    const payload = req.body || {};
    let gallery = [];
    let coverImage = null;
    
    // Handle multi-image upload (max 5 for gallery)
    if (req.files && req.files.length) {
      const virusScanner = require('../services/virusScanner');
      const uploadedPhotos = [];
      
      for (const f of req.files) {
        try {
          const scan = await virusScanner.scanFile(f.path);
          if (!scan.clean) {
            try { fs.unlinkSync(f.path); } catch (e) { }
            return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
          }
          const result = await uploadImage(f.path, { public_id: `produce/${nanoid()}` });
          uploadedPhotos.push({ url: result.url, publicId: result.publicId });
          try { fs.unlinkSync(f.path); } catch (e) { }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      
      // First uploaded photo is cover image
      if (uploadedPhotos.length > 0) {
        coverImage = uploadedPhotos[0];
        gallery = uploadedPhotos.slice(1, 5); // Max 5 total, so 4 in gallery
      }
    }
    
    // Validate category
    const validCategories = ['vegetables','fruits','herbs','grains','dairy','seeds'];
    if (!validCategories.includes(payload.category)) {
      return next(createError(400, 'Invalid category'));
    }
    
    const slug = payload.slug || (payload.name || 'produce').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);
    
    // Handle farmer source - only allow "DeeFresh" or approved farmer IDs
    let farmerSource = { name: 'DeeFresh' };
    if (payload.farmerSourceId) {
      const User = require('../models/User');
      const farmer = await User.findOne({ _id: payload.farmerSourceId, role: 'farmer' });
      if (farmer) {
        farmerSource = {
          name: farmer.farmerProfile?.farmName || farmer.username,
          farmerId: farmer._id,
          location: farmer.farmerProfile?.farmLocation
        };
      }
    }
    
    const produce = await Produce.create({
      name: payload.name,
      slug: slug,
      category: payload.category,
      variety: payload.variety,
      description: payload.description,
      nutritionalInfo: {
        calories: Number(payload.nutritionCalories) || null,
        protein: Number(payload.nutritionProtein) || null,
        carbs: Number(payload.nutritionCarbs) || null,
        fiber: Number(payload.nutritionFiber) || null,
        vitamins: payload.nutritionVitamins || null
      },
      seasonality: payload.seasonality || null,
      storageTips: payload.storageTips || null,
      pricePerUnit: Number(payload.pricePerUnit),
      unit: payload.unit || 'kg',
      availability: {
        inStock: Boolean(payload.inStock !== 'false'),
        quantity: Number(payload.quantity) || 0
      },
      farmerSource: farmerSource,
      coverImage: coverImage || null,
      gallery: gallery,
      images: coverImage ? [coverImage, ...gallery] : gallery,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ data: produce });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/v1/produce/:id - Admin update produce
 * ADDED: Gallery management, nutritional updates, farmer source changes
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updates = { ...payload, updatedAt: new Date() };
    
    const produce = await Produce.findById(id);
    if (!produce) return next(createError(404, 'Produce not found'));
    
    // Handle new image uploads for gallery
    if (req.files && req.files.length) {
      const newPhotos = [];
      const virusScanner = require('../services/virusScanner');
      
      for (const f of req.files) {
        try {
          const scan = await virusScanner.scanFile(f.path);
          if (!scan.clean) {
            try { fs.unlinkSync(f.path); } catch (e) { }
            return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
          }
          const result = await uploadImage(f.path, { public_id: `produce/${nanoid()}` });
          newPhotos.push({ url: result.url, publicId: result.publicId });
          try { fs.unlinkSync(f.path); } catch (e) { }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      
      // Append new photos to gallery (max 5 total including cover)
      if (newPhotos.length > 0) {
        const existingCount = (produce.gallery?.length || 0) + (produce.coverImage ? 1 : 0);
        const maxNewPhotos = Math.max(0, 5 - existingCount);
        
        if (newPhotos.length > 0 && !produce.coverImage) {
          updates.coverImage = newPhotos[0];
          updates.gallery = [...(produce.gallery || []), ...newPhotos.slice(1, maxNewPhotos)];
        } else {
          updates.gallery = [...(produce.gallery || []), ...newPhotos.slice(0, maxNewPhotos)];
        }
      }
    }
    
    // Handle photo removal by publicId
    if (payload.removePhotos && Array.isArray(payload.removePhotos)) {
      const publicIdsToRemove = payload.removePhotos;
      
      // Remove from cover image
      if (produce.coverImage && publicIdsToRemove.includes(produce.coverImage.publicId)) {
        updates.coverImage = null;
      }
      
      // Remove from gallery
      updates.gallery = (produce.gallery || []).filter(photo => 
        !publicIdsToRemove.includes(photo.publicId)
      );
      updates.images = [
        ...(updates.coverImage ? [updates.coverImage] : produce.coverImage ? [produce.coverImage] : []),
        ...((updates.gallery || produce.gallery || []).filter(photo => !publicIdsToRemove.includes(photo.publicId)))
      ].filter(Boolean);
    }
    
    // Update nutritional info
    if (payload.nutritionCalories !== undefined || payload.nutritionProtein !== undefined) {
      updates.nutritionalInfo = {
        ...(produce.nutritionalInfo || {}),
        calories: payload.nutritionCalories !== undefined ? Number(payload.nutritionCalories) : produce.nutritionalInfo?.calories,
        protein: payload.nutritionProtein !== undefined ? Number(payload.nutritionProtein) : produce.nutritionalInfo?.protein,
        carbs: payload.nutritionCarbs !== undefined ? Number(payload.nutritionCarbs) : produce.nutritionalInfo?.carbs,
        fiber: payload.nutritionFiber !== undefined ? Number(payload.nutritionFiber) : produce.nutritionalInfo?.fiber,
        vitamins: payload.nutritionVitamins || produce.nutritionalInfo?.vitamins
      };
    }
    
    // Update farmer source
    if (payload.farmerSourceId) {
      const User = require('../models/User');
      const farmer = await User.findOne({ _id: payload.farmerSourceId, role: 'farmer' });
      if (farmer) {
        updates.farmerSource = {
          name: farmer.farmerProfile?.farmName || farmer.username,
          farmerId: farmer._id,
          location: farmer.farmerProfile?.farmLocation
        };
      } else {
        updates.farmerSource = { name: 'DeeFresh' };
      }
    }
    
    // Update availability
    if (payload.inStock !== undefined) {
      updates.availability = {
        inStock: Boolean(payload.inStock !== 'false'),
        quantity: Number(payload.quantity) || 0
      };
    }
    
    const updated = await Produce.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.json({ data: updated });
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
