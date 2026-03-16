import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { IoMenuOutline } from 'react-icons/io5'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 bg-dark-50 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-dark-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-dark-600 p-1"
          >
            <IoMenuOutline size={24} />
          </button>
          <span className="font-semibold text-dark-900">Dashboard</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
