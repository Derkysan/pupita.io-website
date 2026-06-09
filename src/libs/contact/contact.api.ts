import type { ContactFormData } from './contact.schemas'

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Error al enviar el mensaje')
  }
}
