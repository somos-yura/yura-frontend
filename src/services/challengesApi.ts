import { getApiUrl } from '../config/api'
import type { Challenge, SocialProblemsApiResponse, SimulatedPersonsApiResponse } from '../types/challenge'

class ChallengeApiError extends Error {
    status: number
    details?: any

    constructor(message: string, status: number, details?: any) {
        super(message)
        this.name = 'ChallengeApiError'
        this.status = status
        this.details = details
    }
}


const handleResponse = async (response: Response): Promise<SocialProblemsApiResponse> => {
    const data = await response.json()

    if (!response.ok) {
        const errorMessage = data.message || data.translation || 'Error al obtener los problemas sociales'
        throw new ChallengeApiError(errorMessage, response.status, data)
    }

    if (data.success === true) {
        return data
    }

    throw new ChallengeApiError('Error en la respuesta del servidor', response.status, data)
}

export interface GetSocialProblemsParams {
    category?: string
    search?: string
}

export const challengesApi = {
    async getSocialProblems(params: GetSocialProblemsParams = {}): Promise<SocialProblemsApiResponse> {
        try {
            const queryParams = new URLSearchParams()

            if (params.category && params.category !== 'Todos') {
                queryParams.append('category', params.category)
            }

            if (params.search) {
                queryParams.append('search', params.search)
            }

            const queryString = queryParams.toString()
            const endpoint = `/api/v1/social-problems${queryString ? `?${queryString}` : ''}`

            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            return handleResponse(response)
        } catch (error) {
            throw new ChallengeApiError('Error al obtener los problemas sociales', 500, error)
        }
    },

    async getSocialProblemById(id: string): Promise<Challenge | null> {
        try {
            const response = await this.getSocialProblems({})

            const problem = response.data.problems.find(
                (p: Challenge) => String(p.id) === String(id)
            )
            return problem ?? null
        } catch (error) {
            throw new ChallengeApiError('Error al obtener el problema social', 500, error)
        }
    },

    async getSimulatedPersons(category: string): Promise<SimulatedPersonsApiResponse> {
        try {
            const queryParams = new URLSearchParams()
            queryParams.append('category', category)

            const endpoint = `/api/v1/simulated-persons?${queryParams.toString()}`

            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMessage = data.message || data.translation || 'Error al obtener las personas simuladas'
                throw new ChallengeApiError(errorMessage, response.status, data)
            }

            if (data.success === true) {
                return data
            }

            throw new ChallengeApiError('Error en la respuesta del servidor', response.status, data)
        } catch (error) {
            throw new ChallengeApiError('Error al obtener las personas simuladas', 500, error)
        }
    }
}

export { ChallengeApiError }
