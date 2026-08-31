const express = require('express');
const router = express.Router();
const { create, list, markRead } = require('../controllers/contactEnquiryController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/', create);
router.get('/', requireAuth, requireRole('admin'), list);
router.patch('/:id/read', requireAuth, requireRole('admin'), markRead);

module.exports = router;
