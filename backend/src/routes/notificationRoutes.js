// backend/src/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user's notifications
router.get('/', authMiddleware, notificationController.getNotificationsForUser); // Corrected line!

// Mark a notification as read
router.put('/:notificationId/read', authMiddleware, notificationController.markNotificationAsRead);

// Optionally, you can add a route to delete notifications
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

module.exports = router;