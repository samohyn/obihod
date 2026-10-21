import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { shortTitle, trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { PageHeader } from '@/components/blocks/v3/PageHeader'
import { Picture, Section, Wrap } from '@/components/blocks/v3/shared'
import type { ServicesTilesBlock, V3BlockWithTone } from '@/components/blocks/v3/types'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import a from '@/components/blocks/v3/ArticleBody.module.css'
import { ArticleSide } from '@/components/blocks/v3/ArticleSide'
import { retone } from '@/lib/blocks/v3/retone'
import { toImage } from '@/lib/blocks/v3/fromPayload'
import { BLOG_CATEGORY, blogTopic } from '@/lib/blog-topics'
import { getContacts } from '@/lib/chrome'
import { getPage } from '@/lib/pages'
import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
  type BlogPost as BlogPostSchema,
} from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getAllBlogSlugs, getBlogPostBySlug } from '@/lib/seo/queries'
import { truncateMeta } from '@/lib/seo/text'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
export const dynamicParams = true

type Person = {
  slug: string
  firstName: string
  lastName: string
  jobTitle?: string | null
  _status?: 'draft' | 'published' | null
}

type BlogPostDoc = {
  id: number
  slug: string
  title: string
  h1: string
  intro: string
  body: unknown
  publishedAt: string
  modifiedAt: string
  category: string
  metaTitle?: string | null
  metaDescription?: string | null
  heroImage?: { url?: string; alt?: string } | null
  author?: Person | null
  reviewedBy?: Person | null
  faqBlock?: Array<{ question: string; answer: unknown; id?: string }> | null
  isHowTo?: boolean
  howToSteps?: Array<{ name: string; text: unknown; id?: string }> | null
  canonicalOverride?: string | null
  lastReviewedAt?: string | null
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = (await getBlogPostBySlug(slug)) as unknown as BlogPostDoc | null
  if (!post) return {}
  return {
    title: { absolute: post.metaTitle ?? post.title },
    description: post.metaDescription ?? truncateMeta(post.intro, 155),
    alternates: {
      canonical: post.canonicalOverride ?? canonicalFor(`/blog/${post.slug}/`),
    },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `/blog/${post.slug}/`,
      title: post.title,
      description: truncateMeta(post.intro, 200),
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
      authors:
        post.author?._status === 'published'
          ? [`${SITE_URL}/avtory/${post.author.slug}/`]
          : undefined,
      images: post.heroImage?.url ? [post.heroImage.url] : undefined,
    },
    robots: { index: true, follow: true },
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function richTextToPlain(value: unknown): string {
  // Минимальный fallback для FAQPage schema (Lexical → plain text)
  if (!value || typeof value !== 'object') return ''
  const visit = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const obj = node as Record<string, unknown>
    if (typeof obj.text === 'string') return obj.text
    const children = Array.isArray(obj.children) ? obj.children : []
    return children.map(visit).join(' ')
  }
  const root = (value as { root?: unknown }).root
  return visit(root).trim()
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await getBlogPostBySlug(slug)) as unknown as BlogPostDoc | null
  if (!post) notFound()
  // Страница автора есть только у опубликованного автора — иначе ссылка битая (/avtory/georgy-s/).
  const authorHasPage = post.author?._status === 'published'

  const breadcrumbs = trail('blog', { name: shortTitle(post.title), href: `/blog/${post.slug}/` })

  const blogPostSchema: BlogPostSchema = {
    slug: post.slug,
    h1: post.h1,
    publishedAt: post.publishedAt,
    modifiedAt: post.modifiedAt,
    heroImageUrl: post.heroImage?.url,
    author: post.author
      ? {
          firstName: post.author.firstName,
          lastName: post.author.lastName,
          jobTitle: post.author.jobTitle ?? undefined,
        }
      : { firstName: 'Команда', lastName: 'Обихода' },
  }

  const faqForSchema =
    post.faqBlock && post.faqBlock.length > 0
      ? post.faqBlock.map((item) => ({
          question: item.question,
          answer: richTextToPlain(item.answer),
        }))
      : null

  const topic = blogTopic(post.slug)
  const cover = toImage(post.heroImage) ?? topic.image
  const [contacts, uslugi, pillar] = await Promise.all([
    getContacts(),
    getPage('uslugi'),
    topic.pillar ? getPage(topic.pillar) : Promise.resolve(null),
  ])
  // Связанные услуги: подуслуги направления статьи, а если тема общая — все направления
  const pillarTiles = pillar?.blocks.find((b) => b.blockType === 'services-tiles')
  const allTiles = uslugi?.blocks.find((b) => b.blockType === 'services-tiles')
  const tiles = (pillarTiles ?? allTiles) as ServicesTilesBlock | undefined
  const after: V3BlockWithTone[] = []
  if (faqForSchema) {
    after.push({
      blockType: 'faq-v3',
      eyebrow: 'Вопросы',
      title: 'Вопросы и ответы',
      items: faqForSchema,
    })
  }
  if (tiles?.items?.length) {
    after.push({
      blockType: 'services-tiles',
      eyebrow: 'Услуги',
      title: pillar ? `${pillar.title} — что делаем` : 'Что делаем',
      link: { label: 'Все услуги', href: pillar ? `/${topic.pillar}/` : '/uslugi/' },
      items: tiles.items.slice(0, 6),
    })
  }
  const photo = uslugi?.blocks.find((b) => b.blockType === 'photo-cta')
  if (photo) after.push(photo)
  after.push({
    blockType: 'final-form',
    anchor: 'zayavka',
    eyebrow: 'Заявка · ответ за 10 минут',
    title: 'Остались вопросы — перезвоним за 10 минут',
    background: null,
    channels: [],
    formTitle: 'Вопрос по статье',
    source: `blog-${post.slug}`,
  })
  const author = post.author ? `${post.author.firstName} ${post.author.lastName}` : null

  return (
    <>
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <PageHeader
        eyebrow={BLOG_CATEGORY[post.category] ?? 'Статья'}
        title={post.h1}
        meta={
          <>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {author &&
              (authorHasPage ? (
                <Link href={`/avtory/${post.author!.slug}/`}>{author}</Link>
              ) : (
                <span>{author}</span>
              ))}
            {post.lastReviewedAt && (
              <span>
                обновлено{' '}
                <time dateTime={post.lastReviewedAt}>{formatDate(post.lastReviewedAt)}</time>
              </span>
            )}
          </>
        }
      />
      <Section tone="default">
        <Wrap className={a.layout}>
          <article className={a.body}>
            <div className={a.figure}>
              <Picture
                image={cover}
                sizes="(max-width: 767px) 100vw, 760px"
                eager
                className={a.cover}
              />
            </div>
            {post.intro && <p className={a.lead}>{post.intro}</p>}
            <RichText data={post.body as never} />
            {author && (
              <aside className={a.author}>
                Об авторе
                {authorHasPage ? (
                  <Link href={`/avtory/${post.author!.slug}/`}>
                    <b>{author}</b>
                  </Link>
                ) : (
                  <b>{author}</b>
                )}
                {post.author?.jobTitle && <span>{post.author.jobTitle}</span>}
              </aside>
            )}
          </article>
          <ArticleSide
            phoneDisplay={contacts.phoneDisplay}
            phoneHref={contacts.phoneE164 ? `tel:${contacts.phoneE164}` : ''}
            service={pillar ? { title: pillar.title, href: `/${topic.pillar}/` } : null}
          />
        </Wrap>
      </Section>
      <V3BlockRenderer blocks={retone(after, true)} phoneDisplay={contacts.phoneDisplay} />

      <JsonLd
        schema={[
          articleSchema(blogPostSchema),
          ...(faqForSchema ? [faqPageSchema(faqForSchema)] : []),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </>
  )
}
