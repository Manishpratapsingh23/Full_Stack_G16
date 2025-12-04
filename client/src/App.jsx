import { useState, useEffect } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

// Initialize demo data on first run
function initializeDemoData() {
  if (!localStorage.getItem('_demoInit')) {
    localStorage.setItem('users', JSON.stringify([
      { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
      { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', status: 'active' },
      { id: 'u3', name: 'Carol White', email: 'carol@example.com', status: 'blocked' },
      { id: 'u4', name: 'David Brown', email: 'david@example.com', status: 'active' }
    ]))

    localStorage.setItem('books', JSON.stringify([
      { id: 'b1', title: '1984', author: 'George Orwell', ownerId: 'u1', status: 'available', genre: 'Dystopian Fiction' },
      { id: 'b2', title: 'Sapiens', author: 'Yuval Noah Harari', ownerId: 'u2', status: 'lent', genre: 'History' },
      { id: 'b3', title: 'To Kill a Mockingbird', author: 'Harper Lee', ownerId: 'u1', status: 'available', genre: 'Classic' },
      { id: 'b4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', ownerId: 'u2', status: 'swap', genre: 'Classic' },
      { id: 'b5', title: 'Atomic Habits', author: 'James Clear', ownerId: 'u3', status: 'available', genre: 'Self-Help' },
      { id: 'b6', title: 'Dune', author: 'Frank Herbert', ownerId: 'u4', status: 'lent', genre: 'Science Fiction' }
    ]))

    localStorage.setItem('requests', JSON.stringify([
      { id: 'r1', requesterId: 'u2', ownerId: 'u1', bookId: 'b1', status: 'pending' },
      { id: 'r2', requesterId: 'u4', ownerId: 'u2', bookId: 'b2', status: 'approved' },
      { id: 'r3', requesterId: 'u1', ownerId: 'u3', bookId: 'b5', status: 'rejected' },
      { id: 'r4', requesterId: 'u3', ownerId: 'u4', bookId: 'b6', status: 'returned' }
    ]))

    localStorage.setItem('isAdmin', 'true')
    localStorage.setItem('_demoInit', 'true')
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    initializeDemoData()
  }, [])

  // Simple admin access toggle for testing (replace with real auth in production)
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (showAdmin && isAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">📚 Book Swap & Lending Platform</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Manage your book collection, requests, and community</p>
        
        {isAdmin && (
          <button
            onClick={() => setShowAdmin(true)}
            className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
          >
            → Go to Admin Dashboard
          </button>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">Welcome</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the demo home page. Click the button above to access the full Admin Dashboard with sample data pre-loaded in localStorage.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
              Sample data includes 4 users, 6 books, and 4 requests (all stored in localStorage)
            </p>
          </div>
          <button 
            onClick={() => setCount((count) => count + 1)} 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition"
          >
            Counter: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
