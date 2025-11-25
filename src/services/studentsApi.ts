import { apiClient, ApiError } from '../lib/apiClient';
import type { StudentOnboardingData, StudentProfile, StudentProfileSummary } from '../types/student';



export const studentsApi = {
    async completeOnboarding(data: StudentOnboardingData, token: string): Promise<StudentProfile> {
        try {
            const response = await apiClient.put<StudentProfile>(
                '/api/v1/students/profile/onboarding',
                data,
                { requireAuth: true, token }
            );
            return response.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Error completing onboarding', 500, error);
        }
    },

    async getProfile(token: string): Promise<StudentProfile> {
        try {
            const response = await apiClient.get<StudentProfile>(
                '/api/v1/students/profile',
                { requireAuth: true, token }
            );
            return response.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Error fetching profile', 500, error);
        }
    },

    async getProfileSummary(token: string): Promise<StudentProfileSummary> {
        try {
            const response = await apiClient.get<StudentProfileSummary>(
                '/api/v1/students/profile/summary',
                { requireAuth: true, token }
            );
            return response.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Error fetching profile summary', 500, error);
        }
    }
};

export { ApiError };
