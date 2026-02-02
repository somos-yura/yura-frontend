import type React from 'react'
import { getPasswordRequirements } from '../../utils/validation'

interface PasswordRequirementsProps {
  password: string
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  if (!password) return null

  const requirements = getPasswordRequirements(password)

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center text-sm">
          <span
            className={`mr-2 ${req.test ? 'text-green-600' : 'text-red-500'}`}
          >
            {req.test ? '✓' : '✗'}
          </span>
          <span className={req.test ? 'text-green-600' : 'text-gray-500'}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  )
}
