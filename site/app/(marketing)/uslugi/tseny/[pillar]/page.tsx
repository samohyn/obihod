import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { aggregateOfferSchema, breadcrumbListSchema, faqPageSchema } from '@/lib/seo/jsonld'
import { metadataBase } from '@/lib/seo/metadata'
import { getAllPillarsForPricing, getServiceBySlug } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
export const dynamicParams = true

const PRICE_UNIT_LABELS: Record<string, string> = {
  object: 'за объект',
  tree: 'за дерево',
  m3: 'за м³',
  shift: 'за смену',
  m2: 'за м²',
  sotka: 'за сотку',
  pog_m: 'за погонный м',
  pcs: 'за шт.',
}

function formatPrice(from: number | null, to: number | null, unit: string | null): string {
  if (!from) return 'по запросу'
  const unitLabel = unit ? (PRICE_UNIT_LABELS[unit] ?? unit) : ''
  const suffix = unitLabel ? ` ${unitLabel}` : ''
  if (to && to > from) {
    return `${from.toLocaleString('ru-RU')}–${to.toLocaleString('ru-RU')} ₽${suffix}`
  }
  return `от ${from.toLocaleString('ru-RU')} ₽${suffix}`
}

export async function generateStaticParams() {
  const pillars = await getAllPillarsForPricing()
  return pillars.map((p) => ({ pillar: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>
}): Promise<Metadata> {
  const { pillar: pillarSlug } = await params
  const service = await getServiceBySlug(pillarSlug)
  if (!service) return {}

  const title = `Цены: ${(service as { title?: string }).title ?? pillarSlug} в Москве и МО — прайс 2026`
  const description = `Подробный прайс на услуги «${(service as { title?: string }).title ?? pillarSlug}» — диапазоны «от-до» по каждой подуслуге. Расчёт по фото за 10 минут.`

  return {
    metadataBase,
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/uslugi/tseny/${pillarSlug}/`,
      languages: { 'ru-RU': `/uslugi/tseny/${pillarSlug}/` },
    },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `/uslugi/tseny/${pillarSlug}/`,
      siteName: 'Обиход',
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }
}

type ServiceLike = {
  slug: string
  title: string
  h1?: string
  intro?: string | null
  priceFrom?: number | null
  priceTo?: number | null
  priceUnit?: string | null
  faqGlobal?: Array<{ question: string; answer: unknown }> | null
  subServices?: Array<{
    slug?: string
    title?: string
    priceFrom?: number | null
    priceTo?: number | null
    priceUnit?: string | null
    intro?: string | null
  }> | null
}

function extractText(richTextOrString: unknown): string {
  if (typeof richTextOrString === 'string') return richTextOrString
  if (!richTextOrString || typeof richTextOrString !== 'object') return ''
  const root = richTextOrString as { root?: { children?: unknown[] } }
  if (!root.root?.children) return ''
  function walk(nodes: unknown[]): string {
    return nodes
      .map((n) => {
        if (typeof n !== 'object' || !n) return ''
        const node = n as { text?: string; children?: unknown[] }
        if (node.text) return node.text
        if (node.children) return walk(node.children)
        return ''
      })
      .join(' ')
  }
  return walk(root.root.children).trim()
}

export default async function PillarPricingPage({
  params,
}: {
  params: Promise<{ pillar: string }>
}) {
  const { pillar: pillarSlug } = await params
  const service = (await getServiceBySlug(pillarSlug)) as ServiceLike | null
  if (!service) notFound()

  const subs = (service.subServices ?? []).filter(
    (s): s is { slug: string; title: string } & typeof s => Boolean(s.slug && s.title),
  )

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Цены', href: '/uslugi/tseny/' },
    { name: service.title, href: `/uslugi/tseny/${service.slug}/` },
  ]

  const offers = [
    {
      name: service.title,
      priceFrom: service.priceFrom ?? 0,
      priceTo: service.priceTo ?? service.priceFrom ?? 0,
      unit: service.priceUnit ?? undefined,
      url: `${SITE_URL}/${service.slug}/`,
    },
    ...subs
      .filter((s) => s.priceFrom)
      .map((s) => ({
        name: `${service.title} — ${s.title}`,
        priceFrom: s.priceFrom!,
        priceTo: s.priceTo ?? s.priceFrom!,
        unit: s.priceUnit ?? undefined,
        url: `${SITE_URL}/${service.slug}/${s.slug}/`,
      })),
  ]

  const aggregateOffer = offers.some((o) => o.priceFrom > 0)
    ? aggregateOfferSchema({ offers })
    : null

  const richTextFaq = (service.faqGlobal ?? [])
    .map((q) => ({ question: q.question, answer: extractText(q.answer) }))
    .filter((q) => q.question && q.answer)

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          ...(aggregateOffer ? [aggregateOffer] : []),
          ...(richTextFaq.length > 0 ? [faqPageSchema(richTextFaq)] : []),
        ]}
      />
      <main className="pricing-pillar-page container">
        <Breadcrumbs items={breadcrumbs} />
        <header className="pricing-pillar-page__hero">
          <h1>Цены: {service.title}</h1>
          <p className="pricing-pillar-page__lead">
            {service.intro
              ? service.intro.slice(0, 280)
              : `Подробный прайс на ${service.title.toLowerCase()} в Москве и МО.`}
          </p>
          <p className="pricing-pillar-page__range">
            <strong>Диапазон:</strong>{' '}
            {formatPrice(
              service.priceFrom ?? null,
              service.priceTo ?? null,
              service.priceUnit ?? null,
            )}
          </p>
        </header>

        {subs.length > 0 ? (
          <section className="pricing-pillar-page__matrix">
            <h2>Подуслуги и цены</h2>
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Подуслуга</th>
                  <th>Цена</th>
                  <th>Перейти</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((sub) => (
                  <tr key={sub.slug}>
                    <td>{sub.title}</td>
                    <td>
                      {formatPrice(
                        sub.priceFrom ?? null,
                        sub.priceTo ?? null,
                        sub.priceUnit ?? null,
                      )}
                    </td>
                    <td>
                      <Link href={`/${service.slug}/${sub.slug}/`}>Подробнее →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <p className="pricing-pillar-page__empty">
            Подуслуги ещё не опубликованы. Свяжитесь с нами для расчёта.
          </p>
        )}

        {richTextFaq.length > 0 && (
          <section className="pricing-pillar-page__faq">
            <h2>Частые вопросы о ценообразовании</h2>
            <dl>
              {richTextFaq.map((qa, i) => (
                <div key={i}>
                  <dt>{qa.question}</dt>
                  <dd>{qa.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="pricing-pillar-page__cta">
          <h2>Получить точный расчёт</h2>
          <p>
            Отправьте 2-3 фото объекта — оператор пришлёт точную смету за 10 минут с фиксированной
            ценой и сроком работ.
          </p>
          <p>
            <Link
              href={`/foto-smeta/?utm_source=tseny&utm_medium=${service.slug}&utm_campaign=pricing-deep`}
              className="pricing-pillar-page__primary"
            >
              Расчёт по фото →
            </Link>
            {' · '}
            <Link href={`/${service.slug}/?utm_source=tseny&utm_medium=${service.slug}`}>
              Перейти к услуге
            </Link>
          </p>
        </section>
      </main>
    </>
  )
}
