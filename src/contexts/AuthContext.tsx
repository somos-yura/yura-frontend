import type React from 'react'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { LoginForm, RegisterForm, AuthResponse, User } from '../types/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  onboardingCompleted: boolean
  loading: boolean
  error: string | null
  success: string | null
  login: (credentials: LoginForm) => Promise<AuthResponse | undefined>
  register: (userData: RegisterForm) => Promise<AuthResponse | undefined>
  logout: () => Promise<void>
  markOnboardingComplete: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
