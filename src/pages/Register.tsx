import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { InputField } from "../components/InputField"
import { MessageAlert } from "../components/MessageAlert"
import { Footer } from "../components/Footer"
import { useAuthValidation } from "../hooks/useAuthValidation"
import type { RegisterForm } from "../types/auth"

const Register: React.FC = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState<RegisterForm>({ email: "", password: "", confirmPassword: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { state, validateRegister, setSuccess } = useAuthValidation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateRegister(form)) {
            setSuccess("¡Cuenta creada exitosamente!")
        }
    }

    const handleInputChange = (field: keyof RegisterForm) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 font-roboto">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-darkGray font-montserrat mb-2">MiniWorker Academy</h1>
                    <div className="w-16 h-1 bg-electricBlue mx-auto rounded-full"></div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                    <h2 className="text-center text-2xl font-bold text-darkGray font-montserrat mb-6">
                        Crea tu cuenta
                    </h2>
                    {state.error && <MessageAlert type="error" message={state.error} />}
                    {state.success && <MessageAlert type="success" message={state.success} />}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={handleInputChange('email')}
                            placeholder="tu@email.com"
                            label="Email"
                            focusColor="vibrantOrange"
                            icon={
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            }
                        />
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-darkGray mb-2 font-montserrat">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => handleInputChange('password')(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrantOrange focus:border-transparent transition-all placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-darkGray mb-2 font-montserrat">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword')(e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrantOrange focus:border-transparent transition-all placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-vibrantOrange text-white font-montserrat font-semibold py-3 px-4 rounded-lg hover:bg-[#E67E00] hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 mt-6"
                        >
                            Comenzar
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-darkGray hover:text-vibrantOrange transition-colors text-sm font-medium"
                        >
                            ¿Ya tienes cuenta? <span className="text-vibrantOrange font-semibold">Inicia sesión</span>
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Register
