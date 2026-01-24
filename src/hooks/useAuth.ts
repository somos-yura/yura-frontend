import * as Sentry from '@sentry/react'
import { useState, useEffect } from 'react'
import { authApi, ApiError } from '../services/authApi'
import { studentsApi } from '../services/studentsApi'
import {
  validateEmail,
  validatePassword,
  validatePasswordRegister,
  validatePasswordMatch,
} from '../utils/validation'
import type { LoginForm, RegisterForm, AuthState, User } from '../types/auth'

const AUTH_STORAGE_KEY = 'miniworker_user'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    onboardingCompleted: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const checkOnboardingStatus = async () => {
    try {
      const summary = await studentsApi.getProfileSummary()
      return summary.onboarding_completed
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: number }).status === 401
      ) {
        throw error
      }
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: number }).status === 404
      ) {
        return false
      }
      Sentry.captureException(error)
      console.error('Error checking onboarding status:', error)
      return false
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          const onboardingCompleted = await checkOnboardingStatus()
          setAuthState({
            user,
            isAuthenticated: true,
            onboardingCompleted,
          })
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY)
          setAuthState({
            user: null,
            isAuthenticated: false,
            onboardingCompleted: false,
          })
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const validateForm = (form: LoginForm | RegisterForm): string | null => {
    const emailError = validateEmail(form.email)
    if (emailError) return emailError

    if (!('confirmPassword' in form)) {
      const passwordError = validatePassword(form.password)
      if (passwordError) return passwordError
      return null
    }

    const passwordError = validatePasswordRegister(form.password)
    if (passwordError) return passwordError

    const confirmError = validatePasswordMatch(
      form.password,
      form.confirmPassword
    )
    if (confirmError) return confirmError

    return null
  }

  const saveAuth = (user: User, onboardingCompleted: boolean) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    setAuthState({
      user,
      isAuthenticated: true,
      onboardingCompleted,
    })
  }

  const clearAuth = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthState({
      user: null,
      isAuthenticated: false,
      onboardingCompleted: false,
    })
  }

  const handleAuth = async (
    form: LoginForm | RegisterForm,
    isLogin: boolean
  ) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const validationError = validateForm(form)
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const response = isLogin
        ? await authApi.login(form as LoginForm)
        : await authApi.register(form as RegisterForm)

      let onboardingCompleted = false

      if (isLogin) {
        onboardingCompleted = await checkOnboardingStatus()
      }

      saveAuth(response.data.user, onboardingCompleted)
      setSuccess(
        isLogin ? '¡Inicio de sesión exitoso!' : '¡Cuenta creada exitosamente!'
      )
      return response
    } catch (err) {
      Sentry.captureException(err)
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : `Error inesperado durante ${isLogin ? 'el login' : 'el registro'}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = (credentials: LoginForm) => handleAuth(credentials, true)
  const register = (userData: RegisterForm) => handleAuth(userData, false)

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      Sentry.captureException(error)
    } finally {
      clearAuth()
      setError(null)
      setSuccess(null)
    }
  }

  const markOnboardingComplete = () => {
    if (authState.user) {
      saveAuth(authState.user, true)
    }
  }

  return {
    ...authState,
    loading,
    error,
    success,
    login,
    register,
    logout,
    markOnboardingComplete,
    clearError: () => setError(null),
  }
}
