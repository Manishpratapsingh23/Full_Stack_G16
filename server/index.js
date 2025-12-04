import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== USER ROUTES =====

// Register a new user
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    // In production, validate email format and hash password
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // In production, query database and verify password
    res.json({
      success: true,
      message: 'User logged in successfully',
      token: 'jwt-token-here',
      user: {
        id: '1',
        name: 'User Name',
        email: email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Get user profile
app.get('/api/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      user: {
        id: userId,
        name: 'User Name',
        email: 'user@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main St',
        city: 'Springfield',
        zipCode: '12345',
        bio: 'Book lover and avid reader',
        preferences: {
          notifications: true,
          publicProfile: true,
          shareLocation: false,
          preferredSwapType: 'both'
        },
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user profile' 
    });
  }
});

// Update user profile
app.put('/api/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: userId,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user profile' 
    });
  }
});

// Get user statistics
app.get('/api/users/:userId/stats', (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      stats: {
        totalBooks: 15,
        booksAvailable: 12,
        requestsSent: 5,
        requestsReceived: 8,
        requestsApproved: 6,
        swapsCompleted: 3
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user statistics' 
    });
  }
});

// ===== BOOK ROUTES =====

// Get all books
app.get('/api/books', (req, res) => {
  try {
    const { genre, location, availableFor, search } = req.query;
    
    res.json({
      success: true,
      books: [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          location: 'Springfield',
          availableFor: 'lend',
          status: 'available',
          ownerId: '1',
          ownerName: 'John Doe',
          createdAt: new Date().toISOString()
        }
      ],
      count: 1
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching books' 
    });
  }
});

// Get single book
app.get('/api/books/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    
    res.json({
      success: true,
      book: {
        id: bookId,
        title: 'Sample Book',
        author: 'Sample Author',
        genre: 'Fiction',
        description: 'A great book',
        location: 'Springfield',
        availableFor: 'lend',
        status: 'available',
        ownerId: '1',
        ownerName: 'John Doe',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching book' 
    });
  }
});

// Create a new book
app.post('/api/books', (req, res) => {
  try {
    const { title, author, genre, location, availableFor, description } = req.body;
    
    if (!title || !author || !genre || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, author, genre, and location are required' 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      book: {
        id: Date.now().toString(),
        title,
        author,
        genre,
        location,
        availableFor,
        description,
        status: 'available',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding book' 
    });
  }
});

// Update book
app.put('/api/books/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      book: {
        id: bookId,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating book' 
    });
  }
});

// Delete book
app.delete('/api/books/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting book' 
    });
  }
});

// ===== REQUEST ROUTES =====

// Get all requests for a user
app.get('/api/requests', (req, res) => {
  try {
    const { userId, type } = req.query; // type: 'incoming' or 'outgoing'
    
    res.json({
      success: true,
      requests: [
        {
          id: '1',
          bookId: '1',
          bookTitle: 'The Great Gatsby',
          requesterId: '2',
          requesterName: 'Jane Smith',
          ownerId: '1',
          ownerName: 'John Doe',
          requestType: 'borrow',
          status: 'pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ],
      count: 1
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching requests' 
    });
  }
});

// Create a request
app.post('/api/requests', (req, res) => {
  try {
    const { bookId, bookTitle, ownerId, ownerName, requestType } = req.body;
    
    if (!bookId || !requestType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Book ID and request type are required' 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request: {
        id: Date.now().toString(),
        bookId,
        bookTitle,
        ownerId,
        ownerName,
        requestType,
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating request' 
    });
  }
});

// Update request status
app.put('/api/requests/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      request: {
        id: requestId,
        status,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating request' 
    });
  }
});

// ===== NOTIFICATION ROUTES =====

// Get user notifications
app.get('/api/notifications', (req, res) => {
  try {
    const { userId, read } = req.query;
    
    res.json({
      success: true,
      notifications: [
        {
          id: '1',
          userId: userId,
          type: 'request_approved',
          message: 'Your request for "The Great Gatsby" has been approved!',
          read: read === 'false' ? false : true,
          createdAt: new Date().toISOString()
        }
      ],
      unreadCount: 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications' 
    });
  }
});

// Mark notification as read
app.put('/api/notifications/:notificationId', (req, res) => {
  try {
    const { notificationId } = req.params;
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      notification: {
        id: notificationId,
        read: true
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating notification' 
    });
  }
});

// Mark all notifications as read
app.put('/api/notifications/mark-all-read/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error marking notifications as read' 
    });
  }
});

// Delete notification
app.delete('/api/notifications/:notificationId', (req, res) => {
  try {
    const { notificationId } = req.params;
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting notification' 
    });
  }
});

// ===== SEARCH ROUTES =====

// Advanced search for books
app.get('/api/search', (req, res) => {
  try {
    const { q, genre, author, location, availableFor, sortBy } = req.query;
    
    res.json({
      success: true,
      results: [],
      count: 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error performing search' 
    });
  }
});

// ===== HEALTH CHECK =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`BookSwap server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
