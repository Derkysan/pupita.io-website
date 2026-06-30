import { AnimatePresence, motion } from 'framer-motion'
import { useHeroSlider } from './HeroSlider'

const EASE = [0.22, 1, 0.36, 1] as const

const topContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
}

const topItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
}

const bottomContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
  exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
}

const h2Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
}

const pVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const arrowVariants = {
  hidden: { opacity: 0, scale: 0.65 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
}

export const HeroSliderCard = () => {
  const { slides, currentIndex, autoPlay, interval, showProgress } = useHeroSlider()
  const slide = slides[currentIndex]

  return (
    <div className="relative flex flex-col justify-between bg-mauve-800 rounded-2xl p-6 lg:p-8 overflow-hidden min-h-72 lg:min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05, }}
          animate={{ opacity: 1, scale: 1, }}
          exit={{ opacity: 0, }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-top-left"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />

      {autoPlay && showProgress && slides.length >= 2 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <motion.div
            key={currentIndex}
            className="h-full bg-white/50 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: interval / 1000, ease: 'linear' }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`top-${currentIndex}`}
          className="relative flex justify-end gap-2"
          variants={topContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.button
            className="rounded-md bg-mauve-600 px-5 h-10 text-sm"
            variants={topItemVariants}
          >
            / {slide.route} /
          </motion.button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`bottom-${currentIndex}`}
          className="relative flex items-end gap-[15%]"
          variants={bottomContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex-1">
            <motion.h2
              className="font-poppins font-light text-3xl mb-2"
              variants={h2Variants}
            >
              {slide.title}
            </motion.h2>
            <motion.p
              className="text-sm"
              variants={pVariants}
            >
              {slide.description}
            </motion.p>
          </div>
          <div className="h-12 aspect-square flex-shrink-0" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
