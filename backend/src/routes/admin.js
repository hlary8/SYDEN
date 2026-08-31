const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All admin routes require admin role
router.use(requireAuth, requireRole('admin'));

router.get('/stats', adminController.getStats);
router.get('/comments', adminController.listComments);
router.delete('/comments/:id', adminController.deleteComment);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/activity-logs', adminController.activityLogs);
router.get('/inquiries', adminController.listInquiries);
router.get('/users', adminController.listUsers);
// Farmer application management
router.get('/farmers/applications', adminController.listFarmerApplications);
router.patch('/farmers/:id/approve', adminController.approveFarmer);
router.patch('/farmers/:id/reject', adminController.rejectFarmer);
router.delete('/farmers/:id', adminController.deleteFarmerApplication);
router.put('/farmers/:id', adminController.editFarmer);

// Website concerns
router.get('/website-concerns', adminController.listWebsiteConcerns);
router.patch('/website-concerns/:id/read', adminController.markWebsiteConcernRead);

module.exports = router;
