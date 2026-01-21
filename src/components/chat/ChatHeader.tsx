import type React from 'react'
import { ArrowLeft, FolderOpen, Users, Calendar } from 'lucide-react'
import { type Challenge } from '../../types/challenge'

interface ChatHeaderProps {
  challenge: Challenge | null
  getAvatarInitials: (challenge: Challenge | null) => string
  getFullName: (challenge: Challenge | null) => string
  errorState: { type: string | null }
  isTyping: boolean
  isAvailable: boolean
  activeTab: string
  showRightSidebar: boolean
  diagramsCount: number
  onBack: () => void
  onToggleTab: (tab: 'files' | 'participants' | 'milestones') => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  challenge,
  getAvatarInitials,
  getFullName,
  errorState,
  isTyping,
  isAvailable,
  activeTab,
  showRightSidebar,
  diagramsCount,
  onBack,
  onToggleTab,
}) => {
  const isOffline = errorState.type || !isAvailable

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-base shadow-sm ring-2 ring-white border border-blue-100">
              {getAvatarInitials(challenge)}
            </div>
            {/* Status Indicator Dot */}
            <div
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full transition-colors duration-300 ${
                isOffline
                  ? 'bg-red-500' // Error state or Offline state
                  : isTyping
                    ? 'bg-blue-500 animate-pulse' // Typing state
                    : 'bg-green-500' // Connected/Idle state
              }`}
              title={
                isOffline ? 'Offline' : isTyping ? 'Escribiendo...' : 'Online'
              }
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate leading-tight">
              {getFullName(challenge)}
            </h1>
            <div className="flex items-center gap-1.5 text-sm overflow-hidden">
              <span
                className={`truncate font-medium flex-shrink-0 ${
                  isOffline
                    ? 'text-red-500'
                    : isTyping
                      ? 'text-blue-600'
                      : 'text-green-600'
                }`}
              >
                {isOffline ? 'Offline' : isTyping ? 'Escribiendo...' : 'Online'}
              </span>
              <span className="text-gray-300 flex-shrink-0">•</span>
              <p className="text-gray-500 truncate">{challenge?.title}</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleTab('files')}
            className={`p-2 rounded-lg transition-all ${
              activeTab === 'files' && showRightSidebar
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title="Archivos Compartidos"
          >
            <div className="relative">
              <FolderOpen className="w-5 h-5" />
              {diagramsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {diagramsCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => onToggleTab('participants')}
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
            onClick={() => onToggleTab('milestones')}
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
  )
}
