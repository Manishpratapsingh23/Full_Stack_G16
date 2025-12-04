import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (url = 'http://localhost:5000') => {
  if (socket) {
    return socket;
  }

  socket = io(url, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Connected to notification server:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from notification server');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (eventName, data) => {
  const sock = getSocket();
  sock.emit(eventName, data);
};

export const onEvent = (eventName, callback) => {
  const sock = getSocket();
  sock.on(eventName, callback);
};

export const offEvent = (eventName, callback) => {
  const sock = getSocket();
  sock.off(eventName, callback);
};

export const joinNotificationRoom = (userId) => {
  const sock = getSocket();
  sock.emit('join_notifications', userId);
};

export const leaveNotificationRoom = (userId) => {
  const sock = getSocket();
  sock.emit('leave_notifications', userId);
};

export const isSocketConnected = () => {
  return socket && socket.connected;
};
