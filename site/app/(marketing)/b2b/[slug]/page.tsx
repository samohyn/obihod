import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getAllB2BSlugs, getB2BPageBySlug } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
export const dynamicParams = true

const AUDIENCE_LABELS: Record<string, string> = {
  uk: 'Управляющие компании',
  tszh: 'ТСЖ',
  fm: 'Facility Management',
  zastroyshchik: 'Застройщики',
  gostorgi: 'Госзакупки 44/223-ФЗ',
}

type B2BPageDoc = {
  id: number
  slug: string
  title: string
  h1: string
  metaTitle?: string | null
  metaDescription?: string | null
  audience: keyof typeof AUDIENCE_LABELS | 'uk-tszh'
  body: unknown
  blocks?: unknown[] | null
  krishaShtraf?: boolean
  canonicalOverride?: string | null
  contractTemplateUrl?: string | null
}

export async function generateStaticParams() {
  const slugs = await getAllB2BSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = (await getB2BPageBySlug(slug)) as unknown as B2BPageDoc | null
  if (!page) return {}
  return {
    title: { absolute: page.metaTitle ?? page.title },
    description: page.metaDescription ?? undefined,
    alternates: {
      canonical: page.canonicalOverride ?? canonicalFor(`/b2b/${page.slug}/`),
    },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `/b2b/${page.slug}/`,
      title: page.title,
      description: page.metaDescription ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function B2BPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = (await getB2BPageBySlug(slug)) as unknown as B2BPageDoc | null
  if (!page) notFound()

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'B2B', href: '/b2b/' },
    { name: page.title, href: `/b2b/${page.slug}/` },
  ]

  // US-0 W3 Track B-3 — приоритет blocks[] (cw fixture).
  const hasBlocks = Array.isArray(page.blocks) && page.blocks.length > 0
  if (hasBlocks) {
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <BlockRenderer blocks={page.blocks as any} />
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
      <section className="bg-bg-alt py-10 sm:py-14">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} />
          <span className="bg-card text-ink-soft mt-4 inline-block rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium">
            {AUDIENCE_LABELS[page.audience] ?? page.audience}
          </span>
          <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {page.h1}
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-[var(--pad)] py-12">
        {page.krishaShtraf && (
          <aside className="border-success/40 bg-success/5 mb-8 rounded-[var(--radius)] border p-5">
            <p className="text-success text-sm font-semibold">Штрафы ГЖИ и ОАТИ — на Обиходе</p>
            <p className="text-ink-soft mt-1 text-sm">
              Это пункт договора, не маркетинг. С момента подписания все предписания инспекций по
              предмету договора оплачиваем мы.
            </p>
          </aside>
        )}

        <div className="prose-content">
          <RichTextRenderer data={page.body} className="text-ink-soft leading-relaxed" />
        </div>

        {page.contractTemplateUrl && (
          <a
            href={page.contractTemplateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-on-primary hover:bg-primary-ink mt-8 inline-block rounded-[var(--radius)] px-6 py-3 text-sm font-medium"
          >
            Скачать шаблон договора
          </a>
        )}

        <div className="mt-12">
          <CtaMessengers />
        </div>
      </article>

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
