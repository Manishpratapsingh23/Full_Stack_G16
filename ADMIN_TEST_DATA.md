# Admin Dashboard - Test Data Setup

This guide helps you set up test data for the admin dashboard in development.

## Quick Setup Script

Copy and paste this entire script into your browser's DevTools Console while on the application:

```javascript
// ADMIN DASHBOARD TEST DATA SETUP
// Run this in browser console to populate test data

(function setupTestData() {
  console.log('🔧 Setting up admin dashboard test data...');

  // 1. CREATE TEST USERS
  const users = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-555-0101',
      address: '123 Admin St',
      city: 'New York',
      zipCode: '10001',
      profilePicture: null,
      preferences: {
        notifications: true,
        publicProfile: false,
        shareLocation: false,
        preferredSwapType: 'both'
      },
      bio: 'Platform Administrator',
      blocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'pass123',
      role: 'book_owner',
      phone: '+1-555-0102',
      address: '456 Reader Ave',
      city: 'Boston',
      zipCode: '02101',
      profilePicture: null,
      preferences: {
        notifications: true,
        publicProfile: true,
        shareLocation: false,
        preferredSwapType: 'swap'
      },
      bio: 'Book lover and collector',
      blocked: false,
      createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 30*24*60*60*1000).toISOString()
    },
    {
      id: '3',
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'pass123',
      role: 'reader',
      phone: '+1-555-0103',
      address: '789 Book St',
      city: 'Chicago',
      zipCode: '60601',
      profilePicture: null,
      preferences: {
        notifications: true,
        publicProfile: true,
        shareLocation: false,
        preferredSwapType: 'lend'
      },
      bio: 'Avid reader',
      blocked: false,
      createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 60*24*60*60*1000).toISOString()
    },
    {
      id: '4',
      name: 'Carol White',
      email: 'carol@example.com',
      password: 'pass123',
      role: 'book_owner',
      phone: '+1-555-0104',
      address: '321 Library Ln',
      city: 'San Francisco',
      zipCode: '94102',
      profilePicture: null,
      preferences: {
        notifications: false,
        publicProfile: false,
        shareLocation: false,
        preferredSwapType: 'both'
      },
      bio: 'Sharing my library',
      blocked: false,
      createdAt: new Date(Date.now() - 90*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 90*24*60*60*1000).toISOString()
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      password: 'pass123',
      role: 'reader',
      phone: '+1-555-0105',
      address: '555 Fiction Way',
      city: 'Seattle',
      zipCode: '98101',
      profilePicture: null,
      preferences: {
        notifications: true,
        publicProfile: true,
        shareLocation: false,
        preferredSwapType: 'both'
      },
      bio: 'Mystery and thriller fan',
      blocked: true,  // BLOCKED USER FOR TESTING
      createdAt: new Date(Date.now() - 120*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 10*24*60*60*1000).toISOString()
    }
  ];

  localStorage.setItem('users', JSON.stringify(users));
  console.log('✅ Created 5 test users (1 admin, 2 book_owner, 2 reader)');

  // 2. CREATE TEST BOOKS
  const books = [
    {
      id: 'book1',
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      description: 'A dystopian novel set in a totalitarian society',
      genre: 'Dystopian Fiction',
      ownerId: '2',
      ownerName: 'Alice Johnson',
      status: 'available',
      coverImage: null,
      rating: 4.5,
      reviews: [],
      flagged: false,
      isDisputed: false,
      createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'book2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0061120084',
      description: 'A gripping tale of racial injustice in the American South',
      genre: 'Classic',
      ownerId: '3',
      ownerName: 'Bob Smith',
      status: 'borrowed',
      coverImage: null,
      rating: 4.8,
      reviews: [],
      flagged: false,
      isDisputed: false,
      createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'book3',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      description: 'An American classic about love and wealth',
      genre: 'Classic',
      ownerId: '4',
      ownerName: 'Carol White',
      status: 'available',
      coverImage: null,
      rating: 4.4,
      reviews: [],
      flagged: false,
      isDisputed: false,
      createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'book4',
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0441172719',
      description: 'Epic science fiction novel set on the desert planet Arrakis',
      genre: 'Science Fiction',
      ownerId: '2',
      ownerName: 'Alice Johnson',
      status: 'available',
      coverImage: null,
      rating: 4.6,
      reviews: [],
      flagged: true,  // FLAGGED FOR TESTING
      isDisputed: false,
      createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
    },
    {
      id: 'book5',
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0735211292',
      description: 'Practical guide to building good habits and breaking bad ones',
      genre: 'Self-Help',
      ownerId: '3',
      ownerName: 'Bob Smith',
      status: 'available',
      coverImage: null,
      rating: 4.7,
      reviews: [],
      flagged: false,
      isDisputed: false,
      createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'book6',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      isbn: '978-0525555032',
      description: 'A woman explores parallel lives she could have lived',
      genre: 'Fantasy',
      ownerId: '4',
      ownerName: 'Carol White',
      status: 'reserved',
      coverImage: null,
      rating: 4.3,
      reviews: [],
      flagged: false,
      isDisputed: false,
      createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  localStorage.setItem('books', JSON.stringify(books));
  console.log('✅ Created 6 test books (1 flagged, various genres)');

  // 3. CREATE TEST REQUESTS
  const requests = [
    {
      id: 'req1',
      requesterId: '3',
      requesterName: 'Bob Smith',
      ownerId: '2',
      ownerName: 'Alice Johnson',
      bookId: 'book1',
      bookTitle: '1984',
      type: 'lend',
      status: 'pending',
      hasDispute: false,
      message: 'Would love to borrow this book',
      createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
    },
    {
      id: 'req2',
      requesterId: '4',
      requesterName: 'Carol White',
      ownerId: '3',
      ownerName: 'Bob Smith',
      bookId: 'book2',
      bookTitle: 'To Kill a Mockingbird',
      type: 'swap',
      status: 'approved',
      hasDispute: false,
      message: 'Interested in swapping',
      createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
    },
    {
      id: 'req3',
      requesterId: '2',
      requesterName: 'Alice Johnson',
      ownerId: '4',
      ownerName: 'Carol White',
      bookId: 'book3',
      bookTitle: 'The Great Gatsby',
      type: 'lend',
      status: 'completed',
      hasDispute: false,
      message: 'Great book, thanks!',
      createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
    },
    {
      id: 'req4',
      requesterId: '5',
      requesterName: 'David Brown',
      ownerId: '2',
      ownerName: 'Alice Johnson',
      bookId: 'book4',
      bookTitle: 'Dune',
      type: 'swap',
      status: 'pending',
      hasDispute: true,  // DISPUTE FOR TESTING
      message: 'Requesting swap but unsure about condition',
      createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
    },
    {
      id: 'req5',
      requesterId: '3',
      requesterName: 'Bob Smith',
      ownerId: '4',
      ownerName: 'Carol White',
      bookId: 'book6',
      bookTitle: 'The Midnight Library',
      type: 'lend',
      status: 'rejected',
      hasDispute: false,
      message: 'Owner declined this request',
      createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
    },
    {
      id: 'req6',
      requesterId: '2',
      requesterName: 'Alice Johnson',
      ownerId: '3',
      ownerName: 'Bob Smith',
      bookId: 'book5',
      bookTitle: 'Atomic Habits',
      type: 'swap',
      status: 'returned',
      hasDispute: false,
      message: 'Excellent book exchange',
      createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString(),
      updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
    }
  ];

  localStorage.setItem('requests', JSON.stringify(requests));
  console.log('✅ Created 6 test requests (1 disputed, various statuses)');

  // 4. SET CURRENT USER AS ADMIN
  const adminUser = users[0];
  const userWithoutPassword = { ...adminUser };
  delete userWithoutPassword.password;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  console.log('✅ Set current user as admin (you can now log in as admin@example.com)');

  console.log('\n🎉 Test data setup complete!');
  console.log('Admin credentials: admin@example.com / admin123');
  console.log('Now you can:');
  console.log('1. Log out and log back in as admin');
  console.log('2. Click "Admin" in the navigation');
  console.log('3. Explore the admin dashboard with real test data!');
})();
```

## What Gets Created

### Users (5 total)
- **admin@example.com** (Admin) - Has all admin permissions
- **alice@example.com** (Book Owner) - Active contributor
- **bob@example.com** (Reader) - Active user
- **carol@example.com** (Book Owner) - Active contributor
- **david@example.com** (Reader, Blocked) - Blocked user for testing

### Books (6 total)
- Various genres: Fiction, Classics, Science Fiction, Self-Help, Fantasy
- Mix of statuses: Available, Borrowed, Reserved
- 1 flagged book for testing flag functionality

### Requests (6 total)
- Various types: Lend, Swap
- Different statuses: Pending, Approved, Completed, Rejected, Returned
- 1 disputed request for testing dispute resolution

## Manual Testing Scenarios

### Test 1: Block a User
1. Go to Users tab
2. Find "David Brown" (already blocked)
3. Click "Unblock"
4. Block Alice Johnson
5. Refresh - Alice should stay blocked

### Test 2: Flag and Remove Book
1. Go to Books tab
2. Find "Dune" (already flagged)
3. Click "Unflag"
4. Flag "To Kill a Mockingbird"
5. Remove a book

### Test 3: Resolve Disputes
1. Go to Requests tab
2. Check "Show Disputes Only"
3. Find the disputed request (Dune)
4. Click "Approve" or "Reject"
5. Dispute is resolved

### Test 4: View Analytics
1. Go to Analytics tab
2. See most borrowed books
3. View top contributors
4. Check borrowing trends
5. View genre distribution

## Resetting Test Data

To clear all test data and start fresh:

```javascript
localStorage.removeItem('users');
localStorage.removeItem('books');
localStorage.removeItem('requests');
localStorage.removeItem('currentUser');
console.log('All test data cleared!');
```

## Notes

- Passwords are stored in plain text in localStorage for demo purposes only
- For production, never store passwords client-side
- All timestamps use realistic date ranges
- Book ratings and reviews are pre-populated
- Search and filter functions are fully testable with this data

Enjoy testing the admin dashboard! 🚀
