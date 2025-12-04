import React from 'react'
import { useAdmin } from '../context/AdminContext'

// AdminRequestsTable: read-only view of borrow/swap requests
export default function AdminRequestsTable() {
  const { requests, books, users, getUserById } = useAdmin()

  const mapped = requests.map((r) => {
    const book = books.find((b) => b.id === r.bookId || b._id === r.bookId) || {}
    const requester = users.find((u) => u.id === r.requesterId || u._id === r.requesterId) || { name: r.requesterName }
    const owner = users.find((u) => u.id === r.ownerId || u._id === r.ownerId) || { name: r.ownerName }
    return {
      ...r,
      bookTitle: book.title || book.name || r.bookTitle || '—',
      requesterName: requester.name || requester.email || '—',
      ownerName: owner.name || owner.email || '—',
    }
  })

  return (
    <div className="bg-white/60 dark:bg-gray-800/70 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="px-3 py-2">Requester</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Book</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mapped.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-6 text-center text-gray-500">No requests</td>
              </tr>
            )}
            {mapped.map((r) => (
              <tr key={r.id || JSON.stringify(r)} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2">{r.requesterName}</td>
                <td className="px-3 py-2">{r.ownerName}</td>
                <td className="px-3 py-2">{r.bookTitle}</td>
                <td className="px-3 py-2">{r.status || 'pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
