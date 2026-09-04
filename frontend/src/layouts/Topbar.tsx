import './Topbar.css'

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__identity">
        <h1 className="topbar__title">GeoMangan-AI</h1>
        <p className="topbar__subtitle">Reserve Intelligence Platform</p>
      </div>

      <div className="topbar__status" aria-label="System Status: Operational">
        <span className="topbar__status-dot" aria-hidden="true" />
        <span>System Status: Operational</span>
      </div>
    </header>
  )
}
