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

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          <svg
            className="w-5 h-5 text-gray-700"
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
          className="text-xl font-bold text-gray-900 hidden md:flex items-center gap-2"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Bienvenido
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hidden md:block">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center shadow-md">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-sm font-semibold text-gray-900">
                John Arowoka
              </p>
              <p className="text-xs text-gray-500">
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
