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

const AUTH_STORAGE_KEY = 'miniworker_auth'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    onboardingCompleted: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const checkOnboardingStatus = async (token: string) => {
    try {
      const summary = await studentsApi.getProfileSummary(token)
      return summary.onboarding_completed
    } catch (error: unknown) {
      // If 401, token is invalid/expired, throw error to trigger logout in initAuth
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: number }).status === 401
      ) {
        throw error
      }
      // If 404, profile doesn't exist, so onboarding is not completed
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: number }).status === 404
      ) {
        return false
      }
      // For other errors, we might want to log them but default to false to be safe
      Sentry.captureException(error)
      console.error('Error checking onboarding status:', error)
      return false
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      if (savedAuth) {
        try {
          const { user, token } = JSON.parse(savedAuth)
          // Verify token validity by checking onboarding status (doubles as auth check)
          const onboardingCompleted = await checkOnboardingStatus(token)
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            onboardingCompleted,
          })
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY)
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

  const saveAuth = (
    user: User,
    token: string,
    onboardingCompleted: boolean
  ) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }))
    setAuthState({ user, token, isAuthenticated: true, onboardingCompleted })
  }

  const clearAuth = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthState({
      user: null,
      token: null,
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

      const token = response.data.access_token
      let onboardingCompleted = false

      if (isLogin) {
        onboardingCompleted = await checkOnboardingStatus(token)
      }

      saveAuth(response.data.user, token, onboardingCompleted)
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

  const logout = () => {
    clearAuth()
    setError(null)
    setSuccess(null)
  }

  const markOnboardingComplete = () => {
    if (authState.user && authState.token) {
      saveAuth(authState.user, authState.token, true)
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
