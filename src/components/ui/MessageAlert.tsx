import type React from 'react'

interface MessageAlertProps {
  type: 'error' | 'success'
  message: string
  className?: string
}

export const MessageAlert: React.FC<MessageAlertProps> = ({
  type,
  message,
  className = '',
}) => {
  const isError = type === 'error'

  const icon = isError ? (
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  ) : (
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  )

  if (isError) {
    return (
      <div
        className={`mb-4 p-3 bg-[#FF8C00] bg-opacity-10 border border-[#FF8C00] rounded-lg text-[#FF8C00] text-sm flex items-center gap-2 ${className}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {icon}
        </svg>
        {message}
      </div>
    )
  }

  return (
    <div
      className={`mb-4 p-3 bg-[#7CFC00] bg-opacity-10 border border-[#7CFC00] rounded-lg text-green-700 text-sm flex items-center gap-2 ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        {icon}
      </svg>
      {message}
    </div>
  )
}
