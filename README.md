# MiniWorker Tech Frontend

Frontend de la plataforma MiniWorker Academy, una aplicación web para conectar estudiantes con proyectos sociales y personas simuladas para colaboración y aprendizaje.

## 🚀 Stack Tecnológico

- **Framework**: React 19.1.1 con TypeScript
- **Bundler**: Rsbuild
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 3.4.18
- **Iconos**: Lucide React
- **Linting**: ESLint con TypeScript

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:
```env
API_BASE_URL=http://localhost:8000
API_VERSION=v1
PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id_aqui
```

**Nota**: `PUBLIC_GOOGLE_CLIENT_ID` es requerido para la funcionalidad de integración con Google Calendar.

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto que Rsbuild asigne).

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (InputField, LoadingSpinner, etc.)
│   ├── layout/         # Componentes de layout (Header, Footer, SideBar)
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── pages/              # Páginas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── ChallengeDetail.tsx
│   └── ChallengeChat.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useChallenges.ts
│   ├── useChat.ts
│   ├── useGoogleAuth.ts
│   └── ...
├── services/           # Servicios de API
│   ├── authApi.ts
│   ├── challengesApi.ts
│   └── categoriesApi.ts
├── lib/                # Librerías core
│   └── apiClient.ts    # Cliente HTTP centralizado
├── contexts/           # Contextos de React
│   └── AuthContext.tsx
├── types/              # Tipos TypeScript
├── constants/          # Constantes de la aplicación
├── utils/              # Utilidades y helpers
├── config/             # Configuración
│   ├── api.ts          # Configuración de API y variables de entorno
│   ├── endpoints.ts    # Endpoints de la API
│   └── externalUrls.ts # URLs y configuración de servicios externos (Google OAuth)
└── router.tsx          # Configuración de rutas
```

Para más detalles sobre la arquitectura, consulta [architecture.md](./architecture.md).

## 🎨 Guía de Estilo

### Colores Principales

- **Azul eléctrico** (`#1E90FF`) - Botones primarios, acciones clave
- **Naranja vibrante** (`#FF8C00`) - Botones secundarios, alertas
- **Verde lima** (`#7CFC00`) - Indicadores de éxito/progreso
- **Gris oscuro** (`#2E2E2E`) - Tipografía, encabezados

### Tipografía

- **Montserrat** - Encabezados y botones
- **Roboto** - Cuerpo de texto

## 🔐 Autenticación

La aplicación utiliza un sistema de autenticación basado en tokens JWT:

- Las credenciales se almacenan en `localStorage`
- Las rutas protegidas requieren autenticación
- El token se incluye automáticamente en las peticiones que lo requieren

### Integración con Google Calendar

La aplicación permite vincular Google Calendar para sincronizar hitos del proyecto:

- **Hook personalizado**: `useGoogleAuth` maneja todo el flujo de OAuth
- **Flujo OAuth**: Se abre un popup para autenticación, luego se procesa el código
- **Callback route**: `/auth/google/callback` recibe la respuesta de Google
- **Configuración**: Requiere `PUBLIC_GOOGLE_CLIENT_ID` en variables de entorno

**Ejemplo de uso**:
```typescript
import { useGoogleAuth } from '../hooks/useGoogleAuth'

const { initiateAuth } = useGoogleAuth({
  token: userToken,
  challengeAssignmentId: assignmentId,
  onSuccess: () => {
    // Manejar éxito
  },
  onError: (error) => {
    // Manejar error
  },
})

// Iniciar autenticación
initiateAuth()
```

## 🌐 Rutas

### Rutas Públicas
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

### Rutas Protegidas
- `/` - Redirige a `/dashboard`
- `/dashboard` - Dashboard principal con lista de challenges
- `/challenge/:id` - Detalle de un challenge específico
- `/challenge/:id/chat` - Chat con la persona simulada asignada
- `/auth/google/callback` - Callback de OAuth de Google (usado internamente)

## 🔌 API y Servicios

El proyecto utiliza un cliente HTTP centralizado (`src/lib/apiClient.ts`) que proporciona:

- Manejo unificado de headers y autenticación
- Manejo consistente de errores
- Métodos HTTP (GET, POST, PUT, DELETE)
- Soporte para autenticación con tokens

### Ejemplo de uso:

```typescript
import { apiClient } from '../lib/apiClient'

// GET request
const data = await apiClient.get<ResponseType>('/endpoint')

// POST request con autenticación
const response = await apiClient.post<ResponseType>(
  '/endpoint',
  { data },
  { requireAuth: true, token: userToken }
)
```

## 🧩 Componentes Principales

### LoadingSpinner
Componente reutilizable para estados de carga:
```tsx
<LoadingSpinner message="Cargando..." size="md" fullScreen />
```

### ProtectedRoute / PublicRoute
Componentes para proteger rutas según el estado de autenticación.

### GoogleAuthCallback
Componente que maneja el callback de OAuth de Google. Se renderiza en un popup y comunica el resultado a la ventana principal mediante `postMessage`.

## 🛡️ Manejo de Errores

El proyecto utiliza una jerarquía de errores:

- `ApiError` - Clase base para todos los errores de API
- `ChallengeApiError` - Errores específicos de challenges
- `CategoryApiError` - Errores específicos de categorías

Todos los errores incluyen información estructurada (mensaje, status, details).

## 🧪 Desarrollo

### Convenciones de Código

- Usar TypeScript para type safety
- Seguir las reglas de ESLint
- Componentes funcionales con hooks
- Separar lógica de negocio en custom hooks
- Servicios API organizados por dominio
- No hardcodear valores sensibles (usar variables de entorno)
- Seguir principios SOLID en la arquitectura

### Custom Hooks

El proyecto utiliza custom hooks para encapsular lógica reutilizable:

- `useAuth`: Manejo de autenticación y sesión
- `useChallenges`: Gestión de challenges
- `useChat`: Lógica del chat con IA
- `useGoogleAuth`: Flujo completo de autenticación OAuth con Google
- `useCategories`: Gestión de categorías

### Estructura de Componentes

```tsx
import type React from "react"

interface ComponentProps {
  // props aquí
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // lógica del componente
  return (
    // JSX
  )
}
```

## 📦 Build y Deployment

### Build de Producción

```bash
npm run build
```

El build se genera en la carpeta `dist/`.

### Preview del Build

```bash
npm run preview
```

## 🤝 Contribuir

1. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## 📝 Notas Adicionales

- El proyecto utiliza React 19 con las últimas características
- Tailwind CSS para estilos utilitarios
- TypeScript estricto para mayor seguridad de tipos
- Arquitectura escalable y mantenible

## 📚 Documentación Adicional

- [Architecture.md](./architecture.md) - Documentación detallada de la arquitectura del proyecto

## 📄 Licencia

Este proyecto es privado y confidencial.
