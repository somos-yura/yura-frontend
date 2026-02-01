import type React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
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
        <div className="dashboard-hero mb-8 rounded-3xl p-8 md:p-10 relative overflow-hidden bg-white border border-blue-200">
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
                  {getGreeting()} 👋
                </h1>

                <p className="text-gray-700 text-base md:text-lg max-w-4xl leading-relaxed">
                  Impulsamos desafíos de innovación abierta para descubrir y
                  escalar soluciones tecnológicas a los retos más complejos de
                  nuestro tiempo. Conectamos talento global a través de una
                  plataforma y metodología probadas.
                </p>

                <p className="mt-3 text-gray-600 font-bold">
                  Y esto recién comienza.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Explorar Problemas Sociales
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
