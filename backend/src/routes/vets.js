const express = require('express');
const router = express.Router();
const vetCtrl = require('../controllers/vetRecordController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public listing (optionally by animal)
router.get('/', requireAuth, vetCtrl.listRecords);
router.get('/:id', requireAuth, vetCtrl.getRecord);

// Create (admin only)
router.post('/', requireAuth, requireAdmin, vetCtrl.createRecord);

// Update & delete (admin only)
router.patch('/:id', requireAuth, requireAdmin, vetCtrl.updateRecord);
router.delete('/:id', requireAuth, requireAdmin, vetCtrl.deleteRecord);

module.exports = router;
