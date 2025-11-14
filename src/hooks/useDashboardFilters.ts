import { useState } from 'react'

export const useDashboardFilters = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("Todos")
    }

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        clearFilters
    }
}
