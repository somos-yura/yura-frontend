export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    provider?: string
    latency_ms?: number
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
    estimated_cost_usd?: number
  }
}

export interface Conversation {
  conversation_id: string
  challenge_assignment_id: string
  user_id: string
  stakeholder_persona: string
  status: 'active' | 'archived' | 'completed'
  title?: string
  created_at: Date
  updated_at: Date
}
