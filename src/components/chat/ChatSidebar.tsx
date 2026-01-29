import type React from 'react'
import {
  FolderOpen,
  Users,
  Calendar,
  X,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  User,
} from 'lucide-react'
import { type Diagram } from '../../services/chatApi'
import { type Challenge, type ChallengeAssignment } from '../../types/challenge'
import { DiagramCard } from './DiagramCard'
import { ProjectMilestones } from '../ProjectMilestones'
import { StakeholderAvailabilityService } from '../../services/stakeholderAvailabilityService'
import { capitalizeFirstLetter } from '../../utils/textUtils'

interface ChatSidebarProps {
  activeTab: 'chat' | 'files' | 'participants' | 'milestones'
  onClose: () => void
  diagrams: Diagram[]
  challenge: Challenge | null
  challengeAssignment: ChallengeAssignment | null
  getAvatarInitials: (challenge: Challenge | null) => string
  getFullName: (challenge: Challenge | null) => string
  onLinkGoogleCalendar: () => void
  isGoogleCalendarLinked: boolean
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeTab,
  onClose,
  diagrams,
  challenge,
  challengeAssignment,
  getAvatarInitials,
  getFullName,
  onLinkGoogleCalendar,
  isGoogleCalendarLinked,
}) => {
  if (!challenge) return null

  return (
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
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-3 mt-2">
              <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-blue-600" />
                Diagramas
              </h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {diagrams.length}
              </span>
            </div>

            {diagrams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">No hay diagramas aún</p>
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
                  <span className="text-xs text-gray-400">No hay imágenes</span>
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
                  <span className="text-xs text-gray-400">No hay enlaces</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
              <h4 className="font-semibold text-sm text-gray-900 mb-3">
                INFORMACIÓN DEL RETO
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Título:</span>
                  <p className="text-gray-900 font-medium">{challenge.title}</p>
                </div>
                <div>
                  <span className="text-gray-500">Categorías:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {challenge.category.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-blue-700 text-xs rounded-full border border-blue-200"
                      >
                        {capitalizeFirstLetter(cat)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
                      {challenge.person_expertise_areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
                        >
                          {capitalizeFirstLetter(area)}
                        </span>
                      ))}
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
                      {challenge.person_personality_traits.map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg border border-purple-100"
                        >
                          {capitalizeFirstLetter(trait)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {/* Availability Info */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Horarios Disponibles
                </span>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Días:</span>
                    <span className="text-gray-900 font-medium">
                      {StakeholderAvailabilityService.getFormattedWorkingDays()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Horario:</span>
                    <span className="text-gray-900 font-medium">
                      {StakeholderAvailabilityService.getFormattedWorkingHours()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && challengeAssignment && (
          <div className="animate-fade-in">
            <ProjectMilestones
              challengeAssignmentId={challengeAssignment.id}
              onLinkGoogleCalendar={onLinkGoogleCalendar}
              isGoogleCalendarLinked={isGoogleCalendarLinked}
            />
          </div>
        )}
      </div>
    </div>
  )
}
