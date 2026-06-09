import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { MdArrowOutward } from 'react-icons/md'
import { contactSchema, type ContactFormData, sendContactEmail } from '@/libs/contact'

const EASE = [0.22, 1, 0.36, 1] as const

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: EASE },
  }),
}

const inputClass =
  'bg-transparent border-b border-gray-700 text-white text-base py-2 placeholder:text-gray-700 focus-visible:outline-none transition-colors duration-200'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendContactEmail(data)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg flex flex-col gap-6 normal-case tracking-normal font-normal"
    >
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 uppercase tracking-widest">Nombre</label>
        <input
          {...register('nombre')}
          type="text"
          placeholder="Tu nombre"
          className={inputClass}
        />
        {errors.nombre && <span className="text-pink-400 text-xs mt-1">{errors.nombre.message}</span>}
      </motion.div>

      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 uppercase tracking-widest">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="tu@email.com"
          className={inputClass}
        />
        {errors.email && <span className="text-pink-400 text-xs mt-1">{errors.email.message}</span>}
      </motion.div>

      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 uppercase tracking-widest">Mensaje</label>
        <textarea
          {...register('mensaje')}
          placeholder="Cuéntanos sobre tu proyecto"
          rows={3}
          className={`${inputClass} resize-none`}
        />
        {errors.mensaje && <span className="text-pink-400 text-xs mt-1">{errors.mensaje.message}</span>}
      </motion.div>

      <motion.div
        custom={3}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between gap-4"
      >
        <span className="text-xs">
          {status === 'success' && (
            <span className="text-gray-400">Mensaje enviado. Te contactamos pronto.</span>
          )}
          {status === 'error' && (
            <span className="text-pink-400">Error al enviar. Intenta de nuevo.</span>
          )}
        </span>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex shrink-0 items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando…' : 'Enviar'}
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-600 group-hover:border-pink-400 group-hover:text-pink-400 transition-colors duration-200">
            <MdArrowOutward className="text-base" />
          </span>
        </button>
      </motion.div>
    </form>
  )
}
