import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './AppLayout.css'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Topbar />

      <div className="app-layout__body">
        <Sidebar />

        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
