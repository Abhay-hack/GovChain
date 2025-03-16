// backend/src/routes/ratingRoutes.js

const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Get a vendor's rating/review for a tender
router.get('/:tenderId/:vendorAddr', ratingController.getVendorRatingForTender);

// Create a rating/review (vendor or employee)
router.post('/', authMiddleware, authorizeRole(['vendor', 'employee']), ratingController.createRating);

// Update a rating/review (employee only - optional, for moderation)
router.put('/:ratingId', authMiddleware, authorizeRole(['employee']), ratingController.updateRating);

// Delete a rating/review (employee only - optional, for moderation)
router.delete('/:ratingId', authMiddleware, authorizeRole(['employee']), ratingController.deleteRating);

module.exports = router;