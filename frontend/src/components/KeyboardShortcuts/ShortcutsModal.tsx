import { X } from 'lucide-react'
import './ShortcutsModal.css'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcutsList = [
  { key: 'D', description: 'Dashboard' },
  { key: 'M', description: 'Mines' },
  { key: 'E', description: 'Exploration' },
  { key: 'P', description: 'Production' },
  { key: 'R', description: 'Recommendations' },
  { key: 'W', description: 'What-If Simulator' },
  { key: 'C', description: 'Compare Mines' },
  { key: 'Q', description: 'Equipment Health' },
  { key: '?', description: 'Toggle this modal' },
]

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="shortcuts-modal__header">
          <div>
            <h3 className="shortcuts-modal__title">Keyboard Shortcuts</h3>
            <p className="shortcuts-modal__subtitle">Quick navigation hotkeys</p>
          </div>
          <button className="shortcuts-modal__close" onClick={onClose} aria-label="Close shortcuts modal">
            <X size={18} />
          </button>
        </div>

        <table className="shortcuts-modal__table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shortcutsList.map(item => (
              <tr key={item.key}>
                <td>
                  <kbd className="shortcut-key">{item.key}</kbd>
                </td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="shortcuts-modal__footer">
          Press <kbd className="shortcut-key">Esc</kbd> or <kbd className="shortcut-key">?</kbd> to close
        </div>
      </div>
    </div>
  )
}
