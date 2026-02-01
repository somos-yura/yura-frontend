import type React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Briefcase,
  ArrowRight,
  User,
  Award,
  Heart,
  Sparkles,
} from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { useState, useEffect, useMemo, useRef } from 'react'
import { challengesApi, ChallengeApiError } from '../services/challengesApi'
import type { Challenge, ChallengeAssignment } from '../types/challenge'
import { ConfirmationModal } from '../components/ui/ConfirmationModal'
import { ContactLoadingModal } from '../components/ui/ContactLoadingModal'
import { MessageAlert } from '../components/ui/MessageAlert'
import { useAuthContext } from '../contexts/AuthContext'
import { ProjectMilestones } from '../components/ProjectMilestones'
import { capitalizeFirstLetter } from '../utils/textUtils'

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const getBackPath = () => {
    const from = (location.state as { from?: string })?.from
    return from || '/dashboard'
  }
  const { user } = useAuthContext()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [currentAssignment, setCurrentAssignment] =
    useState<ChallengeAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [milestoneCount, setMilestoneCount] = useState<number>(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const problem = await challengesApi.getSocialProblemById(id)
        if (problem) {
          setChallenge(problem)

          if (user?.id) {
            try {
              const assignmentsResponse =
                await challengesApi.getStudentAssignments(user.id)
              const assignment = assignmentsResponse.data.assignments.find(
                (a: ChallengeAssignment) =>
                  String(a.social_problem_id) === String(id)
              )
              if (assignment) {
                setCurrentAssignment(assignment)
              }
            } catch {
              // Ignore error if assignment not found
            }
          }
        } else {
          setError('Problema social no encontrado')
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

    fetchChallenge()
  }, [id, user?.id])

  const challengeImage = useMemo(() => {
    if (challenge?.images && challenge.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * challenge.images.length)
      return challenge.images[randomIndex]
    }
    return '/photo.png'
  }, [challenge?.images])

  const getCategoryDisplay = () => {
    if (challenge?.category && challenge.category.length > 0) {
      return capitalizeFirstLetter(challenge.category[0])
    }
    return 'Sin categoría'
  }

  const handleContactClick = () => {
    if (currentAssignment) {
      navigate(`/challenge/${challenge?.id}/chat`, {
        state: { from: getBackPath() },
      })
      return
    }
    setAssignmentError(null)
    setShowConfirmationModal(true)
  }

  const handleConfirmContact = async () => {
    if (!challenge || !user) {
      setAssignmentError('Faltan datos necesarios para realizar el contacto')
      setShowConfirmationModal(false)
      return
    }

    setShowConfirmationModal(false)
    setShowLoadingModal(true)
    setAssignmentError(null)

    try {
      const assignmentResponse = await challengesApi.createAssignment({
        social_problem_id: challenge.id,
        student_id: user.id,
      })

      setCurrentAssignment(assignmentResponse.data)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setShowLoadingModal(false)
        navigate(`/challenge/${challenge.id}/chat`, {
          state: { from: getBackPath() },
        })
      }, 2500)
    } catch (err) {
      setShowLoadingModal(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      const errorMessage =
        err instanceof ChallengeApiError
          ? err.message
          : 'Error al crear la asignación del reto'
      setAssignmentError(errorMessage)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCancelContact = () => {
    setShowConfirmationModal(false)
  }

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="h-[400px] bg-muted animate-pulse rounded-xl mb-8" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="h-32 bg-muted animate-pulse rounded-xl" />
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
          </div>
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
              Error al cargar
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(getBackPath(), { replace: true })
              }}
              className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors cursor-pointer"
              type="button"
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
              El reto que buscas no existe o ha sido eliminado
            </p>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(getBackPath(), { replace: true })
              }}
              className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors cursor-pointer"
              type="button"
            >
              Volver
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout noPadding>
      <div className="w-full bg-gray-50 min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={challengeImage}
              alt={challenge.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-20">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (window.history.length > 1 && location.key !== 'default') {
                  navigate(-1)
                } else {
                  navigate(getBackPath(), { replace: true })
                }
              }}
              className="group inline-flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-white/10"
              aria-label="Volver"
              type="button"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver</span>
            </button>
          </div>

          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="animate-fade-in-up space-y-6 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-electricBlue text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-electricBlue/20 backdrop-blur-sm border border-white/10">
                    {getCategoryDisplay()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content Area */}
            <div className="flex-1 space-y-12 min-w-0">
              {/* Description Section */}
              {challenge.description && (
                <section className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-black/5 border border-border/50">
                  <h2 className="text-2xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-3">
                    <div className="w-1 h-8 bg-electricBlue rounded-full" />
                    Sobre el Reto
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-muted-foreground leading-relaxed [&_section]:space-y-6 [&_section]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:font-montserrat [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:mt-5 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: challenge.description,
                    }}
                  />
                </section>
              )}

              {/* Sources Section */}
              {challenge.sources && challenge.sources.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-3 px-2">
                    <div className="w-1 h-8 bg-electricBlue rounded-full" />
                    Recursos y Fuentes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {challenge.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-electricBlue/30 transition-all duration-300 flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-electricBlue/5 flex items-center justify-center flex-shrink-0 group-hover:bg-electricBlue/10 transition-colors">
                          <ArrowRight className="w-5 h-5 text-electricBlue -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate mb-1">
                            Fuente {index + 1}
                          </p>
                          <p className="text-xs text-muted-foreground truncate group-hover:text-electricBlue transition-colors">
                            {source}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Habilidades y Perfiles Requeridos */}
              <h2 className="text-2xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-3">
                <div className="w-1 h-8 bg-electricBlue rounded-full" />
                Habilidades deseables
              </h2>
              <section className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-black/5 border border-border/50">
                <p className="text-muted-foreground mb-8 text-lg">
                  Para sumar valor a este proyecto social, sería ideal (pero no
                  excluyente) tener conocimientos en:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {challenge.career_types.map((type, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-electricBlue/20 transition-colors group"
                      >
                        <div>
                          <p className="font-bold">
                            {capitalizeFirstLetter(type)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Stakeholders Section */}
              <section className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-electricBlue/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                <div className="relative z-10 mb-10 text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-foreground mb-4 font-montserrat flex items-center justify-center gap-3">
                    <User className="w-8 h-8 text-electricBlue" />
                    Conecta con {challenge.person_first_name}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Esta es la persona asignada a este problema social. Conoce
                    más sobre con{' '}
                    <strong>quién trabajarás y cómo podrás ayudarle</strong>. Al
                    contactar,{' '}
                    <strong>iniciarás tu compromiso con este reto.</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>
                      ** La persona asignada es impulsada por inteligencia
                      artificial, no es una persona real.
                    </strong>
                  </p>
                </div>

                {assignmentError && (
                  <div className="mb-8 max-w-3xl mx-auto">
                    <MessageAlert type="error" message={assignmentError} />
                  </div>
                )}

                {challenge ? (
                  <div className="max-w-full mx-auto">
                    <div
                      className={`
                        group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden
                        ${
                          currentAssignment
                            ? 'border-electricBlue ring-2 ring-electricBlue/20 shadow-xl shadow-electricBlue/10 scale-[1.02]'
                            : 'border-border/50 hover:border-electricBlue/30 hover:shadow-xl hover:-translate-y-1'
                        }
                      `}
                    >
                      <div className="bg-gradient-to-r from-electricBlue/5 via-blue-50/50 to-transparent p-6 border-b border-border/30">
                        <div className="flex items-start gap-6">
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-electricBlue to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-electricBlue/30">
                              {challenge.person_first_name[0]}
                              {challenge.person_last_name[0]}
                            </div>
                            {currentAssignment && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-foreground mb-2 font-montserrat">
                              {challenge.person_first_name}{' '}
                              {challenge.person_last_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              {challenge.person_age && (
                                <div className="flex items-center gap-1.5">
                                  <User className="w-4 h-4" />
                                  <span>{challenge.person_age} años</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {challenge.person_bio && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                              <div className="w-1 h-4 bg-electricBlue rounded-full" />
                              Sobre {challenge.person_first_name}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {challenge.person_bio}
                            </p>
                          </div>
                        )}

                        {challenge.person_personality_traits &&
                          challenge.person_personality_traits.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                                <Sparkles className="w-4 h-4 text-electricBlue" />
                                Rasgos de Personalidad
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {challenge.person_personality_traits.map(
                                  (trait, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-100"
                                    >
                                      <Heart className="w-3.5 h-3.5" />
                                      {capitalizeFirstLetter(trait)}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {challenge.person_expertise_areas &&
                          challenge.person_expertise_areas.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                                <Award className="w-4 h-4 text-electricBlue" />
                                Áreas de Experiencia
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {challenge.person_expertise_areas.map(
                                  (area, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center bg-blue-50 text-electricBlue px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100"
                                    >
                                      {capitalizeFirstLetter(area)}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="pt-4 border-t border-border/30">
                          <button
                            onClick={handleContactClick}
                            className={`
                              w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-base
                              ${
                                currentAssignment
                                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
                                  : 'bg-electricBlue text-white hover:bg-[#1873CC] shadow-lg shadow-electricBlue/25 hover:shadow-electricBlue/40'
                              }
                            `}
                          >
                            {currentAssignment ? (
                              <>
                                <span>Continuar Chat</span>
                                <ArrowRight className="w-5 h-5" />
                              </>
                            ) : (
                              <>
                                <span>Iniciar Colaboración</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                          {!currentAssignment && (
                            <p className="text-xs text-center text-muted-foreground mt-3">
                              Al contactar, te comprometerás a trabajar en este
                              reto social
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-border/50">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay stakeholder disponible
                    </h3>
                    <p className="text-muted-foreground">
                      En este momento no hay persona asignada a este reto.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar with Milestones */}
            {currentAssignment && milestoneCount > 0 && (
              <aside className="w-full lg:w-80 flex-shrink-0 animate-fade-in">
                <ProjectMilestones
                  challengeAssignmentId={currentAssignment.id}
                  onMilestonesCountChange={setMilestoneCount}
                  showControls={false}
                />
              </aside>
            )}

            {currentAssignment && milestoneCount === 0 && (
              <div className="hidden">
                <ProjectMilestones
                  challengeAssignmentId={currentAssignment.id}
                  onMilestonesCountChange={setMilestoneCount}
                  showControls={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelContact}
        onConfirm={handleConfirmContact}
        title={`¿Deseas contactar a ${challenge.person_first_name} ${challenge.person_last_name}?`}
        message="Al hacerlo, te comprometerás a trabajar en este reto social."
        confirmText="Sí, contactar"
        cancelText="Cancelar"
      />

      <ContactLoadingModal
        isOpen={showLoadingModal}
        personName={
          challenge
            ? `${challenge.person_first_name} ${challenge.person_last_name}`
            : ''
        }
      />
    </Layout>
  )
}

export default ChallengeDetail
