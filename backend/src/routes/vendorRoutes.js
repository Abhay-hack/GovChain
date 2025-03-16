// backend/src/routes/vendorRoutes.js

const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Register a vendor (vendor only)
router.post('/register', authMiddleware, vendorController.registerVendor);

// Get a specific vendor (from blockchain)
router.get('/:vendorAddr', vendorController.getVendor);

// Get a specific vendor (from database)
router.get('/db/:vendorAddr', vendorController.getVendorProfileFromDB);

// Upload profile image (vendor only)
router.post('/image', authMiddleware, authorizeRole(['vendor']), vendorController.uploadProfileImage);

// Update vendor profile (vendor only)
router.put('/:vendorAddr', authMiddleware, authorizeRole(['vendor']), vendorController.updateVendor);

// Get all vendors (optional: add filters, pagination)
router.get('/', vendorController.getAllVendors);

// Blacklist a vendor (employee only)
router.put('/blacklist/:vendorAddr', authMiddleware, authorizeRole(['employee']), vendorController.blacklistVendor);

module.exports = router;