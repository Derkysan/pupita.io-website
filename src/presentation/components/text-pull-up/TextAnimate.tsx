import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TextAnimateDirection, TextAnimateProps } from './TextAnimate.types'

const getHiddenTransform = (
  direction: TextAnimateDirection,
  offset: number | string,
): { x?: number | string; y?: number | string } => {
  switch (direction) {
    case 'up':    return { y: offset }
    case 'down':  return { y: `-${offset}` }
    case 'left':  return { x: offset }
    case 'right': return { x: `-${offset}` }
  }
}

const flattenToString = (node: React.ReactNode): string => {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenToString).join('')
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return flattenToString(props.children)
  }
  return ''
}

const splitWords = (text: string) =>
  text.split(/(\s+)/).filter((token) => token.length > 0)

const splitLetters = (text: string) => Array.from(text)

export const TextAnimate: React.FC<TextAnimateProps> = ({
  children,
  mode = 'words',
  direction = 'up',
  className,
  itemClassName,
  delay = 0,
  stagger,
  duration = 0.6,
  offset = '100%',
  ease = [0.22, 1, 0.36, 1],
  trigger = 'view',
  once = true,
  amount = 0.3,
  clip = true,
}) => {
  const resolvedStagger = stagger ?? (mode === 'letters' ? 0.03 : 0.07)
  const text = flattenToString(children).replace(/\s+/g, ' ').trim()
  const tokens = mode === 'words' ? splitWords(text) : splitLetters(text)

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: resolvedStagger,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, ...getHiddenTransform(direction, offset) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease },
    },
  }

  const motionProps =
    trigger === 'view'
      ? {
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: { once, amount },
        }
      : {
          initial: 'hidden' as const,
          animate: 'visible' as const,
        }

  return (
    <motion.span
      variants={containerVariants}
      {...motionProps}
      className={cn('inline-block', className)}
      aria-label={text}
    >
      {tokens.map((token, index) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={index} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
              {token}
            </span>
          )
        }
        return (
          <span
            key={index}
            aria-hidden="true"
            className={cn('inline-block align-bottom', clip && 'overflow-hidden')}
          >
            <motion.span
              variants={itemVariants}
              className={cn('inline-block', itemClassName)}
            >
              {token}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}
