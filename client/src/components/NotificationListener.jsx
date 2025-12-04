import { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { initializeSocket, offEvent, onEvent } from '../services/socketService';

const NotificationListener = ({ userId }) => {
  const { createNotification } = useNotifications();
  const [showToast, setShowToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const socket = initializeSocket();
    socket.emit('join_notifications', userId);

    const handleNewNotification = (notification) => {
      console.log('🔔 Notification received:', notification);

      createNotification(
        userId,
        notification.type,
        notification.message,
        notification.data
      );

      displayToast(notification.title, notification.message, notification.type);
    };

    onEvent('notification', handleNewNotification);

    return () => {
      offEvent('notification', handleNewNotification);
      socket.emit('leave_notifications', userId);
    };
  }, [userId, createNotification]);

  const displayToast = (title, message, type = 'general') => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    setShowToast({ title, message, type });

    const timeout = setTimeout(() => {
      setShowToast(null);
    }, 6000);

    setToastTimeout(timeout);
  };

  const getToastStyles = (type) => {
    const styles = {
      request_sent: {
        icon: '📬',
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-600',
      },
      request_approved: {
        icon: '✅',
        bgColor: 'bg-green-500',
        borderColor: 'border-green-600',
      },
      request_rejected: {
        icon: '❌',
        bgColor: 'bg-red-500',
        borderColor: 'border-red-600',
      },
      book_returned: {
        icon: '📚',
        bgColor: 'bg-purple-500',
        borderColor: 'border-purple-600',
      },
      due_date_reminder: {
        icon: '⏰',
        bgColor: 'bg-yellow-500',
        borderColor: 'border-yellow-600',
      },
      general: {
        icon: '🔔',
        bgColor: 'bg-gray-500',
        borderColor: 'border-gray-600',
      },
    };

    return styles[type] || styles.general;
  };

  const toastStyle = showToast ? getToastStyles(showToast.type) : null;

  if (!showToast) return null;

  return (
    <div
      className={`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg border-l-4 ${toastStyle.bgColor} ${toastStyle.borderColor} text-white z-50 animate-slide-in`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{toastStyle.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{showToast.title}</h3>
          <p className="text-sm opacity-90">{showToast.message}</p>
        </div>
        <button
          onClick={() => setShowToast(null)}
          className="text-white hover:opacity-80 transition-opacity ml-2"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-shrink {
          animation: shrink 6s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationListener;
