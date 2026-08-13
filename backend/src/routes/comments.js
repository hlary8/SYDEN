const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { commentCreateSchema } = require('../validation/commentSchemas');

router.post('/', requireAuth, validate(commentCreateSchema), commentController.createComment);
router.get('/:targetType/:targetId', commentController.getCommentsForTarget);
router.delete('/:commentId', requireAuth, commentController.deleteComment);

module.exports = router;
