import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { getSocket } from '../services/socketService';

export const useNotificationsListener = () => {
  const { createNotification } = useNotifications();

  useEffect(() => {
    const socket = getSocket();

    const handleNotification = (notification) => {
      console.log('🔔 New notification received:', notification);
      createNotification(
        notification.userId,
        notification.type,
        notification.message,
        notification.data
      );
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [createNotification]);
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};
