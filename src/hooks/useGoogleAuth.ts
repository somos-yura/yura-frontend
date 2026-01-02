import { useCallback, useEffect, useRef } from 'react'
import { config } from '../config/api'
import { EXTERNAL_URLS, getGoogleRedirectUri } from '../config/externalUrls'
import { chatApi, ChatApiError } from '../services/chatApi'

interface UseGoogleAuthOptions {
  token: string | null
  challengeAssignmentId: string | null
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface UseGoogleAuthReturn {
  initiateAuth: () => void
  isProcessing: boolean
}

export const useGoogleAuth = ({
  token,
  challengeAssignmentId,
  onSuccess,
  onError,
}: UseGoogleAuthOptions): UseGoogleAuthReturn => {
  const isProcessingRef = useRef(false)
  const popupRef = useRef<Window | null>(null)
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null)

  const buildAuthUrl = useCallback((): string => {
    const params = new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID,
      redirect_uri: getGoogleRedirectUri(),
      response_type: 'code',
      scope: EXTERNAL_URLS.GOOGLE.SCOPES.CALENDAR_EVENTS,
      access_type: 'offline',
      prompt: 'consent',
    })
    return `${EXTERNAL_URLS.GOOGLE.OAUTH_AUTH}?${params.toString()}`
  }, [])

  const handleAuthSuccess = useCallback(
    async (code: string) => {
      if (!token || !challengeAssignmentId) {
        onError?.('Token o asignación no disponible')
        return
      }

      try {
        isProcessingRef.current = true
        await chatApi.saveGoogleAuthCode(code, token)
        await chatApi.syncMilestones(challengeAssignmentId, token)
        onSuccess?.()
      } catch (error) {
        const errorMessage =
          error instanceof ChatApiError
            ? error.message
            : 'Error al vincular con Google Calendar'
        onError?.(errorMessage)
      } finally {
        isProcessingRef.current = false
      }
    },
    [token, challengeAssignmentId, onSuccess, onError]
  )

  const cleanup = useCallback(() => {
    if (messageHandlerRef.current) {
      window.removeEventListener('message', messageHandlerRef.current)
      messageHandlerRef.current = null
    }
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close()
      popupRef.current = null
    }
    isProcessingRef.current = false
  }, [])

  const initiateAuth = useCallback(() => {
    if (isProcessingRef.current) {
      return
    }

    if (!config.GOOGLE_CLIENT_ID) {
      onError?.('Google Client ID no configurado')
      return
    }

    const authUrl = buildAuthUrl()
    popupRef.current = window.open(
      authUrl,
      'google-auth',
      'width=500,height=600'
    )

    if (!popupRef.current) {
      onError?.(
        'No se pudo abrir la ventana de autenticación. Verifica que los popups estén permitidos.'
      )
      return
    }

    messageHandlerRef.current = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data?.type === 'google-auth-success' && event.data?.code) {
        cleanup()
        handleAuthSuccess(event.data.code)
      } else if (event.data?.type === 'google-auth-error') {
        cleanup()
        onError?.('Error en la autenticación de Google')
      }
    }

    window.addEventListener('message', messageHandlerRef.current)
  }, [buildAuthUrl, handleAuthSuccess, cleanup, onError])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    initiateAuth,
    isProcessing: isProcessingRef.current,
  }
}
