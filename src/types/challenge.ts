export interface Challenge {
    id: number
    title: string
    category: string
    description: string
    image: string
}

export interface ChallengeFilters {
    searchQuery: string
    selectedCategory: string
}

export interface ChallengeApiResponse {
    success: boolean
    data: Challenge[]
    message?: string
}
