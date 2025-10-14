import { useState, useEffect } from 'react'
import { challengesApi, ChallengeApiError } from '../services/challengesApi'
import type { Challenge } from '../types/challenge'

export const useChallenges = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchChallenges = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await challengesApi.getAllChallenges()
            setChallenges(response.data)
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
        fetchChallenges()
    }, [])

    return {
        challenges,
        loading,
        error,
        refetch: fetchChallenges,
        clearError: () => setError(null)
    }
}
