const express = require('express');
const router = express.Router();
const seedsController = require('../controllers/seedsController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public read routes
router.get('/', seedsController.getAllSeeds);
router.get('/:id', seedsController.getSeedById);

// Admin-only write routes
router.post('/', requireAuth, requireRole('admin'), seedsController.createSeed);
router.patch('/:id', requireAuth, requireRole('admin'), seedsController.updateSeed);
router.delete('/:id', requireAuth, requireRole('admin'), seedsController.deleteSeed);
router.patch('/:id/issue', requireAuth, requireRole('admin'), seedsController.issueBags);

module.exports = router;
