import { Users, Handshake, Lightbulb } from 'lucide-react'

export const SUGGESTED_PROMPTS = [
  {
    icon: Users,
    title: 'Situación actual',
    description: 'Intercambio de conocimientos',
    prompt:
      'Hola, me gustaría conocer más sobre tu experiencia trabajando con este problema. ¿Qué has observado o aprendido que podría ser útil?',
  },
  {
    icon: Handshake,
    title: 'Contexto',
    description: 'Descubre cómo colaborar mejor juntos',
    prompt:
      'Para poder trabajar mejor juntos, ¿podrías contarme qué aspectos del problema consideras más importantes o urgentes de abordar?',
  },
  {
    icon: Lightbulb,
    title: 'Soluciones',
    description: 'Trabajemos juntos en ideas',
    prompt:
      'He estado analizando este problema y creo que un enfoque prometedor sería empezar por...',
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
