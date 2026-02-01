import {
  Server,
  Layout,
  Code,
  Smartphone,
  Terminal,
  Check,
  Database,
  BarChart,
  Target,
  BookOpen,
  Rocket,
  Zap,
} from 'lucide-react'
import {
  CareerTrack,
  ExperienceLevel,
  LearningStyle,
  FeedbackTiming,
  ProjectExperience,
  TeamExperience,
  FocusArea,
} from '../types/student'

export const ONBOARDING_STEPS = [
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

export const CAREER_OPTIONS = [
  {
    value: CareerTrack.BACKEND,
    label: 'Backend Developer',
    tooltip:
      'Se encarga de todo lo que no se ve: el cerebro y la memoria del sistema.',
    icon: Server,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    value: CareerTrack.FRONTEND,
    label: 'Frontend Developer',
    tooltip: 'Crea la parte que tocas y ves: botones, colores y el diseño.',
    icon: Layout,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    value: CareerTrack.FULLSTACK,
    label: 'Full Stack Developer',
    tooltip:
      'Alguien que sabe hacer un poco de todo, tanto lo visual como lo interno.',
    icon: Code,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    value: CareerTrack.MOBILE,
    label: 'Mobile Developer',
    tooltip: 'Especialista en crear aplicaciones exclusivas para celulares.',
    icon: Smartphone,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    value: CareerTrack.DEVOPS,
    label: 'DevOps Engineer',
    tooltip: 'Se asegura de que la página siempre esté "viva" y no se caiga.',
    icon: Terminal,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
  },
  {
    value: CareerTrack.QA,
    label: 'QA Engineer',
    tooltip:
      'Su trabajo es intentar romper la aplicación para encontrar fallas.',
    icon: Check,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    value: CareerTrack.DATA_ENGINEER,
    label: 'Data Engineer',
    tooltip: 'Organiza grandes cantidades de información para que sea útil.',
    icon: Database,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    value: CareerTrack.PRODUCT_MANAGER,
    label: 'Product Manager',
    tooltip: 'El que decide qué se va a construir y por qué es importante.',
    icon: BarChart,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
]

export const EXPERIENCE_LEVEL_OPTIONS = [
  {
    value: ExperienceLevel.BEGINNER,
    label: 'Principiante',
    desc: 'Recién empezando',
  },
  { value: ExperienceLevel.JUNIOR, label: 'Junior', desc: '0-2 años' },
  {
    value: ExperienceLevel.MID_LEVEL,
    label: 'Mid-Level',
    desc: '2-5 años',
  },
  { value: ExperienceLevel.SENIOR, label: 'Senior', desc: '5+ años' },
]

export const LEARNING_STYLE_OPTIONS = [
  {
    value: LearningStyle.VISUAL,
    label: 'Visual',
    desc: 'Aprendo mejor con diagramas e imágenes',
    icon: Target,
    colorClass: 'bg-blue-500',
    iconContainerClass: 'bg-blue-100 text-blue-600',
    activeBorderClass: 'border-blue-500 ring-blue-500 bg-blue-50/30',
    activeTextClass: 'text-blue-700',
  },
  {
    value: LearningStyle.READING_WRITING,
    label: 'Lectura/Escritura',
    desc: 'Prefiero leer documentación y tomar notas',
    icon: BookOpen,
    colorClass: 'bg-gray-800',
    iconContainerClass: 'bg-gray-100 text-gray-700',
    activeBorderClass: 'border-gray-800 ring-gray-800 bg-gray-50',
    activeTextClass: 'text-gray-900',
  },
]

export const FEEDBACK_PREFERENCE_OPTIONS = [
  {
    value: FeedbackTiming.IMMEDIATE,
    label: 'Inmediato, al terminar con un requerimiento',
    icon: Zap,
    borderClass: 'border-green-500 bg-green-50 text-green-700',
    hoverClass: 'hover:border-green-300',
  },
  {
    value: FeedbackTiming.FINAL,
    label: 'Al finalizar el proyecto',
    icon: Target,
    borderClass: 'border-orange-500 bg-orange-50 text-orange-700',
    hoverClass: 'hover:border-orange-300',
  },
]

export const PROJECT_EXPERIENCE_OPTIONS = [
  { value: ProjectExperience.NONE, label: 'Sin experiencia' },
  { value: ProjectExperience.ACADEMIC_ONLY, label: 'Solo académicos' },
  { value: ProjectExperience.PERSONAL_PROJECTS, label: 'Proyectos personales' },
  { value: ProjectExperience.PROFESSIONAL, label: 'Proyectos profesionales' },
]

export const TEAM_EXPERIENCE_OPTIONS = [
  { value: TeamExperience.SOLO_ONLY, label: 'Solo individual' },
  { value: TeamExperience.SMALL_TEAMS, label: 'Equipos pequeños (2-5)' },
  { value: TeamExperience.LARGE_TEAMS, label: 'Equipos grandes (6+)' },
]

export const FOCUS_AREAS_OPTIONS = [
  {
    value: FocusArea.TECHNICAL_PROBLEM_SOLVING,
    label: 'Resolución de problemas técnicos',
  },
  { value: FocusArea.SYSTEM_DESIGN, label: 'Diseño de sistemas' },
  { value: FocusArea.CODE_QUALITY, label: 'Calidad del código' },
  { value: FocusArea.COMMUNICATION, label: 'Comunicación' },
  { value: FocusArea.DEBUGGING, label: 'Depuración' },
  { value: FocusArea.TEAM_COLLABORATION, label: 'Colaboración en equipo' },
  { value: FocusArea.TESTING, label: 'Testing' },
  { value: FocusArea.PERFORMANCE_OPTIMIZATION, label: 'Optimización' },
]

export const TECHNOLOGY_GROUPS = [
  { label: 'Frontend', options: ['React', 'Angular', 'Vue.js', 'Next.js'] },
  {
    label: 'Backend',
    options: ['Node.js', 'Python (Django/FastAPI)', 'Go', 'Java (Spring Boot)'],
  },
  { label: 'Mobile', options: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
  {
    label: 'Cloud/DevOps',
    options: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
  },
  {
    label: 'Data',
    options: [
      'SQL (PostgreSQL)',
      'NoSQL (MongoDB)',
      'Data Science',
      'IA/Machine Learning',
    ],
  },
]

export const STRENGTH_GROUPS = [
  {
    label: 'Técnicas',
    options: [
      'Arquitectura de Software',
      'Clean Code',
      'Testing (Unit/E2E)',
      'Seguridad',
    ],
  },
  {
    label: 'Proceso',
    options: ['Metodologías Ágiles (Scrum)', 'CI/CD', 'Documentación Técnica'],
  },
  {
    label: 'Blandas',
    options: [
      'Liderazgo técnico',
      'Mentoría',
      'Comunicación asertiva',
      'Resolución de conflictos',
    ],
  },
  {
    label: 'Análisis',
    options: [
      'Análisis de requerimientos',
      'Diseño de UI/UX',
      'Optimización de rendimiento',
    ],
  },
]

export const IMPROVEMENT_GROUPS = [
  {
    label: 'Deep Tech',
    options: ['Microservicios', 'Serverless', 'Sistemas Distribuidos'],
  },
  {
    label: 'Liderazgo',
    options: ['Gestión de proyectos', 'Product Management', 'Mentoring'],
  },
  {
    label: 'Soft Skills',
    options: [
      'Hablar en público',
      'Negociación con stakeholders',
      'Inglés técnico',
    ],
  },
  {
    label: 'Especialización',
    options: ['Ciberseguridad', 'Accesibilidad (a11y)', 'Machine Ops (MLOps)'],
  },
]
