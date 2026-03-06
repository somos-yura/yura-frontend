import type { User } from '../types/auth'

export const getUserInitials = (user: User | null): string => {
  if (user?.name && user?.last_name) {
    return (user.name[0] + user.last_name[0]).toUpperCase()
  }
  if (user?.name) {
    return user.name.substring(0, 2).toUpperCase()
  }
  if (!user?.email) return 'U'
  const parts = user.email.split('@')
  const username = parts[0]
  if (username.length >= 2) {
    return username.substring(0, 2).toUpperCase()
  }
  return username.charAt(0).toUpperCase()
}

export const getUserDisplayName = (user: User | null): string => {
  if (user?.name) {
    return `${user.name} ${user.last_name || ''}`.trim()
  }
  if (!user?.email) return 'Usuario'
  const parts = user.email.split('@')
  return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
}
