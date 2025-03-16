// backend/src/controllers/notificationController.js

const notificationService = require('../services/notificationService');

async function createNotification(req, res) {
  try {
    const { userId, message, type, relatedItemId } = req.body;
    const newNotification = await notificationService.createNotification(userId, message, type, relatedItemId);
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getNotificationsForUser(req, res) {
  try {
    const userId = req.user.userId; // Assuming user info is attached by authMiddleware
    const notifications = await notificationService.getNotificationsForUser(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications for user error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getNotificationById(req, res) {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.getNotificationById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function markNotificationAsRead(req, res) {
  try {
    const { notificationId } = req.params;
    const updatedNotification = await notificationService.markNotificationAsRead(notificationId);
    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteNotification(req, res) {
    try{
        const { notificationId } = req.params;
        const deletedNotification = await notificationService.deleteNotification(notificationId);
        if (!deletedNotification){
            return res.status(404).json({error: "Notification not found"});
        }
        res.status(200).json({message: "Notification deleted successfully"});
    } catch(error){
        console.error("Delete notification error:", error);
        res.status(500).json({error: error.message});
    }
}

async function clearAllNotificationsForUser(req, res) {
    try{
        const userId = req.user.userId;
        const result = await notificationService.clearAllNotificationsForUser(userId);
        res.status(200).json({message: "All notifications cleared"});
    } catch(error){
        console.error("Clear all notifications error:", error);
        res.status(500).json({error: error.message});
    }
}

module.exports = {
  createNotification,
  getNotificationsForUser,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotificationsForUser,
};