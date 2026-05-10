import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { buildPillarMetadata } from '@/lib/seo/metadata'
import { breadcrumbListSchema, faqPageSchema, serviceSchema } from '@/lib/seo/jsonld'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import { getAllServiceSlugs, getServiceBySlug, getAllDistrictsForCityList } from '@/lib/seo/queries'
import { getSiteChrome } from '@/lib/chrome'
import { getBlocksForLayer } from '@/lib/master-template/getBlocksForLayer'
import { buildResolverOptions } from '@/lib/feature-flags/template-v2'
import { readAbVariantOverride, AB_PILOT_SLUG } from '@/lib/feature-flags/ab-pilot'
import type { DocumentBlock } from '@/blocks/master-template'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
// dynamicParams = true: разрешаем рендер любых service-slug на runtime.
// Если в БД появилась новая услуга после build — она доступна через ISR.
// Если slug несуществующий — getServiceBySlug вернёт null → notFound().
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map((service) => ({ service }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service } = await params
  const s = await getServiceBySlug(service)
  if (!s) return {}
  return buildPillarMetadata(s as never, s.metaTitle, s.metaDescription)
}

export default async function PillarPage({ params }: { params: Promise<{ service: string }> }) {
  const { service: serviceSlug } = await params
  const service = await getServiceBySlug(serviceSlug)
  if (!service) notFound()

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/uslugi/' },
    { name: service.title, href: `/${service.slug}/` },
  ]

  const richTextFaq = (service.faqGlobal ?? []).map((q: unknown) => {
    const qa = q as { question: string; answer: unknown }
    return { question: qa.question, answer: extractText(qa.answer) }
  })

  // US-0 W3 Track B-3 — приоритет blocks[] из Payload (из cw fixture).
  // Если есть blocks[] — рендерим через BlockRenderer + JSON-LD остаётся.
  const docBlocks = (service as { blocks?: unknown[] | null }).blocks
  const hasBlocks = Array.isArray(docBlocks) && docBlocks.length > 0

  const [chrome, allDistricts] = await Promise.all([getSiteChrome(), getAllDistrictsForCityList()])

  // Composer — sustained AC #6 schema-coverage T2_PILLAR (5 узлов).
  // Org/WebSite/LocalBusiness уже на layout — composer добавляет
  // Service+Rating + FAQ + Breadcrumb (skipChrome).
  const t2Schema = buildJsonLdForTemplate('T2_PILLAR', {
    chrome,
    skipChrome: true,
    service: service as never,
    faqs: richTextFaq,
    breadcrumbs: breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
    rating: { value: 4.9, count: 247 },
  })

  if (hasBlocks) {
    // EPIC-SERVICE-PAGES-UX C4 — resolver gate.
    // - useTemplateV2=false (default sustained): identity, render as-is.
    // - useTemplateV2=true:                       reorder + filter + fill placeholders.
    //
    // EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot cookie override.
    // На pilot pillar (`vyvoz-musora`) если cookie obikhod_ab_var === 'v2' →
    // force templateV2=true локально (без write в Payload doc). Не задеваем
    // sustained pages — для других slugs override === false (no-op).
    const resolverOpts = buildResolverOptions(service as never)
    const abOverride = await readAbVariantOverride(serviceSlug)
    if (abOverride) {
      resolverOpts.templateV2 = true
    }
    const resolvedBlocks = getBlocksForLayer(
      'T2_PILLAR',
      docBlocks as DocumentBlock[],
      resolverOpts,
    )
    return (
      <>
        <BlockRenderer blocks={resolvedBlocks as never} />
        <JsonLd
          schema={[
            serviceSchema(service as never),
            breadcrumbListSchema(
              breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
            ),
            ...(richTextFaq.length > 0 ? [faqPageSchema(richTextFaq)] : []),
          ]}
        />
      </>
    )
  }

  // Top-30 cities (priority A first → B → C, sorted by distanceFromMkad).
  const cities = allDistricts.slice(0, 30)

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/uslugi-t2.css" />
      <JsonLd schema={t2Schema} />

      <article>
        <section className="mx-auto max-w-5xl px-6 pt-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            {service.h1}
          </h1>
          <RichTextRenderer
            data={service.intro}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700"
          />
          <CtaMessengers className="mt-8 max-w-2xl" />
        </section>

        {/* §02 · Sub-services grid */}
        {service.subServices && service.subServices.length > 0 && (
          <section className="mx-auto mt-12 max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-stone-900">Что входит в раздел</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.subServices.map(
                (sub: { slug: string; title: string; priceFrom?: number }) => (
                  <Link
                    key={sub.slug}
                    href={`/${service.slug}/${sub.slug}/`}
                    className="block rounded-lg border border-stone-200 bg-white p-4 transition hover:border-orange-300"
                  >
                    <div className="font-medium text-stone-900">{sub.title}</div>
                    {sub.priceFrom ? (
                      <div className="mt-1 text-sm text-stone-600">
                        от {sub.priceFrom.toLocaleString('ru-RU')} ₽
                      </div>
                    ) : null}
                  </Link>
                ),
              )}
            </div>
          </section>
        )}

        {/* §03 · Pricing */}
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">Цены</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-100 text-left text-stone-700">
                <tr>
                  <th className="px-4 py-3">Услуга</th>
                  <th className="px-4 py-3">Цена от</th>
                </tr>
              </thead>
              <tbody>
                {(service.subServices ?? []).map(
                  (sub: { slug: string; title: string; priceFrom?: number }) => (
                    <tr key={sub.slug} className="border-t border-stone-200">
                      <td className="px-4 py-3 text-stone-900">{sub.title}</td>
                      <td className="px-4 py-3 text-stone-700">
                        {sub.priceFrom?.toLocaleString('ru-RU')} ₽
                      </td>
                    </tr>
                  ),
                )}
                {(!service.subServices || service.subServices.length === 0) && (
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-3 text-stone-700" colSpan={2}>
                      От {service.priceFrom.toLocaleString('ru-RU')} ₽ до{' '}
                      {service.priceTo.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-5xl px-6">
          <LicenseBadge />
        </section>

        {service.faqGlobal && service.faqGlobal.length > 0 && (
          <section className="mx-auto mt-12 max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-stone-900">Частые вопросы</h2>
            <div className="mt-4 space-y-4">
              {service.faqGlobal.map((qa: { question: string; answer: unknown }, i: number) => (
                <details key={i} className="rounded-lg border border-stone-200 bg-white p-4">
                  <summary className="cursor-pointer font-medium text-stone-900">
                    {qa.question}
                  </summary>
                  <RichTextRenderer
                    data={qa.answer}
                    className="mt-3 text-sm leading-relaxed text-stone-700"
                  />
                </details>
              ))}
            </div>
          </section>
        )}

        {/* §13 · 30 cities (T2 — newui/uslugi-pillar.html). */}
        {cities.length > 0 && (
          <section className="mx-auto mt-12 max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-stone-900">
              {service.title} в {cities.length} городах Подмосковья
            </h2>
            <p className="mt-2 max-w-3xl text-stone-700">
              В каждом городе — своя бригада, прайс с учётом расстояния, документы для местных УК и
              ТСЖ. Выберите свой город.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${service.slug}/${c.slug}/`}
                  className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-4 py-3 text-sm transition hover:border-orange-300"
                >
                  <span className="text-stone-900">
                    {service.title} в {c.namePrepositional}
                  </span>
                  <span aria-hidden="true" className="text-stone-400">
                    →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/raiony/"
                className="text-sm font-medium text-orange-700 hover:text-orange-800"
              >
                Все районы →
              </Link>
            </div>
          </section>
        )}

        <section className="mx-auto mt-12 mb-16 max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">Получить смету</h2>
          <p className="mt-2 max-w-3xl text-stone-700">
            Сфотографируйте объект — диспетчер пришлёт ориентир в Telegram, MAX или WhatsApp за 10
            минут. Цена фиксируется на 14 дней.
          </p>
          <div className="mt-4">
            <Link
              href="/kalkulyator/foto-smeta/"
              className="inline-flex items-center rounded-md bg-orange-700 px-5 py-3 text-sm font-medium text-white hover:bg-orange-800"
            >
              Загрузить фото →
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}

/** Минимальный извлекатель текста из Lexical для FAQ schema. */
function extractText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  const n = node as { text?: string; children?: unknown; root?: unknown }
  if (n.text) return n.text
  if (n.children) return extractText(n.children)
  if (n.root) return extractText(n.root)
  return ''
}
