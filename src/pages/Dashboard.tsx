import type React from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Layout } from "../components/layout/Layout"
import { ChallengeCard } from "../components/ChallengeCard"
import { useChallenges } from "../hooks/useChallenges"
import { useDashboardFilters } from "../hooks/useDashboardFilters"
import type { Challenge } from "../types/challenge"
import { useMemo, useRef, useEffect } from "react"

const Dashboard: React.FC = () => {
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
    } = useDashboardFilters()

    const filters = useMemo(() => ({
        search: searchQuery || undefined,
        category: selectedCategory !== "Todos" ? selectedCategory : undefined
    }), [searchQuery, selectedCategory])

    const { challenges, loading: challengesLoading, error: challengesError } = useChallenges(filters)

    const categories = useMemo(() => {
        const uniqueCategories = new Set<string>()
        challenges.forEach(challenge => {
            if (challenge.category && Array.isArray(challenge.category)) {
                challenge.category.forEach(cat => uniqueCategories.add(cat))
            }
        })
        return ["Todos", ...Array.from(uniqueCategories).sort()]
    }, [challenges])

    useEffect(() => {
        if (inputRef.current && searchQuery && document.activeElement !== inputRef.current) {
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

    if (challengesLoading) {
        return (
            <Layout>
                <div className="w-full">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">Cargando...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (challengesError) {
        return (
            <Layout>
                <div className="w-full">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">Error: {challengesError}</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="w-full px-6">
                <div className="mb-8">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Buscar retos por nombre o descripción..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                                        ? "bg-blue-500 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Challenges Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                    {challenges.map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            onExplore={handleExploreChallenge}
                        />
                    ))}
                </div>

                {challenges.length === 0 && !challengesLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No se encontraron retos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Dashboard