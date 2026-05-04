import { useEffect, useState } from 'react'

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

const BREAKPOINTS: Record<Breakpoint, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

const ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl']

function getBreakpoint(width: number): Breakpoint {
  let current: Breakpoint = 'base'
  for (const bp of ORDER) {
    if (width >= BREAKPOINTS[bp]) current = bp
  }
  return current
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window === 'undefined' ? 'xl' : getBreakpoint(window.innerWidth),
  )

  useEffect(() => {
    const update = () => setBp(getBreakpoint(window.innerWidth))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return bp
}

export function resolveResponsive<T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint,
  fallback: T,
): T {
  if (value === null || typeof value !== 'object') return value as T

  const idx = ORDER.indexOf(breakpoint)
  for (let i = idx; i >= 0; i--) {
    const v = (value as Partial<Record<Breakpoint, T>>)[ORDER[i]]
    if (v !== undefined) return v
  }
  return fallback
}
