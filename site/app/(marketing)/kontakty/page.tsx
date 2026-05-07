import Link from 'next/link'
import type { Metadata } from 'next'

import { LeadForm } from '@/components/blocks/LeadForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, localBusinessSchema, organizationSchema } from '@/lib/seo/jsonld'
import { metadataBase } from '@/lib/seo/metadata'
import { getSeoSettings } from '@/lib/seo/queries'
import { getSiteChrome } from '@/lib/chrome'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

const META_TITLE = 'Контакты Обихода — телефон, адрес, мессенджеры | Москва и МО'
const META_DESCRIPTION =
  'Свяжитесь с Обиходом: телефон +7 (985) 229-41-11, hello@obikhod.ru, Telegram, MAX, WhatsApp. Адрес: Московская область, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1.'

export const metadata: Metadata = {
  metadataBase,
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: {
    canonical: '/kontakty/',
    languages: { 'ru-RU': '/kontakty/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/kontakty/',
    siteName: 'Обиход',
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: { card: 'summary', title: META_TITLE, description: META_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
}

const NAP = {
  phone: '+7 (985) 229-41-11',
  phoneE164: '+79852294111',
  email: 'hello@obikhod.ru',
  address: 'Московская область, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1',
  hours: 'Пн–Вс 08:00–21:00',
}

const MESSENGERS: Array<{ name: string; href: string; description: string }> = [
  {
    name: 'Telegram',
    href: 'https://t.me/+79852294111',
    description: 'Самый быстрый канал — оператор отвечает за 10 минут.',
  },
  {
    name: 'MAX',
    href: `tel:${NAP.phoneE164}`,
    description: 'Российский мессенджер — пишите на тот же номер.',
  },
  {
    name: 'WhatsApp',
    href: `https://wa.me/${NAP.phoneE164.replace('+', '')}`,
    description: 'Удобно для отправки фото и видео объекта.',
  },
  {
    name: 'Email',
    href: `mailto:${NAP.email}`,
    description: 'Для договоров, СРО-выписок и B2B-документов.',
  },
]

export default async function KontaktyPage() {
  const [chrome, seo] = await Promise.all([
    getSiteChrome().catch(() => null),
    getSeoSettings().catch(() => null),
  ])

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Контакты', href: '/kontakty/' },
  ]

  // ContactPoint extension к sustained organization schema
  const contactPoints = [
    {
      '@type': 'ContactPoint',
      telephone: NAP.phone,
      contactType: 'customer support',
      availableLanguage: 'Russian',
      areaServed: ['Москва', 'Московская область'],
    },
    {
      '@type': 'ContactPoint',
      email: NAP.email,
      contactType: 'customer support',
      availableLanguage: 'Russian',
    },
  ]

  const orgWithContactPoints = {
    ...organizationSchema(
      chrome as Parameters<typeof organizationSchema>[0],
      seo as Parameters<typeof organizationSchema>[1],
    ),
    contactPoint: contactPoints,
  }

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          orgWithContactPoints,
          localBusinessSchema(
            chrome as Parameters<typeof localBusinessSchema>[0],
            seo as Parameters<typeof localBusinessSchema>[1],
          ),
        ]}
      />
      <main className="kontakty-page container">
        <Breadcrumbs items={breadcrumbs} />
        <header className="kontakty-page__hero">
          <h1>Контакты Обихода</h1>
          <p className="kontakty-page__lead">
            Москва и Московская область. Принимаем заявки 7 дней в неделю с 08:00 до 21:00. Самый
            быстрый ответ — в Telegram (за 10 минут вместе со сметой по фото).
          </p>
        </header>

        <section className="kontakty-page__nap">
          <h2>Прямые контакты</h2>
          <dl className="kontakty-page__nap-list">
            <div>
              <dt>Телефон</dt>
              <dd>
                <a href={`tel:${NAP.phoneE164}`}>{NAP.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${NAP.email}`}>{NAP.email}</a>
              </dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>{NAP.address}</dd>
            </div>
            <div>
              <dt>Режим работы</dt>
              <dd>{NAP.hours}</dd>
            </div>
          </dl>
        </section>

        <section className="kontakty-page__messengers">
          <h2>Мессенджеры — отправьте фото объекта</h2>
          <ul>
            {MESSENGERS.map((m) => (
              <li key={m.name}>
                <a
                  href={m.href}
                  target={m.href.startsWith('http') ? '_blank' : undefined}
                  rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <strong>{m.name}</strong>
                </a>
                <span> — {m.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="kontakty-page__form">
          <h2>Или оставьте заявку — перезвоним за 15 минут</h2>
          <LeadForm
            blockType="lead-form"
            h2="Заявка с /kontakty/"
            helper="Опишите задачу одним предложением — оператор подключится по тому каналу, который вам удобен."
            ctaLabel="Отправить заявку"
            successMessage="Спасибо! Перезвоним в течение 15 минут — на номер из заявки."
          />
          <p className="kontakty-page__cta">
            Нужна точная смета сразу?{' '}
            <Link href="/kalkulyator/foto-smeta/?utm_source=lead-infra&utm_medium=kontakty">
              Отправьте 3 фото — оператор пришлёт расчёт за 10 минут →
            </Link>
          </p>
        </section>
      </main>
    </>
  )
}
