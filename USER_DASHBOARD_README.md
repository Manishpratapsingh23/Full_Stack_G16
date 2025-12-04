# BookSwap Platform - User Dashboard

## 🎯 Project Overview
A complete frontend-only Book Swap platform built with React, Vite, TailwindCSS, Context API, and LocalStorage. This implementation includes all user dashboard features for normal user accounts.

## 🚀 Features Implemented

### 1️⃣ **My Library (Personal Book Management)**
- ✅ CRUD operations for user's books
- ✅ Add books with: title, author, genre, location, availableFor (lend/swap/donate)
- ✅ Edit existing books
- ✅ Delete books with confirmation
- ✅ Beautiful card-based UI with status indicators
- ✅ Empty state with call-to-action

### 2️⃣ **Home Page (Book Discovery)**
- ✅ Display all available books from other users
- ✅ Advanced search with filters:
  - Search by title
  - Search by author
  - Filter by genre
  - Filter by location
  - Filter by availability type (lend/swap/donate)
- ✅ Real-time search functionality
- ✅ Library statistics dashboard
- ✅ Responsive grid layout

### 3️⃣ **Book Details Page**
- ✅ Comprehensive book information display
- ✅ Request buttons for borrow/swap (if not owner)
- ✅ Status indicators (available/borrowed/reserved)
- ✅ Owner information
- ✅ Request confirmation modal
- ✅ Intelligent state management (prevents duplicate requests)

### 4️⃣ **Requests Page**
- ✅ View all outgoing requests (borrow/swap)
- ✅ Request status tracking:
  - Pending (can cancel)
  - Approved (can mark as returned)
  - Rejected (view only)
  - Returned (completed)
- ✅ Filter by status with stats cards
- ✅ Mark requests as returned
- ✅ Cancel pending requests
- ✅ Status guide help section

### 5️⃣ **Notification System**
- ✅ Real-time notification bell with badge count
- ✅ Notification types:
  - Request sent (to owner)
  - Request approved (to requester)
  - Request rejected (to requester)
  - Book returned (to owner)
- ✅ Mark as read/unread functionality
- ✅ Delete individual notifications
- ✅ Mark all as read
- ✅ Beautiful dropdown UI with icons

## 📁 Project Structure

```
client/src/
├── components/
│   ├── BookCard.jsx           # Reusable book card component
│   ├── Layout.jsx             # Main layout with navigation
│   └── NotificationBell.jsx   # Notification dropdown component
├── context/
│   ├── AuthContext.jsx        # Authentication & user management
│   ├── BookContext.jsx        # Book CRUD operations
│   ├── NotificationContext.jsx # Notification management
│   └── RequestContext.jsx     # Request management
├── pages/
│   ├── Home.jsx               # Browse & search books
│   ├── MyLibrary.jsx          # Personal library management
│   ├── BookDetails.jsx        # Detailed book view & requests
│   ├── Requests.jsx           # Request tracking
│   ├── Login.jsx              # User login
│   └── Register.jsx           # User registration
├── App.jsx                    # Main app with routing
└── main.jsx                   # App entry point
```

## 🛠️ Technology Stack

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS 4** - Styling
- **Context API** - State management
- **LocalStorage** - Data persistence

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
Visit `http://localhost:5173`

## 🎮 How to Use

### First Time Setup

1. **Register a new account:**
   - Click "Register" in the header
   - Fill in your name, email, and password
   - You'll be automatically logged in

2. **Add your first book:**
   - Go to "My Library"
   - Click "Add New Book"
   - Fill in book details
   - Choose availability type (lend/swap/donate)

3. **Browse books:**
   - Go to "Home"
   - Use search filters to find books
   - Click "View Details" on any book

4. **Request a book:**
   - On book details page
   - Click "Request to Borrow" or "Request to Swap"
   - Confirm your request

5. **Track requests:**
   - Go to "Requests"
   - View all your requests with status
   - Mark as returned when done

### Testing with Multiple Users

To test the full functionality, open the app in multiple browser windows (or use incognito mode):

1. **User 1:** Register and add books
2. **User 2:** Register and browse User 1's books
3. **User 2:** Request to borrow a book
4. **User 1:** See notification about the request
5. **User 2:** See status update in Requests page

## 🔑 Key Features Explained

### LocalStorage Data Structure

All data is stored in browser's localStorage:

```javascript
// Users
localStorage.setItem('users', JSON.stringify([{
  id: "unique_id",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "user",
  createdAt: "2025-12-04T..."
}]))

// Current User
localStorage.setItem('currentUser', JSON.stringify({...}))

// Books
localStorage.setItem('books', JSON.stringify([{
  id: "unique_id",
  title: "Book Title",
  author: "Author Name",
  genre: "Fiction",
  location: "New York",
  availableFor: "lend", // or "swap" or "donate"
  status: "available", // or "borrowed" or "reserved"
  ownerId: "user_id",
  ownerName: "Owner Name",
  description: "Optional description",
  createdAt: "2025-12-04T..."
}]))

// Requests
localStorage.setItem('requests', JSON.stringify([{
  id: "unique_id",
  bookId: "book_id",
  bookTitle: "Book Title",
  ownerId: "owner_user_id",
  ownerName: "Owner Name",
  requesterId: "requester_user_id",
  requesterName: "Requester Name",
  requestType: "borrow", // or "swap"
  status: "pending", // "approved", "rejected", "returned"
  createdAt: "2025-12-04T...",
  updatedAt: "2025-12-04T..."
}]))

// Notifications
localStorage.setItem('notifications', JSON.stringify([{
  id: "unique_id",
  userId: "user_id",
  type: "request_sent", // "request_approved", "request_rejected", "request_returned"
  message: "Notification message",
  data: {},
  read: false,
  createdAt: "2025-12-04T..."
}]))
```

### Context API Usage

All components use React Context for state management:

```jsx
// In any component
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { useRequests } from '../context/RequestContext';
import { useNotifications } from '../context/NotificationContext';

function MyComponent() {
  const { currentUser, login, logout } = useAuth();
  const { books, addBook, updateBook } = useBooks();
  const { createRequest, getOutgoingRequests } = useRequests();
  const { notifications, unreadCount } = useNotifications();
  
  // Your component logic
}
```

## 🎨 UI/UX Highlights

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Modern Styling:** Gradient backgrounds, shadows, hover effects
- **Loading States:** Spinners and loading messages
- **Empty States:** Beautiful placeholders when no data
- **Form Validation:** Real-time validation with error messages
- **Success/Error Messages:** Toast-like messages for user feedback
- **Confirmation Dialogs:** Prevent accidental deletions
- **Badge Indicators:** Visual status and count indicators
- **Icon Integration:** SVG icons throughout the app

## 🔒 Security Notes

⚠️ **Important:** This is a frontend-only demo application. In production:
- Never store passwords in plain text
- Implement proper backend authentication
- Use secure HTTP-only cookies for sessions
- Add rate limiting and CSRF protection
- Validate all inputs server-side

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Kill the process on port 5173
lsof -ti:5173 | xargs kill -9
```

2. **Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

3. **Tailwind not working:**
```bash
# Restart dev server
npm run dev
```

4. **Data not persisting:**
- Check browser's LocalStorage (DevTools > Application > LocalStorage)
- Clear and try again: `localStorage.clear()`

## 📝 Future Enhancements (Optional)

- [ ] Image upload for books
- [ ] User profiles with avatars
- [ ] Chat system between users
- [ ] Review/rating system
- [ ] Book recommendations
- [ ] Export/import data
- [ ] Dark mode
- [ ] Email notifications (would require backend)

## 👨‍💻 Developer Notes

### Code Quality
- ✅ Comprehensive comments explaining key functions
- ✅ React Hooks + Context API throughout
- ✅ Form validation & button states
- ✅ Mobile-friendly UI with Tailwind grid
- ✅ Reusable components pattern
- ✅ Separation of concerns (context/components/pages)

### Best Practices
- Component-based architecture
- Custom hooks for context
- Error boundary considerations
- Loading state management
- Optimistic UI updates
- Proper prop validation

## 📄 License

This project is part of Full_Stack_G16 repository.

## 🤝 Contributing

This is a student project. For any improvements or bug fixes:
1. Create a new branch
2. Make your changes
3. Submit a pull request

---

**Built with ❤️ by Ayush Chaudhary for Full_Stack_G16**
