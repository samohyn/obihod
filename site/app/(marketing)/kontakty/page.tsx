import Link from 'next/link'
import type { Metadata } from 'next'

import { LeadForm } from '@/components/blocks/LeadForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, localBusinessSchema, organizationSchema } from '@/lib/seo/jsonld'
import { metadataBase } from '@/lib/seo/metadata'
import { getSeoSettings } from '@/lib/seo/queries'
import { getContacts, getSiteChrome } from '@/lib/chrome'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import type { V3BlockWithTone } from '@/components/blocks/v3/types'
import { retone } from '@/lib/blocks/v3/retone'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

const META_TITLE = 'Контакты Обихода — телефон, адрес, мессенджеры | Москва и МО'

export async function generateMetadata(): Promise<Metadata> {
  const blocksPage = await getPage('kontakty')
  if (blocksPage) return buildBlocksPageMetadata(blocksPage, '/kontakty/')
  const c = await getContacts()
  const description = `Свяжитесь с Обиходом: телефон ${c.phoneDisplay}, ${c.email}, Telegram, MAX, WhatsApp. Адрес: ${c.addressLine}.`
  return {
    metadataBase,
    title: { absolute: META_TITLE },
    description,
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
      description,
    },
    twitter: { card: 'summary', title: META_TITLE, description },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }
}

const HOURS = 'Пн–Вс 08:00–21:00'

export default async function KontaktyPage() {
  // 0. Из блоков: документ «Страницы» kontakty
  const blocksPage = await getPage('kontakty')
  if (blocksPage) {
    // Контакты — из «Шапки, подвала и контактов» (один источник), сразу под первым экраном
    const [contacts, view] = await Promise.all([getContacts(), getSiteChrome().catch(() => null)])
    const hours = view?.contacts?.hours?.trim() || 'Ежедневно 8:00–22:00 · заявки 24/7'
    const [hero, ...rest] = blocksPage.blocks
    const info: V3BlockWithTone = {
      blockType: 'about-stats',
      eyebrow: 'Связаться',
      title: 'Телефон, почта, адрес',
      text: hours,
      checklist: [
        `Телефон: ${contacts.phoneDisplay}`,
        `Почта: ${contacts.email}`,
        `Адрес: ${contacts.addressLine}`,
        'Фото объекта — в форме заявки или на почту',
      ],
      stats: [
        { value: '10 мин', label: 'перезвоним после заявки' },
        { value: '30 мин', label: 'смета по фото' },
        { value: '24/7', label: 'приём заявок' },
        { value: '2 ч', label: 'аварийный выезд' },
      ],
    }
    return (
      <PageBlocksView
        page={{ ...blocksPage, blocks: retone([hero, info, ...rest]) }}
        crumbs={trail('kontakty')}
      />
    )
  }

  const [chrome, seo, c] = await Promise.all([
    getSiteChrome().catch(() => null),
    getSeoSettings().catch(() => null),
    getContacts(),
  ])
  const NAP = {
    phone: c.phoneDisplay,
    phoneE164: c.phoneE164,
    email: c.email,
    address: c.addressLine,
    hours: HOURS,
  }
  const MESSENGERS: Array<{ name: string; href: string; description: string }> = [
    {
      name: 'Telegram',
      href: `https://t.me/${NAP.phoneE164}`,
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

  const breadcrumbs = trail('kontakty')

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
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <main className="kontakty-page container">
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
