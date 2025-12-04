const API_BASE_URL = 'http://localhost:5000/api/notifications';

export const fetchNotifications = async (userId, page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/${userId}?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const fetchUnreadCount = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/unread-count`);
    if (!response.ok) throw new Error('Failed to fetch unread count');
    const data = await response.json();
    return data.unreadCount;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/mark-all-read`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
    return await response.json();
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete notification');
    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const notifyRequestApproved = async (requesterId, bookTitle, requestType = 'borrow') => {
  try {
    const response = await fetch(`${API_BASE_URL}/trigger/approved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterId, bookTitle, requestType }),
    });
    if (!response.ok) throw new Error('Failed to send notification');
    return await response.json();
  } catch (error) {
    console.error('Error triggering notification:', error);
    throw error;
  }
};

export const notifyBookReturned = async (ownerId, returnerName, bookTitle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trigger/returned`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerId, returnerName, bookTitle }),
    });
    if (!response.ok) throw new Error('Failed to send notification');
    return await response.json();
  } catch (error) {
    console.error('Error triggering notification:', error);
    throw error;
  }
};

export const notifyDueDateReminder = async (borrowerId, bookTitle, dueDate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trigger/due-date`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ borrowerId, bookTitle, dueDate }),
    });
    if (!response.ok) throw new Error('Failed to send notification');
    return await response.json();
  } catch (error) {
    console.error('Error triggering notification:', error);
    throw error;
  }
};

export const notifyRequestReceived = async (ownerId, requesterName, bookTitle, requestType = 'borrow') => {
  try {
    const response = await fetch(`${API_BASE_URL}/trigger/request-received`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerId, requesterName, bookTitle, requestType }),
    });
    if (!response.ok) throw new Error('Failed to send notification');
    return await response.json();
  } catch (error) {
    console.error('Error triggering notification:', error);
    throw error;
  }
};
