import type React from 'react'
import { Send } from 'lucide-react'
import { StakeholderAvailabilityService } from '../../services/stakeholderAvailabilityService'

import { type Challenge, type ChallengeAssignment } from '../../types/challenge'
import { CHAT_MESSAGES } from '../../constants/chat'
import { ErrorCode } from '../../services/chatApi'

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleKeyPress: (e: React.KeyboardEvent, onSend: () => void) => void
  handleSendMessage: () => void
  isTyping: boolean
  isAvailable: boolean
  challengeAssignment: ChallengeAssignment | null
  errorState: { type: ErrorCode | null }
  getFullName: (challenge: Challenge | null) => string
  challenge: Challenge | null
  CHAT_MESSAGES: typeof CHAT_MESSAGES
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleKeyPress,
  handleSendMessage,
  isTyping,
  isAvailable,
  challengeAssignment,
  errorState,
  getFullName,
  challenge,
  CHAT_MESSAGES,
}) => {
  return (
    <div className="z-20">
      <div className="w-full max-w-4xl mx-auto px-6 py-2">
        {errorState.type && (
          <div className="mb-2 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <p>
              No se pudo enviar el mensaje. Inténtalo más tarde,{' '}
              <span className="font-semibold">{getFullName(challenge)}</span>{' '}
              está desconectado.
            </p>
          </div>
        )}
        {!isAvailable && !errorState.type && (
          <div className="mb-2 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <p>
              {getFullName(challenge)} está fuera de su horario laboral. Horario
              disponible:{' '}
              <span className="font-semibold">
                {StakeholderAvailabilityService.getFormattedWorkingDays()} de{' '}
                {StakeholderAvailabilityService.getFormattedWorkingHours()}
              </span>
              .
            </p>
          </div>
        )}
        <div className="bg-white rounded-[50px] border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-gray-100 hover:ring-blue-100 transition-all duration-300 p-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                placeholder={
                  !isAvailable
                    ? 'Chat inhabilitado fuera de horario'
                    : challengeAssignment
                      ? CHAT_MESSAGES.WRITE_MESSAGE
                      : 'Cargando asignación...'
                }
                rows={1}
                disabled={!challengeAssignment || isTyping || !isAvailable}
                className="w-full pl-5 pr-2 py-3.5 bg-transparent border-0 resize-none focus:outline-none text-[15px] leading-relaxed max-h-32 placeholder:text-gray-400 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '52px' }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={
                !inputValue.trim() ||
                isTyping ||
                !challengeAssignment ||
                !isAvailable
              }
              className="mb-1 mr-1 p-2.5 bg-black text-white rounded-full hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-md hover:shadow-lg flex items-center justify-center group bg-red-300"
            >
              <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-2.5 select-none font-medium opacity-70">
          Estás hablando con un personaje simulado con IA. Puede cometer
          errores.
        </p>
      </div>
    </div>
  )
}
