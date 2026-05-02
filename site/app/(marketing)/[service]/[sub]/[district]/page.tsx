import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { getSiteChrome } from '@/lib/chrome'
import {
  breadcrumbListSchema,
  faqPageSchema,
  localBusinessSchema,
  serviceSchema,
} from '@/lib/seo/jsonld'
import {
  getAllSubLevelSdParams,
  getDistrictBySlug,
  getSeoSettings,
  getServiceBySlug,
  getServiceSubDistrict,
  getSubServiceBySlug,
} from '@/lib/seo/queries'
import { canonicalFor } from '@/lib/seo/canonical'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 43200
export const dynamicParams = true

/**
 * US-3 Wave 0.1 — sub-level service-district route.
 *
 * URL: `/<service>/<sub>/<district>/` — sub-service внутри района.
 * Пример: `/vyvoz-musora/kontejner/odintsovo/` — «контейнер 8 м³ в Одинцово».
 *
 * Backed by: ServiceDistricts SD doc с triple (service, district, subServiceSlug).
 * Sub-service сам по себе живёт inline в Services.subServices array — это
 * pillar-уровень контента (методология). SD добавляет district-specific
 * контент: цены/время выезда/landmarks/localFaq/miniCase из района.
 *
 * Архитектурное замечание: collection `sub-services` не существует.
 * subService идентифицируется text-полем subServiceSlug в SD, которое matches
 * services.subServices[].slug parent-pillar.
 */
export async function generateStaticParams() {
  return getAllSubLevelSdParams()
}

type Params = { service: string; sub: string; district: string }

function unicodeSliceMeta(source: string, max: number): string {
  // sustained Wave 0.4 codepoint-aware truncation — `Array.from` сохраняет
  // суррогатные пары + кириллические комбинации без разрыва UTF-8.
  return Array.from(source).slice(0, max).join('')
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service: serviceSlug, sub: subSlug, district: districtSlug } = await params

  const [service, district, sd, subResult] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getDistrictBySlug(districtSlug),
    getServiceSubDistrict(serviceSlug, subSlug, districtSlug),
    getSubServiceBySlug(serviceSlug, subSlug),
  ])
  if (!service || !district || !subResult) return {}

  const { sub } = subResult as unknown as { sub: { title: string; h1: string } }
  const subTitle = sub?.title ?? subSlug
  const subH1 = sub?.h1 ?? subTitle

  const districtNamePrep =
    (district as unknown as { namePrepositional?: string }).namePrepositional ?? districtSlug
  const baseTitle = `${subH1} ${districtNamePrep} — Обиход`
  const baseDescription =
    (sd as unknown as { seoDescription?: string } | null)?.seoDescription ??
    `${subTitle} ${districtNamePrep}. Фикс-цена за объект, смета за 10 минут по фото в Telegram, MAX или WhatsApp.`

  const description = unicodeSliceMeta(baseDescription, 160)
  const indexable =
    (sd as unknown as { publishStatus?: string } | null)?.publishStatus === 'published' &&
    !(sd as unknown as { noindexUntilCase?: boolean } | null)?.noindexUntilCase

  return {
    title: { absolute: unicodeSliceMeta(baseTitle, 65) },
    description,
    alternates: { canonical: canonicalFor(`/${serviceSlug}/${subSlug}/${districtSlug}/`) },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `/${serviceSlug}/${subSlug}/${districtSlug}/`,
      title: baseTitle,
      description,
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  }
}

export default async function SubLevelSDPage({ params }: { params: Promise<Params> }) {
  const { service: serviceSlug, sub: subSlug, district: districtSlug } = await params

  const [service, district, sd, subResult, chrome, seo] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getDistrictBySlug(districtSlug),
    getServiceSubDistrict(serviceSlug, subSlug, districtSlug),
    getSubServiceBySlug(serviceSlug, subSlug),
    getSiteChrome(),
    getSeoSettings(),
  ])

  if (!service || !district || !subResult) notFound()

  // Casting через `as any` — sustained pattern pillar-level page.tsx; Payload
  // generated types не всегда матчат точное поле shape в RSC scope.
  const svc = service as any
  const dst = district as any

  const { sub } = subResult as unknown as {
    sub: {
      slug: string
      title: string
      h1: string
      priceFrom?: number | null
      intro?: string | null
      body?: unknown
    }
  }

  const subTitle = sub.title
  const subH1 = sub.h1 ?? subTitle

  const districtPrep: string = dst.namePrepositional ?? districtSlug
  const districtNom: string = dst.nameNominative ?? districtSlug
  const localPriceAdj: number = dst.localPriceAdjustment ?? 0
  const basePriceFrom: number = sub.priceFrom ?? svc.priceFrom
  const basePriceTo: number = svc.priceTo
  const adjustedPriceFrom = Math.round(basePriceFrom * (1 + localPriceAdj / 100))
  const adjustedPriceTo = Math.round(basePriceTo * (1 + localPriceAdj / 100))

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: svc.title, href: `/${svc.slug}/` },
    { name: subTitle, href: `/${svc.slug}/${sub.slug}/` },
    { name: districtNom, href: `/${svc.slug}/${sub.slug}/${dst.slug}/` },
  ]

  const localFaq = (
    (sd as unknown as { localFaq?: Array<{ question: string; answer: unknown }> } | null)
      ?.localFaq ?? []
  ).map((q) => ({ question: q.question, answer: extractText(q.answer) }))

  const isReviewOrDraft =
    !sd || (sd as unknown as { publishStatus?: string }).publishStatus !== 'published'

  return (
    <article>
      <section className="mx-auto max-w-5xl px-6 pt-8">
        <Breadcrumbs items={breadcrumbs} />
        {isReviewOrDraft && (
          <div className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            ⚠ Страница в статусе{' '}
            <code>
              {(sd as unknown as { publishStatus?: string } | null)?.publishStatus ?? 'не создана'}
            </code>
            . Для индексации нужны mini-case + минимум 2 локальных FAQ.
          </div>
        )}
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          {subH1} {districtPrep}
        </h1>
        {(sd as unknown as { leadParagraph?: unknown } | null)?.leadParagraph ? (
          <RichTextRenderer
            data={(sd as unknown as { leadParagraph: unknown }).leadParagraph}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700"
          />
        ) : sub.intro ? (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700">{sub.intro}</p>
        ) : (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700">
            {subH1} {districtPrep} — фикс-цена за объект, смета по фото за 10 минут в Telegram, MAX
            или WhatsApp.
          </p>
        )}
        <CtaMessengers className="mt-8 max-w-2xl" />
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-6">
        <h2 className="text-2xl font-semibold text-stone-900">Цены {districtPrep}</h2>
        <p className="mt-2 text-stone-700">
          От {adjustedPriceFrom.toLocaleString('ru-RU')} ₽ до{' '}
          {adjustedPriceTo.toLocaleString('ru-RU')} ₽ за объект.
        </p>
        {(sd as unknown as { localPriceNote?: string } | null)?.localPriceNote && (
          <p className="mt-2 rounded bg-stone-50 p-3 text-sm text-stone-700">
            {(sd as unknown as { localPriceNote: string }).localPriceNote}
          </p>
        )}
      </section>

      {sub.body ? (
        <section className="mx-auto mt-12 max-w-3xl px-6">
          <RichTextRenderer
            data={sub.body}
            className="prose-content leading-relaxed text-stone-700"
          />
        </section>
      ) : null}

      {(sd as unknown as { localLandmarks?: Array<{ landmarkName: string }> } | null)
        ?.localLandmarks &&
      ((sd as unknown as { localLandmarks: Array<{ landmarkName: string }> }).localLandmarks
        .length ?? 0) > 0 ? (
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">
            Где именно работаем {districtPrep}
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              sd as unknown as { localLandmarks: Array<{ landmarkName: string }> }
            ).localLandmarks.map((l, i) => (
              <li key={i} className="text-stone-700">
                · {l.landmarkName}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(sd as unknown as { miniCase?: unknown } | null)?.miniCase ? (
        <MiniCaseSection
          miniCase={(sd as unknown as { miniCase: unknown }).miniCase}
          districtPrep={districtPrep}
        />
      ) : (
        <section className="mx-auto mt-12 max-w-5xl px-6 text-sm text-stone-500">
          Кейс из района будет добавлен после первого выезда.
        </section>
      )}

      <section className="mx-auto mt-12 max-w-5xl px-6">
        <LicenseBadge />
      </section>

      {localFaq.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">Частые вопросы {districtPrep}</h2>
          <div className="mt-4 space-y-4">
            {(
              (sd as unknown as { localFaq: Array<{ question: string; answer: unknown }> })
                .localFaq ?? []
            ).map((qa, i) => (
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

      <section className="mx-auto mt-12 mb-16 max-w-5xl px-6">
        <h2 className="text-2xl font-semibold text-stone-900">Ещё {districtPrep}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/${svc.slug}/${sub.slug}/`}
            className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-300"
          >
            <div className="text-sm text-orange-700">Pillar-уровень sub-услуги</div>
            <div className="mt-1 font-medium text-stone-900">{subTitle} — методология и цены</div>
          </Link>
          <Link
            href={`/raiony/${dst.slug}/`}
            className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-300"
          >
            <div className="text-sm text-orange-700">Все услуги</div>
            <div className="mt-1 font-medium text-stone-900">Хаб района {districtNom}</div>
          </Link>
        </div>
      </section>

      <JsonLd
        schema={[
          {
            ...serviceSchema(svc, dst),
            name: `${subH1} ${districtPrep}`,
          },
          localBusinessSchema(chrome, seo, dst),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          ...(localFaq.length > 0 ? [faqPageSchema(localFaq)] : []),
        ]}
      />
    </article>
  )
}

function MiniCaseSection({ miniCase, districtPrep }: { miniCase: unknown; districtPrep: string }) {
  const mc = miniCase as {
    slug?: string
    title?: string
    photosBefore?: Array<{ image?: { url?: string; alt?: string }; caption?: string }>
    photosAfter?: Array<{ image?: { url?: string; alt?: string }; caption?: string }>
    dateCompleted?: string
    durationHours?: number
    finalPrice?: number
  }
  const before = mc.photosBefore?.[0]
  const after = mc.photosAfter?.[0]
  const photoUrl = (m: unknown) =>
    typeof m === 'object' && m && (m as unknown as { url?: string }).url
      ? (m as unknown as { url: string }).url
      : null

  return (
    <section className="mx-auto mt-12 max-w-5xl px-6">
      <h2 className="text-2xl font-semibold text-stone-900">Кейс {districtPrep}</h2>
      <Link
        href={`/kejsy/${mc.slug}/`}
        className="mt-1 inline-block text-sm text-orange-700 hover:underline"
      >
        {mc.title} →
      </Link>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {before && photoUrl(before.image) && (
          <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="relative aspect-[3/2]">
              <Image
                src={photoUrl(before.image)!}
                alt={before.image?.alt ?? 'До'}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs text-stone-600">
              До: {before.caption ?? ''}
            </figcaption>
          </figure>
        )}
        {after && photoUrl(after.image) && (
          <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="relative aspect-[3/2]">
              <Image
                src={photoUrl(after.image)!}
                alt={after.image?.alt ?? 'После'}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs text-stone-600">
              После: {after.caption ?? ''}
            </figcaption>
          </figure>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
        {mc.dateCompleted && (
          <span>
            🗓{' '}
            {new Date(mc.dateCompleted).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
            })}
          </span>
        )}
        {mc.durationHours && <span>⏱ {mc.durationHours} ч</span>}
        {mc.finalPrice && (
          <span className="font-medium text-stone-800">
            💰 {mc.finalPrice.toLocaleString('ru-RU')} ₽ за объект
          </span>
        )}
      </div>
    </section>
  )
}

function extractText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  const obj = node as unknown as { text?: string; children?: unknown; root?: unknown }
  if (obj.text) return obj.text
  if (obj.children) return extractText(obj.children)
  if (obj.root) return extractText(obj.root)
  return ''
}
