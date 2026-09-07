import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (isInputFocused) {
        return
      }

      if (event.key === '?') {
        event.preventDefault()
        setIsModalOpen(prev => !prev)
        return
      }

      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
        return
      }

      if (isModalOpen) return

      const key = event.key.toLowerCase()

      switch (key) {
        case 'd':
          navigate('/dashboard')
          break
        case 'm':
          navigate('/mines')
          break
        case 'e':
          navigate('/exploration')
          break
        case 'p':
          navigate('/production')
          break
        case 'r':
          navigate('/recommendations')
          break
        case 'w':
          navigate('/whatif')
          break
        case 'c':
          navigate('/compare')
          break
        case 'q':
          navigate('/equipment')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, isModalOpen])

  return {
    isModalOpen,
    showShortcuts: isModalOpen,
    setShowShortcuts: setIsModalOpen,
    closeModal: () => setIsModalOpen(false),
  }
}
