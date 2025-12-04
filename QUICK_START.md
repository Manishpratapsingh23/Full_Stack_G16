# 🚀 Admin Dashboard - Quick Start Guide

## ⚡ Get Started in 3 Minutes

### Step 1: Setup Test Data (1 minute)

Open browser DevTools Console (F12) and paste:

```javascript
(function setupTestData() {
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin', phone: '+1-555-0101', address: '123 Admin St', city: 'New York', zipCode: '10001', profilePicture: null, preferences: { notifications: true, publicProfile: false, shareLocation: false, preferredSwapType: 'both' }, bio: 'Platform Administrator', blocked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  const books = [
    { id: 'book1', title: '1984', author: 'George Orwell', isbn: '978-0451524935', description: 'A dystopian novel', genre: 'Dystopian Fiction', ownerId: '1', ownerName: 'Admin User', status: 'available', coverImage: null, rating: 4.5, reviews: [], flagged: false, isDisputed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'book2', title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', description: 'Epic sci-fi', genre: 'Science Fiction', ownerId: '1', ownerName: 'Admin User', status: 'available', coverImage: null, rating: 4.6, reviews: [], flagged: true, isDisputed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  const requests = [
    { id: 'req1', requesterId: '1', requesterName: 'Admin User', ownerId: '1', ownerName: 'Admin User', bookId: 'book1', bookTitle: '1984', type: 'lend', status: 'pending', hasDispute: false, message: 'Test request', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('books', JSON.stringify(books));
  localStorage.setItem('requests', JSON.stringify(requests));
  const adminUser = users[0];
  delete adminUser.password;
  localStorage.setItem('currentUser', JSON.stringify(adminUser));
  console.log('✅ Test data ready! admin@example.com / admin123');
})();
```

### Step 2: Login as Admin (1 minute)

1. Log out if already logged in
2. Go to Login page
3. Enter:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
4. Click "Login"

### Step 3: Access Admin Dashboard (1 minute)

1. In main navigation, click **"Admin"** link
2. Or go directly to: `http://localhost:5174/admin`
3. You should see the Admin Dashboard! 🎉

---

## 🗂️ Dashboard Tabs

### 📊 Overview
- Total Users count
- Total Books count
- Active Requests count
- Disputes count
- Completed Requests count
- Flagged Content count

### 👥 Users
- List all registered users
- Search by name/email
- Filter (All/Active/Blocked)
- Block or Unblock users
- View user statistics

### 📚 Books
- List all books
- Search by title/author
- Filter by status
- Flag suspicious books
- Remove inappropriate books

### 📋 Requests
- View all requests
- Filter by status
- Show disputed requests
- Resolve disputes

### 📈 Analytics
- Most Borrowed Books (top 5)
- Top Contributors (top 5)
- Borrowing Trends (chart)
- Genre Distribution (chart)

---

## 🎮 Try These Actions

### Test 1: View Dashboard Stats
1. Click "Overview" tab
2. See platform statistics
3. Total users, books, requests

### Test 2: Search Users
1. Click "Users" tab
2. Type in search box
3. Results filter in real-time

### Test 3: Flag a Book
1. Click "Books" tab
2. Find "Dune" (already flagged)
3. Click "Unflag"
4. Watch status change

### Test 4: View Analytics
1. Click "Analytics" tab
2. See graphs and rankings
3. Understand platform usage

### Test 5: Switch Roles
1. See dropdown in header (admin only)
2. Click to open role switcher
3. Switch to "User Dashboard"
4. Switch back to "Admin Dashboard"

---

## 🔍 Key Features Checklist

### User Management
- [ ] View all users
- [ ] Search users
- [ ] Filter by status
- [ ] Block a user
- [ ] Unblock a user
- [ ] View user statistics

### Book Monitoring
- [ ] View all books
- [ ] Search by title/author
- [ ] Filter by status
- [ ] Flag a book
- [ ] Unflag a book
- [ ] Remove a book

### Request Monitoring
- [ ] View all requests
- [ ] Filter by status
- [ ] View disputes
- [ ] Resolve dispute

### Analytics
- [ ] View most borrowed books
- [ ] View top contributors
- [ ] See borrowing trends
- [ ] Check genre distribution

---

## 💡 Tips

1. **Search is Live**: Type to see results in real-time
2. **Filters Work Together**: Combine search + filter
3. **Role Switcher**: Only visible for admin users
4. **All Changes Persist**: Actions save to localStorage
5. **Data Syncs**: Changes reflect instantly across all tabs

---

## ⚠️ Important

- This is a **frontend-only** demo
- Data stored in **localStorage** (for this session only)
- For production, implement:
  - Backend authentication
  - Database storage
  - Role verification on server
  - Audit logging

---

## 📚 Learn More

Read these files for details:

- **ADMIN_DASHBOARD.md** - Complete documentation
- **ADMIN_TEST_DATA.md** - Full test data with more users/books
- **IMPLEMENTATION_SUMMARY.md** - What was built and how

---

## ❓ Troubleshooting

### "Access Denied" message
- Ensure you're logged in as admin user
- Check `role: 'admin'` is set

### Can't find "Admin" link
- Only admin users see it
- Make sure you're logged in as admin

### Data disappeared
- localStorage was cleared
- Run the setup script again

### Components not showing
- Try refreshing the page
- Check browser console for errors

---

## 🎯 Next Steps

1. ✅ Run test data setup
2. ✅ Login as admin
3. ✅ Click through all tabs
4. ✅ Try all features
5. ✅ Read full documentation
6. ✅ Customize for your needs

---

## 📞 Need Help?

Check these files:
- Code comments in components
- ADMIN_DASHBOARD.md (full reference)
- ADMIN_TEST_DATA.md (testing guide)

Enjoy exploring the Admin Dashboard! 🚀
