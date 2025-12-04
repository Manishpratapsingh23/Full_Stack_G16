# 🔐 Admin Dashboard Documentation

## Overview

The Admin Dashboard is a comprehensive management interface for system administrators to monitor and manage users, books, transactions, and disputes in the Book Swap & Lending platform.

## Features

### 1. **Dashboard Overview**
- **Total Users**: Real-time count of all registered users
- **Total Books**: Count of all books in the platform
- **Active Requests**: Number of pending and approved borrowing/swapping requests
- **Disputes**: Count of active disputes requiring admin attention
- **Completed Requests**: Successfully completed transactions
- **Flagged Content**: Books marked as suspicious or policy-violating

### 2. **User Management**
- View all registered users with detailed information
- Search and filter users (active/blocked)
- Block/unblock users for policy violations
- View user statistics:
  - Total books contributed
  - Active requests count
  - User role and status
  - Account creation date

### 3. **Books Monitoring**
- View all books in the platform
- Search by title or author
- Filter by status (available, borrowed, reserved)
- Flag suspicious content for review
- Remove books that violate policies
- View book owner information
- Track book status in real-time

### 4. **Request Monitoring**
- Monitor all borrowing and swapping requests
- View request details:
  - Requester and owner information
  - Book details
  - Request type (lend/swap)
  - Current status
- Filter requests by status (pending, approved, completed, rejected, returned)
- Resolve disputes with approval/rejection options
- Track dispute resolution history

### 5. **Analytics & Insights**
- **Most Borrowed Books**: Identify popular titles
- **Top Contributors**: Users with the most books added
- **Borrowing Trends**: Visual breakdown of request statuses
- **Genre Distribution**: Popular genres in the platform

## Architecture

### Context (AdminContext.jsx)
Manages all admin-related state and operations:

```javascript
const { 
  users,                      // All platform users
  adminStats,                 // Dashboard statistics
  allBooks,                   // All books
  allRequests,               // All requests
  toggleBlockUser,           // Block/unblock user
  toggleFlagBook,            // Flag/unflag book
  removeBook,                // Delete book
  resolveDispute,            // Resolve request dispute
  getMostBorrowedBooks,      // Analytics
  getTopContributors,        // Analytics
  getBorrowingTrends,        // Analytics
  getGenreDistribution,      // Analytics
  searchUsers,               // Search functionality
  searchBooks                // Search functionality
} = useAdmin();
```

### Components

#### AdminDashboard.jsx (Page)
- Main admin interface
- Role-based access control
- Tab navigation
- Role switching interface

#### AdminStatCard.jsx
Reusable statistics card component with:
- Icon and label
- Value display
- Trend indicators
- Color variants

#### AdminUsersTable.jsx
User management interface with:
- Real-time user list
- Search and filtering
- Block/unblock actions
- User statistics display

#### AdminBooksTable.jsx
Books monitoring interface with:
- Complete book inventory
- Search and filtering
- Flag/unflag functionality
- Book removal options

#### AdminRequestsTable.jsx
Request monitoring with:
- All transaction requests
- Dispute identification
- Dispute resolution
- Status filtering

#### AdminAnalytics.jsx
Analytics dashboard featuring:
- Most borrowed books ranking
- Top contributors list
- Borrowing trends visualization
- Genre distribution chart

#### RoleSwitcher.jsx
Navigation component for role switching between:
- User Dashboard
- Admin Dashboard (for admin users)

## How to Use

### Accessing the Admin Dashboard

1. **Prerequisites**:
   - Account with `role: 'admin'` must exist
   - User must be logged in

2. **Navigation**:
   - Click on "Admin" link in main navigation (visible only to admins)
   - Or navigate directly to `/admin`

3. **Dashboard Access Check**:
   The dashboard automatically verifies admin privileges. Non-admin users will see an "Access Denied" message.

### Creating an Admin User

Add to localStorage (for development):

```javascript
const adminUser = {
  id: Date.now().toString(),
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'securepassword',
  role: 'admin',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  profilePicture: null,
  preferences: {
    notifications: true,
    publicProfile: false,
    shareLocation: false,
    preferredSwapType: 'both'
  },
  bio: 'Platform Administrator',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Store admin user
const users = JSON.parse(localStorage.getItem('users') || '[]');
users.push(adminUser);
localStorage.setItem('users', JSON.stringify(users));
```

### Managing Users

**Block a User:**
1. Go to "Users" tab
2. Find the user in the table
3. Click "Block" button
4. User is immediately blocked from platform access

**Search Users:**
1. Use the search bar to find by name or email
2. Filter by status (All/Active/Blocked)

### Managing Books

**Flag Suspicious Book:**
1. Go to "Books" tab
2. Locate the book
3. Click "Flag" to mark for review
4. Book appears in flagged content count

**Remove Book:**
1. Go to "Books" tab
2. Click "Remove" button
3. Confirm deletion
4. Book is permanently removed

### Managing Requests

**View Disputes:**
1. Go to "Requests" tab
2. Check "Show Disputes Only" to filter
3. Active disputes show resolution buttons

**Resolve Dispute:**
1. Locate the disputed request
2. Click "Approve" to complete transaction
3. Or click "Reject" to cancel

### Analyzing Platform

**View Analytics:**
1. Go to "Analytics" tab
2. View:
   - Most borrowed books (top 5)
   - Top contributors (top 5)
   - Borrowing trends chart
   - Genre distribution

## Data Persistence

All admin actions persist to localStorage and are reflected across all user sessions:
- User blocks/unblocks
- Book flags/unflagging
- Book removal
- Dispute resolutions

## Role-Based Navigation

Admin users can easily switch between dashboards:

1. **Role Switcher Dropdown** (visible in header for admins)
   - User Dashboard: Standard user interface
   - Admin Dashboard: Management interface

2. **Navigation Links**:
   - Main nav shows "Admin" link only for admin users
   - Direct URL access (`/admin`) requires admin role

## Integration with Existing System

The admin dashboard integrates seamlessly with:

- **AuthContext**: User authentication and role management
- **BookContext**: Book management and operations
- **RequestContext**: Request and transaction management
- **Layout Component**: Navigation and header integration
- **Existing User Dashboard**: Non-destructive addition

## Security Considerations

⚠️ **Important for Production**:
1. Implement backend authentication and authorization
2. Never store passwords in localStorage
3. Add audit logging for admin actions
4. Implement role-based access control (RBAC) on server
5. Add rate limiting for sensitive operations
6. Validate all admin actions on backend

## File Structure

```
client/src/
├── context/
│   └── AdminContext.jsx          (State management)
├── pages/
│   └── AdminDashboard.jsx         (Main page)
└── components/
    ├── AdminAnalytics.jsx         (Analytics dashboard)
    ├── AdminBooksTable.jsx        (Books management)
    ├── AdminRequestsTable.jsx     (Requests management)
    ├── AdminStatCard.jsx          (Stats display)
    ├── AdminUsersTable.jsx        (Users management)
    └── RoleSwitcher.jsx          (Role navigation)
```

## Future Enhancements

- [ ] Export analytics to CSV/PDF
- [ ] User activity timeline
- [ ] Advanced search filters
- [ ] Bulk operations (block multiple users)
- [ ] Custom date range analytics
- [ ] Admin activity logging
- [ ] User suspension (temporary block)
- [ ] Book verification workflow
- [ ] Automated flagging rules
- [ ] Dashboard notifications for admins

## Support

For issues or questions about the admin dashboard, contact the development team.
