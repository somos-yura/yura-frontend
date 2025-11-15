import { apiClient, ApiError } from '../lib/apiClient'
import type { Challenge, SocialProblemsApiResponse, SimulatedPersonsApiResponse, ChallengeAssignmentRequest, ChallengeAssignmentResponse, SimulatedPerson, StudentAssignmentsApiResponse } from '../types/challenge'

export class ChallengeApiError extends ApiError {
    constructor(message: string, status: number, details?: any) {
        super(message, status, details)
        this.name = 'ChallengeApiError'
    }
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

            return await apiClient.get<SocialProblemsApiResponse['data']>(endpoint) as SocialProblemsApiResponse
        } catch (error) {
            if (error instanceof ApiError) {
                throw new ChallengeApiError(error.message, error.status, error.details)
            }
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

            return await apiClient.get<SimulatedPersonsApiResponse['data']>(endpoint) as SimulatedPersonsApiResponse
        } catch (error) {
            if (error instanceof ApiError) {
                throw new ChallengeApiError(error.message, error.status, error.details)
            }
            throw new ChallengeApiError('Error al obtener las personas simuladas', 500, error)
        }
    },

    async createAssignment(request: ChallengeAssignmentRequest, token: string): Promise<ChallengeAssignmentResponse> {
        try {
            const endpoint = `/api/v1/challenges/assignments`

            return await apiClient.post<ChallengeAssignmentResponse['data']>(
                endpoint,
                request,
                { requireAuth: true, token }
            ) as ChallengeAssignmentResponse
        } catch (error) {
            if (error instanceof ApiError) {
                throw new ChallengeApiError(error.message, error.status, error.details)
            }
            throw new ChallengeApiError('Error al crear la asignación del reto', 500, error)
        }
    },

    async getSimulatedPersonById(personId: string): Promise<SimulatedPerson> {
        try {
            const endpoint = `/api/v1/simulated-persons/${personId}`

            const response = await apiClient.get<SimulatedPerson>(endpoint)
            return response.data
        } catch (error) {
            if (error instanceof ApiError) {
                throw new ChallengeApiError(error.message, error.status, error.details)
            }
            throw new ChallengeApiError('Error al obtener la persona simulada', 500, error)
        }
    },

    async getStudentAssignments(studentId: string): Promise<StudentAssignmentsApiResponse> {
        try {
            const endpoint = `/api/v1/challenges/assignments/student/${studentId}`

            return await apiClient.get<StudentAssignmentsApiResponse['data']>(endpoint) as StudentAssignmentsApiResponse
        } catch (error) {
            if (error instanceof ApiError) {
                throw new ChallengeApiError(error.message, error.status, error.details)
            }
            throw new ChallengeApiError('Error al obtener las asignaciones del estudiante', 500, error)
        }
    }
}
