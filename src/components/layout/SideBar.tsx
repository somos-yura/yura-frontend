import { Link, useLocation } from 'react-router-dom'
import { navigationItems } from './navigationItems'
import { Crown } from 'lucide-react'

export function AppSidebar() {
  const location = useLocation()

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
              M
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              MiniWorker
            </span>
            <span className="text-xs text-gray-300">Academy</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
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

      {/* Subscription Badge */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Plan Gratuito</p>
              <p className="text-xs text-gray-600">Actualiza tu plan</p>
            </div>
          </div>
          <button className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg">
            Mejorar a Premium
          </button>
        </div>
      </div>
    </div>
  )
}
