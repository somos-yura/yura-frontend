import * as Sentry from '@sentry/react'
import { apiClient, ApiError } from '../lib/apiClient'
import { ENDPOINTS } from '../config/endpoints'
import type {
  StudentOnboardingData,
  StudentProfile,
  StudentProfileSummary,
} from '../types/student'

export const studentsApi = {
  async completeOnboarding(
    data: StudentOnboardingData,
    token: string
  ): Promise<StudentProfile> {
    try {
      const response = await apiClient.put<StudentProfile>(
        ENDPOINTS.STUDENTS.ONBOARDING,
        data,
        { requireAuth: true, token }
      )
      return response.data
    } catch (error) {
      Sentry.captureException(error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error completing onboarding', 500, error)
    }
  },

  async getProfile(token: string): Promise<StudentProfile> {
    try {
      const response = await apiClient.get<StudentProfile>(
        ENDPOINTS.STUDENTS.PROFILE,
        { requireAuth: true, token }
      )
      return response.data
    } catch (error) {
      Sentry.captureException(error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error fetching profile', 500, error)
    }
  },

  async getProfileSummary(token: string): Promise<StudentProfileSummary> {
    try {
      const response = await apiClient.get<StudentProfileSummary>(
        ENDPOINTS.STUDENTS.SUMMARY,
        { requireAuth: true, token }
      )
      return response.data
    } catch (error) {
      Sentry.captureException(error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Error fetching profile summary', 500, error)
    }
  },
}

export { ApiError }
