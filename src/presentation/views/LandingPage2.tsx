import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextAnimate } from '../components/text-pull-up'
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5'
import { MdOutlineMail, MdClose } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

import { HeroSlider, useHeroSlider } from '@/presentation/components/HeroSlider'
import type { SlideItem } from '@/presentation/components/HeroSlider'

import bannerImg from '@/assets/images/banner.jpeg'

const EASE = [0.22, 1, 0.36, 1] as const

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string

const contactSchema = z.object({
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFields = z.infer<typeof contactSchema>

const SLIDES: SlideItem[] = [
  {
    image: bannerImg,
    route: 'PRÓXIMAMENTE',
    title: 'Protocolos clínicos listos cuando más los necesitas.',
    description: 'Ajuste de dosis renal para 84+ fármacos, protocolos UCI y manejo completo de CAD/EHH con seguimiento seriado.',
  },
]

const SliderControls = () => {
  const { prev, next, slides } = useHeroSlider()

  if (slides.length < 2) return null

  return (
    <div className="flex gap-2">
      <motion.button
        className="flex items-center justify-center h-12 aspect-square bg-mauve-600 rounded-full"
        onClick={prev}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.28 }}
      >
        <IoChevronBackOutline />
      </motion.button>
      <motion.button
        className="flex items-center justify-center h-12 aspect-square bg-mauve-500 rounded-full"
        onClick={next}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.36 }}
      >
        <IoChevronForward />
      </motion.button>
    </div>
  )
}

const ContactForm = ({ onSent, onClose, onActivity }: { onSent: () => void; onClose: () => void; onActivity: () => void }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFields>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFields) => {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: '[Pupita.io] - Nuevo contacto',
        ...data,
      }),
    })
    if (res.ok) onSent()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={onActivity} onInput={onActivity} className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2">
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="tu@email.com"
            className="w-full bg-mauve-600 rounded-lg px-3 h-9 text-sm placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20"
          />
          {errors.email && <p className="text-pink-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <textarea
            {...register('message')}
            placeholder="Contanos tu idea..."
            rows={5}
            className="w-full bg-mauve-600 rounded-lg px-3 py-2 text-sm placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20 resize-none"
          />
          {errors.message && <p className="text-pink-400 text-xs -mt-1">{errors.message.message}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center h-8 aspect-square rounded-full bg-mauve-600 text-white/50 hover:text-white transition-colors"
        >
          <MdClose />
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-mauve-500 hover:bg-mauve-400 disabled:opacity-50 transition-colors text-sm px-4 h-8 rounded-lg"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  )
}

type CardState = 'default' | 'form' | 'success'

const ContactCard = ({ className }: { className?: string }) => {
  const [state, setState] = useState<CardState>('default')
  const returned = useRef(false)

  const openForm = () => setState('form')

  const close = () => {
    returned.current = true
    setState('default')
  }

  const onSent = () => setState('success')

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearIdle = () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
  const resetIdle = () => { clearIdle(); idleTimer.current = setTimeout(close, 20_000) }

  useEffect(() => {
    if (state !== 'form') { clearIdle(); return }
    resetIdle()
    return clearIdle
  }, [state])

  useEffect(() => {
    if (state !== 'success') return
    const timer = setTimeout(close, 4000)
    return () => clearTimeout(timer)
  }, [state])

  return (
    <div className={`flex flex-col justify-between lg:col-span-2 bg-mauve-700 rounded-2xl p-6 lg:p-8 overflow-hidden min-h-50 ${className ?? ''}`}>
      <AnimatePresence mode="wait">
        {state === 'default' && (
          <motion.div
            key="default"
            className="flex flex-col justify-between h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.h3
              className="font-light text-2xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: returned.current ? 0 : 0.88 }}
            >
              Tu próximo proyecto empieza con una conversación.
            </motion.h3>
            <div className="flex justify-end">
              <motion.button
                className="flex items-center justify-center h-10 aspect-square bg-mauve-500 rounded-full"
                onClick={openForm}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: returned.current ? 0 : 1.06 }}
              >
                <MdOutlineMail />
              </motion.button>
            </div>
          </motion.div>
        )}

        {state === 'form' && (
          <motion.div
            key="form"
            className="flex flex-col justify-between h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ContactForm onSent={onSent} onClose={close} onActivity={resetIdle} />
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            className="flex flex-col justify-center h-full gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="text-2xl font-light">¡Gracias<span className="text-pink-400">!</span></p>
            <p className="text-sm text-white/50">Te respondemos pronto.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const LandingPage2 = () => {
  return (
    <HeroSlider slides={SLIDES} autoPlay interval={5000}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-full text-white">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-6 lg:gap-0 lg:justify-between">

          {/* Logo + thumbnail (en desktop ocupa la mitad superior) */}
          <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-between">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold">
                <TextAnimate mode="letters" stagger={0.025} duration={0.4}>PUPITA</TextAnimate>
                <span className="text-pink-400">
                  <TextAnimate mode="letters" stagger={0.025} duration={0.4} delay={0.12}>.</TextAnimate>
                </span>
                <TextAnimate mode="letters" stagger={0.025} duration={0.4} delay={0.15}>IO</TextAnimate>
              </div>
              <SliderControls />
            </div>

            <div className="hidden lg:flex justify-end">
              <HeroSlider.Thumbnail />
            </div>
          </div>

          {/* Hero text (en desktop ocupa la mitad inferior, texto pegado al fondo) */}
          <div className="flex items-end min-h-[33svh] lg:min-h-0 lg:flex-1">
            <div className="lg:pr-6">
              <h1 className="font-poppins font-bold text-4xl lg:text-6xl mb-3 lg:mb-4">
                <TextAnimate mode="words" stagger={0.04} duration={0.4}>
                  Transformamos ideas en productos digitales que funcionan.
                </TextAnimate>
              </h1>
              <p className="text-base lg:text-lg lg:pr-[35%] text-gray-400">
                <TextAnimate mode="words" stagger={0.025} duration={0.4}>
                  Hacemos que tu idea deje de ser una idea y se convierta en algo que la gente usa.
                </TextAnimate>
              </p>
              <div className="hidden lg:block my-10" />
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="grid gap-4 lg:grid-rows-2">
          <HeroSlider.Card />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <ContactCard className="order-last lg:order-none" />

            <div className="flex flex-col lg:col-span-3 bg-mauve-600 rounded-2xl p-6 lg:p-8 lg:pr-20 order-first lg:order-none">
              <motion.h4
                className="text-2xl font-semibold mb-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.90 }}
              >
                Del concepto al código.
              </motion.h4>
              <motion.p
                className="text-sm text-white/70 leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 1.02 }}
              >
                Desarrollamos aplicaciones web y móviles, sistemas a medida y plataformas digitales que escalan con tu negocio. Trabajamos con equipos que tienen grandes ideas y necesitan un socio técnico que las haga realidad, sin burocracia y con foco en el resultado.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </HeroSlider>
  )
}
