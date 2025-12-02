import type React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
