import { ApiError } from '../lib/apiClient'

export interface Category {
    id: number
    name: string
    slug: string
    description?: string
}

export interface CategoryApiResponse {
    success: boolean
    data: Category[]
    message?: string
}

export class CategoryApiError extends ApiError {
    constructor(message: string, status: number, details?: any) {
        super(message, status, details)
        this.name = 'CategoryApiError'
    }
}

const simulateApiDelay = (ms: number = 200): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const categoriesApi = {
    async getAllCategories(): Promise<CategoryApiResponse> {
        try {
            await simulateApiDelay()
            
            // Datos simulados - reemplazar con llamada real al API
            const mockCategories: Category[] = [
                { id: 1, name: "Medio Ambiente", slug: "medio-ambiente" },
                { id: 2, name: "Educación", slug: "educacion" },
                { id: 3, name: "Energía", slug: "energia" },
                { id: 4, name: "Urbanismo", slug: "urbanismo" },
                { id: 5, name: "Salud", slug: "salud" },
                { id: 6, name: "Tecnología", slug: "tecnologia" },
                { id: 7, name: "Social", slug: "social" },
            ]

            return {
                success: true,
                data: mockCategories,
                message: "Categorías obtenidas exitosamente"
            }

            // Código para llamada real al API (descomentar cuando esté listo):
            /*
            const response = await fetch(getApiUrl(config.API_ENDPOINTS.CATEGORIES), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new CategoryApiError('Error al obtener categorías', response.status)
            }

            const data = await response.json()
            return data
            */
        } catch (error) {
            if (error instanceof ApiError) {
                throw new CategoryApiError(error.message, error.status, error.details)
            }
            throw new CategoryApiError('Error al obtener las categorías', 500, error)
        }
    }
}
