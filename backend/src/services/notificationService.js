// backend/src/services/notificationService.js

const Notification = require('../models/notificationModel'); // Assuming you have a Notification model

async function createNotification(userId, message, type, relatedItemId) {
  try {
    const newNotification = new Notification({
      userId,
      message,
      type,
      relatedItemId,
    });
    const savedNotification = await newNotification.save();
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

async function getNotificationsForUser(userId) {
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }); // Sort by creation time (newest first)
    return notifications;
  } catch (error) {
    console.error('Error getting notifications for user:', error);
    throw error;
  }
}

async function getNotificationById(notificationId) {
  try {
    const notification = await Notification.findById(notificationId);
    return notification;
  } catch (error) {
    console.error('Error getting notification by ID:', error);
    throw error;
  }
}

async function markNotificationAsRead(notificationId) {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    return updatedNotification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

async function deleteNotification(notificationId) {
    try{
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        return deletedNotification;
    } catch(error){
        console.error("Error deleting notification:", error);
        throw error;
    }
}

async function clearAllNotificationsForUser(userId) {
    try {
        const result = await Notification.deleteMany({ userId: userId });
        return result;
    } catch (error) {
        console.error('Error clearing all notifications for user:', error);
        throw error;
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