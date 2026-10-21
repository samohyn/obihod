import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { shortTitle, trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
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
import { getPageTemplates } from '@/lib/page-templates-server'

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

  const before = (c as any).photosBefore?.[0]
  const after = (c as any).photosAfter?.[0]

  // Данные кейса из коллекции «Кейсы»; фото первого экрана и подуслуги — из хаба направления, если он есть
  const pillar = service?.slug ? await getPage(service.slug) : null
  const contacts = await getContacts()
  const slide = (
    pillar?.blocks.find((b) => b.blockType === 'hero-slider') as HeroSliderBlock | undefined
  )?.slides?.[0]
  const beforeImg = toImage(before?.image)
  const afterImg = toImage(after?.image)
  const price = Number((c as any).finalPrice) >= 1000 ? Number((c as any).finalPrice) : null
  const hours = Number((c as any).durationHours) || null
  const sum = price ? `${price.toLocaleString('ru-RU')} ₽` : null
  const t = await getPageTemplates()
  const blocks: V3BlockWithTone[] = []
  if (beforeImg && afterImg) {
    blocks.push({
      blockType: 'projects',
      eyebrow: 'До и после',
      title: t.caseBeforeAfterTitle,
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
    title: t.caseAboutTitle,
    text: service?.title
      ? `${service.title}${district ? ` · ${district.nameNominative}` : ''}`
      : '',
    stats: [
      ...(sum ? [{ value: sum, label: 'итог по акту' }] : []),
      ...(hours ? [{ value: `${hours} ч`, label: 'на объекте' }] : []),
      ...(district ? [{ value: district.nameNominative, label: 'район' }] : []),
    ],
  })
  const tiles = pillar?.blocks.find((b) => b.blockType === 'services-tiles')
  const after2: V3BlockWithTone[] = []
  if (tiles && pillar)
    after2.push({ ...tiles, eyebrow: 'Услуги', title: `${pillar.title} — что делаем` })
  after2.push({
    blockType: 'final-form',
    anchor: 'zayavka',
    eyebrow: t.formEyebrow,
    title: t.caseFormTitle,
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
            {district && <Link href={`/raiony/${district.slug}/`}>{district.nameNominative}</Link>}
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
