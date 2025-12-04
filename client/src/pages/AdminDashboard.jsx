import React, { useState } from 'react'
import { AdminProvider, useAdmin } from '../context/AdminContext'
import AdminStatsCard from '../components/AdminStatsCard'
import AdminUserTable from '../components/AdminUserTable'
import AdminBooksTable from '../components/AdminBooksTable'
import AdminRequestsTable from '../components/AdminRequestsTable'

// Small Sidebar component
function Sidebar({ onBack }) {
  return (
    <aside className="w-64 bg-white/50 dark:bg-gray-900/60 p-4 rounded-lg shadow hidden md:block">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Admin</h2>
      <nav className="flex flex-col gap-2 text-sm">
        <a className="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" href="#analytics">Analytics</a>
        <a className="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" href="#users">Users</a>
        <a className="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" href="#books">Books</a>
        <a className="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" href="#requests">Requests</a>
        <hr className="my-2 border-gray-300 dark:border-gray-600" />
        <button onClick={onBack} className="px-2 py-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-left text-red-600 dark:text-red-400 font-medium">
          ← Back to Home
        </button>
      </nav>
    </aside>
  )
}

function DashboardContent() {
  const { stats } = useAdmin()

  return (
    <div className="flex-1">
      <section id="analytics" className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <AdminStatsCard title="Total Users" value={stats.totalUsers} />
          <AdminStatsCard title="Total Books" value={stats.totalBooks} />
          <AdminStatsCard title="Active Requests" value={stats.totalActiveRequests} />
          <AdminStatsCard title="Top Genre" value={stats.mostBorrowedGenre} note={`Top contributor: ${stats.mostContributingUser.name} (${stats.mostContributingUser.count})`} />
        </div>
      </section>

      <section id="users" className="mb-6">
        <AdminUserTable />
      </section>

      <section id="books" className="mb-6">
        <AdminBooksTable />
      </section>

      <section id="requests" className="mb-6">
        <AdminRequestsTable />
      </section>
    </div>
  )
}

// Inner component that uses AdminContext
function AdminDashboardInner({ onBack }) {
  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        <Sidebar onBack={onBack} />
        <DashboardContent />
      </div>
    </div>
  )
}

// Main page wrapped with AdminProvider to isolate admin logic
export default function AdminDashboardPage({ onBack }) {
  return (
    <AdminProvider>
      <AdminDashboardInner onBack={onBack} />
    </AdminProvider>
  )
}
