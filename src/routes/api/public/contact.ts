import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(200),
  message: z.string().trim().min(1).max(4000),
  // honeypot: bots often fill hidden fields
  website: z.string().max(0).optional(),
})

// naive in-memory rate limit per IP (best-effort per worker instance)
const hits = new Map<string, number[]>()
function rateLimited(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > limit
}

export const Route = createFileRoute('/api/public/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          'unknown'
        if (rateLimited(ip)) {
          return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 })
        }

        let payload: unknown
        try {
          payload = await request.json()
        } catch {
          return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
        }

        const parsed = schema.safeParse(payload)
        if (!parsed.success) {
          return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 })
        }
        const { name, contact, message, website } = parsed.data
        if (website) {
          // honeypot triggered - pretend success
          return Response.json({ ok: true })
        }

        const submittedAt = new Date().toLocaleString('bg-BG', {
          timeZone: 'Europe/Sofia',
        })
        const idempotencyKey = `contact-${ip}-${Date.now()}`

        try {
          const result = await sendTemplateEmail('contact-inquiry', 'info@mikclima.com', {
            templateData: { name, contact, message, submittedAt },
            idempotencyKey,
            replyTo: contact.includes('@') ? contact : undefined,
          })
          if (!result.sent) {
            return Response.json({ ok: false, error: 'suppressed' }, { status: 202 })
          }
          return Response.json({ ok: true })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          console.error('contact form send failed', msg)
          return Response.json({ ok: false, error: 'send_failed', detail: msg }, { status: 500 })
        }
      },
    },
  },
})
