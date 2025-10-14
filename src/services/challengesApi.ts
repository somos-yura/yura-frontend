import type { Challenge, ChallengeApiResponse } from '../types/challenge'

const MOCK_CHALLENGES: Challenge[] = [
    {
        id: 1,
        title: "Agua Limpia y Saneamiento",
        category: "Medio Ambiente",
        description: "Desarrolla soluciones innovadoras para garantizar el acceso al agua potable y saneamiento básico.",
        image: "/photo.png",
    },
    {
        id: 2,
        title: "Educación de Calidad",
        category: "Educación",
        description: "Crea proyectos que mejoren el acceso a educación inclusiva y equitativa para todos.",
        image: "/photo.png",
    },
    {
        id: 3,
        title: "Energía Asequible y No Contaminante",
        category: "Energía",
        description: "Impulsa soluciones de energía renovable y sostenible para comunidades vulnerables.",
        image: "/photo.png",
    },
    {
        id: 4,
        title: "Ciudades y Comunidades Sostenibles Ciudades y Comunidades Sostenibles Ciudades y Comunidades Sostenibles",
        category: "Urbanismo",
        description: "Diseña iniciativas para hacer las ciudades más inclusivas, seguras y sostenibles.",
        image: "/photo.png",
    },
    {
        id: 5,
        title: "Salud y Bienestar",
        category: "Salud",
        description: " Propón soluciones tecnológicas para mejorar el acceso a servicios de salud de calidad. Propón soluciones tecnológicas para mejorar el acceso a servicios de salud de calidad. Propón soluciones tecnológicas para mejorar el acceso a servicios de salud de calidad.Propón soluciones tecnológicas para mejorar el acceso a servicios de salud de calidad.Propón soluciones tecnológicas para mejorar el acceso a servicios de salud de calidad.Propón soluciones tecnológicas para mejorar el acceso a servicios de salud de calidad.",
        image: "/photo.png",
    },
    {
        id: 6,
        title: "Acción por el Clima",
        category: "Medio Ambiente",
        description: "Combate el cambio climático con proyectos innovadores de mitigación y adaptación.",
        image: "/photo.png",
    },
    {
        id: 7,
        title: "Innovación e Infraestructura",
        category: "Tecnología",
        description: "Desarrolla infraestructuras resilientes y fomenta la innovación tecnológica inclusiva.",
        image: "/photo.png",
    },
    {
        id: 8,
        title: "Reducción de Desigualdades",
        category: "Social",
        description: "Crea soluciones que promuevan la inclusión social, económica y política de todos.",
        image: "/photo.png",
    },
]

class ChallengeApiError extends Error {
    status: number
    details?: any

    constructor(message: string, status: number, details?: any) {
        super(message)
        this.name = 'ChallengeApiError'
        this.status = status
        this.details = details
    }
}

const simulateApiDelay = (ms: number = 300): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const challengesApi = {
    async getAllChallenges(): Promise<ChallengeApiResponse> {
        try {
            await simulateApiDelay()
            
            return {
                success: true,
                data: MOCK_CHALLENGES,
                message: "Retos obtenidos exitosamente"
            }
        } catch (error) {
            throw new ChallengeApiError('Error al obtener los retos', 500, error)
        }
    },

    async getChallengeById(id: number): Promise<ChallengeApiResponse> {
        try {
            await simulateApiDelay()
            
            const challenge = MOCK_CHALLENGES.find(c => c.id === id)
            
            if (!challenge) {
                throw new ChallengeApiError('Reto no encontrado', 404)
            }

            return {
                success: true,
                data: [challenge],
                message: "Reto obtenido exitosamente"
            }
        } catch (error) {
            if (error instanceof ChallengeApiError) {
                throw error
            }
            throw new ChallengeApiError('Error al obtener el reto', 500, error)
        }
    },

    async getChallengesByCategory(category: string): Promise<ChallengeApiResponse> {
        try {
            await simulateApiDelay()
            
            const filteredChallenges = MOCK_CHALLENGES.filter(c => c.category === category)
            
            return {
                success: true,
                data: filteredChallenges,
                message: `Retos de ${category} obtenidos exitosamente`
            }
        } catch (error) {
            throw new ChallengeApiError('Error al obtener los retos por categoría', 500, error)
        }
    }
}

export { ChallengeApiError }
