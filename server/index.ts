import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import { z } from 'zod'

const app = express()
const port = process.env.PORT ?? 3001

const resend = new Resend(process.env.RESEND_API_KEY)

// Escapa los datos del formulario antes de insertarlos en el HTML del correo
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const contactSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  mensaje: z.string().min(10),
})

app.use(cors({
  origin: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
    : 'http://localhost:5173',
}))
// inflate: false — no descomprimir cuerpos gzip/deflate/br (CVE-2026-111497)
app.use(express.json({ inflate: false }))

// DO App Platform strips the /api prefix before forwarding — register both paths
app.post(['/contact', '/api/contact'], async (req, res) => {
  const result = contactSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }

  const { nombre, email, mensaje } = result.data

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'Pupita.io <noreply@pupita.io>',
      to: process.env.RESEND_TO ?? '',
      replyTo: email,
      subject: `Nuevo contacto de ${nombre}`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Mensaje:</strong><br>${escapeHtml(mensaje).replace(/\n/g, '<br>')}</p>
      `,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('[contact] Error Resend:', err)
    res.status(500).json({ error: 'Error al enviar el mensaje' })
  }
})

app.listen(port, () => {
  console.log(`API server → http://localhost:${port}`)
})
