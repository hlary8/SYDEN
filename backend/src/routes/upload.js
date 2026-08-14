const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { uploadImage } = require('../services/cloudinaryService');
const fs = require('fs');

// Single image upload (admin only)
router.post('/image', requireAuth, requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const result = await uploadImage(req.file.path, { public_id: `uploads/${Date.now()}` });
    // cleanup temp file
    try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    res.json({ url: result.url, publicId: result.publicId });
  } catch (err) { next(err); }
});

// Multiple images
router.post('/images', requireAuth, requireAdmin, upload.array('images', 10), async (req, res, next) => {
  try {
    console.log('Upload /images called by user:', req.user?._id, 'files:', req.files?.length, 'body.images present:', Array.isArray(req.body.images));
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files' });
    const uploaded = [];
    for (const f of req.files) {
      try {
        const r = await uploadImage(f.path, { public_id: `uploads/${Date.now()}-${Math.random().toString(36).slice(2,8)}` });
        uploaded.push({ url: r.url, publicId: r.publicId });
      } catch (err) {
        console.error('Cloudinary upload failed for', f.path, err);
        // cleanup file and return a 502 to the client with a helpful message
        try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
        return next(require('http-errors')(502, 'Image upload failed: ' + (err.message || 'unknown')));
      }
      try { fs.unlinkSync(f.path); } catch (e) { }
    }
    res.json(uploaded);
  } catch (err) { next(err); }
});

module.exports = router;
