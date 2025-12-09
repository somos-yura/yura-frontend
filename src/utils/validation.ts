const PASSWORD_REQUIREMENTS = [
  { test: (pwd: string) => pwd.length >= 8, text: 'Mínimo 8 caracteres' },
  { test: (pwd: string) => /[A-Z]/.test(pwd), text: '1 mayúscula' },
  { test: (pwd: string) => /[a-z]/.test(pwd), text: '1 minúscula' },
  { test: (pwd: string) => /\d/.test(pwd), text: '1 número' },
  {
    test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    text: '1 carácter especial',
  },
]

export const getPasswordRequirements = (password: string) => {
  return PASSWORD_REQUIREMENTS.map((req) => ({
    test: req.test(password),
    text: req.text,
  }))
}

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'El email es requerido'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Formato de email inválido'
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida'
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
