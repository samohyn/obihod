import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { shortTitle, trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { payloadClient } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageHeader } from '@/components/blocks/v3/PageHeader'
import { Section, Wrap } from '@/components/blocks/v3/shared'
import type { HeroSliderBlock, V3BlockWithTone } from '@/components/blocks/v3/types'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import a from '@/components/blocks/v3/ArticleBody.module.css'
import { ArticleSide } from '@/components/blocks/v3/ArticleSide'
import { retone } from '@/lib/blocks/v3/retone'
import { toImage } from '@/lib/blocks/v3/fromPayload'
import { getContacts } from '@/lib/chrome'
import { getPage } from '@/lib/pages'
import { isDraftPreview } from '@/lib/preview'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
export const dynamicParams = true

async function loadCase(slug: string, draft: boolean) {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'cases',
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    draft,
    limit: 1,
    depth: 2,
  })
  return r.docs[0] ?? null
}

const getPublishedCase = unstable_cache(
  (slug: string) => loadCase(slug, false),
  ['published-case-by-slug'],
  { revalidate: 86400, tags: ['cases'] },
)

/** Снятый с публикации кейс на сайте не виден; в предпросмотре — последняя версия. */
async function getCaseBySlug(slug: string) {
  return (await isDraftPreview()) ? loadCase(slug, true) : getPublishedCase(slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = await getCaseBySlug(slug)
  if (!c) return {}
  return {
    title: { absolute: c.metaTitle ?? c.title },
    description: c.metaDescription,
    alternates: { canonical: `/kejsy/${c.slug}/` },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `/kejsy/${c.slug}/`,
      title: c.title,
      description: c.metaDescription ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await getCaseBySlug(slug)
  if (!c) notFound()

  const district = (c as any).district
  const service = (c as any).service
  const breadcrumbs = trail('kejsy', { name: shortTitle(c.title), href: `/kejsy/${c.slug}/` })

  const photoUrl = (m: any) => (typeof m === 'object' && m?.url ? m.url : null)
  const before = (c as any).photosBefore?.[0]
  const after = (c as any).photosAfter?.[0]

  // 0. Шаблон v3: данные кейса из коллекции «Кейсы» + подуслуги направления из хаба
  const pillar = service?.slug ? await getPage(service.slug) : null
  if (pillar) {
    const contacts = await getContacts()
    const slide = (
      pillar.blocks.find((b) => b.blockType === 'hero-slider') as HeroSliderBlock | undefined
    )?.slides?.[0]
    const beforeImg = toImage(before?.image)
    const afterImg = toImage(after?.image)
    const price = Number((c as any).finalPrice) >= 1000 ? Number((c as any).finalPrice) : null
    const hours = Number((c as any).durationHours) || null
    const sum = price ? `${price.toLocaleString('ru-RU')} ₽` : null
    const blocks: V3BlockWithTone[] = []
    if (beforeImg && afterImg) {
      blocks.push({
        blockType: 'projects',
        eyebrow: 'До и после',
        title: 'Как было и как стало',
        items: [
          {
            place: district?.nameNominative ?? '',
            duration: hours ? `${hours} ч` : '',
            title: c.h1 ?? c.title,
            sum: sum ?? 'по смете',
            matched: true,
            before: beforeImg,
            after: afterImg,
          },
        ],
      })
    }
    blocks.push({
      blockType: 'about-stats',
      eyebrow: 'Объект',
      title: 'Коротко о работе',
      text: service?.title
        ? `${service.title}${district ? ` · ${district.nameNominative}` : ''}`
        : '',
      stats: [
        ...(sum ? [{ value: sum, label: 'итог по акту' }] : []),
        ...(hours ? [{ value: `${hours} ч`, label: 'на объекте' }] : []),
        ...(district ? [{ value: district.nameNominative, label: 'район' }] : []),
      ],
    })
    const tiles = pillar.blocks.find((b) => b.blockType === 'services-tiles')
    const after2: V3BlockWithTone[] = []
    if (tiles) after2.push({ ...tiles, eyebrow: 'Услуги', title: `${pillar.title} — что делаем` })
    after2.push({
      blockType: 'final-form',
      anchor: 'zayavka',
      eyebrow: 'Заявка · ответ за 10 минут',
      title: 'Нужно так же — перезвоним за 10 минут',
      background: afterImg ?? slide?.image ?? null,
      channels: [],
      formTitle: 'Заявка',
      source: `kejs-${c.slug}`,
    })
    // Фон чередуется: шапка бежевая → блоки с кремового → описание → услуги и заявка
    const lastTone = blocks.length % 2 === 1 ? 'default' : 'alt'
    const descTone = lastTone === 'default' ? 'alt' : 'default'
    const hasDesc = Boolean((c as any).description)
    return (
      <>
        <Breadcrumbs items={breadcrumbs} schema={false} />
        <PageHeader
          eyebrow={service?.title ? `Кейс · ${service.title}` : 'Кейс'}
          title={c.h1 ?? c.title}
          meta={
            <>
              {district && (
                <Link href={`/raiony/${district.slug}/`}>{district.nameNominative}</Link>
              )}
              {(c as any).dateCompleted && (
                <span>
                  {new Date((c as any).dateCompleted).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              )}
            </>
          }
        />
        <V3BlockRenderer blocks={retone(blocks)} phoneDisplay={contacts.phoneDisplay} />
        {hasDesc && (
          <Section tone={descTone}>
            <Wrap className={a.layout}>
              <div className={a.body}>
                <RichText data={(c as any).description} />
              </div>
              <ArticleSide
                phoneDisplay={contacts.phoneDisplay}
                phoneHref={contacts.phoneE164 ? `tel:${contacts.phoneE164}` : ''}
                service={
                  service?.slug ? { title: service.title ?? '', href: `/${service.slug}/` } : null
                }
              />
            </Wrap>
          </Section>
        )}
        <V3BlockRenderer
          blocks={retone(after2, (hasDesc ? descTone : lastTone) === 'default')}
          phoneDisplay={contacts.phoneDisplay}
        />
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

  // US-0 W3 Track B-3 — приоритет blocks[] (cw fixture).
  const caseBlocks = (c as { blocks?: unknown[] | null }).blocks
  const hasBlocks = Array.isArray(caseBlocks) && caseBlocks.length > 0
  if (hasBlocks) {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} schema={false} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <BlockRenderer blocks={caseBlocks as any} />
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

  return (
    <>
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <article className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {c.h1 ?? c.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
          {district && (
            <Link href={`/raiony/${district.slug}/`} className="hover:underline">
              📍 {district.nameNominative}
            </Link>
          )}
          {service && (
            <Link href={`/${service.slug}/`} className="hover:underline">
              🪓 {service.title}
            </Link>
          )}
          {(c as any).dateCompleted && (
            <span>
              🗓{' '}
              {new Date((c as any).dateCompleted).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          )}
          {(c as any).durationHours && <span>⏱ {(c as any).durationHours} ч</span>}
          {(c as any).finalPrice && (
            <span className="font-medium text-stone-800">
              💰 {(c as any).finalPrice.toLocaleString('ru-RU')} ₽ за объект
            </span>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {before && photoUrl(before.image) && (
            <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
              <div className="relative aspect-[3/2]">
                <Image
                  src={photoUrl(before.image)!}
                  alt={(before.image as any).alt ?? 'Фото "до"'}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-4 py-3 text-sm text-stone-600">
                <span className="font-semibold text-stone-900">До · </span>
                {before.caption}
              </figcaption>
            </figure>
          )}
          {after && photoUrl(after.image) && (
            <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
              <div className="relative aspect-[3/2]">
                <Image
                  src={photoUrl(after.image)!}
                  alt={(after.image as any).alt ?? 'Фото "после"'}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-4 py-3 text-sm text-stone-600">
                <span className="font-semibold text-stone-900">После · </span>
                {after.caption}
              </figcaption>
            </figure>
          )}
        </div>

        {(c as any).description && (
          <div className="mt-8 max-w-3xl">
            <RichTextRenderer
              data={(c as any).description}
              className="leading-relaxed text-stone-700"
            />
          </div>
        )}

        {((c as any).brigade ?? []).length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-stone-900">Команда</h2>
            <ul className="mt-3 space-y-2">
              {(c as any).brigade.map((p: any) => (
                <li key={p.id} className="text-stone-700">
                  <span className="font-medium text-stone-900">
                    {p.firstName} {p.lastName}
                  </span>{' '}
                  — {p.jobTitle}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10">
          <CtaMessengers className="max-w-2xl" />
        </div>

        <div className="mt-10">
          <LicenseBadge />
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          {service && district && (
            <Link
              href={`/${service.slug}/${district.slug}/`}
              className="rounded-full border border-stone-300 px-4 py-2 hover:border-orange-300"
            >
              ← {service.title} {district.namePrepositional}
            </Link>
          )}
        </div>

        <JsonLd
          schema={[
            {
              '@type': 'CreativeWork',
              name: c.title,
              datePublished: (c as any).dateCompleted,
              ...(district && {
                contentLocation: {
                  '@type': 'Place',
                  name: district.nameNominative,
                  geo:
                    district.centerGeo && Array.isArray(district.centerGeo)
                      ? {
                          '@type': 'GeoCoordinates',
                          latitude: district.centerGeo[1],
                          longitude: district.centerGeo[0],
                        }
                      : undefined,
                },
              }),
            },
            breadcrumbListSchema(
              breadcrumbs.map((b) => ({
                name: b.name,
                url: `${SITE_URL}${b.href}`,
              })),
            ),
          ]}
        />
      </article>
    </>
  )
}
