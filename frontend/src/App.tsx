import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Mines from './pages/Mines'
import Exploration from './pages/Exploration'
import Production from './pages/Production'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"   element={<Dashboard />} />
        <Route path="mines"       element={<Mines />} />
        <Route path="exploration" element={<Exploration />} />
        <Route path="production" element={<Production />} />
      </Route>
    </Routes>
  )
}