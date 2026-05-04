# Arquitectura Frontend — Guía de Boilerplate

> Documento agnóstico al dominio de negocio. Describe la arquitectura, las decisiones técnicas y las librerías utilizadas en este proyecto frontend React, con el objetivo de replicar la misma estructura en proyectos futuros.

---

## Stack Tecnológico

| Categoría | Librería | Versión | Rol |
|---|---|---|---|
| Framework UI | React | 19 | Componentes, renderizado |
| Lenguaje | TypeScript | ~5.8 | Tipo fuerte en toda la app |
| Build Tool | Vite | 7 | Dev server con HMR, bundler |
| Enrutamiento | React Router DOM | v7 | SPA client-side routing |
| Formularios | React Hook Form | v7 | Estado de formulario |
| Validación | Zod | v4 | Schemas de validación |
| Integración HF+Zod | @hookform/resolvers | v5 | Resolver Zod → RHF |
| Estado servidor | TanStack React Query | v5 | Fetching, caché, mutaciones |
| Estado cliente | Zustand | v5 | Estado global liviano |
| HTTP | Axios | v1 | Cliente HTTP |
| Estilos | Tailwind CSS | v4 | Clases utilitarias |
| Animaciones | Framer Motion | v12 | Transiciones de página |
| Iconos | react-icons | v5 | Iconografía |

---

## Estructura de Directorios

```
src/
├── main.tsx                  # Entry point — monta React + providers globales
├── App.tsx                   # BrowserRouter + router principal
├── index.css                 # Importa el sistema de estilos en capas
│
├── libs/                     # Lógica de negocio pura (sin UI)
│   ├── queryClient.ts        # Configuración global de React Query
│   ├── http/                 # Cliente HTTP (Axios wrapper)
│   │   ├── axios-instance.ts # Instancia Axios + interceptores
│   │   ├── axios-http-client.ts # Clase AxiosHttpClient (GET/POST/PUT/PATCH/DELETE)
│   │   ├── types.ts          # Interfaces HttpClient, HttpRequestOptions
│   │   └── index.ts
│   ├── errors/
│   │   └── extractMessage.ts # Extrae mensajes de error de tipos heterogéneos
│   └── [domain]/             # Una carpeta por dominio de negocio
│       ├── domain.types.ts   # Tipos e interfaces TypeScript
│       ├── domain.schemas.ts # Schemas Zod (validación + inferencia de tipos)
│       ├── domain.api.ts     # Funciones de llamada a la API
│       └── index.ts
│
├── store/                    # Zustand stores (estado global cliente)
│   ├── useTheme.ts           # Tema claro/oscuro (persistido)
│   ├── useUI.ts              # Estado de UI (navegación, toggles)
│   ├── useLoading.ts         # Estado de carga global
│   └── index.ts
│
├── hooks/                    # Hooks reutilizables a nivel de app
│   ├── useDebounce.ts        # Debounce genérico
│   ├── useStepNavigation.ts  # Lógica de pasos multi-step
│   ├── useWorkOrders.ts      # Hooks de React Query (por dominio)
│   └── index.ts
│
├── presentation/             # Capa UI
│   ├── components/
│   │   ├── shared/           # Componentes base reutilizables (design system)
│   │   │   ├── BaseButton/
│   │   │   ├── BaseTextField/
│   │   │   ├── BaseSelect/
│   │   │   ├── BaseNumberField/
│   │   │   └── ...
│   │   └── [feature]/        # Componentes específicos por feature
│   ├── layouts/              # Layouts de página (shell + Outlet)
│   │   ├── FormLayout.tsx
│   │   └── PageLayout.tsx
│   └── views/                # Componentes de página (enrutados directamente)
│       └── [FeaturePage].tsx
│
├── routers/
│   └── AppRouter.tsx         # Definición de rutas
│
└── styles/                   # Sistema de diseño CSS
    ├── base.css              # Reset, tipografía, accesibilidad
    ├── theme/
    │   ├── colors.css        # Tokens de color (4 niveles)
    │   ├── typography.css    # Tokens tipográficos
    │   └── spacing.css       # Tokens de espaciado
    ├── components/           # Clases reutilizables de componentes
    ├── utilities/            # Animaciones y helpers
    └── instances/            # Overrides por tenant/cliente
        ├── default.css
        └── client-[x].css
```

---

## Entry Points

### `main.tsx`

El entry point monta la aplicación completa con todos los providers globales.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/libs/queryClient'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
```

### `App.tsx`

Mínimo: sólo BrowserRouter + router.

```tsx
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/routers'

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
```

---

## Cliente HTTP

### Patrón: Interface + Implementación

Se define una interfaz `HttpClient` y se implementa con Axios. Esto permite swappear la implementación sin tocar el código de negocio.

```typescript
// libs/http/types.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequestOptions {
  params?: Record<string, unknown>
  headers?: Record<string, string>
  signal?: AbortSignal
  responseType?: 'json' | 'blob'
}

export interface HttpClient {
  get<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>
  post<TResponse, TBody>(url: string, body: TBody, options?: HttpRequestOptions): Promise<TResponse>
  put<TResponse, TBody>(url: string, body: TBody, options?: HttpRequestOptions): Promise<TResponse>
  patch<TResponse, TBody>(url: string, body: TBody, options?: HttpRequestOptions): Promise<TResponse>
  delete<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>
}
```

```typescript
// libs/http/axios-instance.ts
import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api',
  timeout: 20_000,
  withCredentials: false,
})

// Interceptores opcionales para logging en desarrollo
axiosInstance.interceptors.request.use((config) => {
  if (import.meta.env.DEV) console.log('[HTTP]', config.method?.toUpperCase(), config.url)
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV) console.error('[HTTP Error]', err)
    return Promise.reject(err)
  }
)
```

```typescript
// libs/http/axios-http-client.ts
import type { HttpClient, HttpRequestOptions } from './types'
import { axiosInstance } from './axios-instance'

export class AxiosHttpClient implements HttpClient {
  async get<TResponse>(url: string, options?: HttpRequestOptions) {
    const res = await axiosInstance.get<TResponse>(url, {
      params: options?.params,
      headers: options?.headers,
      signal: options?.signal,
      responseType: options?.responseType ?? 'json',
    })
    return res.data
  }

  async post<TResponse, TBody>(url: string, body: TBody, options?: HttpRequestOptions) {
    const res = await axiosInstance.post<TResponse>(url, body, {
      headers: options?.headers,
      signal: options?.signal,
    })
    return res.data
  }

  // put, patch, delete siguen el mismo patrón...
}

// Singleton exportado
export const httpClient: HttpClient = new AxiosHttpClient()
```

---

## Dominio de Negocio (Feature Module)

Cada dominio vive en `libs/[domain]/` con tres archivos:

### `domain.types.ts` — Tipos TypeScript

```typescript
// Enums para valores cerrados
export enum EntityStatus { PENDING = 'pending', ACTIVE = 'active', DONE = 'done' }

// Tipo completo de la entidad
export interface Entity {
  _id: string
  name: string
  status: EntityStatus
  createdAt: string
}

// DTO de entrada (payload de creación)
export interface CreateEntityPayload {
  name: string
  // ...campos adicionales
}
```

### `domain.schemas.ts` — Validación Zod

```typescript
import { z } from 'zod'

export const createEntitySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  email: z.string().email('Email inválido'),
  // Honeypot para bot detection (campo trampa, debe quedar vacío)
  website: z.string().max(0, 'Bot detectado').optional(),
})

// Inferir el tipo directamente del schema (fuente de verdad única)
export type CreateEntityInput = z.infer<typeof createEntitySchema>
```

### `domain.api.ts` — Llamadas a la API

```typescript
import { httpClient } from '@/libs/http'
import type { Entity, CreateEntityPayload } from './domain.types'

export const entityApi = {
  create: (payload: CreateEntityPayload): Promise<Entity> =>
    httpClient.post('/entities', payload),

  getById: (id: string): Promise<Entity> =>
    httpClient.get(`/entities/${id}`),
}
```

---

## Estado Servidor — React Query

### Configuración global

```typescript
// libs/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,           // 60 segundos antes de re-fetch
      refetchOnWindowFocus: false,  // No re-fetch al volver al tab
      retry: 1,                    // Un solo reintento
    },
  },
})
```

### Hook por dominio

```typescript
// hooks/useEntities.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { entityApi } from '@/libs/entities'

export function useEntityById(id: string) {
  return useQuery({
    queryKey: ['entities', id],
    queryFn: () => entityApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateEntity() {
  return useMutation({
    mutationFn: entityApi.create,
    onSuccess: () => {
      // invalidar queries relacionadas si corresponde
    },
  })
}
```

---

## Estado Cliente — Zustand

### Patrón estándar de store

```typescript
// store/useUI.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  step: number
  isExpanded: boolean
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  reset: () => void
  toggleExpanded: () => void
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      step: 0,
      isExpanded: false,
      nextStep: () => set((s) => ({ step: s.step + 1 })),
      prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
      setStep: (step) => set({ step }),
      reset: () => set({ step: 0, isExpanded: false }),
      toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
    }),
    {
      name: 'ui-storage',
      partialize: (s) => ({ isExpanded: s.isExpanded }), // Solo persiste lo necesario
    }
  )
)
```

### Store de tema

```typescript
// store/useTheme.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { theme: next }
        }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
      },
    }),
    { name: 'theme-storage' }
  )
)
```

---

## Formularios Multi-Paso

### Arquitectura general

El formulario multi-paso usa **React Hook Form** con un `FormProvider` en el layout, lo que permite que cualquier componente hijo acceda al contexto del formulario via `useFormContext()`.

```
FormLayout (FormProvider)
  └─ WorkOrderPage
       ├─ Step 0: CustomerForm (useFormContext)
       ├─ Step 1: ProductForm  (useFormContext)
       ├─ Step 2: CategoryForm (useFormContext)
       ├─ Step 3: ConstructorForm (useFormContext)
       ├─ Step 4: Summary + submit
       └─ Step 5: Success screen
```

### Layout con FormProvider

```tsx
// presentation/layouts/FormLayout.tsx
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Outlet } from 'react-router-dom'
import { createEntitySchema, type CreateEntityInput } from '@/libs/entities'

export function FormLayout() {
  const methods = useForm<CreateEntityInput>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: { /* valores iniciales */ },
    mode: 'onBlur',
  })

  return (
    <FormProvider {...methods}>
      <Header />
      <Outlet />
    </FormProvider>
  )
}
```

### Persistencia del formulario en localStorage

```typescript
// presentation/components/feature/hooks/useFeatureForm.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const STORAGE_KEY = 'feature-form-draft'

export function useFeatureForm() {
  const savedData = localStorage.getItem(STORAGE_KEY)
  const defaultValues = savedData ? JSON.parse(savedData) : {}

  const methods = useForm({
    resolver: zodResolver(createEntitySchema),
    defaultValues,
  })

  // Persistir cambios (usar con debounce en producción)
  const { watch } = methods
  watch((data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)))

  return methods
}
```

### Componente de paso (patrón estándar)

```tsx
// presentation/components/feature/forms/StepOneForm.tsx
import { useFormContext } from 'react-hook-form'
import { BaseTextField, BaseSelect } from '@/presentation/components/shared'
import type { CreateEntityInput } from '@/libs/entities'

export function StepOneForm() {
  const { register, formState: { errors } } = useFormContext<CreateEntityInput>()

  return (
    <form>
      <BaseTextField
        label="Nombre"
        {...register('name')}
        error={errors.name?.message}
      />
      {/* ...más campos */}
    </form>
  )
}
```

### Validación parcial por paso

Para validar sólo los campos del paso actual antes de avanzar:

```typescript
import { useFormContext } from 'react-hook-form'

const STEP_FIELDS: Record<number, string[]> = {
  0: ['name', 'email'],
  1: ['category'],
  2: ['width', 'length'],
}

export function useStepNavigation() {
  const { trigger } = useFormContext()
  const { step, nextStep } = useUI()

  const handleNext = async () => {
    const fields = STEP_FIELDS[step] ?? []
    const valid = await trigger(fields as any)
    if (valid) nextStep()
  }

  return { handleNext }
}
```

---

## Enrutamiento

```typescript
// routers/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { FormLayout, PageLayout } from '@/presentation/layouts'
import { FeaturePage, PricingPage } from '@/presentation/views'

export function AppRouter() {
  return (
    <Routes>
      {/* Redirect raíz */}
      <Route path="/" element={<Navigate to="/feature/create" replace />} />

      {/* Rutas con layout de formulario */}
      <Route element={<FormLayout />}>
        <Route path="/feature/create" element={<FeaturePage />} />
      </Route>

      {/* Rutas con layout general */}
      <Route element={<PageLayout />}>
        <Route path="/pricing" element={<PricingPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

---

## Sistema de Estilos

### Arquitectura de 4 niveles de tokens CSS

```
Nivel 1: Primitivos     --color-brand-primary-500: #3b82f6
         │
         ▼
Nivel 2: Semánticos     --color-primary: var(--color-brand-primary-500)
         │
         ▼
Nivel 3: Aplicación     --bg-primary: var(--color-primary)
                        --text-primary: ...
         │
         ▼
Nivel 4: Componentes    --btn-primary-bg: var(--bg-primary)
                        --input-bg: var(--bg-surface)
```

### Implementación en CSS

```css
/* styles/theme/colors.css */
:root {
  /* Nivel 1: Primitivos */
  --color-brand-primary-500: #3b82f6;
  --color-brand-primary-600: #2563eb;
  --color-neutral-100: #f3f4f6;

  /* Nivel 2: Semánticos */
  --color-primary: var(--color-brand-primary-500);
  --color-primary-hover: var(--color-brand-primary-600);

  /* Nivel 3: Aplicación */
  --bg-primary: var(--color-primary);
  --bg-surface: #ffffff;
  --text-primary: #111827;
  --border-default: #e5e7eb;

  /* Nivel 4: Componentes */
  --btn-primary-bg: var(--bg-primary);
  --btn-primary-text: #ffffff;
  --input-bg: var(--bg-surface);
  --input-border: var(--border-default);
}

/* Dark mode override */
.dark {
  --bg-surface: #1f2937;
  --text-primary: #f9fafb;
  --border-default: #374151;
  /* Solo redefinir los niveles necesarios */
}
```

### Multi-tenant overrides

```css
/* styles/instances/client-x.css */
/* Sobrescribe únicamente los tokens de nivel 1 o 2 */
:root {
  --color-brand-primary-500: #10b981; /* verde en lugar de azul */
}
```

### Configuración de Tailwind v4

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
    dedupe: ['react', 'react-dom'],
  },
})
```

```css
/* index.css — importar en este orden */
@import 'tailwindcss';
@import './styles/theme/colors.css';
@import './styles/theme/typography.css';
@import './styles/theme/spacing.css';
@import './styles/base.css';
@import './styles/components/buttons.css';
@import './styles/components/forms.css';
@import './styles/utilities/animations.css';
@import './styles/instances/default.css';
```

---

## Variables de Entorno

```bash
# .env.template
VITE_API_BASE=          # URL base de la API REST
VITE_APP_ENV=           # "development" | "production"
```

```bash
# .env.development (local)
VITE_API_BASE=http://localhost:3000/api
VITE_APP_ENV=development
```

```bash
# .env (producción)
VITE_API_BASE=https://api.tudominio.com/api
VITE_APP_ENV=production
```

Acceso en código: `import.meta.env.VITE_API_BASE` (siempre con prefijo `VITE_`).

---

## Componentes Base (Design System Interno)

Cada componente base sigue esta estructura de archivos:

```
shared/BaseComponent/
├── BaseComponent.tsx        # Implementación
├── BaseComponent.types.ts   # Props interface
├── BaseComponent.css        # Estilos específicos (si aplica)
└── index.ts                 # Re-export
```

### Patrón de implementación

```tsx
// BaseTextField.types.ts
export interface BaseTextFieldProps {
  label: string
  error?: string
  placeholder?: string
  disabled?: boolean
  // ...resto de atributos HTML input
}

// BaseTextField.tsx
import { forwardRef } from 'react'
import type { BaseTextFieldProps } from './BaseTextField.types'

export const BaseTextField = forwardRef<HTMLInputElement, BaseTextFieldProps>(
  ({ label, error, placeholder, disabled, ...rest }, ref) => {
    return (
      <div className="field-group">
        <label className="field-label">{label}</label>
        <input
          ref={ref}
          className={`field-input ${error ? 'field-input--error' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
        {error && <span className="field-error">{error}</span>}
      </div>
    )
  }
)
BaseTextField.displayName = 'BaseTextField'
```

---

## Configuración de TypeScript

```json
// tsconfig.json (puntos clave)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## Scripts npm

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## Convenciones

| Aspecto | Convención |
|---|---|
| Imports | Alias `@/` para todo lo que esté en `src/` |
| Exports | Barrel exports via `index.ts` por carpeta |
| Nombres de archivos | Componentes en `PascalCase`, utilidades en `camelCase` |
| Sufijos | `.types.ts`, `.schemas.ts`, `.api.ts` |
| Estado servidor | React Query (no useState para datos remotos) |
| Estado cliente global | Zustand (no Context API para estado mutable) |
| Estado de formulario | React Hook Form + Zod (no useState) |
| Validación | Zod schema como fuente de verdad (tipos inferidos del schema) |
| Estilos | CSS tokens + Tailwind (no estilos inline) |
| Dark mode | Clase `.dark` en `document.documentElement` |
| Errores | Extraer mensajes con `extractMessage()`, no acceder a `err.message` directamente |

---

## Checklist para un Nuevo Proyecto

- [ ] Crear proyecto con `npm create vite@latest -- --template react-ts`
- [ ] Instalar dependencias del stack (ver tabla al inicio)
- [ ] Configurar alias `@/` en `vite.config.ts` y `tsconfig.json`
- [ ] Crear archivos `.env`, `.env.development`, `.env.template`
- [ ] Implementar `libs/http/` (instancia Axios + wrapper + tipos)
- [ ] Configurar `libs/queryClient.ts`
- [ ] Crear primer store Zustand para tema (`useTheme`)
- [ ] Implementar sistema de tokens CSS en 4 niveles
- [ ] Crear componentes base (`BaseTextField`, `BaseButton`, `BaseSelect`)
- [ ] Definir layouts (`FormLayout`, `PageLayout`)
- [ ] Configurar `AppRouter.tsx`
- [ ] Crear primer feature module en `libs/[domain]/`
