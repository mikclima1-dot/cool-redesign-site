import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(40)
    .regex(/^[+0-9\s()-]{6,40}$/),
  email: z.string().trim().email().max(200),
  product: z.object({
    title: z.string().trim().min(1).max(300),
    brand: z.string().trim().max(120),
    model: z.string().trim().max(200),
    price: z.string().trim().max(60),
    url: z.string().trim().max(500),
  }),
  website: z.string().optional(),
})

const hits = new Map<string, number[]>()
function rateLimited(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > limit
}

export const Route = createFileRoute('/api/public/quick-order')({
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
        const { name, phone, email, product, website } = parsed.data

        if (website && website.trim() !== '') {
          return Response.json({ ok: true })
        }

        const host = process.env.SMTP_HOST
        const port = Number(process.env.SMTP_PORT || 465)
        const user = process.env.SMTP_USER
        const pass = process.env.SMTP_PASS
        const mailTo = process.env.MAIL_TO

        if (!host || !user || !pass || !mailTo) {
          console.error('quick order: SMTP env vars missing')
          return Response.json({ ok: false, error: 'send_failed' }, { status: 500 })
        }

        const submittedAt = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' })

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        })

        const text = [
          'Нова бърза поръчка от mikclima.com',
          '',
          `Клиент: ${name}`,
          `Телефон: ${phone}`,
          `Имейл: ${email}`,
          '',
          `Продукт: ${product.title}`,
          `Марка: ${product.brand}`,
          `Модел: ${product.model}`,
          `Цена: ${product.price}`,
          '',
          `Линк към продукта: ${product.url}`,
          '',
          `Дата и час на заявката: ${submittedAt}`,
        ].join('\n')

        const esc = (s: string) =>
          s.replace(/&/g, '\u0026amp;').replace(/</g, '\u0026lt;').replace(/>/g, '\u0026gt;')

        const html = `
          <div style="font-family:Arial,sans-serif;color:#0b2545;max-width:560px">
            <h2 style="margin:0 0 6px">Нова бърза поръчка от mikclima.com</h2>
            <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Заявка от ${esc(submittedAt)}</p>
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;background:#f9fafb">
              <p style="margin:0 0 10px"><strong>Клиент:</strong> ${esc(name)}</p>
              <p style="margin:0 0 10px"><strong>Телефон:</strong> ${esc(phone)}</p>
              <p style="margin:0 0 16px"><strong>Имейл:</strong> ${esc(email)}</p>
              <p style="margin:0 0 10px"><strong>Продукт:</strong> ${esc(product.title)}</p>
              <p style="margin:0 0 10px"><strong>Марка:</strong> ${esc(product.brand)}</p>
              <p style="margin:0 0 10px"><strong>Модел:</strong> ${esc(product.model)}</p>
              <p style="margin:0 0 10px"><strong>Цена:</strong> ${esc(product.price)}</p>
              <p style="margin:0"><strong>Линк:</strong> <a href="${esc(product.url)}">${esc(product.url)}</a></p>
            </div>
          </div>`

        try {
          await transporter.sendMail({
            from: '"MIK Clima website" <info@mikclima.com>',
            to: mailTo,
            replyTo: email,
            subject: `Нова бърза поръчка - ${product.brand} ${product.model}`.trim(),
            text,
            html,
          })
          return Response.json({ ok: true })
        } catch (err: unknown) {
          console.error('quick order SMTP send failed', err)
          return Response.json({ ok: false, error: 'send_failed' }, { status: 500 })
        }
      },
    },
  },
})
