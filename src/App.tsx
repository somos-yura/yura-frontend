import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppRouter } from './router'
import { config } from './config/api'

function App() {
  if (!config.GOOGLE_CLIENT_ID) {
    throw new Error('PUBLIC_GOOGLE_CLIENT_ID environment variable is required.')
  }

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <AppRouter />
    </GoogleOAuthProvider>
  )
}

export default App
