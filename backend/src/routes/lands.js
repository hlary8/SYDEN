const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const { landCreateSchema, landUpdateSchema } = require('../validation/landSchemas');

router.get('/', landController.list);
router.get('/:slug', landController.getBySlug);
router.post('/', requireAuth, requireRole('admin'), upload.array('images', 10), validate(landCreateSchema), landController.create);
router.patch('/:id', requireAuth, requireRole('admin'), upload.array('images', 10), validate(landUpdateSchema), landController.update);
router.delete('/:id', requireAuth, requireRole('admin'), landController.remove);
router.post('/:id/inquire', requireAuth, landController.inquire);

module.exports = router;
