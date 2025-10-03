export const validateEmail = (email: string): string | null => {
    if (!email) return "El email es requerido"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Formato de email inválido"
    return null
}

export const validatePassword = (password: string): string | null => {
    if (!password) return "La contraseña es requerida"
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres"
    return null
}

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return "Confirma tu contraseña"
    if (password !== confirmPassword) return "Las contraseñas no coinciden"
    return null
}
