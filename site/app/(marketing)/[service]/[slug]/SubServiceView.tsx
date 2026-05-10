import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { type Service } from '@/lib/seo/jsonld'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import { getSiteChrome } from '@/lib/chrome'
import { getBlocksForLayer } from '@/lib/master-template/getBlocksForLayer'
import { buildResolverOptions } from '@/lib/feature-flags/template-v2'
import type { DocumentBlock } from '@/blocks/master-template'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export type SubServiceDoc = {
  slug: string
  title: string
  h1: string
  priceFrom?: number | null
  intro?: string | null
  body?: unknown
  metaTitle?: string | null
  metaDescription?: string | null
  /**
   * EPIC-SERVICE-PAGES-UX C4.T3T4 — per-sub blocks[] override (optional).
   *
   * Sustained schema (Services.subServices[]) пока не содержит blocks[] поле —
   * T3 рендерится через master-template только когда parent Service flag
   * `useTemplateV2 === true` И sub имеет blocks[] (либо empty → all placeholders).
   * Когда schema расширится (C2.5/C3 follow-up) — поле будет читаться отсюда.
   */
  blocks?: unknown[] | null
  useTemplateV2?: boolean | null
}

type Props = {
  service: Service & {
    slug: string
    title: string
    h1: string
    metaDescription: string
    priceFrom: number
    priceTo: number
    priceUnit: string
    useTemplateV2?: boolean | null
  }
  sub: SubServiceDoc
}

/**
 * Sub-service view для /<service>/<sub>/.
 *
 * Используется в `app/(marketing)/[service]/[district]/page.tsx` через early
 * return когда second-segment slug matches sub-service в Service.subServices.
 *
 * Schema.org Service для конкретной sub — использует существующий
 * `serviceSchema()` без district (areaServed остаётся МО по умолчанию).
 */
export async function SubServiceView({ service, sub }: Props) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/uslugi/' },
    { name: service.title, href: `/${service.slug}/` },
    { name: sub.title, href: `/${service.slug}/${sub.slug}/` },
  ]

  const priceFrom = sub.priceFrom ?? service.priceFrom

  const chrome = await getSiteChrome()

  // EPIC-SERVICE-PAGES-UX C4.T3T4 — master-template integration для T3_SUB.
  //
  // Flag-источник: per-sub `useTemplateV2` если будет добавлен в schema,
  // иначе fallback на parent Service.useTemplateV2 (sustained приоритет).
  // Default false → sustained legacy custom JSX rendering.
  //
  // Когда flag=true: resolver `getBlocksForLayer('T3_SUB', ...)` reorder +
  // filter hidden + fill placeholders для T3_SUB required sections.
  const subFlagDoc = {
    useTemplateV2: sub.useTemplateV2 ?? service.useTemplateV2 ?? false,
  }
  const subBlocks = (Array.isArray(sub.blocks) ? sub.blocks : []) as DocumentBlock[]
  const useV2 = buildResolverOptions(subFlagDoc).templateV2

  // T3 schema через composer (4 узла на странице, +Org/WS/LB на layout).
  const subAsService: Service = {
    slug: sub.slug,
    title: sub.title,
    h1: sub.h1,
    priceFrom,
    priceTo: priceFrom,
    priceUnit: service.priceUnit,
  }
  const t3Schema = buildJsonLdForTemplate('T3_SUB', {
    chrome,
    skipChrome: true,
    service,
    sub: subAsService,
    breadcrumbs: breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
  })

  // C4.T3T4 — early return на master-template branch (только при useV2=true).
  // Legacy путь сохранён ниже — additive integration без regression.
  if (useV2) {
    const resolverOpts = buildResolverOptions(subFlagDoc)
    const resolvedBlocks = getBlocksForLayer('T3_SUB', subBlocks, resolverOpts)
    return (
      <>
        <BlockRenderer blocks={resolvedBlocks as never} />
        <JsonLd schema={t3Schema} />
      </>
    )
  }

  return (
    <>
      <section className="bg-bg-alt py-10 sm:py-14">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-ink mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sub.h1}
          </h1>
          {sub.intro ? (
            <p className="text-ink-soft mt-4 max-w-3xl text-lg leading-relaxed">{sub.intro}</p>
          ) : (
            <p className="text-muted mt-4 max-w-3xl text-lg leading-relaxed">
              Sub-услуга {sub.title.toLowerCase()} — pillar {service.title.toLowerCase()}. Контент в
              работе.
            </p>
          )}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-[var(--pad)] py-12">
        {sub.body ? (
          <div className="prose-content">
            <RichTextRenderer data={sub.body} className="text-ink-soft leading-relaxed" />
          </div>
        ) : (
          <p className="text-muted italic">Подробное описание будет добавлено в Wave 2B2.</p>
        )}

        {priceFrom > 0 && (
          <aside className="border-line bg-card mt-8 rounded-[var(--radius)] border p-5">
            <p className="text-muted text-sm">Стартовая цена</p>
            <p className="text-ink mt-1 text-2xl font-semibold">
              от {priceFrom.toLocaleString('ru-RU')} ₽ за объект
            </p>
            <p className="text-muted mt-2 text-sm">
              Точная цена — после фото в Telegram, MAX или WhatsApp за 10 минут.
            </p>
          </aside>
        )}

        <div className="mt-10">
          <CtaMessengers />
        </div>

        <div className="mt-10">
          <LicenseBadge />
        </div>

        <nav className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/${service.slug}/`}
            className="border-line hover:border-primary/40 rounded-full border px-4 py-2"
          >
            ← {service.title}
          </Link>
        </nav>
      </article>

      <JsonLd schema={t3Schema} />
    </>
  )
}
