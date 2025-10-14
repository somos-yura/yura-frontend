import { useState, useMemo } from 'react'
import type { Challenge } from '../types/challenge'

export const useDashboardFilters = (challenges: Challenge[]) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")

    const filteredChallenges = useMemo(() => {
        return challenges.filter((challenge) => {
            const matchesSearch =
                challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "Todos" || challenge.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [challenges, searchQuery, selectedCategory])

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("Todos")
    }

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredChallenges,
        clearFilters
    }
}
