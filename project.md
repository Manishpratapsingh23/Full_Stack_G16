# BookSwap User Dashboard - Project Summary

## Overview
BookSwap is a community-driven book sharing platform that enables users to exchange, lend, and donate books. The application features role-based authentication with three distinct user types: Reader, Book Owner, and Admin.

## Architecture

### Frontend (React 19.2.0 + Vite 7.2.6)
**Location**: `/client`

**Technology Stack**:
- React 19.2.0 with Hooks
- React Router v7 for navigation
- Tailwind CSS v4 for styling
- Context API for state management
- LocalStorage for data persistence

**Key Features**:
- ✅ Role-based user authentication
- ✅ Advanced book search and filtering
- ✅ User dashboard with statistics
- ✅ Book request tracking system
- ✅ Notification management
- ✅ User profile management
- ✅ Responsive UI with Tailwind CSS

### Backend (Express.js + Node.js)
**Location**: `/server`

**Features**:
- 27 RESTful API endpoints
- User authentication and role management
- Book management (CRUD operations)
- Request handling (pending, approved, rejected)
- Notification system
- Advanced search functionality
- CORS enabled for frontend communication

---

## User Roles & Features

### 1. **Reader Role**
**Purpose**: Browse and request books from other users

**Features**:
- Browse available books with advanced filters
- Search by title, author, genre, location
- Send book requests to owners
- Track request status (pending, approved, rejected)
- View received notifications
- Manage personal profile
- Access dashboard with personal statistics

**Dashboard Stats**:
- Total requests sent
- Requests approved
- Books borrowed
- Books returned

### 2. **Book Owner Role**
**Purpose**: Share and lend books from their personal library

**Features**:
- Add books to personal library
- Manage book availability
- View and approve/reject book requests
- Track lending history
- Manage borrowed books
- Receive notifications for book requests
- Access dashboard with ownership statistics

**Dashboard Stats**:
- Total books owned
- Books available for lending
- Requests received
- Completed swaps
- Active loans

### 3. **Admin Role** (Deferred)
**Purpose**: Platform administration and moderation

**Future Features** (to be implemented):
- User management and moderation
- Book listing moderation
- Request dispute resolution
- Platform statistics
- Content moderation tools

---

## Core Components

### Authentication System
**File**: `client/src/context/AuthContext.jsx`

**Features**:
- User registration with role selection
- Email-based login
- Role validation (reader, book_owner, admin)
- Automatic login after registration
- Password change functionality
- Profile updates
- LocalStorage persistence

**User Object Structure**:
```javascript
{
  id: "1234567890",
  name: "John Doe",
  email: "john@example.com",
  role: "book_owner",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
  profilePicture: null,
  preferences: {
    notifications: true,
    publicProfile: true,
    shareLocation: false,
    preferredSwapType: "both"
  },
  bio: "",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

### Book Management
**File**: `client/src/context/BookContext.jsx`

**Features**:
- Add/edit/delete books
- Advanced search with filters (genre, location, availability)
- Sort by date, title, author
- Book status tracking (available, borrowed, unavailable)
- Filter by swap type (lend, swap, donate)

### Request Management
**File**: `client/src/context/RequestContext.jsx`

**Features**:
- Create book requests
- Track request status (pending, approved, rejected)
- Due date management (30-day default)
- Incoming and outgoing request tracking
- Request approval/rejection logic

### Notification System
**File**: `client/src/context/NotificationContext.jsx`

**Features**:
- Real-time notifications
- Notification types: request_approved, request_received, book_returned
- Mark as read functionality
- Unread count tracking
- Notification deletion

---

## Pages & Components

### Pages

#### 1. **Home Page** (`client/src/pages/Home.jsx`)
- Book discovery with search and filters
- Dashboard preview for logged-in users
- Quick access to user statistics
- Featured books display
- Advanced search interface

#### 2. **Registration Page** (`client/src/pages/Register.jsx`)
- Role selection (Radio buttons):
  - Reader: Browse and request books
  - Book Owner: Lend your books
  - Admin: Manage the platform
- Email validation
- Password strength validation
- Form error handling

#### 3. **Login Page** (`client/src/pages/Login.jsx`)
- Email and password authentication
- Role information display
- Form validation
- Error messages
- Redirect to home on success

#### 4. **Dashboard Page** (`client/src/pages/Dashboard.jsx`)
- **Overview Tab**: User statistics, quick actions
- **Profile Tab**: Edit name, email, bio, contact information
- **Security Tab**: Change password
- **Activity Tab**: Recent activities and request history

#### 5. **My Library Page** (`client/src/pages/MyLibrary.jsx`)
- View personal book collection
- Add new books
- Edit book details
- Delete books
- Filter and sort options

#### 6. **Requests Page** (`client/src/pages/Requests.jsx`)
- Incoming requests from other users
- Outgoing requests made by user
- Request status tracking
- Approve/reject incoming requests
- Cancel outgoing requests

### Components

#### 1. **Layout Component** (`client/src/components/Layout.jsx`)
- Main navigation bar
- Navigation links:
  - Discover Books
  - Dashboard (if logged in)
  - My Library (if logged in)
  - Requests (if logged in)
- User profile menu
- Logout button

#### 2. **NotificationBell Component** (`client/src/components/NotificationBell.jsx`)
- Displays unread notification count
- Notification dropdown menu
- Mark as read functionality

#### 3. **BookCard Component** (`client/src/components/BookCard.jsx`)
- Display book information
- Quick view button
- Request button
- Book availability status

---

## API Endpoints

### User Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `GET /api/users/:userId/stats` - Get user statistics

### Book Routes
- `GET /api/books` - Get all books with filters
- `GET /api/books/:bookId` - Get single book details
- `POST /api/books` - Create new book
- `PUT /api/books/:bookId` - Update book
- `DELETE /api/books/:bookId` - Delete book

### Request Routes
- `GET /api/requests` - Get user requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/:requestId` - Update request status

### Notification Routes
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:notificationId` - Mark notification as read
- `PUT /api/notifications/mark-all-read/:userId` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Search Routes
- `GET /api/search` - Advanced search for books

---

## Key Features

### 1. Role-Based Access Control
- Different UI and features based on user role
- Reader and Book Owner: Full feature access
- Admin: Deferred for future implementation

### 2. Advanced Search & Filtering
- Search by title, author, genre
- Filter by location, availability
- Sort by date added, title, author
- Multiple filter combinations

### 3. User Dashboard
- Personalized statistics
- Quick actions
- Profile management
- Security settings
- Activity tracking

### 4. Notification System
- Real-time updates for requests
- Book availability notifications
- Request status changes
- Read/unread tracking

### 5. Book Management
- Add books to library
- Edit book details
- Remove books
- Track availability
- Manage lending

### 6. Request Management
- Send book requests
- Receive and review requests
- Approve/reject logic
- Due date tracking
- Request history

---

## Data Storage

### LocalStorage Structure
```javascript
{
  users: [
    {
      id: "...",
      name: "...",
      email: "...",
      role: "...",
      // ... other user properties
    }
  ],
  currentUser: {
    // Current logged-in user (without password)
  },
  books: [
    {
      id: "...",
      title: "...",
      author: "...",
      ownerId: "...",
      // ... other book properties
    }
  ],
  requests: [
    {
      id: "...",
      bookId: "...",
      requesterId: "...",
      status: "pending",
      // ... other request properties
    }
  ],
  notifications: [
    {
      id: "...",
      userId: "...",
      type: "...",
      message: "...",
      read: false
    }
  ]
}
```

---

## Development Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

**Client Setup**:
```bash
cd client
npm install
npm run dev
```

**Server Setup**:
```bash
cd server
npm install
npm start
```

### Development Server
- **Client**: http://localhost:5175 (Vite dev server)
- **Server**: http://localhost:5000 (Express server)

---

## Future Enhancements

### Phase 2
- [ ] Admin dashboard implementation
- [ ] Backend database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] Email verification
- [ ] Real-time notifications (WebSocket)

### Phase 3
- [ ] Payment integration
- [ ] Book ratings and reviews
- [ ] User messaging system
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 4
- [ ] Machine learning recommendations
- [ ] Social features
- [ ] Community events
- [ ] Book clubs

---

## Testing

### Manual Testing Checklist
- [ ] Register as Reader
- [ ] Register as Book Owner
- [ ] Register as Admin
- [ ] Login with registered account
- [ ] View dashboard
- [ ] Add book to library
- [ ] Search for books
- [ ] Send book request
- [ ] Approve/reject request
- [ ] Change password
- [ ] Update profile
- [ ] View notifications

---

## Project Status

**Completed**:
- ✅ Role-based authentication system
- ✅ User registration and login
- ✅ User dashboard with multiple tabs
- ✅ Book management (CRUD)
- ✅ Request tracking system
- ✅ Notification management
- ✅ Advanced search and filtering
- ✅ Profile management
- ✅ Express backend with API endpoints

**In Progress**:
- Backend database integration
- Production deployment setup

**Planned**:
- Admin dashboard
- Real-time notifications
- Payment integration
- Mobile application

---

## Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 19.2.0 |
| Build Tool | Vite | 7.2.6 |
| Routing | React Router | v7 |
| Styling | Tailwind CSS | v4 |
| State Management | Context API | Built-in |
| Backend | Express.js | Latest |
| Database | LocalStorage | Built-in |
| Package Manager | npm | Latest |

---

## Git Repository
- **Repository**: team-16-project
- **Owner**: Manishpratapsingh23
- **Current Branch**: main
- **Latest Commit**: Merge feature-Umesh-user-dashboard

---

## Contact & Support
For questions or issues, please refer to the repository or contact the development team.
