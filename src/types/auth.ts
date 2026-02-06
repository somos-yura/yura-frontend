export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  name: string
  last_name: string
  password: string
  confirmPassword: string
}

export interface User {
  id: string
  email: string
  name?: string
  last_name?: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
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
  isAuthenticated: boolean
  onboardingCompleted: boolean
}
