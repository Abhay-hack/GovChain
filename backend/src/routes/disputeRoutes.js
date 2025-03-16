// backend/src/routes/disputeRoutes.js

const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Get all disputes for a specific tender
router.get('/:tenderId', disputeController.getDisputesForTender);

// Get a specific dispute
router.get('/:disputeId', disputeController.getDisputeById);

// Create a dispute (vendor or employee)
router.post('/', authMiddleware, authorizeRole(['vendor', 'employee']), disputeController.createDispute);

// Update a dispute (employee only)
router.put('/:disputeId', authMiddleware, authorizeRole(['employee']), disputeController.updateDispute);

module.exports = router;