import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import notificationRoutes from './routes/notificationRoutes.js';
import notificationTriggersRoutes from './routes/notificationTriggersRoutes.js';
import { verifyEmailService } from './utils/emailService.js';
import { setupSocketHandlers } from './utils/socketHandler.js';

// Load environment variables
dotenv.config();

// Create app + HTTP server
const app = express();
const httpServer = createServer(app);

// ===== SOCKET.IO =====
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ===== DATABASE CONNECTION =====
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookswap';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Setup socket handlers
setupSocketHandlers(io);

// =================== AUTH ROUTES ===================

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email & password required' });

    res.json({
      success: true,
      message: 'Login successful',
      token: 'jwt-token-here',
      user: {
        id: '1',
        name: 'User Name',
        email,
        role: 'user',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login error' });
  }
});

// =================== USER ROUTES ===================

app.get('/api/users/:userId', (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.params.userId,
      name: 'User Name',
      email: 'user@example.com',
      bio: 'Book Lover',
      createdAt: new Date().toISOString(),
    },
  });
});

app.put('/api/users/:userId', (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated',
    user: { id: req.params.userId, ...req.body },
  });
});

app.get('/api/users/:userId/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalBooks: 15,
      booksAvailable: 12,
      requestsSent: 5,
      requestsReceived: 8,
      swapsCompleted: 3,
    },
  });
});

// =================== BOOK ROUTES ===================

app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    books: [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        availableFor: 'lend',
        status: 'available',
      },
    ],
  });
});

app.post('/api/books', (req, res) => {
  const { title, author, genre, location } = req.body;
  if (!title || !author || !genre || !location)
    return res.status(400).json({ success: false, message: 'Missing fields' });

  res.status(201).json({
    success: true,
    message: 'Book added',
    book: { id: Date.now().toString(), ...req.body },
  });
});

// =================== REQUEST ROUTES ===================

app.get('/api/requests', (req, res) => {
  res.json({
    success: true,
    requests: [
      {
        id: '1',
        bookId: '1',
        requesterId: '2',
        status: 'pending',
      },
    ],
  });
});

app.post('/api/requests', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Request created',
    request: { id: Date.now().toString(), ...req.body },
  });
});

// =================== NOTIFICATION ROUTES ===================

app.use('/api/notifications', notificationRoutes);
app.use('/api/notifications/trigger', notificationTriggersRoutes);

// =================== SEARCH ROUTES ===================

app.get('/api/search', (req, res) => {
  res.json({ success: true, results: [], count: 0 });
});

// =================== HEALTH CHECK ===================

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// =================== START SERVER ===================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 Socket.IO active`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  verifyEmailService();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📛 Shutting down...');
  httpServer.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

export default app;
