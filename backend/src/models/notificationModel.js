// backend/src/models/notificationModel.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model, replace with your actual user model name if different.
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'chat', 'like', 'comment', 'follow'], // Add your notification types
    default: 'info',
  },
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId, // Could be another model's ID, like a post, comment, etc.
    default: null, // Optional, can be null if not related to a specific item.
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;