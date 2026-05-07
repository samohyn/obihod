import Link from 'next/link'
import type { Metadata } from 'next'

import { LeadForm } from '@/components/blocks/LeadForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { payloadClient } from '@/lib/payload'
import {
  aggregateRatingSchema,
  breadcrumbListSchema,
  reviewSchema,
  type ReviewItem,
} from '@/lib/seo/jsonld'
import { metadataBase } from '@/lib/seo/metadata'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

const META_TITLE = 'Отзывы об Обиходе — клиенты Москвы и МО | реальные истории'
const META_DESCRIPTION =
  'Отзывы клиентов Обихода: спил деревьев, чистка крыш, вывоз мусора, демонтаж, уборка территории. Реальные истории с Я.Карт, Авито, 2ГИС. Средний рейтинг и AggregateRating schema.'

export const metadata: Metadata = {
  metadataBase,
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: {
    canonical: '/otzyvy/',
    languages: { 'ru-RU': '/otzyvy/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/otzyvy/',
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

const SOURCE_LABELS: Record<string, string> = {
  yandex_maps: 'Я.Карты',
  yandex_business: 'Я.Бизнес',
  twogis: '2ГИС',
  avito: 'Авито',
  site_form: 'Форма на сайте',
  direct: 'Личное обращение',
  other: 'Другое',
}

type ReviewDoc = {
  authorName: string
  rating: number
  text: string
  datePublished: string
  source?: string | null
  sourceUrl?: string | null
  service?: { slug?: string; title?: string } | string | null
  district?: { slug?: string; nameNominative?: string } | string | null
  verified?: boolean | null
  priority?: number | null
}

async function fetchReviews(): Promise<ReviewDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'reviews',
      where: { _status: { equals: 'published' } },
      limit: 200,
      pagination: false,
      depth: 1,
      sort: '-priority,-datePublished',
    })
    return r.docs as unknown as ReviewDoc[]
  } catch {
    return []
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return iso
  }
}

export default async function OtzyvyPage() {
  const reviews = await fetchReviews()

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Отзывы', href: '/otzyvy/' },
  ]

  // AggregateRating: средний rating + count
  const aggregate = (() => {
    if (reviews.length === 0) return null
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0)
    const avg = sum / reviews.length
    return aggregateRatingSchema({
      ratingValue: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
      bestRating: 5,
    })
  })()

  // Review schemas (top-50 на странице, остальные через pagination в US-9 follow-up)
  const reviewSchemas = reviews.slice(0, 50).map((r) =>
    reviewSchema({
      authorName: r.authorName,
      body: r.text,
      rating: r.rating,
      datePublished: r.datePublished,
      serviceSlug: typeof r.service === 'object' && r.service?.slug ? r.service.slug : undefined,
      districtSlug:
        typeof r.district === 'object' && r.district?.slug ? r.district.slug : undefined,
    } satisfies ReviewItem),
  )

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          ...(aggregate ? [aggregate] : []),
          ...reviewSchemas,
        ]}
      />
      <main className="otzyvy-page container">
        <Breadcrumbs items={breadcrumbs} />
        <header className="otzyvy-page__hero">
          <h1>Отзывы клиентов Обихода</h1>
          <p className="otzyvy-page__lead">
            Реальные отзывы из Я.Карт, 2ГИС, Авито и формы на сайте. Каждый отзыв привязан к
            конкретной услуге и району — можно отфильтровать тематику.
          </p>
          {aggregate && (
            <p className="otzyvy-page__stats">
              <strong>Средний рейтинг:</strong> {(aggregate as { ratingValue: number }).ratingValue}{' '}
              из 5 · <strong>{(aggregate as { reviewCount: number }).reviewCount}</strong> отзывов
            </p>
          )}
        </header>

        {reviews.length > 0 ? (
          <section className="otzyvy-page__list">
            {reviews.map((r, i) => {
              const sourceLabel = r.source ? (SOURCE_LABELS[r.source] ?? null) : null
              const districtName =
                typeof r.district === 'object' && r.district?.nameNominative
                  ? r.district.nameNominative
                  : null
              const serviceTitle =
                typeof r.service === 'object' && r.service?.title ? r.service.title : null

              return (
                <article
                  key={i}
                  className="otzyvy-card"
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  <header className="otzyvy-card__header">
                    <span className="otzyvy-card__rating" aria-label={`${r.rating} из 5`}>
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                    </span>
                    <strong className="otzyvy-card__author" itemProp="author">
                      {r.authorName}
                    </strong>
                    <time
                      className="otzyvy-card__date"
                      dateTime={r.datePublished}
                      itemProp="datePublished"
                    >
                      {formatDate(r.datePublished)}
                    </time>
                  </header>
                  <p className="otzyvy-card__text" itemProp="reviewBody">
                    {r.text}
                  </p>
                  <footer className="otzyvy-card__meta">
                    {serviceTitle && <span>Услуга: {serviceTitle}</span>}
                    {districtName && <span>Район: {districtName}</span>}
                    {sourceLabel && (
                      <span>
                        Источник:{' '}
                        {r.sourceUrl ? (
                          <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {sourceLabel}
                          </a>
                        ) : (
                          sourceLabel
                        )}
                      </span>
                    )}
                    {r.verified && <span className="otzyvy-card__verified">✓ Подтверждён</span>}
                  </footer>
                </article>
              )
            })}
          </section>
        ) : (
          <section className="otzyvy-page__empty">
            <p>
              Отзывы загружаются. Хотите оставить свой отзыв после работы — напишите{' '}
              <Link href="/kontakty/?utm_source=otzyvy">в контактах</Link>, мы отправим форму с
              верификацией.
            </p>
          </section>
        )}

        <section className="otzyvy-page__cta">
          <h2>Готовы заказать?</h2>
          <p>
            Отправьте 2-3 фото объекта — пришлём смету за 10 минут с фиксированной ценой.{' '}
            <Link href="/kalkulyator/foto-smeta/?utm_source=otzyvy&utm_medium=root">
              Расчёт по фото →
            </Link>
          </p>
          <LeadForm
            blockType="lead-form"
            h2="Или оставьте заявку"
            helper="Перезвоним за 15 минут, обсудим объект и пришлём смету."
            ctaLabel="Отправить заявку"
            successMessage="Спасибо! Перезвоним в течение 15 минут."
          />
        </section>
      </main>
    </>
  )
}
