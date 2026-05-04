import { motion } from 'framer-motion'
import { GlassGrid } from '../glass-grid'
import { GradientWave } from '../gradient-wave'
import type { GlassBackdropProps } from './GlassBackdrop.types'

export function GlassBackdrop({
  cols,
  cellAspectRatio,
  className = 'absolute inset-0',
}: GlassBackdropProps) {
  return (
    <div className={className} aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <GradientWave />
      </motion.div>
      <GlassGrid
        cols={cols}
        cellAspectRatio={cellAspectRatio}
        className="absolute inset-0 z-10"
      />
    </div>
  )
}
