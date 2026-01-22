import type React from 'react'
import { Link as LinkIcon } from 'lucide-react'

interface GoogleAuthModalProps {
  onLogin: () => void
  onClose: () => void
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  onLogin,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <LinkIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Sincroniza tu Calendario!
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Vincular con Google Calendar te permitirá ver estas fechas
            directamente en tu agenda.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Conectar Google Calendar
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-all"
            >
              Continuar sin sincronizar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
