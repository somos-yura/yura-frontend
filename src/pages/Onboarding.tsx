import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsApi } from '../services/studentsApi'
import type {
  StudentOnboardingData,
  CareerTrack,
  ExperienceLevel,
  LearningStyle,
  FeedbackTiming,
  ProjectExperience,
  TeamExperience,
  FocusArea,
} from '../types/student'
import { MessageAlert } from '../components/ui/MessageAlert'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Rocket,
  Code,
  Loader2,
  Star,
  Zap,
} from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import {
  ONBOARDING_STEPS,
  CAREER_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  LEARNING_STYLE_OPTIONS,
  FEEDBACK_PREFERENCE_OPTIONS,
  PROJECT_EXPERIENCE_OPTIONS,
  TEAM_EXPERIENCE_OPTIONS,
  TECHNOLOGY_GROUPS,
  STRENGTH_GROUPS,
  IMPROVEMENT_GROUPS,
  FOCUS_AREAS_OPTIONS,
} from '../constants/onboardingData'

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { markOnboardingComplete } = useAuthContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const totalSteps = ONBOARDING_STEPS.length

  // Form state
  const [formData, setFormData] = useState<StudentOnboardingData>({
    career_track: '' as CareerTrack,
    experience_level: '' as ExperienceLevel,
    learning_style: '' as LearningStyle,
    feedback_timing: '' as FeedbackTiming,
    project_experience: '' as ProjectExperience,
    team_experience: '' as TeamExperience,
    has_production_experience: false,
    desired_technologies: [],
    strength_areas: [],
    improvement_areas: [],
    focus_areas: [],
    experience_notes: '',
  })

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setError(null)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 5000))
      const apiCall = studentsApi.completeOnboarding(formData)

      await Promise.all([apiCall, delay])

      markOnboardingComplete()
      navigate('/dashboard')
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error completing onboarding. Please try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  const toggleFocusArea = (area: FocusArea) => {
    setFormData((prev) => {
      const currentAreas = prev.focus_areas
      const isSelected = currentAreas.includes(area)
      if (isSelected) {
        return { ...prev, focus_areas: currentAreas.filter((a) => a !== area) }
      } else if (currentAreas.length < 5) {
        return { ...prev, focus_areas: [...currentAreas, area] }
      }
      return prev
    })
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.career_track && !!formData.experience_level
      case 2:
        return !!formData.learning_style && !!formData.feedback_timing
      case 3:
        return !!formData.project_experience && !!formData.team_experience
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar / Left Panel */}
      <div className="lg:w-1/3 bg-[#0F172A] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">YURA</span>
          </div>

          <div className="space-y-8">
            {ONBOARDING_STEPS.map((step) => (
              <div
                key={step.id}
                className={`gap-4 transition-all duration-300 ${
                  currentStep === step.id
                    ? 'flex opacity-100 translate-x-2'
                    : 'hidden lg:flex opacity-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                      currentStep === step.id
                        ? 'bg-blue-600 border-blue-600'
                        : currentStep > step.id
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  {step.id !== totalSteps && (
                    <div
                      className={`w-0.5 h-full mt-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'}`}
                    ></div>
                  )}
                </div>
                <div className="pb-8">
                  <h3
                    className={`font-semibold text-lg ${currentStep === step.id ? 'text-white' : 'text-gray-400'}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex gap-2 mb-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-300 italic">
              &quot;La mejor forma de predecir el futuro es implementarlo.&quot;
            </p>
            <p className="text-xs text-gray-500 mt-2 font-semibold">
              - Alan Kay
            </p>
          </div>
        </div>
      </div>

      {/* Main Content / Right Panel */}
      <div className="lg:w-2/3 p-6 lg:p-12 overflow-y-auto h-screen">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-8 animate-fade-in">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Preparando tu experiencia...
                </h2>
                <p className="text-gray-500">
                  Estamos configurando tu entorno de aprendizaje personalizado
                </p>
              </div>
              <div className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                {[
                  {
                    label: 'Analizando tu perfil profesional',
                    completed: true,
                  },
                  {
                    label: 'Analizando la forma en la que aprendes',
                    completed: true,
                  },
                  {
                    label: 'Cargando tus primeros desafíos',
                    completed: false,
                    active: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 text-gray-700"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-green-100' : 'bg-blue-100 animate-pulse'}`}
                    >
                      {item.completed ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      )}
                    </div>
                    <span
                      className={`font-medium ${item.active ? 'text-blue-700' : ''}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {error && (
                <MessageAlert type="error" message={error} className="mb-6" />
              )}

              {/* Step 1: Career & Experience */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Objetivos de Carrera
                    </h2>
                    <p className="text-gray-600">
                      Selecciona el camino que mejor describe tus ambiciones
                      profesionales.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CAREER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            career_track: option.value as CareerTrack,
                          }))
                        }
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-4 ${
                          formData.career_track === option.value
                            ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${option.bg}`}>
                          <option.icon className={`w-6 h-6 ${option.color}`} />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Nivel de Experiencia
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              experience_level: option.value as ExperienceLevel,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                            formData.experience_level === option.value
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-600'
                          }`}
                        >
                          <div className="font-bold mb-1">{option.label}</div>
                          <div className="text-xs opacity-80">
                            {option.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Learning Style */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Estilo de aprendizaje
                    </h2>
                    <p className="text-gray-600 text-lg">
                      ¿Cómo prefieres aprender?
                    </p>
                  </div>

                  <div className="space-y-4">
                    {LEARNING_STYLE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            learning_style: option.value as LearningStyle,
                          }))
                        }
                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-6 ${
                          formData.learning_style === option.value
                            ? option.activeBorderClass
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div
                          className={`p-4 rounded-xl transition-colors ${
                            formData.learning_style === option.value
                              ? `${option.colorClass} text-white`
                              : option.iconContainerClass
                          }`}
                        >
                          <option.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-bold mb-1 ${
                              formData.learning_style === option.value
                                ? option.activeTextClass
                                : 'text-gray-900'
                            }`}
                          >
                            {option.label}
                          </h3>
                          <p className="text-gray-600">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Preferencia de Feedback
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Esta elección determinará qué tan seguido recibirás
                      retroalimentación sobre tu trabajo.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {FEEDBACK_PREFERENCE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              feedback_timing: option.value as FeedbackTiming,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                            formData.feedback_timing === option.value
                              ? option.borderClass
                              : `border-gray-200 ${option.hoverClass}`
                          }`}
                        >
                          <option.icon className="w-5 h-5" />
                          <span className="font-medium text-left">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Goals & Experience */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Detalles Finales
                    </h2>
                    <p className="text-gray-600">
                      Cuéntanos un poco más sobre tu experiencia previa y tus
                      intereses.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: 'Experiencia en Proyectos',
                        value: formData.project_experience,
                        options: PROJECT_EXPERIENCE_OPTIONS,
                        field: 'project_experience',
                      },
                      {
                        label: 'Trabajo en Equipo',
                        value: formData.team_experience,
                        options: TEAM_EXPERIENCE_OPTIONS,
                        field: 'team_experience',
                      },
                    ].map((select) => (
                      <div key={select.field} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          {select.label}
                        </label>
                        <select
                          value={select.value}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [select.field]: e.target.value,
                            }))
                          }
                          className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                          <option value="">Selecciona...</option>
                          {select.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        className={`w-6 h-6 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                          formData.has_production_experience
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-400 bg-white'
                        }`}
                      >
                        {formData.has_production_experience && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.has_production_experience}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            has_production_experience: e.target.checked,
                          }))
                        }
                      />
                      <span className="font-medium text-gray-700">
                        He desplegado código a producción
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-6">
                    {[
                      {
                        title: '1. Tecnologías de Interés',
                        groups: TECHNOLOGY_GROUPS,
                        field: 'desired_technologies',
                        icon: Code,
                        color: 'text-blue-600',
                        activeClass: 'bg-blue-600 border-blue-600',
                        hoverClass: 'group-hover:border-blue-300',
                        gridClass: 'xl:grid-cols-5',
                      },
                      {
                        title: '2. Fortalezas',
                        groups: STRENGTH_GROUPS,
                        field: 'strength_areas',
                        icon: Star,
                        color: 'text-green-600',
                        activeClass: 'bg-green-600 border-green-600',
                        hoverClass: 'group-hover:border-green-300',
                        gridClass: 'xl:grid-cols-4',
                      },
                      {
                        title: '3. Áreas de Mejora',
                        groups: IMPROVEMENT_GROUPS,
                        field: 'improvement_areas',
                        icon: Zap,
                        color: 'text-orange-600',
                        activeClass: 'bg-orange-600 border-orange-600',
                        hoverClass: 'group-hover:border-orange-300',
                        gridClass: 'xl:grid-cols-4',
                      },
                    ].map((col) => (
                      <div
                        key={col.field}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                          <div
                            className={`p-2 rounded-lg ${col.color.replace('text-', 'bg-').replace('-600', '-50')}`}
                          >
                            <col.icon className={`w-6 h-6 ${col.color}`} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {col.title}
                          </h3>
                        </div>

                        <div
                          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${col.gridClass} gap-8`}
                        >
                          {col.groups.map((group) => (
                            <div key={group.label} className="space-y-4">
                              <h4 className="text-xs font-black uppercase tracking-widest">
                                {group.label}
                              </h4>
                              <div className="flex flex-col gap-3">
                                {group.options.map((option) => {
                                  const isSelected = (
                                    formData[
                                      col.field as keyof StudentOnboardingData
                                    ] as string[]
                                  ).includes(option)
                                  return (
                                    <label
                                      key={option}
                                      className="flex items-center gap-3 group cursor-pointer"
                                    >
                                      <div
                                        onClick={() => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            [col.field]: isSelected
                                              ? (
                                                  prev[
                                                    col.field as keyof StudentOnboardingData
                                                  ] as string[]
                                                ).filter((t) => t !== option)
                                              : [
                                                  ...(prev[
                                                    col.field as keyof StudentOnboardingData
                                                  ] as string[]),
                                                  option,
                                                ],
                                          }))
                                        }}
                                        className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                          isSelected
                                            ? `${col.activeClass} shadow-sm`
                                            : `border-gray-200 bg-white ${
                                                col.hoverClass
                                              }`
                                        }`}
                                      >
                                        {isSelected && (
                                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                        )}
                                      </div>
                                      <span
                                        className={`text-sm transition-colors duration-200 ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}
                                      >
                                        {option}
                                      </span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Áreas de Enfoque (Max 5)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FOCUS_AREAS_OPTIONS.map((opt) => {
                        const isSelected = formData.focus_areas.includes(
                          opt.value as FocusArea
                        )
                        return (
                          <button
                            key={opt.value}
                            onClick={() =>
                              toggleFocusArea(opt.value as FocusArea)
                            }
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Notas adicionales (Opcional)
                    </label>
                    <textarea
                      value={formData.experience_notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          experience_notes: e.target.value.slice(0, 500),
                        }))
                      }
                      placeholder="Cualquier contexto adicional sobre tu experiencia o metas..."
                      rows={3}
                      maxLength={500}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {formData.experience_notes?.length || 0} / 500
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Navigation */}
              <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep) || loading}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                    !isStepValid(currentStep)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : currentStep === totalSteps ? (
                    <>
                      Completar <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Siguiente <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding
