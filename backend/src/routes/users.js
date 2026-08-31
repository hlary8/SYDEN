const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/:id/activity', requireAuth, userController.activity);
// Notifications for current user
router.get('/notifications', requireAuth, userController.getNotifications);
router.patch('/notifications/:id/read', requireAuth, userController.markNotificationRead);

module.exports = router;
