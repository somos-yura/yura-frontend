import { Lightbulb, FileText, Target } from 'lucide-react'

export const SUGGESTED_PROMPTS = [
  {
    icon: Lightbulb,
    title: 'Proponer una idea',
    description: 'Comparte tu propuesta de solución',
    prompt: 'Me gustaría proponer una idea para resolver este reto...',
  },
  {
    icon: FileText,
    title: 'Más detalles del proyecto',
    description: 'Conoce los requisitos específicos',
    prompt:
      '¿Podrías darme más detalles sobre los requisitos específicos del proyecto?',
  },
  {
    icon: Target,
    title: 'Objetivos clave',
    description: 'Entiende las metas principales',
    prompt: '¿Cuáles son los objetivos más importantes que debemos alcanzar?',
  },
] as const

export const CHAT_CONFIG = {
  TYPING_DELAY: 1500,
  MAX_INPUT_HEIGHT: 32,
  AI_RESPONSE:
    'Excelente pregunta. Basándome en mi experiencia en el campo, creo que es fundamental considerar la sostenibilidad a largo plazo y el impacto en la comunidad. ¿Has pensado en cómo tu solución podría adaptarse a diferentes contextos culturales y geográficos?',
} as const

export const CHAT_MESSAGES = {
  GREETING: 'Hola, gracias por tu interés',
  NOT_FOUND: 'El reto que buscas no existe o ha sido eliminado',
  LOADING_ERROR: 'Error al cargar',
  BACK_TO_DASHBOARD: 'Volver al Dashboard',
  BACK: 'Volver',
  DESCRIPTION: 'Descripción',
  WRITE_MESSAGE: 'Escribe tu mensaje...',
} as const
