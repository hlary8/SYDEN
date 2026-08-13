const express = require('express');
const router = express.Router();
const produceController = require('../controllers/produceController');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', produceController.list);
router.get('/:slug', produceController.getBySlug);
router.post('/', requireAuth, requireRole('admin'), upload.array('images', 10), produceController.create);
router.patch('/:id', requireAuth, requireRole('admin'), upload.array('images', 10), produceController.update);
router.delete('/:id', requireAuth, requireRole('admin'), produceController.remove);
router.post('/:slug/order', requireAuth, produceController.createOrder);
router.get('/orders', requireAuth, produceController.listOrders);

module.exports = router;
