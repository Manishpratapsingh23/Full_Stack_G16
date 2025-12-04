import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

/**
 * Notification Routes
 * All routes for managing and fetching notifications
 */

// Get all notifications for a user (with pagination)
router.get('/user/:userId', notificationController.getUserNotifications);

// Get unread notification count
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);

// Get notifications by type
router.get('/user/:userId/type/:type', notificationController.getNotificationsByType);

// Mark a notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/user/:userId/mark-all-read', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Clear all notifications for a user
router.delete('/user/:userId/clear-all', notificationController.clearAllNotifications);

export default router;
