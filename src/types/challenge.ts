export interface Challenge {
    id: string
    title: string
    category: string[]
    description: string
    career_types: string[]
    sources: string[]
    images: string[]
    created_at: string
    updated_at: string
}

export interface SimulatedPerson {
    id: string
    first_name: string
    last_name: string
    personality_traits: string[]
    expertise_areas: string[]
    age: number
    bio: string
}

export interface ChallengeAssignmentRequest {
    simulated_person_id: string
    social_problem_id: string
    student_id: string
}

export interface ChallengeAssignment {
    id: string
    student_id: string
    social_problem_id: string
    simulated_person_id: string
    prompt: string
    created_at: string
    updated_at: string
}

export interface ChallengeAssignmentResponse {
    success: boolean
    message: string
    data: ChallengeAssignment
}

export interface SimulatedPersonsApiResponse {
    success: boolean
    message: string
    data: SimulatedPerson[]
}

export interface ChallengeFilters {
    searchQuery: string
    selectedCategory: string
}

export interface SocialProblemsApiResponse {
    success: boolean
    message: string
    data: {
        problems: Challenge[]
        total: number
    }
}

export interface StudentAssignmentsApiResponse {
    success: boolean
    message: string
    data: {
        assignments: ChallengeAssignment[]
    }
}
