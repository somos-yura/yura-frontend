import { getApiUrl } from '../config/api'
import type { LoginForm, RegisterForm, AuthResponse } from '../types/auth'

class ApiError extends Error {
    status: number
    details?: any

    constructor(message: string, status: number, details?: any) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

const handleResponse = async (response: Response): Promise<AuthResponse> => {
    const data = await response.json()
    
    if (data.success === true) {
        return data
    }
    
    if (data.translation) {
        throw new ApiError(data.translation, response.status, data)
    }
    
    if (data.message) {
        throw new ApiError(data.message, response.status, data)
    }
    
    throw new ApiError('Error', response.status, data)
}


export const authApi = {
    async login(credentials: LoginForm): Promise<AuthResponse> {
        try {
            const response = await fetch(getApiUrl('/api/v1/users/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            })
            
            return handleResponse(response)
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            
            
            throw new ApiError('Usuario no encontrado', 404)
        }
    },

    async register(userData: RegisterForm): Promise<AuthResponse> {
        try {
            const response = await fetch(getApiUrl('/api/v1/users/register'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password
                })
            })
            
            return handleResponse(response)
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            
            throw new ApiError('El usuario ya existe', 409)
        }
    }
}

export { ApiError }
