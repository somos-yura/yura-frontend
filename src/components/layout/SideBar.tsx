import { navigationItems } from './navigationItems'
import { Crown } from 'lucide-react'

export function AppSidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Brand Header */}
      <div className="border-b border-gray-200 p-4 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md">
            <span
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              M
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              MiniWorker
            </span>
            <span className="text-xs text-gray-500">Academy</span>
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
            {navigationItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  title={item.title}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
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
