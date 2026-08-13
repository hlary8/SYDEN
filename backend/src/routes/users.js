const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/:id/activity', requireAuth, userController.activity);

module.exports = router;
