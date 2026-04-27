import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getPublishedB2BPages } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Обиход для бизнеса — УК, ТСЖ, FM, застройщики, госзаказ',
  description:
    'Сезонные и годовые контракты с УК и ТСЖ, FM-операторами, застройщиками. Штрафы Госжилинспекции и ОАТИ — на нас по договору. Москва и МО.',
  alternates: { canonical: canonicalFor('/b2b/') },
}

const AUDIENCE_LABELS: Record<string, string> = {
  uk: 'Управляющие компании',
  tszh: 'ТСЖ',
  fm: 'Facility Management',
  zastroyshchik: 'Застройщики',
  gostorgi: 'Госзакупки 44/223-ФЗ',
}

type B2BPage = {
  id: number
  slug: string
  title: string
  h1: string
  metaDescription?: string | null
  audience: keyof typeof AUDIENCE_LABELS
  krishaShtraf?: boolean
}

const TRUST_PILLARS = [
  {
    title: 'Фикс-цена за объект',
    description:
      'Цена утверждается на этапе сметы и не меняется на месте. Без «нашли непредвиденные сложности».',
  },
  {
    title: 'Штрафы ГЖИ и ОАТИ — на нас',
    description:
      'С момента подписания договора любые предписания инспекций по предмету договора оплачивает Обиход.',
  },
  {
    title: 'Страховка ГО до 10 млн ₽',
    description:
      'Каждая бригада застрахована. Если повредим фасад, машину или теплицу — оплачиваем восстановление.',
  },
  {
    title: 'Акт об утилизации',
    description:
      'Акт по форме УК-1 с реквизитами лицензированного полигона ТКО или КГМ для отчётов УК и налоговой.',
  },
]

export default async function B2BIndex() {
  const pages = (await getPublishedB2BPages()) as unknown as B2BPage[]

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'B2B', href: '/b2b/' },
  ]

  // overview-карточка `b2b-overview` идёт в hero, остальные показываем как audience-cards
  const overview = pages.find((p) => p.slug === 'b2b-overview')
  const sections = pages.filter((p) => p.slug !== 'b2b-overview')

  return (
    <>
      <section className="bg-primary py-12 sm:py-16">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} variant="onPrimary" />
          <h1 className="text-on-primary mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {overview?.h1 ?? 'Обиход для бизнеса — УК, ТСЖ, FM, застройщики, госзаказ'}
          </h1>
          <p className="text-on-primary/85 mt-3 max-w-2xl text-lg">
            {overview?.metaDescription ??
              'Сезонные и годовые контракты с переносом штрафов Госжилинспекции и ОАТИ на исполнителя.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] py-12">
        <h2 className="sr-only">Что в договоре</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((p) => (
            <li key={p.title} className="border-line bg-card rounded-[var(--radius)] border p-5">
              <h3 className="text-ink text-base font-semibold">{p.title}</h3>
              <p className="text-muted mt-2 text-sm">{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {sections.length > 0 && (
        <section className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] pb-12">
          <h2 className="text-ink text-2xl font-semibold">Сегменты и материалы</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {sections.map((page) => (
              <li
                key={page.id}
                className="border-line bg-card hover:border-primary/40 rounded-[var(--radius)] border transition"
              >
                <Link
                  href={`/b2b/${page.slug}/`}
                  className="focus-visible:outline-accent block p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="bg-bg-alt text-ink-soft inline-block rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium">
                    {AUDIENCE_LABELS[page.audience] ?? page.audience}
                  </span>
                  <h3 className="text-ink mt-3 text-xl leading-snug font-semibold">{page.title}</h3>
                  {page.metaDescription && (
                    <p className="text-muted mt-2 line-clamp-3 text-sm">{page.metaDescription}</p>
                  )}
                  {page.krishaShtraf && (
                    <p className="text-success mt-3 text-xs font-medium">
                      ✓ Штрафы ГЖИ/ОАТИ — на Обиходе
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] pb-16">
        <CtaMessengers />
      </section>

      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </>
  )
}
