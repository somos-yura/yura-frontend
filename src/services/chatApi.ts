import { apiClient, ApiError } from '../lib/apiClient'

export class ChatApiError extends ApiError {
  constructor(message: string, status: number, details?: unknown) {
    super(message, status, details)
    this.name = 'ChatApiError'
  }
}

export interface ChatRequest {
  challenge_assignment_id: string
  message: string
  session_id: string
}

export interface ChatResponse {
  ai_response: string
  conversation_id: string
  metadata: {
    model: string
    provider: string
    latency_ms: number
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    estimated_cost_usd: number
  }
}

export interface ChatApiResponse {
  success: boolean
  message?: string
  data: ChatResponse
}

export interface MessageItem {
  message_id: string
  role: string
  content: string
  timestamp: string
}

export interface MessageHistoryResponse {
  conversation_id: string
  messages: MessageItem[]
  has_more: boolean
}

export interface MessageHistoryApiResponse {
  success: boolean
  message?: string
  data: MessageHistoryResponse
}

export const chatApi = {
  async sendMessage(
    request: ChatRequest,
    token: string
  ): Promise<ChatApiResponse> {
    try {
      const endpoint = '/api/v1/ai/chat/send-message'
      return (await apiClient.post<ChatResponse>(endpoint, request, {
        requireAuth: true,
        token,
      })) as ChatApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al enviar el mensaje', 500, error)
    }
  },

  async getMessages(
    challengeAssignmentId: string,
    sessionId: string,
    token: string,
    limit?: number,
    before?: string
  ): Promise<MessageHistoryApiResponse> {
    try {
      const params = new URLSearchParams({
        challenge_assignment_id: challengeAssignmentId,
        session_id: sessionId,
      })

      if (limit !== undefined) {
        params.append('limit', limit.toString())
      }

      if (before) {
        params.append('before', before)
      }

      const endpoint = `/api/v1/ai/chat/messages?${params.toString()}`
      return (await apiClient.get<MessageHistoryResponse>(endpoint, {
        requireAuth: true,
        token,
      })) as MessageHistoryApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al obtener los mensajes', 500, error)
    }
  },
}
