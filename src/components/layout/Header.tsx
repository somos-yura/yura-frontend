import { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import type { AppHeaderProps } from '../../types/components'

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
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-lightGray px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          <svg
            className="w-5 h-5"
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
          className="text-lg font-bold text-gray-900 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Bienvenido
        </h1>
      </div>
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="relative w-9 h-9 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 flex items-center justify-center"
        >
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </button>
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Mi Cuenta</h3>
            </div>
            <div
              onClick={handleLogout}
              className="p-2 hover:bg-gray-50 cursor-pointer text-sm text-red-600"
            >
              Cerrar Sesión
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
