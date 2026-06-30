import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { SlideItem, HeroSliderContextValue } from './HeroSlider.types'

const HeroSliderContext = createContext<HeroSliderContextValue | null>(null)

export const useHeroSlider = (): HeroSliderContextValue => {
  const ctx = useContext(HeroSliderContext)
  if (!ctx) throw new Error('useHeroSlider must be used within <HeroSlider>')
  return ctx
}

interface HeroSliderRootProps {
  slides: SlideItem[]
  children: ReactNode
  autoPlay?: boolean
  interval?: number
  showProgress?: boolean
}

export const HeroSliderRoot = ({
  slides,
  children,
  autoPlay = false,
  interval = 4000,
  showProgress = true,
}: HeroSliderRootProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex(i => (i + 1) % slides.length)
  const prev = () => setCurrentIndex(i => (i - 1 + slides.length) % slides.length)
  const goTo = (index: number) => setCurrentIndex(index)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length])

  return (
    <HeroSliderContext.Provider value={{ slides, currentIndex, next, prev, goTo, autoPlay, interval, showProgress }}>
      {children}
    </HeroSliderContext.Provider>
  )
}
