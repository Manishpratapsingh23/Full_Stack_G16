import mongoose from 'mongoose';

/**
 * Notification Schema
 * Stores all notifications for users in the Book Swap & Lending Platform
 * Tracks: type, read status, timestamps, and metadata
 */
const NotificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries by userId
    },

    // Notification title
    title: {
      type: String,
      required: true,
    },

    // Notification message body
    message: {
      type: String,
      required: true,
    },

    // Type of notification: 'request_sent', 'request_approved', 'request_rejected', 'book_returned', 'due_date_reminder'
    type: {
      type: String,
      enum: ['request_sent', 'request_approved', 'request_rejected', 'book_returned', 'due_date_reminder', 'general'],
      required: true,
      index: true,
    },

    // Whether the notification has been read
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Associated request ID (if applicable)
    requestId: {
      type: String,
      default: null,
    },

    // Associated book ID (if applicable)
    bookId: {
      type: String,
      default: null,
    },

    // Additional metadata
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Related user (who took the action)
    relatedUserId: {
      type: String,
      default: null,
    },

    // For email notification tracking
    emailSent: {
      type: Boolean,
      default: false,
    },

    // For push notification tracking
    pushSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index for efficient querying
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });

// Method to mark notification as read
NotificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  return this.save();
};

// Static method to get user's unread notifications
NotificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

// Static method to get user's notifications with pagination
NotificationSchema.statics.getUserNotifications = function (userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to mark all user notifications as read
NotificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany({ userId, isRead: false }, { isRead: true });
};

export default mongoose.model('Notification', NotificationSchema);
