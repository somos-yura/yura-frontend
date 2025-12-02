import type React from 'react'
import { useState, useEffect } from 'react'
import { Header } from './Header'
import { AppSidebar } from './SideBar'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  hideFooter = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden fixed md:relative z-50 h-full`}
      >
        <AppSidebar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  )
}
