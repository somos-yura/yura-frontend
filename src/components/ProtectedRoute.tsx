import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import { LoadingSpinner } from "./ui/LoadingSpinner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
