import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

/**
 * Extended Notification Routes
 * Trigger specific notification types
 * These are helper endpoints to send notifications based on specific events
 */

// Trigger request received notification
router.post('/trigger/request-received', async (req, res) => {
  try {
    const { ownerId, requesterName, bookTitle, requestType, requestId } =
      req.body;

    if (!ownerId || !requesterName || !bookTitle || !requestType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await notificationController.notifyRequestReceived(
      ownerId,
      requesterName,
      bookTitle,
      requestType,
      { requestId }
    );

    res.json({
      success: true,
      message: 'Request received notification sent',
    });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message,
    });
  }
});

// Trigger request approved notification
router.post('/trigger/approved', async (req, res) => {
  try {
    const { requesterId, bookTitle, requestType, requestId } = req.body;

    if (!requesterId || !bookTitle || !requestType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await notificationController.notifyRequestApproved(
      requesterId,
      bookTitle,
      requestType,
      { requestId }
    );

    res.json({
      success: true,
      message: 'Request approved notification sent',
    });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message,
    });
  }
});

// Trigger request rejected notification
router.post('/trigger/rejected', async (req, res) => {
  try {
    const { requesterId, bookTitle, requestType, requestId } = req.body;

    if (!requesterId || !bookTitle || !requestType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await notificationController.notifyRequestRejected(
      requesterId,
      bookTitle,
      requestType,
      { requestId }
    );

    res.json({
      success: true,
      message: 'Request rejected notification sent',
    });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message,
    });
  }
});

// Trigger book returned notification
router.post('/trigger/returned', async (req, res) => {
  try {
    const { ownerId, returnerName, bookTitle, requestId } = req.body;

    if (!ownerId || !returnerName || !bookTitle) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await notificationController.notifyBookReturned(
      ownerId,
      returnerName,
      bookTitle,
      { requestId }
    );

    res.json({
      success: true,
      message: 'Book returned notification sent',
    });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message,
    });
  }
});

// Trigger due date reminder notification
router.post('/trigger/due-date', async (req, res) => {
  try {
    const { borrowerId, bookTitle, dueDate, requestId } = req.body;

    if (!borrowerId || !bookTitle || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await notificationController.notifyDueDateReminder(
      borrowerId,
      bookTitle,
      dueDate,
      { requestId }
    );

    res.json({
      success: true,
      message: 'Due date reminder notification sent',
    });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message,
    });
  }
});

export default router;
