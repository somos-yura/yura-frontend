import { useState, useEffect } from 'react'
import { categoriesApi, CategoryApiError } from '../services/categoriesApi'
import type { Category } from '../services/categoriesApi'

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await categoriesApi.getAllCategories()
            setCategories(response.data)
        } catch (err) {
            const errorMessage = err instanceof CategoryApiError
                ? err.message
                : 'Error al cargar las categorías'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const getCategoryNames = (): string[] => {
        return ["Todos", ...categories.map(category => category.name).sort()]
    }

    const getCategoryBySlug = (slug: string): Category | undefined => {
        return categories.find(category => category.slug === slug)
    }

    return {
        categories,
        loading,
        error,
        getCategoryNames,
        getCategoryBySlug,
        refetch: fetchCategories,
        clearError: () => setError(null)
    }
}
