import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  contact?: string
  message?: string
  submittedAt?: string
}

const ContactInquiryEmail = ({ name, contact, message, submittedAt }: Props) => (
  <Html lang="bg" dir="ltr">
    <Head />
    <Preview>Ново запитване от {name || 'клиент'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ново запитване от сайта</Heading>
        <Text style={muted}>
          {submittedAt ? `Получено на ${submittedAt}` : 'Току-що получено от контактната форма.'}
        </Text>

        <Section style={card}>
          <Text style={label}>Име</Text>
          <Text style={value}>{name || '-'}</Text>

          <Text style={label}>Телефон / имейл</Text>
          <Text style={value}>{contact || '-'}</Text>

          <Text style={label}>Съобщение</Text>
          <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message || '-'}</Text>
        </Section>

        <Text style={muted}>
          Свържете се с клиента възможно най-скоро.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactInquiryEmail,
  subject: (data: Record<string, any>) =>
    `Ново запитване от ${data?.name || 'клиент'} - MIKCLIMA`,
  displayName: 'Запитване от контактна форма',
  to: 'info@mikclima.com',
  previewData: {
    name: 'Иван Иванов',
    contact: '+359 897 000 000',
    message: 'Здравейте, интересува ме инверторен климатик 12000 BTU за спалня.',
    submittedAt: new Date().toLocaleString('bg-BG'),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { color: '#0b2545', fontSize: '22px', margin: '0 0 8px' }
const muted = { color: '#6b7280', fontSize: '13px', margin: '4px 0 16px' }
const card = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px 20px',
  background: '#f9fafb',
}
const label = {
  color: '#6b7280',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  margin: '10px 0 2px',
}
const value = { color: '#0b2545', fontSize: '15px', margin: '0 0 6px', fontWeight: 600 }
