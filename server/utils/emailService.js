import nodemailer from 'nodemailer';

/**
 * Email Notification Service
 * Sends emails for various notification types
 * 
 * IMPORTANT: Configure your email credentials in .env
 * EMAIL_USER=your-email@gmail.com
 * EMAIL_PASSWORD=your-app-password
 */

// Create transporter (update with your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to your email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

/**
 * Send email notification
 * @param {string} userId - User ID (in a real system, fetch user email from DB)
 * @param {string} title - Email subject
 * @param {string} message - Email body
 * @param {string} type - Type of notification
 */
export const sendEmailNotification = async (userId, title, message, type) => {
  try {
    // In a real system, fetch user email from database
    // For now, we'll store user emails in a mock structure
    const userEmail = getUserEmail(userId);

    if (!userEmail) {
      console.log(`No email found for user ${userId}`);
      return false;
    }

    const emailContent = generateEmailContent(title, message, type);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@bookswap.com',
      to: userEmail,
      subject: title,
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw - email failure shouldn't block notification
    return false;
  }
};

/**
 * Get user email (mock implementation)
 * In production, fetch from database
 */
const getUserEmail = (userId) => {
  // In a real application, query your database for the user's email
  // For development, you can hardcode a test email
  const mockEmails = {
    user1: 'user1@example.com',
    user2: 'user2@example.com',
  };

  return mockEmails[userId] || null;
};

/**
 * Generate HTML email content based on notification type
 */
const generateEmailContent = (title, message, type) => {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
      .content { background: #f9f9f9; padding: 20px; border: 1px solid #eee; }
      .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
      .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      .notification-type { font-size: 12px; color: #999; margin-top: 5px; }
    </style>
  `;

  let actionButton = '';

  switch (type) {
    case 'request_approved':
      actionButton = `<a href="https://bookswap.local/my-library" class="button">View My Library</a>`;
      break;
    case 'book_returned':
      actionButton = `<a href="https://bookswap.local/requests" class="button">View Requests</a>`;
      break;
    case 'due_date_reminder':
      actionButton = `<a href="https://bookswap.local/my-library" class="button">View Borrowed Books</a>`;
      break;
    case 'request_sent':
      actionButton = `<a href="https://bookswap.local/requests" class="button">View Requests</a>`;
      break;
    default:
      actionButton = `<a href="https://bookswap.local" class="button">Visit Book Swap Platform</a>`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          <p class="notification-type">${getNotificationTypeLabel(type)}</p>
        </div>
        <div class="content">
          <p>${message}</p>
          <p>
            Thank you for using the Book Swap & Lending Platform!
          </p>
          ${actionButton}
        </div>
        <div class="footer">
          <p>© 2025 Book Swap & Lending Platform. All rights reserved.</p>
          <p><a href="https://bookswap.local/notifications" style="color: #667eea; text-decoration: none;">Manage Notifications</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Get human-readable label for notification type
 */
const getNotificationTypeLabel = (type) => {
  const labels = {
    request_sent: 'New Request',
    request_approved: 'Request Approved',
    request_rejected: 'Request Rejected',
    book_returned: 'Book Returned',
    due_date_reminder: 'Due Date Reminder',
    general: 'Notification',
  };

  return labels[type] || 'Notification';
};

/**
 * Verify email service is configured
 */
export const verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log('Email service verified successfully');
    return true;
  } catch (error) {
    console.error('Email service verification failed:', error);
    return false;
  }
};
