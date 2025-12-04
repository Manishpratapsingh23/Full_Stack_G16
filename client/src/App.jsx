import { useState } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)

  // Simple admin access toggle for testing (replace with real auth in production)
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('adminMode') === 'true'

  if (showAdmin && isAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Book Swap & Lending Platform</h1>
      
      {isAdmin && (
        <button
          onClick={() => setShowAdmin(true)}
          className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Go to Admin Dashboard
        </button>
      )}
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
