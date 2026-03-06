export const config = {
  API_BASE_URL: process.env.PUBLIC_API_BASE_URL || '/api', // Use proxy in production, env var for dev
  API_VERSION: process.env.PUBLIC_API_VERSION || 'v1',
}

export const getApiUrl = (endpoint: string) => {
  const baseUrl = config.API_BASE_URL.endsWith('/')
    ? config.API_BASE_URL.slice(0, -1)
    : config.API_BASE_URL
  return `${baseUrl}${endpoint}`
}
