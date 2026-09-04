import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Factory,
  Map,
  Lightbulb,
  SlidersHorizontal,
  LayoutDashboard,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard',        path: '/dashboard',       icon: LayoutDashboard },
  { name: 'Mines',            path: '/mines',            icon: Factory },
  { name: 'Exploration',      path: '/exploration',      icon: Map },
  { name: 'Production',       path: '/production',       icon: BarChart3 },
  { name: 'Recommendations',  path: '/recommendations',  icon: Lightbulb },
  { name: 'What-if Simulator',path: '/whatif',           icon: SlidersHorizontal },
]

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-xl font-semibold tracking-tight">GeoMangan-AI</h1>
        <p className="mt-1 text-xs text-slate-400">Mining Intelligence Platform</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-800 px-6 py-4">
        <p className="text-xs text-slate-500">Decision Support System</p>
        <p className="text-xs text-yellow-600 mt-1">Synthetic data mode</p>
      </div>
    </aside>
  )
}