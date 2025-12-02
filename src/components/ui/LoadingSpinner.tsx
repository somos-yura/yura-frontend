import type React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto mb-4 ${sizeClasses[size]}`}
        ></div>
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  )
}
