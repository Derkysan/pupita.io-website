import { z } from 'zod'

export const contactSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  mensaje: z.string().min(10, 'Mínimo 10 caracteres'),
})

export type ContactFormData = z.infer<typeof contactSchema>
