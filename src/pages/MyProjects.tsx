import type React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Loader2, FolderOpen, Eye } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { useAuthContext } from '../contexts/AuthContext'
import { challengesApi, ChallengeApiError } from '../services/challengesApi'
import type { ChallengeAssignment, Challenge } from '../types/challenge'
import { capitalizeFirstLetter } from '../utils/textUtils'

interface ProjectWithAssignment {
  challenge: Challenge
  assignment: ChallengeAssignment
}

const MyProjects: React.FC = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectWithAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActiveProjects = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const assignmentsResponse = await challengesApi.getStudentAssignments(
          user.id
        )
        const assignments = assignmentsResponse.data.assignments

        if (assignments.length === 0) {
          setProjects([])
          setLoading(false)
          return
        }

        const projectsData: ProjectWithAssignment[] = []

        for (const assignment of assignments) {
          try {
            const challenge = await challengesApi.getSocialProblemById(
              assignment.social_problem_id
            )
            if (challenge) {
              projectsData.push({
                challenge,
                assignment,
              })
            }
          } catch (err) {
            console.error(
              `Error fetching challenge ${assignment.social_problem_id}:`,
              err
            )
          }
        }

        setProjects(projectsData)
      } catch (err) {
        if (err instanceof ChallengeApiError) {
          setError(err.message)
        } else {
          setError('Error al cargar los proyectos activos')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchActiveProjects()
  }, [user?.id])

  const handleProjectClick = (project: ProjectWithAssignment) => {
    navigate(`/challenge/${project.challenge.id}/chat`, {
      state: { from: '/my-projects' },
    })
  }

  const handleViewDetails = (project: ProjectWithAssignment) => {
    navigate(`/challenge/${project.challenge.id}`, {
      state: { from: '/my-projects' },
    })
  }

  const getRandomImage = (challenge: Challenge) => {
    if (challenge.images && challenge.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * challenge.images.length)
      return challenge.images[randomIndex]
    }
    return '/photo.png'
  }

  const getCategoryDisplay = (challenge: Challenge) => {
    if (challenge.category && challenge.category.length > 0) {
      return capitalizeFirstLetter(challenge.category[0])
    }
    return 'Sin categoría'
  }

  if (loading) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Cargando tus proyectos...
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Error al cargar
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="w-full px-6 lg:px-12 py-8 lg:py-12">
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Mis Proyectos
                </h1>
                <p className="text-lg text-gray-600">
                  Proyectos en los que estás trabajando actualmente
                </p>
              </div>
            </div>
            {projects.length > 0 && (
              <div className="mt-4 px-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {projects.length} proyecto{projects.length !== 1 ? 's' : ''}{' '}
                  activo{projects.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                No tienes proyectos activos
              </h2>
              <p className="text-gray-500 text-center mb-8 max-w-md">
                Comienza explorando los retos disponibles en el dashboard
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explorar Problemas Sociales
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <div
                  key={project.assignment.id}
                  className="relative border-2 border-gray-200 rounded-3xl overflow-hidden transition-all duration-300 group hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col h-[420px] bg-white hover:-translate-y-2 hover:border-blue-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getRandomImage(project.challenge)}
                      alt={project.challenge.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold bg-white/95 text-gray-900 px-4 py-2 rounded-full shadow-xl backdrop-blur-md border border-white/60 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                        {getCategoryDisplay(project.challenge)}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
                  </div>

                  <div className="relative flex-1 flex flex-col p-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 font-montserrat line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {project.challenge.title}
                      </h3>
                      <div
                        className="text-gray-600 text-sm leading-relaxed mb-4 overflow-hidden max-h-[72px] [&_section]:space-y-1 [&_section]:block [&_h2]:hidden [&_h3]:hidden [&_p]:text-gray-600 [&_p]:text-sm [&_p]:mb-1 [&_p]:line-clamp-2 [&_p]:last:mb-0 [&_strong]:font-semibold [&_strong]:text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: project.challenge.description,
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Progreso
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          45%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProjectClick(project)
                        }}
                        className="flex-1 bg-gradient-to-r from-sky-500 to-sky-400 text-white font-montserrat font-bold py-3 px-4 rounded-2xl hover:from-sky-600 hover:to-sky-500 hover:shadow-2xl hover:shadow-sky-300 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Ir al Chat</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(project)
                        }}
                        className="px-4 bg-white border-2 border-gray-300 text-gray-700 font-montserrat font-bold py-3 rounded-2xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyProjects
