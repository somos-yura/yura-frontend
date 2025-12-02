import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Send, User, ArrowLeft } from "lucide-react"
import { Layout } from "../components/layout/Layout"
import { useChat } from "../hooks/useChat"
import { challengesApi, ChallengeApiError } from "../services/challengesApi"
import { useAuthContext } from "../contexts/AuthContext"
import type { Challenge, SimulatedPerson, ChallengeAssignment } from "../types/challenge"
import { SUGGESTED_PROMPTS, CHAT_MESSAGES } from "../constants/chat"
import { handleKeyPress, formatTime, scrollToBottom } from "../utils/chatHelpers"

const ChallengeChat: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user, token } = useAuthContext()
    const [challenge, setChallenge] = useState<Challenge | null>(null)
    const [simulatedPerson, setSimulatedPerson] = useState<SimulatedPerson | null>(null)
    const [challengeAssignment, setChallengeAssignment] = useState<ChallengeAssignment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [chatError, setChatError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Generate or retrieve session ID
    const getSessionId = (): string => {
        const storageKey = `chat_session_${id}`
        let sessionId = localStorage.getItem(storageKey)
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem(storageKey, sessionId)
        }
        return sessionId
    }

    const sessionId = getSessionId()

    const getAvatarInitials = (person: SimulatedPerson | null): string => {
        if (!person) return "?"
        const first = person.first_name?.charAt(0).toUpperCase() || ""
        const last = person.last_name?.charAt(0).toUpperCase() || ""
        return (first + last) || "?"
    }

    const getFullName = (person: SimulatedPerson | null): string => {
        if (!person) return "Persona"
        return `${person.first_name} ${person.last_name}`.trim() || "Persona"
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
    } = useChat({
        challengeAssignmentId: challengeAssignment?.id || null,
        sessionId,
        token: token || null,
        onError: (errorMessage) => {
            setChatError(errorMessage)
            setTimeout(() => setChatError(null), 5000)
        },
    })

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
                    const assignmentsResponse = await challengesApi.getStudentAssignments(user.id)
                    const assignment = assignmentsResponse.data.assignments.find(
                        (a: ChallengeAssignment) => String(a.social_problem_id) === String(id)
                    )

                    if (!assignment) {
                        setError('No tienes una asignación para este reto. Por favor, crea una asignación primero.')
                        setLoading(false)
                        return
                    }

                    setChallengeAssignment(assignment)

                    // Fetch simulated person
                    try {
                        const person = await challengesApi.getSimulatedPersonById(assignment.simulated_person_id)
                        setSimulatedPerson(person)
                    } catch (err) {
                        if (err instanceof ChallengeApiError) {
                            setError(err.message)
                        } else {
                            setError('Error al cargar los datos de la persona simulada')
                        }
                    }
                } catch (err) {
                    if (err instanceof ChallengeApiError) {
                        setError(err.message)
                    } else {
                        setError('Error al cargar las asignaciones')
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el problema social')
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
                        <h2 className="text-2xl font-bold text-foreground mb-2">{CHAT_MESSAGES.LOADING_ERROR}</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <button
                            onClick={() => navigate("/dashboard", { replace: true })}
                            className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors"
                        >
                            {CHAT_MESSAGES.BACK_TO_DASHBOARD}
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
                        <h2 className="text-2xl font-bold text-foreground mb-2">Reto no encontrado</h2>
                        <p className="text-muted-foreground mb-6">{CHAT_MESSAGES.NOT_FOUND}</p>
                        <button
                            onClick={() => navigate("/dashboard", { replace: true })}
                            className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors"
                        >
                            {CHAT_MESSAGES.BACK_TO_DASHBOARD}
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }


    return (
        <Layout hideFooter={true}>
            <div className="w-full h-full bg-gray-50">
                <div className="flex flex-col h-full bg-white relative overflow-hidden">
                    <div className="relative z-10 border-b border-gray-200 bg-white shadow-sm">
                        <div className="w-full px-4 py-3 flex items-center gap-3">
                            <button
                                onClick={() => navigate(`/challenge/${challenge.id}`)}
                                className="inline-flex items-center justify-center w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                        {getAvatarInitials(simulatedPerson)}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-base font-semibold text-gray-900 truncate">
                                        {getFullName(simulatedPerson)}
                                    </h1>
                                    <p className="text-xs text-gray-500 truncate">{challenge.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto relative z-10 bg-gray-50">
                        <div className="w-full max-w-4xl mx-auto px-4 py-6">
                            {chatError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{chatError}</p>
                                </div>
                            )}
                            {messages.length === 0 && (
                                <div className="mb-6">
                                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
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
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl mx-auto shadow-lg mb-3">
                                            {getAvatarInitials(simulatedPerson)}
                                        </div>
                                        <h1 className="text-2xl font-semibold text-gray-900">
                                            {CHAT_MESSAGES.GREETING}
                                        </h1>
                                        <p className="text-sm text-gray-500">Comencemos a conversar sobre este problema social</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
                                        {SUGGESTED_PROMPTS.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestedPrompt(prompt.prompt)}
                                                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                                            >
                                                <div className="space-y-2">
                                                    <div className="p-2 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors">
                                                        <prompt.icon className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                            {prompt.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 leading-relaxed">{prompt.description}</p>
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
                                        const isUser = message.role === "user"
                                        const showAvatar = !isUser && (index === 0 || messages[index - 1].role === "user")
                                        const isConsecutive = index > 0 && messages[index - 1].role === message.role

                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} ${isConsecutive ? "mt-1" : "mt-4"}`}
                                            >
                                                <div className="flex-shrink-0 w-8">
                                                    {showAvatar && !isUser ? (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                                                            {getAvatarInitials(simulatedPerson)}
                                                        </div>
                                                    ) : isUser ? (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8"></div>
                                                    )}
                                                </div>
                                                <div
                                                    className={`flex-1 max-w-[70%] ${isUser ? "items-end" : "items-start"} flex flex-col`}
                                                >
                                                    <div
                                                        className={`rounded-2xl px-4 py-2.5 shadow-sm ${isUser
                                                            ? "bg-blue-500 text-white rounded-tr-sm"
                                                            : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
                                                            }`}
                                                    >
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                            {message.content}
                                                        </p>
                                                    </div>
                                                    {!isConsecutive && (
                                                        <span className={`text-xs text-gray-400 mt-1 px-1 ${isUser ? "text-right" : "text-left"}`}>
                                                            {formatTime(message.timestamp)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {isTyping && (
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm flex-shrink-0">
                                                {getAvatarInitials(simulatedPerson)}
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                                <div className="flex gap-1">
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
                    <div className="border-t border-gray-200 bg-white sticky bottom-0 shadow-lg z-10">
                        <div className="w-full max-w-4xl mx-auto px-4 py-3">
                            <div className="bg-gray-100 rounded-3xl border border-gray-200 shadow-sm">
                                <div className="flex items-end gap-2 p-2">
                                    <div className="flex-1 min-w-0">
                                        <textarea
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                                            placeholder={challengeAssignment ? CHAT_MESSAGES.WRITE_MESSAGE : "Cargando asignación..."}
                                            rows={1}
                                            disabled={!challengeAssignment || isTyping}
                                            className="w-full px-4 py-2.5 bg-transparent border-0 resize-none focus:outline-none text-sm leading-relaxed max-h-32 placeholder:text-gray-400 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ minHeight: "44px" }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isTyping || !challengeAssignment}
                                        className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex-shrink-0 shadow-sm"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ChallengeChat