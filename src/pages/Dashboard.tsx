import type React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Users, Target, Award } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { ChallengeCard } from '../components/ChallengeCard'
import { useChallenges } from '../hooks/useChallenges'
import { useDashboardFilters } from '../hooks/useDashboardFilters'
import type { Challenge } from '../types/challenge'
import { useMemo, useRef, useEffect } from 'react'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useDashboardFilters()

  const filters = useMemo(
    () => ({
      search: searchQuery || undefined,
      category: selectedCategory !== 'Todos' ? selectedCategory : undefined,
    }),
    [searchQuery, selectedCategory]
  )

  const {
    challenges,
    loading: challengesLoading,
    error: challengesError,
  } = useChallenges(filters)

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    challenges.forEach((challenge) => {
      if (challenge.category && Array.isArray(challenge.category)) {
        challenge.category.forEach((cat) => uniqueCategories.add(cat))
      }
    })
    return ['Todos', ...Array.from(uniqueCategories).sort()]
  }, [challenges])

  useEffect(() => {
    if (
      inputRef.current &&
      searchQuery &&
      document.activeElement !== inputRef.current
    ) {
      const selectionStart = inputRef.current.selectionStart
      const selectionEnd = inputRef.current.selectionEnd
      inputRef.current.focus()
      if (selectionStart !== null && selectionEnd !== null) {
        inputRef.current.setSelectionRange(selectionStart, selectionEnd)
      }
    }
  }, [challenges, searchQuery])

  const handleExploreChallenge = (challenge: Challenge) => {
    navigate(`/challenge/${challenge.id}`)
  }

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '¡Buenos días!'
    if (hour < 18) return '¡Buenas tardes!'
    return '¡Buenas noches!'
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalChallenges = challenges.length
    const categoryCount = new Set(challenges.flatMap((c) => c.category || []))
      .size

    return {
      totalChallenges,
      activeChallenges: Math.floor(totalChallenges * 0.7), // Mock data
      categoryCount,
      completionRate: 68, // Mock data
    }
  }, [challenges])

  if (challengesLoading) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-muted-foreground text-lg">
              Cargando tu panel...
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (challengesError) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center bg-red-50 rounded-2xl p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-semibold">
              Error al cargar los retos
            </p>
            <p className="text-red-500 text-sm mt-2">{challengesError}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full px-4 md:px-8 pb-12">
        {/* Hero Section with Greeting and CTA */}
        <div className="dashboard-hero mb-8 rounded-3xl p-8 md:p-10 relative overflow-hidden bg-white border-2 border-blue-300">
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
                  {getGreeting()} 👋
                </h1>
                <p className="text-gray-700 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                  Explora retos sociales impactantes y únete a nuestra comunidad
                  para crear un cambio positivo.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <div className="bg-blue-50 rounded-xl px-5 py-3 border border-blue-200 hover:bg-blue-100 transition-all shadow-sm">
                    <div className="text-gray-700 text-xs mb-1">
                      Retos Activos
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalChallenges}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl px-5 py-3 border border-blue-200 hover:bg-blue-100 transition-all shadow-sm">
                    <div className="text-gray-700 text-xs mb-1">
                      Tasa de Éxito
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.completionRate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="stats-card-enhanced group bg-gradient-to-br from-blue-200 to-blue-300 text-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/60 text-xs font-semibold flex items-center gap-1 text-gray-700">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <div>
              <p className="text-gray-700 text-sm mb-1">Total de Retos</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                {stats.totalChallenges}
              </p>
              <p className="text-xs text-gray-600 mt-2">Desde el mes pasado</p>
            </div>
          </div>

          <div className="stats-card-enhanced group bg-gradient-to-br from-purple-200 to-purple-300 text-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/60 text-xs font-semibold flex items-center gap-1 text-gray-700">
                <TrendingUp className="w-3 h-3" />
                +8%
              </div>
            </div>
            <div>
              <p className="text-gray-700 text-sm mb-1">Retos Activos</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                {stats.activeChallenges}
              </p>
              <p className="text-xs text-gray-600 mt-2">En progreso ahora</p>
            </div>
          </div>

          <div className="stats-card-enhanced group bg-gradient-to-br from-emerald-200 to-emerald-300 text-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/60 text-xs font-semibold text-gray-700">
                Activas
              </div>
            </div>
            <div>
              <p className="text-gray-700 text-sm mb-1">Categorías</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                {stats.categoryCount}
              </p>
              <p className="text-xs text-gray-600 mt-2">Áreas de impacto</p>
            </div>
          </div>

          <div className="stats-card-enhanced group bg-gradient-to-br from-orange-200 to-orange-300 text-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/60 text-xs font-semibold flex items-center gap-1 text-gray-700">
                <TrendingUp className="w-3 h-3" />
                +5%
              </div>
            </div>
            <div>
              <p className="text-gray-700 text-sm mb-1">Tasa de Éxito</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                {stats.completionRate}%
              </p>
              <p className="text-xs text-gray-600 mt-2">Mejorando cada mes</p>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Explorar Retos
            </h2>
            <p className="text-sm text-gray-500">
              {challenges.length} retos disponibles
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar retos por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all duration-200 text-base shadow-sm"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-chip ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-300 to-blue-200 text-gray-800 shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ChallengeCard
                challenge={challenge}
                onExplore={handleExploreChallenge}
              />
            </div>
          ))}
        </div>

        {challenges.length === 0 && !challengesLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron retos
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No encontramos retos que coincidan con tu búsqueda. Intenta con
              otros términos o categorías.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
