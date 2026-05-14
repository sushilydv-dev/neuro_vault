import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'

export default function RequireAuth({ children }) {
  const { status, refresh } = useAuth()
  const location = useLocation()

  useEffect(() => {
    refresh({ silent: true })
  }, [location.pathname, refresh])

  if (status === 'checking') {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-muted">Verifying session…</div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
