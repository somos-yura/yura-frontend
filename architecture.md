# Arquitectura Frontend - MiniWorker Academy

## Resumen del Proyecto

MiniWorker Academy es una plataforma de aprendizaje construida con React + TypeScript + Tailwind CSS. El proyecto implementa un sistema de autenticación completo con pantallas de Login y Registro siguiendo principios de diseño modernos y arquitectura escalable.

## Stack Tecnológico

- **Framework**: React 19.1.1 con TypeScript
- **Bundler**: Rsbuild
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 3.4.18
- **Linting**: ESLint con TypeScript
- **Estado**: React Hooks (useState, useEffect, custom hooks)

## Estructura de Directorios

```
src/
├── components/          # Componentes reutilizables
│   ├── Footer.tsx
│   ├── InputField.tsx
│   ├── MessageAlert.tsx
│   └── PasswordRequirements.tsx
├── config/             # Configuración de la aplicación
│   └── api.ts
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   └── useFormNavigation.ts
├── pages/              # Páginas principales
│   ├── Login.tsx
│   └── Register.tsx
├── services/           # Servicios de API
│   └── authApi.ts
├── types/              # Definiciones de TypeScript
│   └── auth.ts
├── utils/              # Utilidades
│   └── validation.ts
├── App.tsx             # Componente raíz
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## Principios de Arquitectura

### 1. Separación de Responsabilidades

- **Pages**: Componentes de página que manejan la lógica de presentación
- **Components**: Componentes reutilizables sin lógica de negocio
- **Hooks**: Lógica de estado y efectos secundarios
- **Services**: Comunicación con APIs externas
- **Types**: Definiciones de tipos TypeScript
- **Utils**: Funciones puras y utilidades

### 2. Patrones de Diseño

- **Custom Hooks**: Para lógica reutilizable (`useAuth`, `useFormNavigation`)
- **Composition**: Componentes compuestos por otros componentes más pequeños
- **Props Interface**: Interfaces TypeScript para todas las props
- **Error Boundaries**: Manejo centralizado de errores

### 3. Gestión de Estado

- **Local State**: useState para estado local de componentes
- **Global State**: Custom hooks para estado compartido
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

### 1. Configuración de API

```typescript
export const config = {
    API_BASE_URL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000',
    API_VERSION: import.meta.env?.VITE_API_VERSION || 'v1',
    API_ENDPOINTS: {
        LOGIN: '/api/v1/users/login',
        REGISTER: '/api/v1/users/register'
    }
}
```

### 2. Manejo de Respuestas

```typescript
const handleResponse = async (response: Response): Promise<AuthResponse> => {
    const data = await response.json()
    
    if (data.success === true) {
        return data
    }
    
    if (data.translation) {
        throw new ApiError(data.translation, response.status, data)
    }
    
    throw new ApiError('Error', response.status, data)
}
```

## Prompt Base para IA

```
Genera los componentes de UI para proyecto React + TypeScript + Tailwind CSS, que representen la pantalla de _ de la plataforma MiniWorker Academy.

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
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
```