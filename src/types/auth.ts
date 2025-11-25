export interface LoginForm {
    email: string
    password: string
}

export interface RegisterForm {
    email: string
    password: string
    confirmPassword: string
}

export interface User {
    id: string
    email: string
    is_active: boolean
    created_at: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data: {
        user: User
        access_token: string
        token_type: string
    }
}

export interface ValidationError {
    loc: (string | number)[]
    msg: string
    type: string
}

export interface ApiError {
    detail: ValidationError[]
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    onboardingCompleted: boolean
}
