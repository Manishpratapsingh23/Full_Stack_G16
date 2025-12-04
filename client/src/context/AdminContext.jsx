import React, { createContext, useContext, useEffect, useState } from 'react'

// AdminContext: manages users, books, requests from localStorage
// Provides helper actions for admin UI (block/unblock user, delete book, etc.)

const AdminContext = createContext(null)

const readLS = (key) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : []
  } catch (e) {
    console.warn('Failed to read localStorage', key, e)
    return []
  }
}

const writeLS = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.warn('Failed to write localStorage', key, e)
  }
}

export const AdminProvider = ({ children }) => {
  // Keep local copies and mirror to localStorage when changed
  const [users, setUsers] = useState(() => readLS('users'))
  const [books, setBooks] = useState(() => readLS('books'))
  const [requests, setRequests] = useState(() => readLS('requests'))

  // Try to detect current admin from common storage keys (no AuthContext present)
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const possible = readLS('currentUser') || readLS('auth') || null
    return possible && typeof possible === 'object' ? possible : null
  })

  useEffect(() => writeLS('users', users), [users])
  useEffect(() => writeLS('books', books), [books])
  useEffect(() => writeLS('requests', requests), [requests])

  // Toggle block/unblock a user by id. Accepts either `id` or full user object.
  const toggleBlockUser = (userId) => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId || u._id === userId) {
          // support different shapes: `status` or `blocked` boolean
          if (u.status) {
            return { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' }
          }
          return { ...u, blocked: !u.blocked }
        }
        return u
      })
      return updated
    })
  }

  // Delete a book by id and remove related references (requests remain for audit)
  const deleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId && b._id !== bookId))
  }

  const getUserById = (id) => {
    return users.find((u) => u.id === id || u._id === id) || null
  }

  // Stats helpers
  const stats = {
    totalUsers: users.length,
    totalBooks: books.length,
    totalActiveRequests: requests.filter((r) => r.status && r.status !== 'returned' && r.status !== 'rejected').length,
    mostBorrowedGenre: (() => {
      // Try to compute from requests (bookId) else fallback to most common book.genre
      const genreCounts = {}
      if (requests.length && books.length) {
        requests.forEach((req) => {
          const book = books.find((b) => b.id === req.bookId || b._id === req.bookId)
          if (book) {
            const g = book.genre || 'Unknown'
            genreCounts[g] = (genreCounts[g] || 0) + 1
          }
        })
      }
      if (Object.keys(genreCounts).length === 0) {
        books.forEach((b) => {
          const g = b.genre || 'Unknown'
          genreCounts[g] = (genreCounts[g] || 0) + 1
        })
      }
      const sorted = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
      return sorted[0] ? sorted[0][0] : '—'
    })(),
    mostContributingUser: (() => {
      const counts = {}
      books.forEach((b) => {
        const ownerId = b.ownerId || b.userId || b.owner || b.owner_id
        if (!ownerId) return
        counts[ownerId] = (counts[ownerId] || 0) + 1
      })
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
      if (!sorted[0]) return { name: '—', count: 0 }
      const user = getUserById(sorted[0][0])
      return { name: user ? user.name || user.fullname || user.email : sorted[0][0], count: sorted[0][1] }
    })(),
  }

  // Expose API
  const value = {
    users,
    setUsers,
    books,
    setBooks,
    requests,
    setRequests,
    currentAdmin,
    toggleBlockUser,
    deleteBook,
    getUserById,
    stats,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return ctx
}

export default AdminContext
