import * as Sentry from '@sentry/react'
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
  response: Response
): Promise<ApiResponse<T>> => {
  const data = await response.json()

  if (!response.ok) {
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
    return handleApiResponse<T>(response)
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
