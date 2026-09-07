import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Mines from './pages/Mines'
import MineDetail from './pages/MineDetail'
import Exploration from './pages/Exploration'
import Equipment from './pages/Equipment'
import Production from './pages/Production'
import Recommendations from './pages/Recommendations'
import WhatIf from './pages/WhatIf'
import MineComparison from './pages/MineComparison'
import NotFound from './pages/NotFound'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import ShortcutsModal from './components/KeyboardShortcuts/ShortcutsModal'

export default function App() {
  const { isModalOpen, closeModal } = useKeyboardShortcuts()

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"       element={<Dashboard />} />
          <Route path="mines"           element={<Mines />} />
          <Route path="mines/:id"       element={<MineDetail />} />
          <Route path="exploration"     element={<Exploration />} />
          <Route path="equipment"       element={<Equipment />} />
          <Route path="production"      element={<Production />} />
          <Route path="recommendations"  element={<Recommendations />} />
          <Route path="whatif"          element={<WhatIf />} />
          <Route path="compare"         element={<MineComparison />} />
          <Route path="*"               element={<NotFound />} />
        </Route>
      </Routes>
      <ShortcutsModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}