import type React from "react"
import { Search } from "lucide-react"
import { Layout } from "../components/layout/Layout"
import { ChallengeCard } from "../components/ChallengeCard"
import { useChallenges } from "../hooks/useChallenges"
import { useCategories } from "../hooks/useCategories"
import { useDashboardFilters } from "../hooks/useDashboardFilters"
import type { Challenge } from "../types/challenge"

const Dashboard: React.FC = () => {
    const { challenges, loading: challengesLoading, error: challengesError } = useChallenges()
    const { loading: categoriesLoading, error: categoriesError, getCategoryNames } = useCategories()
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredChallenges
    } = useDashboardFilters(challenges)

    const handleExploreChallenge = (challenge: Challenge) => {
        console.log("Explorando reto:", challenge.title)
    }

    if (challengesLoading || categoriesLoading) {
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

    if (challengesError || categoriesError) {
        return (
            <Layout>
                <div className="w-full">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">Error: {challengesError || categoriesError}</p>
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
                            type="text"
                            placeholder="Buscar retos por nombre o descripción..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {getCategoryNames().map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                                    selectedCategory === category
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
                    {filteredChallenges.map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            onExplore={handleExploreChallenge}
                        />
                    ))}
                </div>

                {filteredChallenges.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No se encontraron retos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Dashboard