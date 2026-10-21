import Link from 'next/link'
import type { Metadata } from 'next'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { retone } from '@/lib/blocks/v3/retone'
import { getPage, getPillarSummaryBlock } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { aggregateOfferSchema, breadcrumbListSchema } from '@/lib/seo/jsonld'
import { metadataBase } from '@/lib/seo/metadata'
import { getAllPillarsForPricing, type PricingPillar } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

const META_TITLE = 'Цены на услуги Обихода в Москве и МО — единый прайс 2026'
const META_DESCRIPTION =
  'Прозрачные цены на 5 групп услуг: вывоз мусора, арбористика, демонтаж, чистка крыш, уборка территории. Диапазоны «от-до» по каждой подуслуге. Москва + МО, расчёт по фото за 10 минут.'

const LEGACY_METADATA: Metadata = {
  metadataBase,
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: {
    canonical: '/uslugi/tseny/',
    languages: { 'ru-RU': '/uslugi/tseny/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/uslugi/tseny/',
    siteName: 'Обиход',
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('uslugi/tseny')
  return page ? buildBlocksPageMetadata(page, '/uslugi/tseny/') : LEGACY_METADATA
}

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

function PillarPricingCard({ pillar }: { pillar: PricingPillar }) {
  const topSubs = pillar.subServices.slice(0, 3)
  return (
    <article className="pricing-card" data-pillar={pillar.slug}>
      <header className="pricing-card__header">
        <h2 className="pricing-card__title">
          <Link href={`/uslugi/tseny/${pillar.slug}/`}>{pillar.title}</Link>
        </h2>
        <p className="pricing-card__range">
          {formatPrice(pillar.priceFrom ?? null, pillar.priceTo ?? null, pillar.priceUnit ?? null)}
        </p>
      </header>
      {pillar.intro && <p className="pricing-card__intro">{pillar.intro.slice(0, 240)}</p>}
      {topSubs.length > 0 && (
        <ul className="pricing-card__subs">
          {topSubs.map((sub) => (
            <li key={sub.slug}>
              <Link href={`/${pillar.slug}/${sub.slug}/`}>{sub.title}</Link>
              <span className="pricing-card__sub-price">
                {formatPrice(sub.priceFrom ?? null, sub.priceTo ?? null, sub.priceUnit ?? null)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link className="pricing-card__more" href={`/uslugi/tseny/${pillar.slug}/`}>
        Подробный прайс →
      </Link>
    </article>
  )
}

/** Порядок разделов в сводном прайсе: направления по карте 08, калькуляторы — без своего прайса. */
const PRICE_ORDER = [
  'arboristika',
  'vyvoz-musora',
  'chistka-krysh',
  'demontazh',
  'uborka-territorii',
  'dizain-landshafta',
  'arenda-tehniki',
  'promyshlennyj-alpinizm',
  'porubochnyj-bilet',
]

export default async function MegaPricingPage() {
  const pillars = await getAllPillarsForPricing()

  // 0. Прайс из блоков: рамка — документ «Страницы», под первым экраном — сводный прайс каждого хаба
  const blocksPage = await getPage('uslugi/tseny')
  if (blocksPage) {
    const bySlug = new Map(pillars.map((p) => [p.slug, p.title]))
    const summaries = (
      await Promise.all(
        PRICE_ORDER.filter((slug) => bySlug.has(slug)).map((slug) =>
          getPillarSummaryBlock(slug, bySlug.get(slug) ?? slug),
        ),
      )
    ).filter((b) => b !== null)
    const [hero, ...rest] = blocksPage.blocks
    return (
      <PageBlocksView
        page={{ ...blocksPage, blocks: retone([hero, ...summaries, ...rest]) }}
        crumbs={trail('tseny')}
      />
    )
  }

  const breadcrumbs = trail('tseny')

  // Combined AggregateOffer (все pillars + sub-services).
  const allOffers = pillars.flatMap((p) => [
    {
      name: p.title,
      priceFrom: p.priceFrom ?? 0,
      priceTo: p.priceTo ?? p.priceFrom ?? 0,
      unit: p.priceUnit ?? undefined,
      url: `${SITE_URL}/uslugi/tseny/${p.slug}/`,
    },
    ...p.subServices
      .filter((s) => s.priceFrom)
      .map((s) => ({
        name: `${p.title} — ${s.title}`,
        priceFrom: s.priceFrom!,
        priceTo: s.priceTo ?? s.priceFrom!,
        unit: s.priceUnit ?? undefined,
        url: `${SITE_URL}/${p.slug}/${s.slug}/`,
      })),
  ])

  const aggregateOffer = allOffers.length > 0 ? aggregateOfferSchema({ offers: allOffers }) : null

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          ...(aggregateOffer ? [aggregateOffer] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <main className="pricing-page container">
        <header className="pricing-page__hero">
          <h1>Цены на услуги Обихода в Москве и МО</h1>
          <p className="pricing-page__lead">
            Единый прайс на 5 групп услуг: вывоз мусора, арбористика, демонтаж, чистка крыш, уборка
            территории. Цены приведены диапазонами «от-до» — точная стоимость зависит от объёма,
            класса отходов, плеча выезда. Расчёт по 2-3 фото за 10 минут.
          </p>
        </header>

        {pillars.length > 0 ? (
          <section className="pricing-grid">
            {pillars.map((pillar) => (
              <PillarPricingCard key={pillar.slug} pillar={pillar} />
            ))}
          </section>
        ) : (
          <p className="pricing-page__empty">
            Идёт обновление прайс-листа. Свяжитесь с нами для актуального расчёта.
          </p>
        )}

        <section className="pricing-page__cta">
          <h2>Получить точный расчёт</h2>
          <p>
            Отправьте 2-3 фото объекта в Telegram, MAX, WhatsApp или заполните форму ниже — оператор
            пришлёт точную смету за 10 минут с фиксированной ценой.
          </p>
          <p>
            <Link
              href="/foto-smeta/?utm_source=tseny&utm_medium=root&utm_campaign=pricing-hub"
              className="pricing-page__primary"
            >
              Расчёт по фото →
            </Link>
            {' · '}
            <Link href="/kontakty/?utm_source=tseny&utm_medium=root">Контакты и мессенджеры</Link>
          </p>
        </section>
      </main>
    </>
  )
}
