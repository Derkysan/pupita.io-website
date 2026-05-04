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

type LetterGroup =
  | { isSpace: true; text: string }
  | { isSpace: false; chars: string[] }

const splitLettersGrouped = (text: string): LetterGroup[] =>
  text.split(/(\s+)/).filter((t) => t.length > 0).map((token) =>
    /^\s+$/.test(token)
      ? { isSpace: true, text: token }
      : { isSpace: false, chars: Array.from(token) }
  )

const splitWords = (text: string) =>
  text.split(/(\s+)/).filter((token) => token.length > 0)

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

  const renderLetter = (char: string, key: React.Key) => (
    <span
      key={key}
      aria-hidden="true"
      className={cn('inline-block align-bottom', clip && 'overflow-hidden')}
    >
      <motion.span variants={itemVariants} className={cn('inline-block', itemClassName)}>
        {char}
      </motion.span>
    </span>
  )

  return (
    <motion.span
      variants={containerVariants}
      {...motionProps}
      className={cn('inline-block', className)}
      aria-label={text}
    >
      {mode === 'letters'
        ? splitLettersGrouped(text).map((group, gi) =>
            group.isSpace ? (
              <span key={`s${gi}`} aria-hidden="true">{' '}</span>
            ) : (
              // whitespace-nowrap keeps all letters of a word on the same line
              <span key={`w${gi}`} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {group.chars.map((char, ci) => renderLetter(char, `${gi}-${ci}`))}
              </span>
            )
          )
        : splitWords(text).map((token, i) =>
            /^\s+$/.test(token) ? (
              <span key={i} aria-hidden="true">{' '}</span>
            ) : (
              <span
                key={i}
                aria-hidden="true"
                className={cn('inline-block align-bottom', clip && 'overflow-hidden')}
              >
                <motion.span variants={itemVariants} className={cn('inline-block', itemClassName)}>
                  {token}
                </motion.span>
              </span>
            )
          )}
    </motion.span>
  )
}
