import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import nodemailer from 'nodemailer'

// Runs on the Node.js runtime (nodemailer opens a raw TCP socket to SMTP,
// which is not possible on an Edge runtime).
export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1).max(4000),
  // honeypot: bots often fill hidden fields
  website: z.string().optional(),
})

// naive in-memory rate limit per IP (best-effort per instance)
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
          return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 })
        }

        const parsed = schema.safeParse(payload)
        if (!parsed.success) {
          return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 })
        }
        const { name, email, phone, message, website } = parsed.data

        // honeypot triggered - pretend success, send nothing
        if (website && website.trim() !== '') {
          return Response.json({ ok: true })
        }

        const host = process.env.SMTP_HOST
        const port = Number(process.env.SMTP_PORT || 465)
        const user = process.env.SMTP_USER
        const pass = process.env.SMTP_PASS
        const mailTo = process.env.MAIL_TO

        if (!host || !user || !pass || !mailTo) {
          console.error('contact form: SMTP env vars missing')
          return Response.json({ ok: false, error: 'send_failed' }, { status: 500 })
        }

        const submittedAt = new Date().toLocaleString('bg-BG', {
          timeZone: 'Europe/Sofia',
        })

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465, // implicit TLS
          auth: { user, pass },
        })

        const text = [
          'Ново запитване от сайта',
          `Получено на: ${submittedAt}`,
          '',
          `Име: ${name}`,
          `Имейл: ${email}`,
          ...(phone ? [`Телефон: ${phone}`] : []),
          '',
          'Съобщение:',
          message,
        ].join('\n')

        const esc = (s: string) =>
          s
            .replace(/&/g, '\u0026amp;')
            .replace(/</g, '\u0026lt;')
            .replace(/>/g, '\u0026gt;')

        const html = `
          <div style="font-family:Arial,sans-serif;color:#0b2545;max-width:560px">
            <h2 style="margin:0 0 6px">Ново запитване от сайта</h2>
            <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Получено на ${esc(submittedAt)}</p>
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;background:#f9fafb">
              <p style="margin:0 0 10px"><strong>Име:</strong> ${esc(name)}</p>
              <p style="margin:0 0 10px"><strong>Имейл:</strong> ${esc(email)}</p>
              ${phone ? `<p style="margin:0 0 10px"><strong>Телефон:</strong> ${esc(phone)}</p>` : ''}
              <p style="margin:0 0 4px"><strong>Съобщение:</strong></p>
              <p style="margin:0;white-space:pre-wrap">${esc(message)}</p>
            </div>
          </div>`

        try {
          await transporter.sendMail({
            from: '"MIK Clima website" <info@mikclima.com>',
            to: mailTo,
            replyTo: email,
            subject: `Ново запитване от сайта - ${name}`,
            text,
            html,
          })
          return Response.json({ ok: true })
        } catch (err: unknown) {
          console.error('contact form SMTP send failed', err)
          return Response.json({ ok: false, error: 'send_failed' }, { status: 500 })
        }
      },
    },
  },
})
