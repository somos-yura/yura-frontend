import * as Sentry from '@sentry/react'
import { getApiUrl } from '../config/api'
import { ENDPOINTS } from '../config/endpoints'

// Refresh token state
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(null)
    }
  })
  failedQueue = []
}

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
  _retry?: boolean // Internal flag to prevent infinite retry loops
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  translation?: string
  data: T
}

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const handleApiResponse = async <T>(
  response: Response,
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const data = await response.json()

  if (!response.ok) {
    // Handle 401 Unauthorized - attempt token refresh
    if (
      response.status === 401 &&
      endpoint !== ENDPOINTS.USERS.LOGIN &&
      endpoint !== ENDPOINTS.USERS.REFRESH &&
      !config._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            // Retry the original request after refresh completes
            return makeRequest<T>(endpoint, config.method || 'GET', {
              ...config,
              _retry: true,
            })
          })
          .catch((err) => {
            throw err
          })
      }

      // Start refresh process
      isRefreshing = true
      config._retry = true

      try {
        // Call refresh endpoint - this will set new access token cookie
        await fetch(getApiUrl(ENDPOINTS.USERS.REFRESH), {
          method: 'POST',
          credentials: 'include',
          headers: DEFAULT_HEADERS,
        })

        processQueue(null) // Resolve all queued requests
        isRefreshing = false

        // Retry the original request
        return makeRequest<T>(endpoint, config.method || 'GET', config)
      } catch (refreshError) {
        processQueue(refreshError) // Reject all queued requests
        isRefreshing = false

        // Refresh failed - redirect to login
        window.location.href = '/login'
        throw new ApiError('Session expired. Please login again.', 401)
      }
    }

    // For non-401 errors or if refresh already attempted
    if (response.status === 401 && endpoint !== ENDPOINTS.USERS.LOGIN) {
      window.location.href = '/login'
    }

    const errorMessage =
      data.translation || data.message || data.detail || 'Error en la petición'
    throw new ApiError(errorMessage, response.status, data)
  }

  if (data.success === true) {
    return data
  }

  throw new ApiError(
    'Error en la respuesta del servidor',
    response.status,
    data
  )
}

const handleApiError = (error: unknown): never => {
  Sentry.captureException(error)
  if (error instanceof ApiError) {
    throw error
  }
  throw new ApiError('Error de conexión', 0, error)
}

const createFetchConfig = (
  method: string,
  config: RequestConfig,
  body?: unknown
): RequestInit => {
  const headers = { ...DEFAULT_HEADERS }

  return {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    ...config,
  }
}

const makeRequest = async <T>(
  endpoint: string,
  method: string,
  config: RequestConfig = {},
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const fetchConfig = createFetchConfig(method, config, body)
    const response = await fetch(getApiUrl(endpoint), fetchConfig)
    return handleApiResponse<T>(response, endpoint, config)
  } catch (error) {
    return handleApiError(error)
  }
}

export const apiClient = {
  async get<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, 'GET', config)
  },

  async post<T>(
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, 'POST', config, body)
  },

  async put<T>(
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, 'PUT', config, body)
  },

  async delete<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, 'DELETE', config)
  },

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, 'PATCH', config, body)
  },
}
