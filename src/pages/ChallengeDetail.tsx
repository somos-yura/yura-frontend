import type React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Briefcase, ArrowRight } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { useState, useEffect, useMemo, useRef } from 'react'
import { challengesApi, ChallengeApiError } from '../services/challengesApi'
import type {
  Challenge,
  SimulatedPerson,
  ChallengeAssignment,
} from '../types/challenge'
import { ConfirmationModal } from '../components/ui/ConfirmationModal'
import { ContactLoadingModal } from '../components/ui/ContactLoadingModal'
import { MessageAlert } from '../components/ui/MessageAlert'
import { useAuthContext } from '../contexts/AuthContext'

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const getBackPath = () => {
    const from = (location.state as { from?: string })?.from
    return from || '/dashboard'
  }
  const { user, token } = useAuthContext()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [simulatedPersons, setSimulatedPersons] = useState<SimulatedPerson[]>(
    []
  )
  const [currentAssignment, setCurrentAssignment] =
    useState<ChallengeAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingPersons, setLoadingPersons] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<SimulatedPerson | null>(
    null
  )
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

          if (problem.category && problem.category.length > 0) {
            setLoadingPersons(true)
            try {
              const personsResponse = await challengesApi.getSimulatedPersons(
                problem.category[0]
              )
              setSimulatedPersons(personsResponse.data.slice(0, 4))
            } catch {
              setError('Error al cargar las personas simuladas')
            } finally {
              setLoadingPersons(false)
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
      return challenge.category[0]
    }
    return 'Sin categoría'
  }

  const handleContactClick = (person: SimulatedPerson) => {
    if (currentAssignment) {
      navigate(
        `/challenge/${challenge?.id}/chat?person_id=${currentAssignment.simulated_person_id}`,
        {
          state: { from: getBackPath() },
        }
      )
      return
    }
    setSelectedPerson(person)
    setAssignmentError(null)
    setShowConfirmationModal(true)
  }

  const isPersonAssigned = (personId: string): boolean => {
    return currentAssignment?.simulated_person_id === personId
  }

  const getDisplayedPersons = (): SimulatedPerson[] => {
    if (currentAssignment) {
      const assignedPerson = simulatedPersons.find(
        (person) => person.id === currentAssignment.simulated_person_id
      )
      return assignedPerson ? [assignedPerson] : []
    }
    return simulatedPersons
  }

  const handleConfirmContact = async () => {
    if (!challenge || !selectedPerson || !user || !token) {
      setAssignmentError('Faltan datos necesarios para realizar el contacto')
      setShowConfirmationModal(false)
      return
    }

    setShowConfirmationModal(false)
    setShowLoadingModal(true)
    setAssignmentError(null)

    try {
      const assignmentResponse = await challengesApi.createAssignment(
        {
          simulated_person_id: selectedPerson.id,
          social_problem_id: challenge.id,
          student_id: user.id,
        },
        token
      )

      setCurrentAssignment(assignmentResponse.data)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setShowLoadingModal(false)
        navigate(
          `/challenge/${challenge.id}/chat?person_id=${selectedPerson.id}`,
          {
            state: { from: getBackPath() },
          }
        )
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
    setSelectedPerson(null)
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
    <Layout>
      <div className="w-full bg-gray-50/50 min-h-screen pb-20">
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
                navigate(getBackPath(), { replace: true })
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
                  {challenge.career_types?.map((careerType, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 flex items-center gap-2"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      {careerType}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-montserrat leading-tight text-balance shadow-sm">
                  {challenge.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 space-y-12">
          {/* Description Section */}
          {challenge.description && (
            <section className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-black/5 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-3">
                <div className="w-1 h-8 bg-electricBlue rounded-full" />
                Sobre el Reto
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-line">{challenge.description}</p>
              </div>
            </section>
          )}

          {/* Sources Section */}
          {challenge.sources && challenge.sources.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-3 px-2">
                <div className="w-1 h-8 bg-electricBlue rounded-full" />
                Recursos y Fuentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Stakeholders Section */}
          <section className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl p-8 md:p-12 border border-border/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-electricBlue/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="relative z-10 mb-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-montserrat">
                Conecta con un Stakeholder
              </h2>
              <p className="text-muted-foreground text-lg">
                Selecciona a la persona con la que te gustaría colaborar. Al
                contactar, iniciarás tu compromiso con este reto.
              </p>
            </div>

            {assignmentError && (
              <div className="mb-8 max-w-2xl mx-auto">
                <MessageAlert type="error" message={assignmentError} />
              </div>
            )}

            {loadingPersons ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 h-[400px] animate-pulse border border-border/50"
                  />
                ))}
              </div>
            ) : getDisplayedPersons().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getDisplayedPersons().map((person) => {
                  const isAssigned = isPersonAssigned(person.id)

                  return (
                    <div
                      key={person.id}
                      className={`
                                                group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden
                                                ${
                                                  isAssigned
                                                    ? 'border-electricBlue ring-2 ring-electricBlue/20 shadow-xl shadow-electricBlue/10 scale-[1.02]'
                                                    : 'border-border/50 hover:border-electricBlue/30 hover:shadow-xl hover:-translate-y-1'
                                                }
                                            `}
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shadow-inner">
                            {person.first_name[0]}
                            {person.last_name[0]}
                          </div>
                          {person.expertise_areas?.[0] && (
                            <span className="bg-blue-50 text-electricBlue text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                              {person.expertise_areas[0]}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 font-montserrat">
                          {person.first_name} {person.last_name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <span>{person.age} años</span>
                          <span>•</span>
                          <span className="truncate">Stakeholder</span>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 mb-6 flex-1">
                          {person.bio}
                        </p>

                        <button
                          onClick={() => handleContactClick(person)}
                          className={`
                                                        w-full py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300
                                                        ${
                                                          isAssigned
                                                            ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25'
                                                            : 'bg-electricBlue text-white hover:bg-[#1873CC] shadow-lg shadow-electricBlue/25'
                                                        }
                                                    `}
                        >
                          {isAssigned ? (
                            <>
                              <span>Continuar Chat</span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              <span>Contactar</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-border/50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay stakeholders disponibles
                </h3>
                <p className="text-muted-foreground">
                  En este momento no hay personas asignadas a este reto.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelContact}
        onConfirm={handleConfirmContact}
        title="Iniciar Colaboración"
        message={
          selectedPerson
            ? `¿Deseas contactar a ${selectedPerson.first_name} ${selectedPerson.last_name}? Al hacerlo, te comprometerás a trabajar en este reto social.`
            : '¿Estás seguro de que deseas contactarte para llevar a cabo este proyecto?'
        }
        confirmText="Sí, contactar"
        cancelText="Cancelar"
      />

      <ContactLoadingModal
        isOpen={showLoadingModal}
        personName={
          selectedPerson
            ? `${selectedPerson.first_name} ${selectedPerson.last_name}`
            : ''
        }
      />
    </Layout>
  )
}

export default ChallengeDetail
