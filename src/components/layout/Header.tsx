import type { AppHeaderProps } from '../../types/components'
import { Bell, Search } from 'lucide-react'

export function Header({
  onToggleSidebar,
  isSidebarOpen = true,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-[100] flex h-20 items-center justify-between border-b border-[#0D1424]/20 bg-gradient-to-r from-[#0D1424] to-[#0F1729] px-4 sm:px-6 shadow-sm">
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
      </div>
    </header>
  )
}
