import type { Challenge } from "./challenge"

export interface ChallengeCardProps {
    challenge: Challenge
    onExplore?: (challenge: Challenge) => void
}

export interface AppHeaderProps {
    onToggleSidebar?: () => void
    isSidebarOpen?: boolean
}
