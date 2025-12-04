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

  const value = {
    notifications,
    unreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByType,
    // User-triggered notification helpers
    notifyRequestSent,
    notifyRequestApproved,
    notifyRequestRejected,
    notifyBookReturned,
    refreshNotifications: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
