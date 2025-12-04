import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

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

  // Load notifications for user
  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const loadNotifications = () => {
    const stored = localStorage.getItem('notifications');
    if (stored && currentUser) {
      const all = JSON.parse(stored);
      const userNotifs = all.filter(n => n.userId === currentUser.id);
      setNotifications(userNotifs);
      setUnreadCount(userNotifs.filter(n => !n.read).length);
    }
  };

  const saveNotifications = (updated) => {
    const stored = localStorage.getItem('notifications');
    const all = stored ? JSON.parse(stored) : [];

    const others = all.filter(n => n.userId !== currentUser?.id);
    const newAll = [...others, ...updated];

    localStorage.setItem('notifications', JSON.stringify(newAll));

    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const createNotification = (userId, type, message, data = {}) => {
    const stored = localStorage.getItem('notifications');
    const all = stored ? JSON.parse(stored) : [];

    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId,
      type,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString()
    };

    all.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(all));

    if (currentUser && userId === currentUser.id) {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }

    return newNotification;
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const getNotificationsByType = (type) =>
    notifications.filter(n => n.type === type);

  // ----------- CUSTOM TRIGGERS ------------ //

  const notifyRequestSent = (ownerId, requesterName, bookTitle, type) => {
    createNotification(
      ownerId,
      'request_sent',
      `${requesterName} requested to ${type} your book "${bookTitle}"`,
      { bookTitle, requestType: type }
    );
  };

  const notifyRequestApproved = (requesterId, bookTitle, type) => {
    createNotification(
      requesterId,
      'request_approved',
      `Your ${type} request for "${bookTitle}" has been approved!`,
      { bookTitle, requestType: type }
    );
  };

  const notifyRequestRejected = (requesterId, bookTitle, type) => {
    createNotification(
      requesterId,
      'request_rejected',
      `Your ${type} request for "${bookTitle}" has been rejected.`,
      { bookTitle, requestType: type }
    );
  };

  const notifyBookReturned = (ownerId, requesterName, bookTitle) => {
    createNotification(
      ownerId,
      'request_returned',
      `${requesterName} has returned your book "${bookTitle}"`,
      { bookTitle }
    );
  };

  const notifyDueDateApproaching = (userId, bookTitle, dueDate) => {
    createNotification(
      userId,
      'due_date_approaching',
      `Your borrowed book "${bookTitle}" is due on ${new Date(dueDate).toLocaleDateString()}`,
      { bookTitle, dueDate }
    );
  };

  const notifyBookOverdue = (userId, bookTitle, days) => {
    createNotification(
      userId,
      'book_overdue',
      `"${bookTitle}" is ${days} day(s) overdue. Please return it.`,
      { bookTitle, daysOverdue: days }
    );
  };

  const notifyBookUpdate = (userId, bookTitle, updateType, msg) => {
    createNotification(
      userId,
      'book_update',
      `Update about "${bookTitle}": ${msg}`,
      { bookTitle, updateType }
    );
  };

  const notifySwapRequest = (ownerId, requesterName, bookTitle, requesterBookTitle) => {
    createNotification(
      ownerId,
      'swap_request',
      `${requesterName} wants to swap "${requesterBookTitle}" for "${bookTitle}"`,
      { bookTitle, requesterBookTitle }
    );
  };

  const notifySwapCompleted = (userId, bookTitle, partnerBookTitle, partnerName) => {
    createNotification(
      userId,
      'swap_completed',
      `Swap complete! You exchanged "${bookTitle}" with ${partnerName}'s "${partnerBookTitle}"`,
      { bookTitle, partnerBookTitle }
    );
  };

  const notifyProfileUpdated = (userId) => {
    createNotification(userId, 'profile_updated', 'Your profile has been updated.');
  };

  const notifyBookAdded = (userId, bookTitle, availableFor) => {
    createNotification(
      userId,
      'book_added',
      `You added "${bookTitle}" available for ${availableFor}`,
      { bookTitle, availableFor }
    );
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  const getRecentNotifications = (limit = 10) =>
    notifications.slice(0, limit);

  return (
    <NotificationContext.Provider
      value={{
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
