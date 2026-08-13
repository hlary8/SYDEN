const NewsArticle = require('../models/NewsArticle');
const cloudinary = require('../config/cloudinary');
const { uploadImage } = require('../services/cloudinaryService');
const { nanoid } = require('nanoid');
const fs = require('fs');
const createError = require('http-errors');

// GET /api/v1/news
exports.getNews = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12, featured } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    const articles = await NewsArticle.find(query)
      .populate('author', 'username avatar')
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await NewsArticle.countDocuments(query);

    res.json({ articles, totalPages: Math.ceil(count / limit), currentPage: Number(page), total: count });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/news/admin/all (Get all articles including drafts - admin only)
exports.getAllNewsAdmin = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    const query = {};
    if (category) query.category = category;

    const articles = await NewsArticle.find(query)
      .populate('author', 'username avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await NewsArticle.countDocuments(query);

    res.json({ articles, totalPages: Math.ceil(count / limit), currentPage: Number(page), total: count });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/news/:slug
exports.getNewsBySlug = async (req, res, next) => {
  try {
    const article = await NewsArticle.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'username avatar');

    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/news
exports.createNews = async (req, res, next) => {
  try {
    const body = req.body;
    const gallery = [];
    let coverImage = null;

    // Handle image uploads
    if (req.files && req.files.length) {
      const virusScanner = require('../services/virusScanner');
      for (let i = 0; i < req.files.length; i++) {
        const f = req.files[i];
        try {
          const scan = await virusScanner.scanFile(f.path);
          if (!scan.clean) {
            try { fs.unlinkSync(f.path); } catch (e) { }
            return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
          }
          const result = await uploadImage(f.path, { public_id: `news/${nanoid()}` });
          
          // First image becomes cover image
          if (i === 0) {
            coverImage = { url: result.url, publicId: result.publicId, caption: body.coverCaption || '' };
          } else {
            gallery.push({ url: result.url, publicId: result.publicId, caption: '' });
          }
          
          try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
    }

    // Use provided images or uploaded ones
    const finalCoverImage = coverImage || (body.coverImage);
    if (!finalCoverImage) {
      return next(createError(400, 'Cover image is required'));
    }

    const slug = (body.slug || body.title || 'news').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);
    
    // Support both 'published' and 'isPublished' field names
    const isPublished = body.published !== undefined ? body.published : body.isPublished;
    
    const article = await NewsArticle.create({
      title: body.title,
      slug: slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: finalCoverImage,
      gallery: gallery.length > 0 ? gallery : (Array.isArray(body.gallery) ? body.gallery : []),
      images: gallery.length > 0 ? gallery : (Array.isArray(body.images) ? body.images : []),
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: req.user._id,
      isPublished: Boolean(isPublished),
      featured: Boolean(body.featured),
      publishedAt: new Date()
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/news/:id
exports.updateNews = async (req, res, next) => {
  try {
    const body = req.body;
    const updates = { ...body };
    const virusScanner = require('../services/virusScanner');

    // Handle new image uploads
    if (req.files && req.files.length) {
      const newImages = [];
      for (const f of req.files) {
        try {
          const scan = await virusScanner.scanFile(f.path);
          if (!scan.clean) {
            try { fs.unlinkSync(f.path); } catch (e) { }
            return next(createError(400, `File failed virus scan: ${scan.reason || 'unknown'}`));
          }
          const result = await uploadImage(f.path, { public_id: `news/${nanoid()}` });
          newImages.push({ url: result.url, publicId: result.publicId, caption: '' });
          try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        } catch (uploadErr) {
          try { fs.unlinkSync(f.path); } catch (e) { }
          return next(createError(400, 'Image upload failed: ' + uploadErr.message));
        }
      }
      
      // If new images provided, use the first as cover and rest as gallery
      if (newImages.length > 0) {
        updates.coverImage = newImages[0];
        updates.gallery = newImages.slice(1);
        updates.images = newImages.slice(1);
      }
    }

    // Support both 'published' and 'isPublished' field names
    if (updates.published !== undefined) {
      updates.isPublished = updates.published;
      delete updates.published;
    }

    updates.updatedAt = new Date();
    const article = await NewsArticle.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/news/:id
exports.deleteNews = async (req, res, next) => {
  try {
    const article = await NewsArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });

    if (article.coverImage?.publicId) {
      try { await cloudinary.uploader.destroy(article.coverImage.publicId); } catch (e) { }
    }
    for (const img of article.gallery || []) {
      if (img.publicId) {
        try { await cloudinary.uploader.destroy(img.publicId); } catch (e) { }
      }
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    next(err);
  }
};
