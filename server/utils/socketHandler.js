/**
 * Socket.IO Event Handler
 * Manages real-time socket connections and user rooms
 */

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins their notification room using userId
    socket.on('join_notifications', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their notification room`);

      // Emit confirmation
      socket.emit('joined_notifications', {
        message: `You are now receiving real-time notifications`,
        userId,
        socketId: socket.id,
      });
    });

    // User leaves their notification room
    socket.on('leave_notifications', (userId) => {
      socket.leave(userId);
      console.log(`User ${userId} left their notification room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Ping/Pong for connection health check
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
};

/**
 * Emit notification to a specific user
 * @param {object} io - Socket.IO instance
 * @param {string} userId - Target user ID
 * @param {object} notification - Notification data
 */
export const emitToUser = (io, userId, notification) => {
  io.to(userId).emit('notification', notification);
};

/**
 * Emit notification to multiple users
 * @param {object} io - Socket.IO instance
 * @param {array} userIds - Array of user IDs
 * @param {object} notification - Notification data
 */
export const emitToUsers = (io, userIds, notification) => {
  userIds.forEach((userId) => {
    io.to(userId).emit('notification', notification);
  });
};

/**
 * Broadcast notification to all connected users
 * @param {object} io - Socket.IO instance
 * @param {object} notification - Notification data
 */
export const broadcastNotification = (io, notification) => {
  io.emit('notification', notification);
};

/**
 * Get connected users count in a room (room name = userId)
 * @param {object} io - Socket.IO instance
 * @param {string} userId - User ID (room name)
 */
export const getConnectedUsersInRoom = async (io, userId) => {
  const clients = await io.in(userId).fetchSockets();
  return clients.length;
};

/**
 * Get all connected socket IDs for a user
 * @param {object} io - Socket.IO instance
 * @param {string} userId - User ID
 */
export const getUserSockets = async (io, userId) => {
  const clients = await io.in(userId).fetchSockets();
  return clients.map((client) => client.id);
};
