export const EXTERNAL_URLS = {
  GOOGLE: {
    CALENDAR: 'https://calendar.google.com',
    OAUTH_AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
    SCOPES: {
      CALENDAR_EVENTS: 'https://www.googleapis.com/auth/calendar.events',
    },
  },
} as const

export const getGoogleRedirectUri = (): string => {
  return `${window.location.origin}/auth/google/callback`
}
