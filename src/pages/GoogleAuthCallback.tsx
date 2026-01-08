import { useEffect } from 'react'

export default function GoogleAuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (code) {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'google-auth-success', code },
          window.location.origin
        )
      }
    } else if (error) {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'google-auth-error', error },
          window.location.origin
        )
      }
    }

    setTimeout(() => {
      window.close()
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ¡Autorización Exitosa!
        </h2>
        <p className="text-gray-500">
          Esta ventana se cerrará automáticamente...
        </p>
      </div>
    </div>
  )
}
