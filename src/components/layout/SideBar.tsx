import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigationItems } from './navigationItems'
import { LogOut, Settings, User as UserIcon } from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'
import { getUserInitials, getUserDisplayName } from '../../utils/userUtils'

export function AppSidebar() {
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthContext()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Brand Header */}
      <div className="border-b border-[#0D1424]/20 h-20 flex items-center px-4 sm:px-6 bg-gradient-to-r from-[#0D1424] to-[#0F1729]">
        <div className="flex items-center gap-3">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white shadow-md border border-white/20">
            <span
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Y
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              YURA
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            Navegación
          </div>
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url
              return (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0D1424] to-[#0F1729] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                    }`}
                    title={item.title}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Profile and Subscription */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        {/* User Profile Button */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-all cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 font-bold flex items-center justify-center shadow-sm ring-2 ring-white border border-blue-100 group-hover:ring-blue-100 transition-all">
                {getUserInitials(user)}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {getUserDisplayName(user)}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'usuario@example.com'}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-[110] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mi Cuenta
                </p>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer transition-colors">
                  <UserIcon className="w-4 h-4" />
                  Ver Perfil
                </button>
                <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer transition-colors">
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
              </div>
              <div className="p-1 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-2 hover:bg-red-50 rounded-lg text-sm text-red-600 font-medium cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Badge */}
        {/* <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Plan Gratuito</p>
              <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                Actualizar ahora
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
