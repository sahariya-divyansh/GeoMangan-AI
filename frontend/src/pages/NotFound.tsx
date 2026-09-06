import { useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="notfound">
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">The page you are looking for does not exist or has been moved.</p>
      <button className="notfound-btn" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  )
}