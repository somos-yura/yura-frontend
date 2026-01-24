import { apiClient, ApiError } from '../lib/apiClient'
import { ENDPOINTS } from '../config/endpoints'
import type { LoginForm, RegisterForm, AuthResponse } from '../types/auth'

export const authApi = {
  async login(credentials: LoginForm): Promise<AuthResponse> {
    try {
      return (await apiClient.post<AuthResponse['data']>(
        ENDPOINTS.USERS.LOGIN,
        {
          email: credentials.email,
          password: credentials.password,
        }
      )) as AuthResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error al iniciar sesión', 500, error)
    }
  },

  async register(userData: RegisterForm): Promise<AuthResponse> {
    try {
      return (await apiClient.post<AuthResponse['data']>(
        ENDPOINTS.USERS.REGISTER,
        {
          email: userData.email,
          password: userData.password,
        }
      )) as AuthResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error al registrar usuario', 500, error)
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.USERS.LOGOUT, {}, { requireAuth: true })
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error al cerrar sesión', 500, error)
    }
  },
}

export { ApiError }
