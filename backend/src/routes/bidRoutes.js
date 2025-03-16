// backend/src/routes/bidRoutes.js

const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Get all bids for a specific tender
router.get('/:tenderId', bidController.getBidsForTender);

// Create a bid (vendor only)
router.post('/', authMiddleware, authorizeRole(['vendor']), bidController.createBid);

module.exports = router;