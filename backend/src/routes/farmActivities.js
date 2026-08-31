const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/farmActivityController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public listing
router.get('/', ctrl.listActivities);
router.get('/:id', ctrl.getActivity);

// Admin actions (create/update/delete)
router.post('/', requireAuth, requireAdmin, ctrl.createActivity);
router.patch('/:id', requireAuth, requireAdmin, ctrl.updateActivity);
router.delete('/:id', requireAuth, requireAdmin, ctrl.deleteActivity);

module.exports = router;
