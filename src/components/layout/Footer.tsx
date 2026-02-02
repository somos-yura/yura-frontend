import type React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  return (
    <div className="text-center text-sm text-gray-500">
      <p>© {currentYear} YURA. Todos los derechos reservados.</p>
    </div>
  )
}
