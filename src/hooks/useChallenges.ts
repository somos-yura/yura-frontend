import { useState, useEffect } from 'react'
import { challengesApi, ChallengeApiError, type GetSocialProblemsParams } from '../services/challengesApi'
import type { Challenge } from '../types/challenge'

export const useChallenges = (filters: GetSocialProblemsParams = {}) => {
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchChallenges = async (params: GetSocialProblemsParams = filters) => {
        setLoading(true)
        setError(null)

        try {
            const response = await challengesApi.getSocialProblems(params)
            setChallenges(response.data.problems)
        } catch (err) {
            const errorMessage = err instanceof ChallengeApiError
                ? err.message
                : 'Error al cargar los retos'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchChallenges(filters)
    }, [filters.category, filters.search])

    return {
        challenges,
        loading,
        error,
        refetch: () => fetchChallenges(filters),
        clearError: () => setError(null)
    }
}
