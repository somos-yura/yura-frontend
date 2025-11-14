import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Briefcase, CheckCircle2, ArrowRight } from "lucide-react"
import { Layout } from "../components/layout/Layout"
import { useState, useEffect } from "react"
import { challengesApi } from "../services/challengesApi"
import type { Challenge, SimulatedPerson } from "../types/challenge"

const ChallengeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [challenge, setChallenge] = useState<Challenge | null>(null)
    const [simulatedPersons, setSimulatedPersons] = useState<SimulatedPerson[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingPersons, setLoadingPersons] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!id) return
            
            setLoading(true)
            setError(null)
            
            try {
                const problem = await challengesApi.getSocialProblemById(id)
                if (problem) {
                    setChallenge(problem)
                    
                    if (problem.category && problem.category.length > 0) {
                        setLoadingPersons(true)
                        try {
                            const personsResponse = await challengesApi.getSimulatedPersons(problem.category[0])
                            setSimulatedPersons(personsResponse.data.slice(0, 4))
                        } catch (err) {
                            console.error('Error al cargar personas simuladas:', err)
                        } finally {
                            setLoadingPersons(false)
                        }
                    }
                } else {
                    setError('Problema social no encontrado')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el problema social')
            } finally {
                setLoading(false)
            }
        }

        fetchChallenge()
    }, [id])

    const getRandomImage = () => {
        if (challenge?.images && challenge.images.length > 0) {
            const randomIndex = Math.floor(Math.random() * challenge.images.length)
            return challenge.images[randomIndex]
        }
        return "/photo.png"
    }

    const getCategoryDisplay = () => {
        if (challenge?.category && challenge.category.length > 0) {
            return challenge.category[0]
        }
        return "Sin categoría"
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
                        <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate("/dashboard", { replace: true })
                            }}
                            className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors cursor-pointer"
                            type="button"
                        >
                            Volver al Dashboard
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
                        <p className="text-muted-foreground mb-6">El reto que buscas no existe o ha sido eliminado</p>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate("/dashboard", { replace: true })
                            }}
                            className="px-6 py-3 bg-electricBlue text-white rounded-lg font-semibold hover:bg-[#1873CC] transition-colors cursor-pointer"
                            type="button"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="w-full">
                <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-none md:rounded-xl mb-8">
                    <img
                        src={getRandomImage()}
                        alt={challenge.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate("/dashboard", { replace: true })
                            }}
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg transition-all cursor-pointer"
                            aria-label="Volver al dashboard"
                            type="button"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Dashboard</span>
                        </button>
                    </div>

                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white text-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                                    {getCategoryDisplay()}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 font-montserrat text-balance">
                                {challenge.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
                    {challenge.career_types && challenge.career_types.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-10">
                            {challenge.career_types.map((careerType, index) => {
                                const colorClasses = [
                                    { container: 'career-type-purple', icon: 'career-type-purple-icon' },
                                    { container: 'career-type-green', icon: 'career-type-green-icon' },
                                    { container: 'career-type-blue', icon: 'career-type-blue-icon' },
                                    { container: 'career-type-orange', icon: 'career-type-orange-icon' }
                                ]
                                const colorScheme = colorClasses[index % colorClasses.length]
                                
                                return (
                                    <div
                                        key={index}
                                        className={`${colorScheme.container} border rounded-lg px-3 py-2 flex items-center gap-2`}
                                    >
                                        <Briefcase className={`w-4 h-4 ${colorScheme.icon}`} />
                                        <span className="text-sm font-medium text-foreground">{careerType}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="w-full space-y-8">
                        {challenge.description && (
                            <section className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-foreground mb-4 font-montserrat flex items-center gap-2">
                                    Descripción General
                                </h2>
                                <p className="text-muted-foreground leading-relaxed text-base">{challenge.description}</p>
                            </section>
                        )}

                        {challenge.sources && challenge.sources.length > 0 && (
                            <section className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-foreground mb-6 font-montserrat flex items-center gap-2">
                                    Fuentes de Información
                                </h2>
                                <ul className="space-y-4">
                                    {challenge.sources.map((source, index) => (
                                        <li key={index} className="flex items-start gap-4 group">
                                            <div className="w-8 h-8 rounded-lg bg-electricBlue/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-electricBlue/20 transition-colors">
                                                <CheckCircle2 className="w-4 h-4 text-electricBlue" />
                                            </div>
                                            <a
                                                href={source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-electricBlue hover:text-[#1873CC] hover:underline transition-colors break-all leading-relaxed pt-0.5"
                                            >
                                                {source}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-foreground mb-3 font-montserrat flex items-center gap-2">
                                Presentado por
                            </h2>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Comunícate con los stakeholders para unirte y comenzar a colaborar.
                            </p>
                            {loadingPersons ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="bg-white border border-border rounded-xl p-6 animate-pulse flex flex-col">
                                            <div className="space-y-3">
                                                <div className="h-6 bg-muted rounded w-3/4" />
                                                <div className="h-4 bg-muted rounded w-1/2" />
                                                <div className="h-20 bg-muted rounded" />
                                                <div className="h-10 bg-muted rounded w-32 ml-auto" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : simulatedPersons.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {simulatedPersons.map((person, index) => (
                                        <div key={index} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-all flex flex-col h-full">
                                            <div className="flex flex-col flex-1">
                                                <div className="mb-4">
                                                    <h3 className="text-xl font-bold text-foreground mb-2 font-montserrat line-clamp-2">
                                                        {person.first_name} {person.last_name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                                                        {person.expertise_areas && person.expertise_areas.length > 0 && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-purple-500 font-semibold">
                                                                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                                                                    <span className="truncate">{person.expertise_areas[0]}</span>
                                                                </div>
                                                                <span className="text-muted-foreground">•</span>
                                                            </>
                                                        )}
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <span className="truncate">{person.age} años</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 mb-4 min-h-[80px]">
                                                    <p className="text-muted-foreground leading-relaxed text-sm line-clamp-4 overflow-hidden text-ellipsis">
                                                        {person.bio}
                                                    </p>
                                                </div>
                                                <div className="flex justify-end mt-auto">
                                                    <button
                                                        onClick={() => navigate(`/challenge/${challenge.id}/chat`)}
                                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-electricBlue text-white rounded-xl font-semibold shadow-md hover:bg-[#1873CC] hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electricBlue focus:ring-offset-2"
                                                    >
                                                        <span>Contactarse</span>
                                                        <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No hay personas disponibles para contactar en este momento.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ChallengeDetail
