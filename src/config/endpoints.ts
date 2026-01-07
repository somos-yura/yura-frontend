export const ENDPOINTS = {
  USERS: {
    LOGIN: '/api/v1/users/login',
    REGISTER: '/api/v1/users/register',
    GOOGLE_AUTH: '/api/v1/users/google-auth',
  },
  AI: {
    CHAT: {
      SEND_MESSAGE: '/api/v1/ai/chat/send-message',
      MESSAGES: '/api/v1/ai/chat/messages',
      DIAGRAMS: '/api/v1/ai/chat/diagrams',
      MILESTONES: '/api/v1/ai/chat/milestones',
      STATUS: '/api/v1/ai/chat/status',
      SYNC_MILESTONES: '/api/v1/ai/chat/sync-milestones',
    },
  },
  STUDENTS: {
    PROFILE: '/api/v1/students/profile',
    ONBOARDING: '/api/v1/students/profile/onboarding',
    SUMMARY: '/api/v1/students/profile/summary',
  },
  CHALLENGES: {
    SOCIAL_PROBLEMS: '/api/v1/social-problems',
    ASSIGNMENTS: '/api/v1/challenges/assignments',
    ASSIGNMENTS_BY_STUDENT: (studentId: string) =>
      `/api/v1/challenges/assignments/student/${studentId}`,
  },
} as const
