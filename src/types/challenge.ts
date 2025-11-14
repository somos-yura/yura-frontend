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
    first_name: string
    last_name: string
    personality_traits: string[]
    expertise_areas: string[]
    age: number
    bio: string
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
