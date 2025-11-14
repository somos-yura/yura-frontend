import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Send, User, ArrowLeft } from "lucide-react"
import { Layout } from "../components/layout/Layout"
import { useChat } from "../hooks/useChat"
import { challengesApi } from "../services/challengesApi"
import type { Challenge } from "../types/challenge"
import { SUGGESTED_PROMPTS, CHAT_MESSAGES } from "../constants/chat"
import { handleKeyPress, formatTime, scrollToBottom } from "../utils/chatHelpers"

const ChallengeChat: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [challenge, setChallenge] = useState<Challenge | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const {
        messages,
        inputValue,
        setInputValue,
        isTyping,
        handleSendMessage,
        handleSuggestedPrompt,
    } = useChat()

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!id) return
            
            setLoading(true)
            setError(null)
            
            try {
                const problem = await challengesApi.getSocialProblemById(id)
                setChallenge(problem)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el problema social')
            } finally {
                setLoading(false)
            }
        }
        fetchChallenge()
    }, [id])

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
            <div className="w-full h-full">
                <div className="flex flex-col h-full bg-background relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 via-success/5 to-transparent rounded-full blur-3xl opacity-50" />
                    <div className="relative z-10 p-2 border-b border-border/40 bg-card/40 backdrop-blur-xl">
                        <div className="w-full px-4 flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/challenge/${challenge.id}`)}
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-medium">{CHAT_MESSAGES.BACK}</span>
                            </button>
                            <div className="flex-1 text-center">
                                <h1 className="text-xl font-bold text-foreground font-montserrat">
                                    Chat del Proyecto
                                </h1>
                                <p className="text-sm text-muted-foreground">{challenge.title}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto relative z-10">
                        <div className="w-full px-4 py-2">
                            <div className="mb-4">
                                <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-3">
                                    <h3 className="text-base font-semibold text-foreground mb-2 font-montserrat">
                                        {CHAT_MESSAGES.DESCRIPTION}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {challenge.description}
                                    </p>
                                </div>
                            </div>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <div className="space-y-4 max-w-3xl text-center">
                                        <h1
                                            className="text-3xl font-bold leading-tight"
                                            style={{ fontFamily: "var(--font-montserrat)" }}
                                        >
                                            <span className="bg-gradient-to-r from-black via-purple-700 to-black bg-clip-text text-transparent">
                                                {CHAT_MESSAGES.GREETING}
                                            </span>
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full pt-4">
                                        {SUGGESTED_PROMPTS.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestedPrompt(prompt.prompt)}
                                                className="group bg-card/60 backdrop-blur-sm border border-border/40 rounded-3xl p-6 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-200 transition-all duration-300 text-left hover:-translate-y-1"
                                            >
                                                <div className="space-y-3">
                                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl w-fit group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                                                        <prompt.icon className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3
                                                            className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors"
                                                            style={{ fontFamily: "var(--font-montserrat)" }}
                                                        >
                                                            {prompt.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{prompt.description}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {messages.length > 0 && (
                                <div className="space-y-6">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                        >
                                            <div className="flex-shrink-0">
                                                {message.role === "assistant" ? (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                        <span>{challenge.title.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-secondary" />
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={`flex-1 max-w-2xl ${message.role === "user" ? "items-end" : "items-start"} flex flex-col`}
                                            >
                                                <div
                                                    className={`rounded-2xl px-5 py-3.5 ${message.role === "user"
                                                        ? "bg-primary text-primary-foreground ml-auto"
                                                        : "bg-card/60 backdrop-blur-sm border border-border/40"
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-1.5 px-1">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                <span>{challenge.title.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl px-5 py-3.5">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border-t border-border/40 bg-card/40 backdrop-blur-xl sticky bottom-0 shadow-2xl relative z-10">
                        <div className="w-full px-4 py-2">
                            <div className="bg-background/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-lg p-2">
                                <div className="flex items-end gap-3 px-2">
                                    <div className="flex-1">
                                        <textarea
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                                            placeholder={CHAT_MESSAGES.WRITE_MESSAGE}
                                            rows={1}
                                            className="w-full px-2 py-3 bg-transparent border-0 resize-none focus:outline-none text-sm leading-relaxed max-h-32 placeholder:text-muted-foreground/50"
                                            style={{ minHeight: "44px" }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                        className="p-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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