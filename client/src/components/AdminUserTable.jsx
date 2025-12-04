import React, { useMemo, useState } from 'react'
import { useAdmin } from '../context/AdminContext'

// AdminUserTable: lists users with controls to block/unblock
export default function AdminUserTable() {
  const { users, books, toggleBlockUser } = useAdmin()
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users
      .map((u) => {
        const id = u.id || u._id || u.email
        const totalBooks = books.filter((b) => {
          const ownerId = b.ownerId || b.userId || b.owner || b.owner_id
          return ownerId === id || b.ownerName === u.name || b.ownerName === u.fullname
        }).length
        return { ...u, totalBooks }
      })
      .filter((u) => (q ? (u.name || u.email || '').toLowerCase().includes(q) : true))
  }, [users, books, query])

  return (
    <div className="bg-white/60 dark:bg-gray-800/70 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Users</h3>
        <input
          className="border rounded px-2 py-1 text-sm bg-white/80 dark:bg-gray-700/60"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Total Books</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-gray-500">No users found</td>
              </tr>
            )}
            {rows.map((u) => (
              <tr key={u.id || u._id || u.email} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2">{u.name || u.fullname || '—'}</td>
                <td className="px-3 py-2">{u.email || '—'}</td>
                <td className="px-3 py-2">{u.totalBooks}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.status === 'blocked' || u.blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {u.status === 'blocked' || u.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleBlockUser(u.id || u._id || u.email)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                  >
                    {u.status === 'blocked' || u.blocked ? 'Unblock' : 'Block'}
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
