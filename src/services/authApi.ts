import { apiClient, ApiError } from '../lib/apiClient'
import { config } from '../config/api'
import type { LoginForm, RegisterForm, AuthResponse } from '../types/auth'

export const authApi = {
    async login(credentials: LoginForm): Promise<AuthResponse> {
        try {
            return await apiClient.post<AuthResponse['data']>(
                config.API_ENDPOINTS.LOGIN,
                {
                    email: credentials.email,
                    password: credentials.password
                }
            ) as AuthResponse
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('Error al iniciar sesión', 500, error)
        }
    },

    async register(userData: RegisterForm): Promise<AuthResponse> {
        try {
            return await apiClient.post<AuthResponse['data']>(
                config.API_ENDPOINTS.REGISTER,
                {
                    email: userData.email,
                    password: userData.password
                }
            ) as AuthResponse
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('Error al registrar usuario', 500, error)
        }
    }
}

export { ApiError }
