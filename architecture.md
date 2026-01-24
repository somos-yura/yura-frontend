# Arquitectura Frontend - YURA

## Resumen del Proyecto

YURA es una plataforma de aprendizaje construida con React + TypeScript + Tailwind CSS.

## Stack Tecnológico

- **Framework**: React 19.1.1 con TypeScript
- **Bundler**: Rsbuild
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 3.4.18
- **Linting**: ESLint con TypeScript
- **Observabilidad**: Sentry (@sentry/react)
- **Estado**: React Hooks (useState, useEffect, custom hooks)

## Estructura de Directorios

```
src/
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base
│   │   ├── InputField.tsx
│   │   ├── MessageAlert.tsx
│   │   ├── PasswordRequirements.tsx
│   │   ├── ConfirmationModal.tsx
│   │   ├── ContactLoadingModal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/           # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── SideBar.tsx
│   │   └── navigationItems.ts
│   ├── ChallengeCard.tsx # Componentes específicos
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── pages/                # Páginas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── ChallengeDetail.tsx
│   └── ChallengeChat.tsx
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   ├── useChallenges.ts
│   ├── useCategories.ts
│   ├── useChat.ts
│   ├── useGoogleAuth.ts  # Hook para autenticación OAuth con Google
│   ├── useDashboardFilters.ts
│   └── useFormNavigation.ts
├── services/             # Servicios de API
│   ├── authApi.ts
│   ├── challengesApi.ts
│   └── categoriesApi.ts
├── lib/                  # Librerías y utilidades core
│   └── apiClient.ts      # Cliente HTTP centralizado
├── contexts/             # Contextos globales
│   └── AuthContext.tsx
├── types/                # Tipos TypeScript
│   ├── auth.ts
│   ├── challenge.ts
│   ├── components.ts
│   └── css.d.ts
├── constants/            # Constantes de la aplicación
│   └── chat.ts
├── utils/                # Utilidades
│   ├── validation.ts
│   └── chatHelpers.ts
├── config/               # Configuración
│   ├── api.ts            # Configuración de API y variables de entorno
│   ├── endpoints.ts      # Endpoints de la API
│   └── externalUrls.ts   # URLs y configuración de servicios externos
├── App.tsx               # Componente raíz
├── router.tsx            # Configuración de rutas
├── main.tsx              # Punto de entrada (Inicialización de Sentry)
├── index.css             # Estilos globales
└── types/env.d.ts        # Definiciones de tipos para variables de entorno
```

## Principios de Arquitectura

### 1. Arquitectura Simplificada

- **Components**: Componentes reutilizables organizados por tipo (ui, layout)
- **Pages**: Páginas principales de la aplicación
- **Hooks**: Custom hooks para lógica reutilizable
- **Services**: Servicios de API organizados por dominio
- **Lib**: Librerías core y utilidades compartidas (cliente HTTP, etc.)
- **Types**: Definiciones de tipos TypeScript
- **Contexts**: Estado global compartido
- **Utils**: Utilidades y helpers
- **Constants**: Constantes de la aplicación

### 2. Separación de Responsabilidades

- **Components**: Componentes reutilizables organizados por tipo (ui, layout)
- **Hooks**: Lógica de estado y efectos secundarios centralizada
- **Services**: Comunicación con APIs externas por dominio
- **Types**: Definiciones de tipos TypeScript organizadas por contexto
- **Contexts**: Estado global compartido entre componentes

### 3. Patrones de Diseño

- **Context Provider**: Para estado global de autenticación
- **Protected Routes**: Para rutas que requieren autenticación
- **Custom Hooks**: Para lógica reutilizable por feature
- **Composition**: Componentes compuestos por otros componentes más pequeños
- **Error Boundaries**: Manejo centralizado de errores con `Sentry.ErrorBoundary`
- **Observability**: Monitoreo de errores y rendimiento distribuido con Sentry.

## Rutas de la Aplicación

### Rutas Públicas
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

### Rutas Protegidas (requieren autenticación)
- `/` - Redirige a `/dashboard`
- `/dashboard` - Dashboard principal con lista de challenges
- `/challenge/:id` - Detalle de un challenge específico
- `/challenge/:id/chat` - Chat con la persona simulada asignada al challenge
- `/auth/google/callback` - Callback de OAuth de Google (usado internamente en popup)

### Componentes de Rutas
- `ProtectedRoute`: Verifica autenticación antes de renderizar
- `PublicRoute`: Redirige a dashboard si el usuario ya está autenticado

### 4. Gestión de Estado

- **Global State**: React Context para autenticación
- **Local State**: useState para estado local de componentes
- **Custom Hooks**: Hooks centralizados para lógica reutilizable
- **Persistence**: localStorage para persistencia de sesión
- **Validation**: Validación en tiempo real con feedback visual

## Guías de Estilo Visual

### Paleta de Colores

```typescript
// Tailwind Config
colors: {
  electricBlue: "#1E90FF",    // Botones primarios, acciones clave
  limeGreen: "#7CFC00",       // Indicadores de éxito/progreso
  darkGray: "#2E2E2E",        // Tipografía, encabezados
  vibrantOrange: "#FF8C00",   // Botones secundarios, alertas
}
```

### Tipografía

- **Montserrat**: Encabezados y botones (`font-montserrat`)
- **Roboto**: Cuerpo de texto (`font-roboto`)

## API y Servicios

### 1. Cliente HTTP Centralizado

El proyecto utiliza un cliente HTTP centralizado (`src/lib/apiClient.ts`) que proporciona:

- Manejo unificado de headers y autenticación
- Manejo consistente de errores
- Métodos HTTP (GET, POST, PUT, DELETE)
- Soporte para autenticación con tokens
- Clase base `ApiError` para manejo de errores

```typescript
import { apiClient, ApiError } from '../lib/apiClient'

// Ejemplo de uso
const response = await apiClient.get<Data>('/endpoint')
const response = await apiClient.post<Data>('/endpoint', body, { requireAuth: true, token })
```

### 2. Configuración de API

```typescript
export const config = {
    API_BASE_URL: (import.meta as any).env?.API_BASE_URL || 'http://localhost:8000',
    API_VERSION: (import.meta as any).env?.API_VERSION || 'v1',
    GOOGLE_CLIENT_ID: (import.meta.env as any).PUBLIC_GOOGLE_CLIENT_ID || '',
}
```

### 3. Configuración de Servicios Externos

```typescript
export const EXTERNAL_URLS = {
    GOOGLE: {
        CALENDAR: 'https://calendar.google.com',
        OAUTH_AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
        SCOPES: {
            CALENDAR_EVENTS: 'https://www.googleapis.com/auth/calendar.events',
        },
    },
} as const

export const getGoogleRedirectUri = (): string => {
    return `${window.location.origin}/auth/google/callback`
}
```

### 4. Integración con Google Calendar

La aplicación integra Google Calendar mediante OAuth 2.0:

- **Hook `useGoogleAuth`**: Encapsula todo el flujo de autenticación OAuth
  - Construye la URL de autorización
  - Maneja el popup de autenticación
  - Procesa el callback de Google
  - Intercambia el código por tokens
  - Sincroniza hitos con Google Calendar
  - Limpia recursos automáticamente

- **Flujo OAuth**:
  1. Usuario inicia autenticación → se abre popup con URL de Google
  2. Google redirige a `/auth/google/callback` con código
  3. `GoogleAuthCallback` envía código a ventana principal vía `postMessage`
  4. Hook procesa código y sincroniza con backend
  5. Popup se cierra automáticamente

- **Configuración requerida**:
  - Variable de entorno `PUBLIC_GOOGLE_CLIENT_ID`
  - Ruta `/auth/google/callback` configurada en router

### 5. Servicios de API

Los servicios (`authApi`, `challengesApi`, `categoriesApi`) utilizan el cliente HTTP centralizado y extienden la clase `ApiError` para errores específicos:

- `ApiError`: Clase base para todos los errores de API
- `ChallengeApiError`: Errores específicos de challenges
- `CategoryApiError`: Errores específicos de categorías

### 6. Manejo de Errores

Todos los servicios utilizan el manejo de errores centralizado del `apiClient`, que:
- Extrae mensajes de error del servidor
- Maneja errores de red
- Proporciona información estructurada (status, details)

## Prompt Base para IA

```
Genera los componentes de UI para proyecto React + TypeScript + Tailwind CSS, que representen la pantalla de _ de la plataforma YURA.

🎨 Estilo visual

Inspiración: _
UI: limpia, minimalista, modular.

Colores principales:
- Azul eléctrico #1E90FF → botones primarios, acciones clave
- Naranja vibrante #FF8C00 → botones secundarios, alertas
- Verde lima #7CFC00 → indicadores de éxito/progreso
- Gris oscuro #2E2E2E → tipografía, encabezados
- Blanco #FFFFFF → fondo principal, formularios, contraste

Tipografía: Montserrat (encabezados, botones), Roboto (cuerpo de texto).

Botones:
- Primario: azul eléctrico, texto blanco, bordes redondeados (8px)
- Secundario: naranja vibrante, texto blanco
- Ghost/neutro: fondo blanco, borde gris oscuro, texto gris oscuro
- Estados: normal, hover (más oscuro), disabled (gris claro)

Inputs de formulario:
- Fondo blanco, borde gris claro #CCCCCC, bordes redondeados (6px)
- Placeholder gris #999999
- Íconos opcionales dentro (ej. email, candado)

Cards (para feedback): fondo blanco, sombra ligera, título + descripción.
```

## Deployment y CI/CD

### 1. Build Process

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### 2. Variables de Entorno

```env
API_BASE_URL=http://localhost:8000
API_VERSION=v1
PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id_aqui
```

**Nota**: `PUBLIC_GOOGLE_CLIENT_ID` es requerido para la funcionalidad de integración con Google Calendar. Las variables con prefijo `PUBLIC_` son expuestas al cliente por RSBuild.