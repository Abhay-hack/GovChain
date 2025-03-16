// backend/src/routes/tenderRoutes.js

const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tendorController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Create a tender (employee only)
router.post('/', authMiddleware, authorizeRole(['employee']), tenderController.createTender);

// Get a specific tender (from blockchain)
router.get('/:tenderId', tenderController.getTender);

// Get a specific tender (from database)
router.get('/db/:tenderId', tenderController.getTenderFromDB);

// Get all tenders (optional: add filters, pagination)
router.get('/', tenderController.getAllTenders);

// Update a tender (employee only)
router.put('/:tenderId', authMiddleware, authorizeRole(['employee']), tenderController.updateTender);

// Award a tender (employee only)
router.put('/:tenderId/award', authMiddleware, authorizeRole(['employee']), tenderController.awardTender);

// Submit a bid for a tender (vendor only)
router.post('/:tenderId/bid', authMiddleware, authorizeRole(['vendor']), tenderController.submitBid);

// Get all bids for a tender (optional: add authentication)
router.get('/:tenderId/bids', tenderController.getBidsForTender);

module.exports = router;