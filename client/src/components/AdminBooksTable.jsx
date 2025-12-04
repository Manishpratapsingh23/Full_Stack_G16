import React, { useMemo, useState } from 'react'
import { useAdmin } from '../context/AdminContext'

// AdminBooksTable: shows all books, allows delete and filtering by owner
export default function AdminBooksTable() {
  const { books, users, deleteBook, getUserById } = useAdmin()
  const [selectedUser, setSelectedUser] = useState('all')
  const [query, setQuery] = useState('')

  const userOptions = useMemo(() => [{ id: 'all', label: 'All Users' }, ...users.map((u) => ({ id: u.id || u._id || u.email, label: u.name || u.fullname || u.email }))], [users])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books
      .map((b) => {
        const ownerId = b.ownerId || b.userId || b.owner || b.owner_id
        const owner = ownerId ? getUserById(ownerId) : null
        const ownerName = owner ? owner.name || owner.fullname || owner.email : b.ownerName || b.owner || '—'
        return { ...b, ownerName }
      })
      .filter((b) => (selectedUser === 'all' ? true : (b.ownerId || b.userId || b.owner || b.owner_id) === selectedUser || (b.ownerName === selectedUser)))
      .filter((b) => (q ? (b.title || b.name || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q) : true))
  }, [books, selectedUser, query, getUserById])

  return (
    <div className="bg-white/60 dark:bg-gray-800/70 rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Books</h3>
        <div className="flex items-center gap-2">
          <select className="px-2 py-1 rounded bg-white/80 dark:bg-gray-700/60" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {userOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <input
            className="border rounded px-2 py-1 text-sm bg-white/80 dark:bg-gray-700/60"
            placeholder="Search title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-gray-500">No books found</td>
              </tr>
            )}
            {rows.map((b) => (
              <tr key={b.id || b._id || (b.title + Math.random())} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2">{b.title || b.name || '—'}</td>
                <td className="px-3 py-2">{b.author || b.authors || '—'}</td>
                <td className="px-3 py-2">{b.ownerName}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${b.status === 'lent' ? 'bg-yellow-100 text-yellow-800' : b.status === 'swap' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {b.status || 'available'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this book? This action cannot be undone.')) deleteBook(b.id || b._id)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
