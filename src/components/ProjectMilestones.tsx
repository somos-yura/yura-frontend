import React, { useEffect, useState } from 'react'
import { Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { chatApi, type Milestone } from '../services/chatApi'
import { useAuthContext } from '../contexts/AuthContext'
import { EXTERNAL_URLS } from '../config/externalUrls'

interface ProjectMilestonesProps {
  challengeAssignmentId: string
  onLinkGoogleCalendar?: () => void
  isGoogleCalendarLinked?: boolean
  onMilestonesCountChange?: (count: number) => void
  showControls?: boolean
}

export const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  challengeAssignmentId,
  onLinkGoogleCalendar,
  isGoogleCalendarLinked = false,
  onMilestonesCountChange,
  showControls = true,
}) => {
  const { token } = useAuthContext()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!token) return
      try {
        const response = await chatApi.getMilestones(
          challengeAssignmentId,
          token
        )
        if (response.data && response.data.milestones) {
          const sorted = [...response.data.milestones].sort(
            (a, b) =>
              new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          )
          setMilestones(sorted)
          onMilestonesCountChange?.(sorted.length)
        } else {
          onMilestonesCountChange?.(0)
        }
      } catch (error) {
        console.error('Error fetching milestones:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMilestones()
  }, [challengeAssignmentId, token, onMilestonesCountChange])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50 sticky top-8">
      <h3 className="text-xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-2">
        <Calendar className="w-5 h-5 text-electricBlue" />
        Hitos Próximos
      </h3>

      {showControls && (
        <div className="mb-8 pb-6 border-b border-gray-100 flex flex-col gap-3">
          <button
            onClick={onLinkGoogleCalendar}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {isGoogleCalendarLinked
              ? 'Cambiar Google Calendar'
              : 'Vincular mi Google Calendar'}
          </button>

          <button
            onClick={() => window.open(EXTERNAL_URLS.GOOGLE.CALENDAR, '_blank')}
            className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            Ver en mi Google Calendar
          </button>
        </div>
      )}

      <div className="space-y-6 relative">
        {milestones.length > 0 ? (
          <>
            {/* Vertical line connector */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />

            {milestones.map((milestone) => (
              <div key={milestone.id} className="relative flex gap-4 group">
                <div className="relative z-10 flex-shrink-0 mt-1">
                  {milestone.status === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100 group-hover:border-electricBlue transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-electricBlue/40 group-hover:bg-electricBlue transition-colors" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground mb-1 line-clamp-1 group-hover:text-electricBlue transition-colors">
                    {milestone.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(milestone.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  {milestone.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                      {milestone.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-gray-400 font-medium">
              No hay hitos programados aún
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
