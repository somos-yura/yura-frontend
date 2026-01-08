import { apiClient, ApiError } from '../lib/apiClient'
import { ENDPOINTS } from '../config/endpoints'

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

export interface Diagram {
  id: string
  code: string
  description: string
  created_at: string
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
  diagrams?: Diagram[]
  current_agent?: string
  google_calendar_linked?: boolean
  needs_google_auth?: boolean
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

export interface Milestone {
  id: string
  title: string
  description: string
  due_date: string
  status: string
  google_calendar_event_id?: string
}

export interface MilestonesApiResponse {
  success: boolean
  message?: string
  data: {
    milestones: Milestone[]
  }
}

export interface DiagramsApiResponse {
  success: boolean
  message?: string
  data: {
    diagrams: Diagram[]
  }
}

export interface GoogleAuthResponse {
  success: boolean
}

export interface GoogleAuthApiResponse {
  success: boolean
  message?: string
  data: GoogleAuthResponse
}

export interface ConversationStatus {
  google_calendar_linked: boolean
  current_agent?: string
}

export interface ConversationStatusApiResponse {
  success: boolean
  message?: string
  data: ConversationStatus
}

export interface SyncMilestonesResponse {
  success: boolean
  synced_count?: number
}

export interface SyncMilestonesApiResponse {
  success: boolean
  message?: string
  data: SyncMilestonesResponse
}

export const chatApi = {
  async sendMessage(
    request: ChatRequest,
    token: string
  ): Promise<ChatApiResponse> {
    try {
      const endpoint = ENDPOINTS.AI.CHAT.SEND_MESSAGE
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

      const endpoint = `${ENDPOINTS.AI.CHAT.MESSAGES}?${params.toString()}`
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

  async getDiagrams(
    challengeAssignmentId: string,
    token: string
  ): Promise<DiagramsApiResponse> {
    try {
      const endpoint = `${ENDPOINTS.AI.CHAT.DIAGRAMS}/${challengeAssignmentId}`
      return (await apiClient.get<{ diagrams: Diagram[] }>(endpoint, {
        requireAuth: true,
        token,
      })) as DiagramsApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al obtener los diagramas', 500, error)
    }
  },

  async getMilestones(
    challengeAssignmentId: string,
    token: string
  ): Promise<MilestonesApiResponse> {
    try {
      const endpoint = `${ENDPOINTS.AI.CHAT.MILESTONES}/${challengeAssignmentId}`
      return (await apiClient.get<{ milestones: Milestone[] }>(endpoint, {
        requireAuth: true,
        token,
      })) as MilestonesApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al obtener los hitos', 500, error)
    }
  },

  async saveGoogleAuthCode(
    code: string,
    token: string
  ): Promise<GoogleAuthApiResponse> {
    try {
      const endpoint = ENDPOINTS.USERS.GOOGLE_AUTH
      return (await apiClient.post<GoogleAuthResponse>(
        endpoint,
        { code },
        { requireAuth: true, token }
      )) as GoogleAuthApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al vincular con Google', 500, error)
    }
  },

  async getStatus(
    challengeAssignmentId: string,
    sessionId: string,
    token: string
  ): Promise<ConversationStatusApiResponse> {
    try {
      const endpoint = `${ENDPOINTS.AI.CHAT.STATUS}/${challengeAssignmentId}?session_id=${sessionId}`
      return (await apiClient.get<ConversationStatus>(endpoint, {
        requireAuth: true,
        token,
      })) as ConversationStatusApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al obtener el estado', 500, error)
    }
  },

  async syncMilestones(
    challengeAssignmentId: string,
    token: string
  ): Promise<SyncMilestonesApiResponse> {
    try {
      const endpoint = `${ENDPOINTS.AI.CHAT.SYNC_MILESTONES}/${challengeAssignmentId}`
      return (await apiClient.post<SyncMilestonesResponse>(
        endpoint,
        {},
        { requireAuth: true, token }
      )) as SyncMilestonesApiResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ChatApiError(error.message, error.status, error.details)
      }
      throw new ChatApiError('Error al sincronizar hitos', 500, error)
    }
  },
}
