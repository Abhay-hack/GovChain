const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tendorController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// 📝 Get all tenders (Optional: add filters & pagination)
router.get('/', tenderController.getAllTenders);

// 📝 Get a tender (from blockchain)
router.get('/:tenderId', tenderController.getTender);

// 📝 Get a tender (from database)
router.get('/db/:tenderId', tenderController.getTenderFromDB);

// 🔐 Get all bids for a tender (accessible to employees & vendors)
router.get('/:tenderId/bids', authMiddleware, authorizeRole(['employee', 'vendor']), tenderController.getBidsForTender);

// 🚀 Create a new tender (Employee only)
router.post('/', authMiddleware, authorizeRole(['employee']), tenderController.createTender);

// 🛠️ Submit a bid for a tender (Vendor only)
router.post('/:tenderId/bid', authMiddleware, authorizeRole(['vendor']), tenderController.submitBid);

// ✏️ Update a tender (Employee only)
router.put('/:tenderId', authMiddleware, authorizeRole(['employee']), tenderController.updateTender);

// 🎯 Award a tender (Employee only)
router.put('/:tenderId/award', authMiddleware, authorizeRole(['employee']), tenderController.awardTender);

module.exports = router;
