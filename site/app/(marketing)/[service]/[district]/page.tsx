import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { buildProgrammaticMetadata } from '@/lib/seo/metadata'
import {
  breadcrumbListSchema,
  faqPageSchema,
  localBusinessSchema,
  serviceSchema,
} from '@/lib/seo/jsonld'
import {
  getDistrictBySlug,
  getPublishedServiceDistricts,
  getServiceBySlug,
  getServiceDistrict,
} from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 43200
export const dynamicParams = true

export async function generateStaticParams() {
  const sds = await getPublishedServiceDistricts()
  return sds.map((sd: any) => ({
    service: sd.service?.slug ?? '',
    district: sd.district?.slug ?? '',
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; district: string }>
}): Promise<Metadata> {
  const { service: serviceSlug, district: districtSlug } = await params
  const [service, district, sd] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getDistrictBySlug(districtSlug),
    getServiceDistrict(serviceSlug, districtSlug),
  ])
  if (!service || !district) return {}
  return buildProgrammaticMetadata({
    service: service as any,
    district: district as any,
    localPriceAdjustment: (district as any).localPriceAdjustment ?? 0,
    localPriceNote: sd?.localPriceNote ?? undefined,
    hasMiniCase: Boolean(sd?.miniCase),
    publishStatus: sd?.publishStatus ?? 'draft',
    noindexUntilCase: sd?.noindexUntilCase ?? true,
  })
}

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ service: string; district: string }>
}) {
  const { service: serviceSlug, district: districtSlug } = await params
  const [service, district, sd] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getDistrictBySlug(districtSlug),
    getServiceDistrict(serviceSlug, districtSlug),
  ])
  if (!service || !district) notFound()

  const adjustedPriceFrom = Math.round(
    service.priceFrom * (1 + ((district as any).localPriceAdjustment ?? 0) / 100),
  )
  const adjustedPriceTo = Math.round(
    service.priceTo * (1 + ((district as any).localPriceAdjustment ?? 0) / 100),
  )

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: service.title, href: `/${service.slug}/` },
    { name: district.nameNominative, href: `/${service.slug}/${district.slug}/` },
  ]

  const localFaq = ((sd as any)?.localFaq ?? []).map((q: any) => ({
    question: q.question,
    answer: extractText(q.answer),
  }))

  const isReviewOrDraft = !sd || sd.publishStatus !== 'published'

  return (
    <article>
      <section className="mx-auto max-w-5xl px-6 pt-8">
        <Breadcrumbs items={breadcrumbs} />
        {isReviewOrDraft && (
          <div className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            ⚠ Страница в статусе{' '}
            <code>{sd?.publishStatus ?? 'не создана'}</code>. Для индексации
            нужны mini-case + минимум 2 локальных FAQ.
          </div>
        )}
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          {service.h1} {district.namePrepositional}
        </h1>
        {sd?.leadParagraph ? (
          <RichTextRenderer
            data={sd.leadParagraph}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700"
          />
        ) : (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700">
            {service.h1} {district.namePrepositional} — фикс-цена за объект,
            смета по фото за 10 минут в Telegram, MAX или WhatsApp.
          </p>
        )}
        <CtaMessengers className="mt-8 max-w-2xl" />
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-6">
        <h2 className="text-2xl font-semibold text-stone-900">
          Цены {district.namePrepositional}
        </h2>
        <p className="mt-2 text-stone-700">
          От {adjustedPriceFrom.toLocaleString('ru-RU')} ₽ до{' '}
          {adjustedPriceTo.toLocaleString('ru-RU')} ₽ за объект.
        </p>
        {sd?.localPriceNote && (
          <p className="mt-2 rounded bg-stone-50 p-3 text-sm text-stone-700">
            {sd.localPriceNote}
          </p>
        )}
      </section>

      {(sd as any)?.localLandmarks && (sd as any).localLandmarks.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">
            Где именно работаем {district.namePrepositional}
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(sd as any).localLandmarks.map((l: any, i: number) => (
              <li key={i} className="text-stone-700">
                · {l.landmarkName}
              </li>
            ))}
          </ul>
        </section>
      )}

      {sd?.miniCase ? (
        <MiniCaseSection miniCase={sd.miniCase} district={district} />
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
          <h2 className="text-2xl font-semibold text-stone-900">
            Частые вопросы {district.namePrepositional}
          </h2>
          <div className="mt-4 space-y-4">
            {(sd as any).localFaq.map((qa: any, i: number) => (
              <details
                key={i}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
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
        <h2 className="text-2xl font-semibold text-stone-900">
          Ещё {district.namePrepositional}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/raiony/${district.slug}/`}
            className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-300"
          >
            <div className="text-sm text-orange-700">Все услуги</div>
            <div className="mt-1 font-medium text-stone-900">
              Хаб района {district.nameNominative}
            </div>
          </Link>
          {((district as any).neighborDistricts ?? []).slice(0, 3).map((n: any) => {
            const slug = typeof n === 'object' ? n.slug : n
            const name = typeof n === 'object' ? n.nameNominative : n
            return (
              <Link
                key={slug}
                href={`/${service.slug}/${slug}/`}
                className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-300"
              >
                <div className="text-sm text-orange-700">Соседний район</div>
                <div className="mt-1 font-medium text-stone-900">
                  {service.h1} в {name}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <JsonLd
        schema={[
          serviceSchema(service as any, district as any),
          localBusinessSchema(district as any),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          ...(localFaq.length > 0 ? [faqPageSchema(localFaq)] : []),
        ]}
      />
    </article>
  )
}

function MiniCaseSection({ miniCase, district }: { miniCase: any; district: any }) {
  const before = miniCase.photosBefore?.[0]
  const after = miniCase.photosAfter?.[0]
  const photoUrl = (m: any) =>
    typeof m === 'object' && m?.url ? m.url : null

  return (
    <section className="mx-auto mt-12 max-w-5xl px-6">
      <h2 className="text-2xl font-semibold text-stone-900">
        Кейс {district.namePrepositional}
      </h2>
      <Link
        href={`/kejsy/${miniCase.slug}/`}
        className="mt-1 inline-block text-sm text-orange-700 hover:underline"
      >
        {miniCase.title} →
      </Link>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {before && photoUrl(before.image) && (
          <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="relative aspect-[3/2]">
              <Image
                src={photoUrl(before.image)!}
                alt={(before.image as any).alt ?? 'До'}
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
                alt={(after.image as any).alt ?? 'После'}
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
        {miniCase.dateCompleted && (
          <span>
            🗓{' '}
            {new Date(miniCase.dateCompleted).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
            })}
          </span>
        )}
        {miniCase.durationHours && <span>⏱ {miniCase.durationHours} ч</span>}
        {miniCase.finalPrice && (
          <span className="font-medium text-stone-800">
            💰 {miniCase.finalPrice.toLocaleString('ru-RU')} ₽ за объект
          </span>
        )}
      </div>
    </section>
  )
}

function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (node.text) return node.text
  if (node.children) return extractText(node.children)
  if (node.root) return extractText(node.root)
  return ''
}
