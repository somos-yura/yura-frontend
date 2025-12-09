import { getApiUrl } from '../config/api'

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

interface RequestConfig extends RequestInit {
  requireAuth?: boolean
  token?: string
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  translation?: string
  data: T
}

const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const data = await response.json()

    if (!response.ok) {
        const errorMessage = data.translation || data.message || data.detail || 'Error en la petición'
        throw new ApiError(errorMessage, response.status, data)
    }

    if (data.success === true) {
        return data
    }

    throw new ApiError('Error en la respuesta del servidor', response.status, data)
}

export const apiClient = {
  async get<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { requireAuth = false, token, ...fetchConfig } = config
      const headers =
        requireAuth && token ? getAuthHeaders(token) : getAuthHeaders()

      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers,
        ...fetchConfig,
      })

      return handleApiResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error de conexión', 0, error)
    }
  },

  async post<T>(
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { requireAuth = false, token, ...fetchConfig } = config
      const headers =
        requireAuth && token ? getAuthHeaders(token) : getAuthHeaders()

      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...fetchConfig,
      })

      return handleApiResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error de conexión', 0, error)
    }
  },

  async put<T>(
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { requireAuth = false, token, ...fetchConfig } = config
      const headers =
        requireAuth && token ? getAuthHeaders(token) : getAuthHeaders()

      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...fetchConfig,
      })

      return handleApiResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error de conexión', 0, error)
    }
  },

  async delete<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { requireAuth = false, token, ...fetchConfig } = config
      const headers =
        requireAuth && token ? getAuthHeaders(token) : getAuthHeaders()

      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers,
        ...fetchConfig,
      })

      return handleApiResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error de conexión', 0, error)
    }
  },
}
