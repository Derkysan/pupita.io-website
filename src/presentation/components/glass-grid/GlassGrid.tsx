import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { resolveResponsive, useBreakpoint } from '@/hooks'
import type { GlassGridProps } from './GlassGrid.types'

const gridVariants: Variants = {
  hidden: {},
  visible: {},
}

const gridMobileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.93, filter: 'blur(10px)' },
  visible: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
}

const cellVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  visible: (diag: number) => ({
    opacity: 0.5,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: diag * 0.05 },
  }),
}

const cellMobileVariants: Variants = {
  hidden: {},
  visible: { opacity: 0.5 },
}

const DEFAULT_COLS = { base: 5, sm: 7, md: 9, lg: 12, xl: 14 }
const DEFAULT_CELL_ASPECT = 7 / 8
const GAP_PX = 2

export function GlassGrid({
  cols = DEFAULT_COLS,
  cellAspectRatio = DEFAULT_CELL_ASPECT,
  className = '',
}: GlassGridProps) {
  const bp = useBreakpoint()
  const resolvedCols = resolveResponsive(cols, bp, 14)
  const isMobile = bp === 'base' || bp === 'sm'

  const ref = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<number>(0)
  const [cellHeight, setCellHeight] = useState<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      const availW = w - (resolvedCols - 1) * GAP_PX
      const cellW = availW / resolvedCols
      const cellHIdeal = cellW / cellAspectRatio
      const fitsRows = Math.max(1, Math.ceil((h + GAP_PX) / (cellHIdeal + GAP_PX)))
      const actualCellH = (h - (fitsRows - 1) * GAP_PX) / fitsRows
      setRows(fitsRows)
      setCellHeight(actualCellH)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [resolvedCols, cellAspectRatio])

  const cells = resolvedCols * rows

  return (
    <motion.div
      ref={ref}
      className={`grid overflow-hidden ${className}`.trim()}
      style={{
        gridTemplateColumns: `repeat(${resolvedCols}, minmax(0, 1fr))`,
        gridAutoRows: cellHeight > 0 ? `${cellHeight}px` : 'auto',
        gap: `${GAP_PX}px`,
      }}
      aria-hidden="true"
      variants={isMobile ? gridMobileVariants : gridVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: cells }, (_, i) => {
        const row = Math.floor(i / resolvedCols)
        const col = i % resolvedCols
        return (
          <motion.div
            key={i}
            className="relative overflow-hidden rounded-xs bg-white/15 backdrop-blur-3xl shadow-[inset_1px_1px_0_rgba(255,255,255,0.25),inset_-8px_-8px_24px_-8px_rgba(255,255,255,7.5)]"
            variants={isMobile ? cellMobileVariants : cellVariants}
            custom={row + col}
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/40 via-white/5 to-transparent" />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
