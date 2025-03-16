// backend/src/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Fund a tender (employee only)
router.post('/fund/:tenderId', authMiddleware, authorizeRole(['employee']), paymentController.fundTender);

// Get tender funds information (anyone authenticated)
router.get('/funds/:tenderId', authMiddleware, paymentController.getTenderFunds);

// Release payment to a vendor (employee only)
router.post('/release/:tenderId', authMiddleware, authorizeRole(['employee']), paymentController.releasePayment);

// Apply penalty to a vendor (employee only)
router.post('/penalty/:tenderId/:vendorAddr', authMiddleware, authorizeRole(['employee']), paymentController.applyPenalty);

// Get all payment transactions (admin or employee)
router.get('/', authMiddleware, authorizeRole(['employee']), paymentController.getAllPayments);

// Get a specific payment transaction (admin or employee)
router.get('/:paymentId', authMiddleware, authorizeRole(['employee']), paymentController.getPaymentById);

module.exports = router;