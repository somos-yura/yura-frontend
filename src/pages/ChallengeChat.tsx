import type React from 'react'
import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Send,
  User,
  ArrowLeft,
  FileText,
  X,
  Users,
  FolderOpen,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { Layout } from '../components/layout/Layout'
import { useChat } from '../hooks/useChat'
import { challengesApi, ChallengeApiError } from '../services/challengesApi'
import { chatApi, type Diagram } from '../services/chatApi'
import { useAuthContext } from '../contexts/AuthContext'
import type { Challenge, ChallengeAssignment } from '../types/challenge'
import { SUGGESTED_PROMPTS, CHAT_MESSAGES } from '../constants/chat'
import {
  handleKeyPress,
  formatTime,
  scrollToBottom,
} from '../utils/chatHelpers'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Mermaid } from '../components/ui/Mermaid'
import { ProjectMilestones } from '../components/ProjectMilestones'

type TabType = 'chat' | 'files' | 'participants' | 'milestones'

const DiagramCard: React.FC<{
  diagram: Diagram
  index: number
  total: number
}> = ({ diagram, index, total }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="group border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
      {/* Card Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-wide">
              Diagrama {total - index}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(diagram.created_at).toLocaleString('es-ES', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Diagram Content - Accordion */}
      {isOpen && (
        <div className="p-3 animate-in slide-in-from-top-2 duration-200">
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
            <Mermaid chart={diagram.code} />
          </div>
          {/* Description */}
          {diagram.description && (
            <div className="mt-3 px-1">
              <p className="text-xs text-gray-700 leading-relaxed">
                {diagram.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ChallengeChat: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, token } = useAuthContext()

  const getBackPath = () => {
    const from = (location.state as { from?: string })?.from
    return from || `/challenge/${id}`
  }
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [challengeAssignment, setChallengeAssignment] =
    useState<ChallengeAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)
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
    token: token || null,
    challengeAssignmentId: challengeAssignment?.id || null,
    onSuccess: async () => {
      await refreshHistory()
      setGoogleCalendarLinked(true)
      setIsGoogleAuthModalOpen(false)
    },
    onError: (errorMessage) => {
      setChatError(errorMessage)
      setTimeout(() => setChatError(null), 5000)
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
    handleSendMessage,
    handleSuggestedPrompt,
    loadMoreMessages,
    refreshHistory,
  } = useChat({
    challengeAssignmentId: challengeAssignment?.id || null,
    sessionId,
    token: token || null,
    onError: (errorMessage) => {
      setChatError(errorMessage)
      setTimeout(() => setChatError(null), 5000)
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
      if (!challengeAssignment || !token) return
      try {
        const response = await chatApi.getDiagrams(
          challengeAssignment.id,
          token
        )
        if (response.data && response.data.diagrams) {
          setDiagrams(response.data.diagrams)
        }
      } catch (err) {
        console.error('Error fetching diagrams:', err)
      }
    }
    fetchDiagrams()
  }, [challengeAssignment, token])

  useEffect(() => {
    const fetchStatus = async () => {
      if (!challengeAssignment || !token) return
      try {
        const response = await chatApi.getStatus(
          challengeAssignment.id,
          sessionId,
          token
        )
        if (response.success && response.data) {
          setGoogleCalendarLinked(response.data.google_calendar_linked)
        }
      } catch (err) {
        console.error('Error fetching status:', err)
      }
    }
    fetchStatus()
  }, [challengeAssignment, token, sessionId])

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user?.id) return

      setLoading(true)
      setError(null)
      setChatError(null)

      try {
        // Fetch challenge
        const problem = await challengesApi.getSocialProblemById(id)
        if (!problem) {
          setError('Problema social no encontrado')
          setLoading(false)
          return
        }
        setChallenge(problem)

        // Fetch user's assignments to find the challenge assignment
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

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="h-[400px] bg-muted animate-pulse rounded-xl mb-8" />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="w-full">
          <div className="max-w-md mx-auto text-center py-16 px-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {CHAT_MESSAGES.LOADING_ERROR}
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
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

  if (!challenge) {
    return (
      <Layout>
        <div className="w-full">
          <div className="max-w-md mx-auto text-center py-16 px-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Reto no encontrado
            </h2>
            <p className="text-muted-foreground mb-6">
              {CHAT_MESSAGES.NOT_FOUND}
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
          <div className="border-b border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => {
                    if (
                      window.history.length > 1 &&
                      location.key !== 'default'
                    ) {
                      navigate(-1)
                    } else {
                      navigate(getBackPath())
                    }
                  }}
                  className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-base shadow-sm ring-2 ring-white border border-blue-100">
                    {getAvatarInitials(challenge)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate leading-tight">
                    {getFullName(challenge)}
                  </h1>
                  <p className="text-sm text-gray-500 truncate">
                    {challenge.title}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (activeTab === 'files' && showRightSidebar) {
                      setShowRightSidebar(false)
                    } else {
                      setActiveTab('files')
                      setShowRightSidebar(true)
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    activeTab === 'files' && showRightSidebar
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title="Archivos Compartidos"
                >
                  <div className="relative">
                    <FolderOpen className="w-5 h-5" />
                    {diagrams.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                        {diagrams.length}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (activeTab === 'participants' && showRightSidebar) {
                      setShowRightSidebar(false)
                    } else {
                      setActiveTab('participants')
                      setShowRightSidebar(true)
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    activeTab === 'participants' && showRightSidebar
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title="Participantes"
                >
                  <Users className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    if (activeTab === 'milestones' && showRightSidebar) {
                      setShowRightSidebar(false)
                    } else {
                      setActiveTab('milestones')
                      setShowRightSidebar(true)
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    activeTab === 'milestones' && showRightSidebar
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title="Hitos del Proyecto"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white">
            <div className="w-full max-w-4xl mx-auto px-6 py-6">
              {chatError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{chatError}</p>
                </div>
              )}
              {messages.length === 0 && (
                <div className="mb-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {CHAT_MESSAGES.DESCRIPTION}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              )}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center space-y-8 py-8">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-2xl mx-auto shadow-sm mb-4 ring-4 ring-white border border-blue-100">
                      {getAvatarInitials(challenge)}
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {CHAT_MESSAGES.GREETING}
                    </h1>
                    <p className="text-sm text-gray-500">
                      Comencemos a conversar sobre este problema social
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
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
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {prompt.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.length > 0 && (
                <div className="space-y-4">
                  {hasMoreMessages && (
                    <div className="flex justify-center py-2">
                      <button
                        onClick={loadMoreMessages}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Cargar más
                      </button>
                    </div>
                  )}
                  {messages.map((message, index) => {
                    const isUser = message.role === 'user'
                    const isConsecutive =
                      index > 0 && messages[index - 1].role === message.role

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
                      >
                        <div
                          className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
                        >
                          {/* Avatar */}
                          {!isUser && !isConsecutive ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm flex-shrink-0 mb-1 ring-2 ring-white border border-blue-100">
                              {getAvatarInitials(challenge)}
                            </div>
                          ) : isUser && !isConsecutive ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm flex-shrink-0 mb-1">
                              <User className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 flex-shrink-0" />
                          )}

                          <div
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                          >
                            {/* Message Bubble */}
                            <div
                              className={`relative px-4 py-2.5 shadow-sm w-fit ${
                                isUser
                                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                  : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                              }`}
                            >
                              <div className="text-sm leading-relaxed break-words markdown-content">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    code: ({
                                      inline,
                                      className,
                                      children,
                                      ...props
                                    }: React.ComponentPropsWithoutRef<'code'> & {
                                      inline?: boolean
                                    }) => {
                                      const match = /language-(\w+)/.exec(
                                        className || ''
                                      )
                                      // Check if it's a mermaid diagram
                                      if (
                                        !inline &&
                                        match &&
                                        match[1] === 'mermaid'
                                      ) {
                                        return (
                                          <div className="my-4 overflow-hidden rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                                            <Mermaid
                                              chart={String(children).replace(
                                                /\n$/,
                                                ''
                                              )}
                                            />
                                          </div>
                                        )
                                      }

                                      return !inline && match ? (
                                        <div className="rounded-lg bg-gray-900 p-3 my-2 overflow-x-auto">
                                          <code
                                            className={className}
                                            {...props}
                                          >
                                            {children}
                                          </code>
                                        </div>
                                      ) : (
                                        <code
                                          className={`${className} ${
                                            isUser
                                              ? 'bg-blue-700/30 text-white'
                                              : 'bg-gray-100 text-gray-800'
                                          } px-1.5 py-0.5 rounded text-xs font-mono`}
                                          {...props}
                                        >
                                          {children}
                                        </code>
                                      )
                                    },
                                    p: ({ children }) => (
                                      <p className="mb-1 last:mb-0">
                                        {children}
                                      </p>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="list-disc ml-4 mb-2">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal ml-4 mb-2">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="mb-1">{children}</li>
                                    ),
                                    a: ({ href, children }) => (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`underline ${isUser ? 'text-white' : 'text-blue-600'} hover:opacity-80`}
                                      >
                                        {children}
                                      </a>
                                    ),
                                  }}
                                >
                                  {cleanDiagramDescriptions(message.content)}
                                </ReactMarkdown>
                              </div>
                            </div>

                            {/* Timestamp below bubble */}
                            <div
                              className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm flex-shrink-0 border border-blue-100">
                        {getAvatarInitials(challenge)}
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="w-full max-w-4xl mx-auto px-6 py-2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-end gap-2.5 p-2.5">
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                      placeholder={
                        challengeAssignment
                          ? CHAT_MESSAGES.WRITE_MESSAGE
                          : 'Cargando asignación...'
                      }
                      rows={1}
                      disabled={!challengeAssignment || isTyping}
                      className="w-full px-4 py-4 bg-transparent border-0 resize-none focus:outline-none text-sm leading-relaxed max-h-32 placeholder:text-gray-400 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ minHeight: '56px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !inputValue.trim() || isTyping || !challengeAssignment
                    }
                    className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2 select-none">
                Estás hablando con un personaje simulado con IA. Puede cometer
                errores.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Dynamic Content Based on Active Tab */}
        {showRightSidebar && (
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-96 md:relative md:inset-auto md:z-0 border-l border-gray-200/80 bg-white overflow-y-auto flex flex-col shadow-xl transition-all duration-300">
            {/* Sidebar Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                {activeTab === 'files' ? (
                  <FolderOpen className="w-5 h-5 text-gray-500" />
                ) : activeTab === 'participants' ? (
                  <Users className="w-5 h-5 text-gray-500" />
                ) : (
                  <Calendar className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-base font-medium text-gray-700">
                  {activeTab === 'files'
                    ? 'Archivos Compartidos'
                    : activeTab === 'participants'
                      ? 'Participantes'
                      : 'Hitos del Proyecto'}
                </span>
              </div>
              <button
                onClick={() => setShowRightSidebar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === 'files' && (
                <div className="space-y-4">
                  {/* File Categories */}
                  {/* File Categories */}
                  <div className="flex items-center justify-between px-2 mb-3 mt-2">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Diagramas
                    </h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {diagrams.length}
                    </span>
                  </div>

                  {/* Diagrams List */}
                  {diagrams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <FileText className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500">
                        No hay diagramas aún
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {diagrams.map((diagram, index) => (
                        <DiagramCard
                          key={diagram.id}
                          diagram={diagram}
                          index={index}
                          total={diagrams.length}
                        />
                      ))}
                    </div>
                  )}

                  {/* Additional File Categories - Placeholder */}
                  {/* Additional File Categories - Placeholder */}
                  <div className="mt-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between px-2 mb-3">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                          <ImageIcon className="w-4 h-4 text-purple-600" />
                          Imágenes
                        </h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          0
                        </span>
                      </div>
                      <div className="px-4 py-8 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-8 h-8 text-gray-200 mb-2" />
                        <span className="text-xs text-gray-400">
                          No hay imágenes
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between px-2 mb-3">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                          <LinkIcon className="w-4 h-4 text-orange-600" />
                          Enlaces
                        </h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          0
                        </span>
                      </div>
                      <div className="px-4 py-8 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
                        <LinkIcon className="w-8 h-8 text-gray-200 mb-2" />
                        <span className="text-xs text-gray-400">
                          No hay enlaces
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'participants' && (
                <div className="space-y-4">
                  {/* Challenge Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">
                      INFORMACIÓN DEL RETO
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Título:</span>
                        <p className="text-gray-900 font-medium">
                          {challenge.title}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Categorías:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {challenge.category.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white text-blue-700 text-xs rounded-full border border-blue-200"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stakeholder Info */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Stakeholder Asignado
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm ring-2 ring-white border border-blue-100">
                        {getAvatarInitials(challenge)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {getFullName(challenge)}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {challenge?.person_age} años
                        </p>
                      </div>
                    </div>
                    {challenge?.person_bio && (
                      <div className="mb-4">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Biografía
                        </span>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {challenge.person_bio}
                        </p>
                      </div>
                    )}
                    {challenge?.person_expertise_areas &&
                      challenge.person_expertise_areas.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Áreas de Experiencia
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {challenge.person_expertise_areas.map(
                              (area, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
                                >
                                  {area}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {challenge?.person_personality_traits &&
                      challenge.person_personality_traits.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Rasgos de Personalidad
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {challenge.person_personality_traits.map(
                              (trait, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg border border-purple-100"
                                >
                                  {trait}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && challengeAssignment && (
                <div className="animate-fade-in">
                  <ProjectMilestones
                    challengeAssignmentId={challengeAssignment.id}
                    onLinkGoogleCalendar={googleLogin}
                    isGoogleCalendarLinked={googleCalendarLinked}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Google Auth Modal */}
        {isGoogleAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <LinkIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Sincroniza tu Calendario!
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Vincular con Google Calendar te permitirá ver estas fechas
                  directamente en tu agenda.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => googleLogin()}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    Conectar Google Calendar
                  </button>
                  <button
                    onClick={() => setIsGoogleAuthModalOpen(false)}
                    className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-all"
                  >
                    Continuar sin sincronizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ChallengeChat
