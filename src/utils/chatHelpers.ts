import type React from 'react'

export const handleKeyPress = (e: React.KeyboardEvent, onSend: () => void) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    onSend()
  }
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({ behavior: 'smooth' })
}
