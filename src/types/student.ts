// Student onboarding types matching backend schemas

export const CareerTrack = {
    BACKEND: "backend",
    FRONTEND: "frontend",
    FULLSTACK: "fullstack",
    QA: "qa",
    DEVOPS: "devops",
    PRODUCT_MANAGER: "product_manager",
    DATA_ENGINEER: "data_engineer",
    MOBILE: "mobile"
} as const;
export type CareerTrack = typeof CareerTrack[keyof typeof CareerTrack];

export const ExperienceLevel = {
    BEGINNER: "beginner",
    JUNIOR: "junior",
    MID_LEVEL: "mid_level",
    SENIOR: "senior"
} as const;
export type ExperienceLevel = typeof ExperienceLevel[keyof typeof ExperienceLevel];

export const YearsOfExperience = {
    ZERO: "0",
    LESS_THAN_ONE: "0-1",
    ONE_TO_THREE: "1-3",
    THREE_TO_FIVE: "3-5",
    FIVE_PLUS: "5+"
} as const;
export type YearsOfExperience = typeof YearsOfExperience[keyof typeof YearsOfExperience];

export const LearningStyle = {
    VISUAL: "visual",
    READING_WRITING: "reading_writing",
    PRACTICAL: "practical"
} as const;
export type LearningStyle = typeof LearningStyle[keyof typeof LearningStyle];

export const FeedbackTiming = {
    IMMEDIATE: "immediate",
    FINAL: "final"
} as const;
export type FeedbackTiming = typeof FeedbackTiming[keyof typeof FeedbackTiming];

export const ProjectExperience = {
    NONE: "none",
    ACADEMIC_ONLY: "academic_only",
    PERSONAL_PROJECTS: "personal_projects",
    PROFESSIONAL: "professional"
} as const;
export type ProjectExperience = typeof ProjectExperience[keyof typeof ProjectExperience];

export const TeamExperience = {
    SOLO_ONLY: "solo_only",
    SMALL_TEAMS: "small_teams",
    LARGE_TEAMS: "large_teams"
} as const;
export type TeamExperience = typeof TeamExperience[keyof typeof TeamExperience];

export const AITone = {
    ENCOURAGING: "encouraging",
    NEUTRAL: "neutral",
    DIRECT: "direct"
} as const;
export type AITone = typeof AITone[keyof typeof AITone];

export const DifficultyPreference = {
    EASY_START: "easy_start",
    BALANCED: "balanced",
    HARDCORE: "hardcore"
} as const;
export type DifficultyPreference = typeof DifficultyPreference[keyof typeof DifficultyPreference];

export const CommunicationStyle = {
    FORMAL: "formal",
    CASUAL: "casual",
    MENTOR: "mentor"
} as const;
export type CommunicationStyle = typeof CommunicationStyle[keyof typeof CommunicationStyle];

export const ResponseLength = {
    CONCISE: "concise",
    DETAILED: "detailed",
    ADAPTIVE: "adaptive"
} as const;
export type ResponseLength = typeof ResponseLength[keyof typeof ResponseLength];

export const ProgressionPace = {
    GRADUAL: "gradual",
    MODERATE: "moderate",
    AGGRESSIVE: "aggressive"
} as const;
export type ProgressionPace = typeof ProgressionPace[keyof typeof ProgressionPace];

export const TimeHorizon = {
    SHORT_TERM: "short_term",
    MEDIUM_TERM: "medium_term",
    LONG_TERM: "long_term"
} as const;
export type TimeHorizon = typeof TimeHorizon[keyof typeof TimeHorizon];

export const FocusArea = {
    TECHNICAL_PROBLEM_SOLVING: "technical_problem_solving",
    SYSTEM_DESIGN: "system_design",
    CODE_QUALITY: "code_quality",
    COMMUNICATION: "communication",
    DEBUGGING: "debugging",
    TEAM_COLLABORATION: "team_collaboration",
    TESTING: "testing",
    PERFORMANCE_OPTIMIZATION: "performance_optimization"
} as const;
export type FocusArea = typeof FocusArea[keyof typeof FocusArea];

export interface StudentOnboardingData {
    career_track: CareerTrack;
    experience_level: ExperienceLevel;
    years_of_experience: YearsOfExperience;
    learning_style: LearningStyle;
    feedback_timing: FeedbackTiming;
    project_experience: ProjectExperience;
    team_experience: TeamExperience;
    has_production_experience: boolean;
    desired_technologies: string[];
    strength_areas: string[];
    improvement_areas: string[];
    focus_areas: FocusArea[];
    time_horizon: TimeHorizon;
    experience_notes?: string;
}

export interface StudentProfile extends StudentOnboardingData {
    id: string;
    user_id: string;
    onboarding_completed: boolean;
    onboarding_completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface StudentProfileSummary {
    id: string;
    user_id: string;
    career_track: CareerTrack;
    experience_level: ExperienceLevel;
    onboarding_completed: boolean;
    onboarding_completed_at: string | null;
}
