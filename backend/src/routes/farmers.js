const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/**
 * Farmer Management Routes
 * ADDED: Sept 2026
 */

// User applies to become a farmer
router.post('/apply', requireAuth, farmerController.applyAsFarmer);

// Get user's own farmer status
router.get('/my-status', requireAuth, farmerController.getMyFarmerStatus);

// Get approved farmers list (for dropdown in produce forms)
router.get('/approved', farmerController.getApprovedFarmers);

// Admin: Get all farmer requests
router.get('/admin/requests', requireAuth, requireAdmin, farmerController.getAllFarmerRequests);

// Admin: Approve a farmer
router.patch('/admin/approve/:requestId', requireAuth, requireAdmin, farmerController.approveFarmer);

// Admin: Reject a farmer
router.patch('/admin/reject/:requestId', requireAuth, requireAdmin, farmerController.rejectFarmer);

// Admin: Delete a farmer request
router.delete('/admin/:requestId', requireAuth, requireAdmin, farmerController.deleteFarmerRequest);

module.exports = router;
