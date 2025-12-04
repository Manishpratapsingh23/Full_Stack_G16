import Notification from '../models/Notification.js';
import { io } from '../server.js';
import { sendEmailNotification } from '../utils/emailService.js';

/**
 * Controller for handling notification operations
 * Manages creating, fetching, and updating notifications
 */

/**
 * Create a new notification
 * @param {string} userId - The user who receives the notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Type of notification
 * @param {object} data - Additional metadata
 * @param {boolean} sendEmail - Whether to send email notification
 */
export const createNotification = async (
  userId,
  title,
  message,
  type,
  data = {},
  sendEmail = true
) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      data,
      isRead: false,
    });

    await notification.save();

    // Send email notification if enabled
    if (sendEmail) {
      await sendEmailNotification(userId, title, message, type);
    }

    // Emit real-time notification via Socket.IO
    if (io) {
      io.to(userId).emit('notification', {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @param {string} userId - The user ID
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of notifications per page
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.getUserNotifications(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    const total = await Notification.countDocuments({ userId });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

/**
 * Get unread notification count for a user
 * @param {string} userId - The user ID
 */
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message,
    });
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification ID
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message,
    });
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - The user ID
 */
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message,
    });
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - The notification ID
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message,
    });
  }
};

/**
 * Clear all notifications for a user
 * @param {string} userId - The user ID
 */
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.deleteMany({ userId });

    res.json({
      success: true,
      message: 'All notifications cleared',
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing notifications',
      error: error.message,
    });
  }
};

/**
 * Get notifications by type for a user
 * @param {string} userId - The user ID
 * @param {string} type - Notification type
 */
export const getNotificationsByType = async (req, res) => {
  try {
    const { userId, type } = req.params;

    const notifications = await Notification.find({ userId, type })
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications by type',
      error: error.message,
    });
  }
};

/**
 * Trigger notification for request approval
 * @param {string} requesterId - The user who made the request
 * @param {string} bookTitle - Title of the book
 * @param {string} requestType - 'borrow' or 'swap'
 */
export const notifyRequestApproved = async (
  requesterId,
  bookTitle,
  requestType,
  data = {}
) => {
  const title = 'Request Approved ✅';
  const message = `Your ${requestType} request for "${bookTitle}" has been approved!`;

  return createNotification(
    requesterId,
    title,
    message,
    'request_approved',
    { bookTitle, requestType, ...data },
    true
  );
};

/**
 * Trigger notification for request rejection
 * @param {string} requesterId - The user who made the request
 * @param {string} bookTitle - Title of the book
 * @param {string} requestType - 'borrow' or 'swap'
 */
export const notifyRequestRejected = async (
  requesterId,
  bookTitle,
  requestType,
  data = {}
) => {
  const title = 'Request Rejected ❌';
  const message = `Your ${requestType} request for "${bookTitle}" has been rejected.`;

  return createNotification(
    requesterId,
    title,
    message,
    'request_rejected',
    { bookTitle, requestType, ...data },
    true
  );
};

/**
 * Trigger notification when a book is returned
 * @param {string} ownerId - The book owner's ID
 * @param {string} returnerName - Name of the person returning
 * @param {string} bookTitle - Title of the book
 */
export const notifyBookReturned = async (
  ownerId,
  returnerName,
  bookTitle,
  data = {}
) => {
  const title = 'Book Returned 📚';
  const message = `${returnerName} has returned your book "${bookTitle}"`;

  return createNotification(
    ownerId,
    title,
    message,
    'book_returned',
    { bookTitle, returnerName, ...data },
    true
  );
};

/**
 * Trigger notification for upcoming due date
 * @param {string} borrowerId - The borrower's ID
 * @param {string} bookTitle - Title of the book
 * @param {string} dueDate - Due date string
 */
export const notifyDueDateReminder = async (
  borrowerId,
  bookTitle,
  dueDate,
  data = {}
) => {
  const title = 'Due Date Reminder ⏰';
  const message = `Your borrowed book "${bookTitle}" is due on ${dueDate}`;

  return createNotification(
    borrowerId,
    title,
    message,
    'due_date_reminder',
    { bookTitle, dueDate, ...data },
    true
  );
};

/**
 * Trigger notification for new request received
 * @param {string} ownerId - The book owner's ID
 * @param {string} requesterName - Name of the requester
 * @param {string} bookTitle - Title of the book
 * @param {string} requestType - 'borrow' or 'swap'
 */
export const notifyRequestReceived = async (
  ownerId,
  requesterName,
  bookTitle,
  requestType,
  data = {}
) => {
  const title = 'New Request Received 📬';
  const message = `${requesterName} requested to ${requestType} your book "${bookTitle}"`;

  return createNotification(
    ownerId,
    title,
    message,
    'request_sent',
    { bookTitle, requesterName, requestType, ...data },
    true
  );
};
