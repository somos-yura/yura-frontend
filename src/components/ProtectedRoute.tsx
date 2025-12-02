import type React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, onboardingCompleted } = useAuthContext()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If user is authenticated but hasn't completed onboarding, redirect to onboarding page
  // unless they are already there
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // If user has completed onboarding and tries to access onboarding page, redirect to dashboard
  if (onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
