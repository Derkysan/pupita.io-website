import { AnimatePresence, motion } from 'framer-motion'
import { useHeroSlider } from './HeroSlider'

const EASE = [0.22, 1, 0.36, 1] as const

export const HeroSliderThumbnail = () => {
  const { slides, currentIndex, goTo } = useHeroSlider()
  const nextIndex = (currentIndex + 1) % slides.length
  const nextSlide = slides[nextIndex]

  if (slides.length < 2) return null

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
    >
      <motion.button
        className="bg-mauve-800 flex items-center justify-center rounded-xl h-26 aspect-square overflow-hidden cursor-pointer"
        onClick={() => goTo(nextIndex)}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.52 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={nextIndex}
            src={nextSlide.image}
            alt={nextSlide.title}
            className="w-full h-full object-cover opacity-75!"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </AnimatePresence>
      </motion.button>

      <div className="flex gap-1 px-3">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            className={`flex flex-1 h-1.5 rounded-xs transition-colors duration-300 ${
              i === currentIndex ? 'bg-mauve-400' : 'bg-mauve-700'
            }`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.60 + i * 0.08 }}
            style={{ originX: 0 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
