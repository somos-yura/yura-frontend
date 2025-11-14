import { useState, useCallback } from "react"
import { CHAT_CONFIG } from "../constants/chat"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const createUserMessage = useCallback((content: string): Message => ({
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
    }), [])

    const createAIMessage = useCallback((): Message => ({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: CHAT_CONFIG.AI_RESPONSE,
        timestamp: new Date(),
    }), [])

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim()) return

        const userMessage = createUserMessage(inputValue)
        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        setTimeout(() => {
            const aiMessage = createAIMessage()
            setMessages(prev => [...prev, aiMessage])
            setIsTyping(false)
        }, CHAT_CONFIG.TYPING_DELAY)
    }, [inputValue, createUserMessage, createAIMessage])

    const handleSuggestedPrompt = useCallback((prompt: string) => {
        setInputValue(prompt)
    }, [])

    return {
        messages,
        inputValue,
        setInputValue,
        isTyping,
        handleSendMessage,
        handleSuggestedPrompt,
    }
}
