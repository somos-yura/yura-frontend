import { useState, useEffect } from 'react'
import { authApi, ApiError } from '../services/authApi'
import { validateEmail, validatePassword, validatePasswordRegister, validatePasswordMatch } from '../utils/validation'
import type { LoginForm, RegisterForm, AuthState, User } from '../types/auth'

const AUTH_STORAGE_KEY = 'miniworker_auth'

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
        if (savedAuth) {
            try {
                const { user, token } = JSON.parse(savedAuth)
                setAuthState({ user, token, isAuthenticated: true })
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY)
            }
        }
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

        const confirmError = validatePasswordMatch(form.password, form.confirmPassword)
        if (confirmError) return confirmError

        return null
    }

    const saveAuth = (user: User, token: string) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }))
        setAuthState({ user, token, isAuthenticated: true })
    }

    const clearAuth = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setAuthState({ user: null, token: null, isAuthenticated: false })
    }

    const handleAuth = async (form: LoginForm | RegisterForm, isLogin: boolean) => {
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

            saveAuth(response.data.user, response.data.access_token)
            setSuccess(isLogin ? "¡Inicio de sesión exitoso!" : "¡Cuenta creada exitosamente!")
            return response
        } catch (err) {
            const errorMessage = err instanceof ApiError
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

    return {
        ...authState,
        loading,
        error,
        success,
        login,
        register,
        logout,
        clearError: () => setError(null)
    }
}
