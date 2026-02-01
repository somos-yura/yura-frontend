import type React from 'react'
import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { Layout } from '../components/layout/Layout'
import { useChat } from '../hooks/useChat'
import { challengesApi, ChallengeApiError } from '../services/challengesApi'
import { chatApi, type Diagram } from '../services/chatApi'
import { useAuthContext } from '../contexts/AuthContext'
import type { Challenge, ChallengeAssignment } from '../types/challenge'
import { SUGGESTED_PROMPTS, CHAT_MESSAGES } from '../constants/chat'
import { handleKeyPress, scrollToBottom } from '../utils/chatHelpers'

// Refactored Components
import { ChatHeader } from '../components/chat/ChatHeader'
import { ChatSidebar } from '../components/chat/ChatSidebar'
import { MessageList } from '../components/chat/MessageList'
import { ChatInput } from '../components/chat/ChatInput'
import { GoogleAuthModal } from '../components/chat/GoogleAuthModal'

type TabType = 'chat' | 'files' | 'participants' | 'milestones'

const ChallengeChat: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthContext()

  const getBackPath = () => {
    const from = (location.state as { from?: string })?.from
    return from || `/challenge/${id}`
  }
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [challengeAssignment, setChallengeAssignment] =
    useState<ChallengeAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diagrams, setDiagrams] = useState<Diagram[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('chat')
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [googleCalendarLinked, setGoogleCalendarLinked] =
    useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate or retrieve session ID
  const getSessionId = (): string => {
    const storageKey = `chat_session_${id} `
    let sessionId = localStorage.getItem(storageKey)
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)} `
      localStorage.setItem(storageKey, sessionId)
    }
    return sessionId
  }

  const sessionId = getSessionId()

  const { initiateAuth: googleLogin } = useGoogleAuth({
    challengeAssignmentId: challengeAssignment?.id || null,
    onSuccess: async () => {
      await refreshHistory()
      setGoogleCalendarLinked(true)
      setIsGoogleAuthModalOpen(false)
    },
    onError: (errorMessage) => {
      console.warn('Google Auth Debug Info:', errorMessage)
    },
  })

  const getAvatarInitials = (challenge: Challenge | null): string => {
    if (!challenge) return '?'
    const first = challenge.person_first_name?.charAt(0).toUpperCase() || ''
    const last = challenge.person_last_name?.charAt(0).toUpperCase() || ''
    return first + last || '?'
  }

  const getFullName = (challenge: Challenge | null): string => {
    if (!challenge) return 'Persona'
    return (
      `${challenge.person_first_name} ${challenge.person_last_name}`.trim() ||
      'Persona'
    )
  }

  const cleanDiagramDescriptions = (content: string): string => {
    return content.replace(
      /(```mermaid\n[\s\S]*?\n```)\s*\n\s*\[([^\]]+)\]/g,
      '$1'
    )
  }

  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    hasMoreMessages,
    errorState,
    handleSendMessage,
    handleSuggestedPrompt,
    loadMoreMessages,
    refreshHistory,
    isAvailable,
  } = useChat({
    challengeAssignmentId: challengeAssignment?.id || null,
    sessionId,
    onError: (errorMessage) => {
      console.warn('Simulation Debug Info:', errorMessage)
    },
    onMessageSent: (data) => {
      const newDiagrams = data.diagrams
      if (newDiagrams && newDiagrams.length > 0) {
        setDiagrams((prev) => [...newDiagrams, ...prev])
      }
      if (data.google_calendar_linked !== undefined) {
        setGoogleCalendarLinked(data.google_calendar_linked)
      }
      if (data.needs_google_auth) {
        setIsGoogleAuthModalOpen(true)
      }
    },
  })

  useEffect(() => {
    const fetchDiagrams = async () => {
      if (!challengeAssignment) return
      try {
        const response = await chatApi.getDiagrams(challengeAssignment.id)
        if (response.data && response.data.diagrams) {
          setDiagrams(response.data.diagrams)
        }
      } catch (err) {
        console.error('Error fetching diagrams:', err)
      }
    }
    fetchDiagrams()
  }, [challengeAssignment])

  useEffect(() => {
    const fetchStatus = async () => {
      if (!challengeAssignment) return
      try {
        const response = await chatApi.getStatus(
          challengeAssignment.id,
          sessionId
        )
        if (response.success && response.data) {
          setGoogleCalendarLinked(response.data.google_calendar_linked)
        }
      } catch (err) {
        console.error('Error fetching status:', err)
      }
    }
    fetchStatus()
  }, [challengeAssignment, sessionId])

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user?.id) return

      setLoading(true)
      setError(null)

      try {
        const problem = await challengesApi.getSocialProblemById(id)
        if (!problem) {
          setError('Problema social no encontrado')
          setLoading(false)
          return
        }
        setChallenge(problem)

        try {
          const assignmentsResponse = await challengesApi.getStudentAssignments(
            user.id
          )
          const assignment = assignmentsResponse.data.assignments.find(
            (a: ChallengeAssignment) =>
              String(a.social_problem_id) === String(id)
          )

          if (!assignment) {
            setError(
              'No tienes una asignación para este reto. Por favor, crea una asignación primero.'
            )
            setLoading(false)
            return
          }

          setChallengeAssignment(assignment)
        } catch (err) {
          if (err instanceof ChallengeApiError) {
            setError(err.message)
          } else {
            setError('Error al cargar las asignaciones')
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar el problema social'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user?.id])

  useEffect(() => {
    scrollToBottom(messagesEndRef)
  }, [messages])

  const handleToggleTab = (tab: TabType) => {
    if (activeTab === tab && showRightSidebar) {
      setShowRightSidebar(false)
    } else {
      setActiveTab(tab)
      setShowRightSidebar(true)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="h-[400px] bg-muted animate-pulse rounded-xl mb-8" />
        </div>
      </Layout>
    )
  }

  if (error || !challenge) {
    return (
      <Layout>
        <div className="w-full">
          <div className="max-w-md mx-auto text-center py-16 px-6">
            <div
              className={`w-16 h-16 ${error ? 'bg-red-100' : 'bg-muted'} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-3xl">{error ? '⚠️' : '🔍'}</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {error ? CHAT_MESSAGES.LOADING_ERROR : 'Reto no encontrado'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || CHAT_MESSAGES.NOT_FOUND}
            </p>
            <button
              onClick={() => navigate(getBackPath(), { replace: true })}
              className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout noPadding={true} hideFooter={true}>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <ChatHeader
            challenge={challenge}
            getAvatarInitials={getAvatarInitials}
            getFullName={getFullName}
            errorState={errorState}
            isTyping={isTyping}
            isAvailable={isAvailable}
            activeTab={activeTab}
            showRightSidebar={showRightSidebar}
            diagramsCount={diagrams.length}
            onBack={() => {
              if (window.history.length > 1 && location.key !== 'default') {
                navigate(-1)
              } else {
                navigate(getBackPath())
              }
            }}
            onToggleTab={handleToggleTab}
          />

          <MessageList
            messages={messages}
            challenge={challenge}
            getAvatarInitials={getAvatarInitials}
            hasMoreMessages={hasMoreMessages}
            onLoadMore={loadMoreMessages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
            cleanDiagramDescriptions={cleanDiagramDescriptions}
          />

          {messages.length === 0 && (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-8 py-8 bg-gradient-to-br from-gray-50/50 to-white">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-2xl mx-auto shadow-sm mb-4 ring-4 ring-white border border-blue-100">
                  {getAvatarInitials(challenge)}
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {CHAT_MESSAGES.GREETING}
                </h1>
                <p className="text-sm text-gray-500">
                  Comencemos a trabajar en encontrar una solución a este
                  problema
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl px-6">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt.prompt)}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="space-y-2">
                      <div className="p-2.5 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors">
                        <prompt.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {prompt.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
            isTyping={isTyping}
            isAvailable={isAvailable}
            challengeAssignment={challengeAssignment}
            errorState={errorState}
            getFullName={getFullName}
            challenge={challenge}
            CHAT_MESSAGES={CHAT_MESSAGES}
          />
        </div>

        {showRightSidebar && (
          <ChatSidebar
            activeTab={activeTab}
            onClose={() => setShowRightSidebar(false)}
            diagrams={diagrams}
            challenge={challenge}
            challengeAssignment={challengeAssignment}
            getAvatarInitials={getAvatarInitials}
            getFullName={getFullName}
            onLinkGoogleCalendar={googleLogin}
            isGoogleCalendarLinked={googleCalendarLinked}
          />
        )}

        {isGoogleAuthModalOpen && (
          <GoogleAuthModal
            onLogin={googleLogin}
            onClose={() => setIsGoogleAuthModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  )
}

export default ChallengeChat
