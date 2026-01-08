import { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import type { AppHeaderProps } from '../../types/components'
import { Bell, Search } from 'lucide-react'

export function Header({
  onToggleSidebar,
  isSidebarOpen = true,
}: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuthContext()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const getUserInitials = (email: string | undefined): string => {
    if (!email) return 'U'
    const parts = email.split('@')
    const username = parts[0]
    if (username.length >= 2) {
      return username.substring(0, 2).toUpperCase()
    }
    return username.charAt(0).toUpperCase()
  }

  const getUserDisplayName = (email: string | undefined): string => {
    if (!email) return 'Usuario'
    const parts = email.split('@')
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  }

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[#0D1424]/20 bg-gradient-to-r from-[#0D1424] to-[#0F1729] px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1
          className="text-xl font-bold text-white hidden md:flex items-center gap-2"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Bienvenido
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden md:block">
          <Search className="w-5 h-5 text-white" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer relative">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-white/10 rounded-xl p-2 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 font-bold flex items-center justify-center shadow-sm ring-2 ring-white border border-blue-100">
                {getUserInitials(user?.email)}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-sm font-semibold text-white">
                {getUserDisplayName(user?.email)}
              </p>
              <p className="text-xs text-gray-300">
                {user?.email || 'usuario@example.com'}
              </p>
            </div>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900">Mi Cuenta</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {user?.email || 'usuario@example.com'}
                </p>
              </div>
              <div className="p-2">
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer">
                  Ver Perfil
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer">
                  Configuración
                </button>
              </div>
              <div className="p-2 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2 hover:bg-red-50 rounded-lg text-sm text-red-600 font-medium cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
