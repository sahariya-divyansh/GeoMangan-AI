import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Mines from './pages/Mines'
import MineDetail from './pages/MineDetail'
import Exploration from './pages/Exploration'
import Production from './pages/Production'
import Recommendations from './pages/Recommendations'
import WhatIf from './pages/WhatIf'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"   element={<Dashboard />} />
        <Route path="mines"       element={<Mines />} />
        <Route path="mines/:id"   element={<MineDetail />} />
        <Route path="exploration" element={<Exploration />} />
        <Route path="production" element={<Production />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="whatif" element={<WhatIf />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}