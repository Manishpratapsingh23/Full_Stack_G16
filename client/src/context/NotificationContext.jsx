import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

// Hook to use NotificationContext in components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const loadNotifications = () => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const allNotifications = JSON.parse(storedNotifications);
      
      // Filter notifications for current user
      if (currentUser) {
        const userNotifications = allNotifications.filter(
          n => n.userId === currentUser.id
        );
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      }
    }
  };

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications) => {
    const storedNotifications = localStorage.getItem('notifications');
    const allNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    // Remove current user's old notifications
    const otherNotifications = allNotifications.filter(
      n => n.userId !== currentUser?.id
    );
    
    // Combine with updated notifications
    const newAllNotifications = [...otherNotifications, ...updatedNotifications];
    localStorage.setItem('notifications', JSON.stringify(newAllNotifications));
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  // Create a notification for a specific user
  const createNotification = (userId, type, message, data = {}) => {
    const storedNotifications = localStorage.getItem('notifications');
    const allNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId,
      type, // 'request_sent', 'request_approved', 'request_rejected', 'request_returned'
      message,
      data, // Additional data like requestId, bookId, etc.
      read: false,
      createdAt: new Date().toISOString()
    };
    
    allNotifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
    
    // If this notification is for the current user, update local state
    if (currentUser && userId === currentUser.id) {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
    
    return newNotification;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    saveNotifications(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updatedNotifications);
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  // Clear all notifications
  const clearAll = () => {
    if (!currentUser) return;
    
    saveNotifications([]);
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  // User-specific notification triggers
  
  // When user sends a borrow/swap request
  const notifyRequestSent = (ownerId, requesterName, bookTitle, requestType) => {
    const message = `${requesterName} requested to ${requestType} your book "${bookTitle}"`;
    createNotification(ownerId, 'request_sent', message, { requestType, bookTitle });
  };

  // When owner approves a request
  const notifyRequestApproved = (requesterId, bookTitle, requestType) => {
    const message = `Your ${requestType} request for "${bookTitle}" has been approved!`;
    createNotification(requesterId, 'request_approved', message, { requestType, bookTitle });
  };

  // When owner rejects a request
  const notifyRequestRejected = (requesterId, bookTitle, requestType) => {
    const message = `Your ${requestType} request for "${bookTitle}" has been rejected.`;
    createNotification(requesterId, 'request_rejected', message, { requestType, bookTitle });
  };

  // When book is marked as returned
  const notifyBookReturned = (ownerId, requesterName, bookTitle) => {
    const message = `${requesterName} has returned your book "${bookTitle}"`;
    createNotification(ownerId, 'request_returned', message, { bookTitle });
  };

  // When book due date is approaching (due in 3 days)
  const notifyDueDateApproaching = (userId, bookTitle, dueDate) => {
    const message = `Your borrowed book "${bookTitle}" is due on ${new Date(dueDate).toLocaleDateString()}`;
    createNotification(userId, 'due_date_approaching', message, { bookTitle, dueDate });
  };

  // When book is overdue
  const notifyBookOverdue = (userId, bookTitle, daysOverdue) => {
    const message = `Your book "${bookTitle}" is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue. Please return it soon!`;
    createNotification(userId, 'book_overdue', message, { bookTitle, daysOverdue });
  };

  // When book owner sends update about borrowed book
  const notifyBookUpdate = (userId, bookTitle, updateType, message) => {
    const fullMessage = `Update about "${bookTitle}": ${message}`;
    createNotification(userId, 'book_update', fullMessage, { bookTitle, updateType });
  };

  // When user receives a swap request
  const notifySwapRequest = (ownerId, requesterName, bookTitle, requesterBookTitle) => {
    const message = `${requesterName} wants to swap their "${requesterBookTitle}" for your "${bookTitle}"`;
    createNotification(ownerId, 'swap_request', message, { bookTitle, requesterBookTitle });
  };

  // When swap is completed
  const notifySwapCompleted = (userId, bookTitle, partnerBookTitle, partnerName) => {
    const message = `Your swap with ${partnerName} is complete! You've exchanged "${bookTitle}" for "${partnerBookTitle}"`;
    createNotification(userId, 'swap_completed', message, { bookTitle, partnerBookTitle });
  };

  // Send profile update notification (when user updates their profile)
  const notifyProfileUpdated = (userId) => {
    const message = `Your profile has been updated successfully`;
    createNotification(userId, 'profile_updated', message, {});
  };

  // Send book added to library notification
  const notifyBookAdded = (userId, bookTitle, availableFor) => {
    const message = `You've added "${bookTitle}" to your library available for ${availableFor}`;
    createNotification(userId, 'book_added', message, { bookTitle, availableFor });
  };

  // Get unread notifications count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Get recent notifications (last 10)
  const getRecentNotifications = (limit = 10) => {
    return notifications.slice(0, limit);
  };

  const value = {
    notifications,
    unreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByType,
    getUnreadCount,
    getRecentNotifications,
    // User-triggered notification helpers
    notifyRequestSent,
    notifyRequestApproved,
    notifyRequestRejected,
    notifyBookReturned,
    notifyDueDateApproaching,
    notifyBookOverdue,
    notifyBookUpdate,
    notifySwapRequest,
    notifySwapCompleted,
    notifyProfileUpdated,
    notifyBookAdded,
    refreshNotifications: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
