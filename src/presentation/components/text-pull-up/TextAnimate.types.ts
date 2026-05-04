import type { Easing } from 'framer-motion'

export type TextAnimateMode = 'words' | 'letters'
export type TextAnimateTrigger = 'view' | 'mount'
export type TextAnimateDirection = 'up' | 'down' | 'left' | 'right'

export interface TextAnimateProps {
  children: React.ReactNode
  mode?: TextAnimateMode
  direction?: TextAnimateDirection
  className?: string
  itemClassName?: string
  delay?: number
  stagger?: number
  duration?: number
  offset?: number | string
  ease?: Easing | Easing[]
  trigger?: TextAnimateTrigger
  once?: boolean
  amount?: number
  clip?: boolean
}
