const createError = require('http-errors');
const Livestock = require('../models/Livestock');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { nanoid } = require('nanoid');
const fs = require('fs');

async function list(req, res, next) {
  try {
    const { category, query = '', featured } = req.query;
    const filter = {};

    // ADDED: Strict category validation
    const validCategories = ['cattle','poultry','goats','sheep','pigs','equine'];
    if (category && !validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (category) filter.category = category.toLowerCase();
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
    let coverImage = null;
    let gallery = [];
    
    // ADDED: Strict category validation
    const validCategories = ['cattle','poultry','goats','sheep','pigs','equine'];
    if (!validCategories.includes(payload.category?.toLowerCase())) {
      return next(createError(400, 'Invalid category. Must be one of: ' + validCategories.join(', ')));
    }
    
    // Handle multi-image upload (cover + gallery, max 3 total)
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
          const result = await uploadImage(f.path, { public_id: `livestock/${nanoid()}` });
          uploadedPhotos.push({ url: result.url, publicId: result.publicId });
          try { fs.unlinkSync(f.path); } catch (e) { }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      
      // First photo is cover, rest go to gallery (max 3 total)
      if (uploadedPhotos.length > 0) {
        coverImage = uploadedPhotos[0];
        gallery = uploadedPhotos.slice(1, 3);
      }
    }
    
    // ADDED: Parse accordion sections from request
    const accordionSections = [];
    if (payload.accordionSections && Array.isArray(payload.accordionSections)) {
      accordionSections.push(...payload.accordionSections);
    }
    
    const item = await Livestock.create({
      name: payload.name,
      category: payload.category.toLowerCase(),
      breed: payload.breed,
      age: payload.age,
      weight: payload.weight,
      location: payload.location,
      healthStatus: payload.healthStatus || 'good',
      description: payload.description,
      coverImage: coverImage,
      gallery: gallery,
      accordionSections: accordionSections,
      veterinaryHistory: Array.isArray(payload.veterinaryHistory) ? payload.veterinaryHistory : [],
      isFeatured: Boolean(payload.isFeatured),
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
    
    const item = await Livestock.findById(id);
    if (!item) return next(createError(404, 'Livestock record not found'));
    
    // ADDED: Category validation if changing
    if (payload.category) {
      const validCategories = ['cattle','poultry','goats','sheep','pigs','equine'];
      if (!validCategories.includes(payload.category.toLowerCase())) {
        return next(createError(400, 'Invalid category'));
      }
      updates.category = payload.category.toLowerCase();
    }
    
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
          const result = await uploadImage(f.path, { public_id: `livestock/${nanoid()}` });
          newPhotos.push({ url: result.url, publicId: result.publicId });
          try { fs.unlinkSync(f.path); } catch (e) { }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      
      // Add to gallery (max 3 total)
      if (newPhotos.length > 0) {
        const existingGallery = item.gallery || [];
        const maxNewPhotos = Math.max(0, 3 - existingGallery.length - (item.coverImage ? 1 : 0));
        updates.gallery = [...existingGallery, ...newPhotos.slice(0, maxNewPhotos)];
      }
    }
    
    // ADDED: Handle photo removal by publicId
    if (payload.removePhotos && Array.isArray(payload.removePhotos)) {
      const publicIdsToRemove = payload.removePhotos;
      
      if (item.coverImage && publicIdsToRemove.includes(item.coverImage.publicId)) {
        updates.coverImage = null;
      }
      
      updates.gallery = (item.gallery || []).filter(photo => 
        !publicIdsToRemove.includes(photo.publicId)
      );
    }
    
    // ADDED: Update accordion sections
    if (payload.accordionSections && Array.isArray(payload.accordionSections)) {
      updates.accordionSections = payload.accordionSections;
    }
    
    const updated = await Livestock.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.json({ data: updated });
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
