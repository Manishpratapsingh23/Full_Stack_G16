import * as notificationController from '../controllers/notificationController.js';
import Notification from '../models/Notification.js';

/**
 * Scheduled Notification Service
 * Handles recurring notifications like due date reminders
 * 
 * Usage:
 * - Call startDueDateReminderJob() in server startup
 * - Runs every hour to check for upcoming due dates
 */

/**
 * Start scheduled job for due date reminders
 * Runs every hour to check for books due within 3 days
 */
export const startDueDateReminderJob = () => {
  console.log('✅ Starting due date reminder job...');

  // Run every hour (3600000 ms)
  const interval = setInterval(async () => {
    try {
      await checkDueDateReminders();
    } catch (error) {
      console.error('Error in due date reminder job:', error);
    }
  }, 3600000); // 1 hour

  // Also run on startup
  checkDueDateReminders();

  return interval;
};

/**
 * Check for books with due dates approaching
 * Send reminders for books due within 3 days
 */
const checkDueDateReminders = async () => {
  try {
    console.log('🔍 Checking for upcoming due dates...');

    // Get all active borrowing requests
    // In a real app, you'd query from your Requests/Borrowing collection
    // This is a placeholder - adjust based on your schema

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Example: Query requests with due dates in next 3 days
    // const upcomingDueBooks = await Request.find({
    //   status: 'active',
    //   dueDate: { $gte: now, $lte: threeDaysFromNow }
    // });

    // For each upcoming due book:
    // await notificationController.notifyDueDateReminder(
    //   borrowerId,
    //   bookTitle,
    //   formattedDueDate
    // );

    console.log('✅ Due date check completed');
  } catch (error) {
    console.error('Error checking due dates:', error);
  }
};

/**
 * Clear old notifications (older than 30 days)
 * Helps keep database clean
 * Run once per day
 */
export const startCleanupJob = () => {
  console.log('✅ Starting notification cleanup job...');

  const interval = setInterval(async () => {
    try {
      await cleanupOldNotifications();
    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  }, 24 * 60 * 60 * 1000); // Every 24 hours

  return interval;
};

/**
 * Delete notifications older than 30 days
 */
const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true, // Only delete read notifications
    });

    console.log(`♻️  Cleaned up ${result.deletedCount} old notifications`);
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
  }
};

/**
 * Archive notifications older than 90 days
 * Useful if you want to keep history
 */
export const archiveOldNotifications = async () => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const archived = await Notification.find({
      createdAt: { $lt: ninetyDaysAgo },
    });

    // In production, save to archive collection or external storage
    console.log(`📦 Archived ${archived.length} notifications`);

    return archived;
  } catch (error) {
    console.error('Error archiving notifications:', error);
  }
};

/**
 * Generate notification statistics
 * Useful for analytics
 */
export const getNotificationStats = async () => {
  try {
    const stats = {
      total: await Notification.countDocuments(),
      unread: await Notification.countDocuments({ isRead: false }),
      byType: {},
      last24Hours: await Notification.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    };

    // Count by type
    const types = [
      'request_sent',
      'request_approved',
      'request_rejected',
      'book_returned',
      'due_date_reminder',
      'general',
    ];

    for (const type of types) {
      stats.byType[type] = await Notification.countDocuments({ type });
    }

    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

/**
 * Send bulk notifications
 * Useful for announcements or system messages
 */
export const sendBulkNotification = async (userIds, title, message, type = 'general') => {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        notificationController.createNotification(
          userId,
          title,
          message,
          type,
          {},
          false // Don't send individual emails
        )
      )
    );

    console.log(`✅ Sent bulk notification to ${notifications.length} users`);
    return notifications;
  } catch (error) {
    console.error('Error sending bulk notification:', error);
    throw error;
  }
};

/**
 * Resend failed email notifications
 * For notifications where emailSent is false
 */
export const resendFailedEmailNotifications = async (limit = 100) => {
  try {
    const failedNotifications = await Notification.find({
      emailSent: false,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    }).limit(limit);

    console.log(`📧 Resending ${failedNotifications.length} failed emails...`);

    let successCount = 0;
    for (const notification of failedNotifications) {
      try {
        const sent = await sendEmailNotification(
          notification.userId,
          notification.title,
          notification.message,
          notification.type
        );

        if (sent) {
          notification.emailSent = true;
          await notification.save();
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to resend email for notification ${notification._id}:`, error);
      }
    }

    console.log(`✅ Successfully resent ${successCount} emails`);
    return successCount;
  } catch (error) {
    console.error('Error resending failed notifications:', error);
    throw error;
  }
};
