import { useState, useCallback, useEffect, useRef } from 'react'
import { chatApi, ChatApiError } from '../services/chatApi'
import type { Message } from '../types/chat'

interface UseChatOptions {
  challengeAssignmentId: string | null
  sessionId: string
  token: string | null
  onError?: (error: string) => void
}

const INITIAL_MESSAGE_LIMIT = 5
const MESSAGES_PER_LOAD = 5

export const useChat = (options: UseChatOptions) => {
  const { challengeAssignmentId, sessionId, token, onError } = options
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [displayedMessageCount, setDisplayedMessageCount] = useState(
    INITIAL_MESSAGE_LIMIT
  )
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const hasLoadedHistory = useRef(false)

  // Show only the last displayedMessageCount messages
  const messages =
    allMessages.length > displayedMessageCount
      ? allMessages.slice(-displayedMessageCount)
      : allMessages

  const hasMoreMessages = allMessages.length > displayedMessageCount

  const createUserMessage = useCallback(
    (content: string): Message => ({
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }),
    []
  )

  const createAIMessage = useCallback(
    (content: string, metadata?: Message['metadata']): Message => ({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      metadata,
    }),
    []
  )

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !challengeAssignmentId || !token || isTyping)
      return

    const userMessage = createUserMessage(inputValue)
    const messageContent = inputValue.trim()
    setAllMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await chatApi.sendMessage(
        {
          challenge_assignment_id: challengeAssignmentId,
          message: messageContent,
          session_id: sessionId,
        },
        token
      )

      console.log('Chat API Response:', response)

      if (!response.data) {
        throw new Error('Invalid response format: missing data')
      }

      const aiMessage = createAIMessage(
        response.data.ai_response,
        response.data.metadata
      )

      console.log('Created AI Message:', aiMessage)
      setAllMessages((prev) => [...prev, aiMessage])
      setConversationId(response.data.conversation_id)
      // After sending a new message, show all messages (increment display count)
      setDisplayedMessageCount((prev) => prev + 2) // User message + AI response
    } catch (error) {
      // Remove the user message on error
      setAllMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))

      const errorMessage =
        error instanceof ChatApiError
          ? error.message
          : 'Error al enviar el mensaje. Por favor, intenta de nuevo.'

      if (onError) {
        onError(errorMessage)
      } else {
        console.error('Chat error:', error)
      }
    } finally {
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }, [
    inputValue,
    challengeAssignmentId,
    sessionId,
    token,
    isTyping,
    createUserMessage,
    createAIMessage,
    onError,
  ])

  const handleSuggestedPrompt = useCallback((prompt: string) => {
    setInputValue(prompt)
  }, [])

  const loadMoreMessages = useCallback(() => {
    if (!hasMoreMessages) {
      return
    }
    // Simply show more messages from what we already have loaded
    setDisplayedMessageCount((prev) =>
      Math.min(prev + MESSAGES_PER_LOAD, allMessages.length)
    )
  }, [hasMoreMessages, allMessages.length])

  // Load message history when challenge assignment is available
  useEffect(() => {
    const loadMessageHistory = async () => {
      if (
        !challengeAssignmentId ||
        !sessionId ||
        !token ||
        hasLoadedHistory.current
      ) {
        return
      }

      setIsLoading(true)
      try {
        const response = await chatApi.getMessages(
          challengeAssignmentId,
          sessionId,
          token
        )

        if (response.data && response.data.messages) {
          const formattedMessages: Message[] = response.data.messages.map(
            (msg) => ({
              id: msg.message_id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            })
          )

          // Store all messages, but display only the last INITIAL_MESSAGE_LIMIT initially
          setAllMessages(formattedMessages)
          setDisplayedMessageCount(
            formattedMessages.length > INITIAL_MESSAGE_LIMIT
              ? INITIAL_MESSAGE_LIMIT
              : formattedMessages.length
          )
          setConversationId(response.data.conversation_id)
        }
        hasLoadedHistory.current = true
      } catch (error) {
        // Silently fail - it's okay if there's no history yet
        console.log('No message history found or error loading:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessageHistory()
  }, [challengeAssignmentId, sessionId, token])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    messages,
    allMessages,
    inputValue,
    setInputValue,
    isTyping,
    isLoading,
    conversationId,
    hasMoreMessages,
    handleSendMessage,
    handleSuggestedPrompt,
    loadMoreMessages,
  }
}
