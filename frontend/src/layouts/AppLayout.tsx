import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './AppLayout.css'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(prev => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-layout">
      <Topbar onMenuClick={toggleSidebar} />

      <div className="app-layout__body">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />
        )}

        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
