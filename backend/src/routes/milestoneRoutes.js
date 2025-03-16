// backend/src/routes/milestoneRoutes.js

const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleBasedAccess');

// Get all milestones for a specific tender
router.get('/:tenderId', milestoneController.getMilestonesForTender);

// Get a specific milestone
router.get('/milestone/:milestoneId', milestoneController.getMilestoneById);

// Create a milestone (employee only)
router.post('/', authMiddleware, authorizeRole(['employee']), milestoneController.createMilestone);

// Update a milestone (employee only)
router.put('/milestone/:milestoneId', authMiddleware, authorizeRole(['employee']), milestoneController.updateMilestone);

// Delete a milestone (employee only)
router.delete('/milestone/:milestoneId', authMiddleware, authorizeRole(['employee']), milestoneController.deleteMilestone);

module.exports = router;