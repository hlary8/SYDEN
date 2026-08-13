const express = require('express');
const router = express.Router();
const livestockController = require('../controllers/livestockController');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', livestockController.list);
router.get('/:id', livestockController.getById);
router.post('/', requireAuth, requireRole('admin'), upload.array('images', 10), livestockController.create);
router.patch('/:id', requireAuth, requireRole('admin'), upload.array('images', 10), livestockController.update);
router.delete('/:id', requireAuth, requireRole('admin'), livestockController.remove);

module.exports = router;
