export interface Challenge {
  id: string
  title: string
  category: string[]
  description: string
  career_types: string[]
  sources: string[]
  images: string[]
  person_first_name: string
  person_last_name: string
  person_personality_traits: string[]
  person_expertise_areas: string[]
  person_age: number | null
  person_bio: string | null
  created_at: string
  updated_at: string
}

export interface ChallengeAssignmentRequest {
  social_problem_id: string
  student_id: string
}

export interface ChallengeAssignment {
  id: string
  student_id: string
  social_problem_id: string
  prompt: string
  created_at: string
  updated_at: string
}

export interface ChallengeAssignmentResponse {
  success: boolean
  message: string
  data: ChallengeAssignment
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
