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
  TimeHorizon,
  FocusArea,
} from '../types/student'
import { MessageAlert } from '../components/ui/MessageAlert'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Rocket,
  Code,
  Target,
  Loader2,
  BookOpen,
  Star,
  Zap,
  Layout,
  Terminal,
  Smartphone,
  Server,
  Database,
  BarChart,
} from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { markOnboardingComplete } = useAuthContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const totalSteps = 3

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
    time_horizon: '' as TimeHorizon,
    experience_notes: '',
  })

  const [techInput, setTechInput] = useState('')
  const [strengthInput, setStrengthInput] = useState('')
  const [improvementInput, setImprovementInput] = useState('')

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
      // Minimum delay to show the animation (5 seconds)
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

  const addTag = (
    field: 'desired_technologies' | 'strength_areas' | 'improvement_areas',
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim() && formData[field].length < 20) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
      setter('')
    }
  }

  const removeTag = (
    field: 'desired_technologies' | 'strength_areas' | 'improvement_areas',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const toggleFocusArea = (area: FocusArea) => {
    setFormData((prev) => {
      const currentAreas = prev.focus_areas
      if (currentAreas.includes(area)) {
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
        return (
          !!formData.project_experience &&
          !!formData.team_experience &&
          !!formData.time_horizon
        )
      default:
        return false
    }
  }

  const steps = [
    {
      id: 1,
      title: 'Perfil Profesional',
      description: 'Define tu trayectoria y nivel actual',
      icon: Target,
    },
    {
      id: 2,
      title: 'Estilo de Aprendizaje',
      description: 'Personaliza tu experiencia educativa',
      icon: BookOpen,
    },
    {
      id: 3,
      title: 'Metas y Experiencia',
      description: 'Establece tus objetivos a futuro',
      icon: Rocket,
    },
  ]

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
            {steps.map((step) => (
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
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
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
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium">
                    Analizando tu perfil profesional
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium">
                    Analizando la forma en la que aprendes
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                  <span className="font-medium text-blue-700">
                    Cargando tus primeros desafíos
                  </span>
                </div>
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
                    {[
                      {
                        value: 'backend',
                        label: 'Backend Developer',
                        icon: Server,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                      },
                      {
                        value: 'frontend',
                        label: 'Frontend Developer',
                        icon: Layout,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                      },
                      {
                        value: 'fullstack',
                        label: 'Full Stack Developer',
                        icon: Code,
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-50',
                      },
                      {
                        value: 'mobile',
                        label: 'Mobile Developer',
                        icon: Smartphone,
                        color: 'text-pink-600',
                        bg: 'bg-pink-50',
                      },
                      {
                        value: 'devops',
                        label: 'DevOps Engineer',
                        icon: Terminal,
                        color: 'text-slate-600',
                        bg: 'bg-slate-50',
                      },
                      {
                        value: 'qa',
                        label: 'QA Engineer',
                        icon: Check,
                        color: 'text-green-600',
                        bg: 'bg-green-50',
                      },
                      {
                        value: 'data_engineer',
                        label: 'Data Engineer',
                        icon: Database,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                      },
                      {
                        value: 'product_manager',
                        label: 'Product Manager',
                        icon: BarChart,
                        color: 'text-cyan-600',
                        bg: 'bg-cyan-50',
                      },
                    ].map((option) => (
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
                      {[
                        {
                          value: 'beginner',
                          label: 'Principiante',
                          desc: 'Recién empezando',
                        },
                        { value: 'junior', label: 'Junior', desc: '0-2 años' },
                        {
                          value: 'mid_level',
                          label: 'Mid-Level',
                          desc: '2-5 años',
                        },
                        { value: 'senior', label: 'Senior', desc: '5+ años' },
                      ].map((option) => (
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
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          learning_style: 'visual' as LearningStyle,
                        }))
                      }
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-6 ${
                        formData.learning_style === 'visual'
                          ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div
                        className={`p-4 rounded-xl transition-colors ${
                          formData.learning_style === 'visual'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <Target className="w-8 h-8" />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-bold mb-1 ${
                            formData.learning_style === 'visual'
                              ? 'text-blue-700'
                              : 'text-gray-900'
                          }`}
                        >
                          Visual
                        </h3>
                        <p className="text-gray-600">
                          Aprendo mejor con diagramas e imágenes
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          learning_style: 'reading_writing' as LearningStyle,
                        }))
                      }
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-6 ${
                        formData.learning_style === 'reading_writing'
                          ? 'border-gray-800 ring-1 ring-gray-800 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div
                        className={`p-4 rounded-xl transition-colors ${
                          formData.learning_style === 'reading_writing'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-bold mb-1 ${
                            formData.learning_style === 'reading_writing'
                              ? 'text-gray-900'
                              : 'text-gray-900'
                          }`}
                        >
                          Lectura/Escritura
                        </h3>
                        <p className="text-gray-600">
                          Prefiero leer documentación y tomar notas
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Preferencia de Feedback
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            feedback_timing: 'immediate' as FeedbackTiming,
                          }))
                        }
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          formData.feedback_timing === 'immediate'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">
                          Inmediato (tras cada paso)
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            feedback_timing: 'final' as FeedbackTiming,
                          }))
                        }
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          formData.feedback_timing === 'final'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <Target className="w-5 h-5" />
                        <span className="font-medium">
                          Al finalizar el proyecto
                        </span>
                      </button>
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
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Experiencia en Proyectos
                      </label>
                      <select
                        value={formData.project_experience}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            project_experience: e.target
                              .value as ProjectExperience,
                          }))
                        }
                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Selecciona...</option>
                        <option value="none">Sin experiencia</option>
                        <option value="academic_only">Solo académicos</option>
                        <option value="personal_projects">
                          Proyectos personales
                        </option>
                        <option value="professional">
                          Proyectos profesionales
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Trabajo en Equipo
                      </label>
                      <select
                        value={formData.team_experience}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            team_experience: e.target.value as TeamExperience,
                          }))
                        }
                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Selecciona...</option>
                        <option value="solo_only">Solo individual</option>
                        <option value="small_teams">
                          Equipos pequeños (2-5)
                        </option>
                        <option value="large_teams">
                          Equipos grandes (6+)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
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

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tecnologías de interés
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(),
                          addTag(
                            'desired_technologies',
                            techInput,
                            setTechInput
                          ))
                        }
                        placeholder="React, Python, AWS..."
                        className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() =>
                          addTag(
                            'desired_technologies',
                            techInput,
                            setTechInput
                          )
                        }
                        className="px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.desired_technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {tech}
                          <button
                            onClick={() =>
                              removeTag('desired_technologies', idx)
                            }
                            className="hover:text-blue-900"
                          >
                            <div className="text-xs">✕</div>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Fortalezas
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={strengthInput}
                          onChange={(e) => setStrengthInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' &&
                            (e.preventDefault(),
                            addTag(
                              'strength_areas',
                              strengthInput,
                              setStrengthInput
                            ))
                          }
                          className="flex-1 p-2 border-2 border-gray-200 rounded-lg text-sm"
                          placeholder="Añadir fortaleza..."
                        />
                        <button
                          onClick={() =>
                            addTag(
                              'strength_areas',
                              strengthInput,
                              setStrengthInput
                            )
                          }
                          className="px-3 bg-green-500 text-white rounded-lg"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.strength_areas.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1"
                          >
                            {item}
                            <button
                              onClick={() => removeTag('strength_areas', idx)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Áreas de mejora
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={improvementInput}
                          onChange={(e) => setImprovementInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' &&
                            (e.preventDefault(),
                            addTag(
                              'improvement_areas',
                              improvementInput,
                              setImprovementInput
                            ))
                          }
                          className="flex-1 p-2 border-2 border-gray-200 rounded-lg text-sm"
                          placeholder="Añadir área..."
                        />
                        <button
                          onClick={() =>
                            addTag(
                              'improvement_areas',
                              improvementInput,
                              setImprovementInput
                            )
                          }
                          className="px-3 bg-orange-500 text-white rounded-lg"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.improvement_areas.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium flex items-center gap-1"
                          >
                            {item}
                            <button
                              onClick={() =>
                                removeTag('improvement_areas', idx)
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Áreas de Enfoque (Max 5)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Resolución de problemas técnicos',
                        'Diseño de sistemas',
                        'Calidad del código',
                        'Comunicación',
                        'Depuración',
                        'Colaboración en equipo',
                        'Testing',
                        'Optimización',
                      ].map((label, idx) => {
                        const value = [
                          'technical_problem_solving',
                          'system_design',
                          'code_quality',
                          'communication',
                          'debugging',
                          'team_collaboration',
                          'testing',
                          'performance_optimization',
                        ][idx]
                        const isSelected = formData.focus_areas.includes(
                          value as FocusArea
                        )
                        return (
                          <button
                            key={value}
                            onClick={() => toggleFocusArea(value as FocusArea)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Horizonte de Tiempo
                    </label>
                    <select
                      value={formData.time_horizon}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          time_horizon: e.target.value as TimeHorizon,
                        }))
                      }
                      className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl"
                    >
                      <option value="">Selecciona...</option>
                      <option value="short_term">Corto plazo (3 meses)</option>
                      <option value="medium_term">Medio plazo (6 meses)</option>
                      <option value="long_term">Largo plazo (1+ año)</option>
                    </select>
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
