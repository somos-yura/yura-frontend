export const config = {
  API_BASE_URL:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).env?.API_BASE_URL || 'http://localhost:8000',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  API_VERSION: (import.meta as any).env?.API_VERSION || 'v1',
  GOOGLE_CLIENT_ID:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta.env as any).PUBLIC_GOOGLE_CLIENT_ID ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).env?.PUBLIC_GOOGLE_CLIENT_ID ||
    '',
}

export const getApiUrl = (endpoint: string) => {
  return `${config.API_BASE_URL}${endpoint}`
}
