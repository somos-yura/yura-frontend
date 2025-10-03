import { useState } from "react"
import { validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation"
import type { LoginForm, RegisterForm, FormState } from "../types/auth"

export const useAuthValidation = () => {
    const [state, setState] = useState<FormState>({ error: "", success: "" })

    const validateLogin = (form: LoginForm): boolean => {
        setState({ error: "", success: "" })

        const emailError = validateEmail(form.email)
        const passwordError = validatePassword(form.password)

        if (emailError || passwordError) {
            setState({ error: emailError || passwordError || "", success: "" })
            return false
        }

        return true
    }

    const validateRegister = (form: RegisterForm): boolean => {
        setState({ error: "", success: "" })

        const emailError = validateEmail(form.email)
        const passwordError = validatePassword(form.password)
        const confirmPasswordError = validatePasswordMatch(form.password, form.confirmPassword)

        if (emailError || passwordError || confirmPasswordError) {
            setState({ error: emailError || passwordError || confirmPasswordError || "", success: "" })
            return false
        }

        return true
    }

    const setSuccess = (message: string) => setState({ error: "", success: message })
    const setError = (message: string) => setState({ error: message, success: "" })

    return { state, validateLogin, validateRegister, setSuccess, setError }
}
