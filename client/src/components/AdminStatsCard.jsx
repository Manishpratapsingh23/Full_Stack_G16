import React from 'react'

// Simple stat card used in Admin Dashboard
export default function AdminStatsCard({ title, value, note }) {
  return (
    <div className="bg-white/60 dark:bg-gray-800/70 shadow rounded-lg p-4 flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
      {note && <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{note}</p>}
    </div>
  )
}
