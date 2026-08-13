const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', newsController.getNews);
router.get('/admin/all', requireAuth, requireAdmin, newsController.getAllNewsAdmin);
router.get('/:slug', newsController.getNewsBySlug);

// Protected admin routes
router.post('/', requireAuth, requireAdmin, upload.array('images', 20), newsController.createNews);
router.patch('/:id', requireAuth, requireAdmin, upload.array('images', 20), newsController.updateNews);
router.delete('/:id', requireAuth, requireAdmin, newsController.deleteNews);

module.exports = router;
