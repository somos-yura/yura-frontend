const PASSWORD_REQUIREMENTS = [
  { test: (pwd: string) => pwd.length >= 6, text: 'Mínimo 6 caracteres' },
  { test: (pwd: string) => /\d/.test(pwd), text: 'Al menos 1 número' },
]

export const getPasswordRequirements = (password: string) => {
  return PASSWORD_REQUIREMENTS.map((req) => ({
    test: req.test(password),
    text: req.text,
  }))
}

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'El email es requerido'
  if (email.length > 100) return 'El email es demasiado largo'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Formato de email inválido'
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida'
  if (password.length > 100) return 'La contraseña es demasiado larga'
  return null
}

export const validatePasswordRegister = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida'

  for (const requirement of PASSWORD_REQUIREMENTS) {
    if (!requirement.test(password)) {
      return 'La contraseña debe cumplir con las convenciones'
    }
  }

  return null
}

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) return 'Confirma tu contraseña'
  if (password !== confirmPassword) return 'Las contraseñas no coinciden'
  return null
}

export const validateName = (
  name: string,
  fieldName: string
): string | null => {
  if (!name.trim()) return `El ${fieldName} es obligatorio`
  if (name.trim().length < 2)
    return `El ${fieldName} debe tener al menos 2 caracteres`
  if (name.length > 50) return `El ${fieldName} es demasiado largo`
  return null
}
