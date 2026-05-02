import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
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

const CATEGORY_LABELS: Record<string, string> = {
  arbo: 'Арбористика',
  sneg: 'Снегоуборка',
  musor: 'Вывоз мусора',
  demontazh: 'Демонтаж',
  b2b: 'B2B / УК',
  regulyatorika: 'Регуляторика',
  evergreen: 'Evergreen',
}

type Person = {
  slug: string
  firstName: string
  lastName: string
  jobTitle?: string | null
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
  category: keyof typeof CATEGORY_LABELS
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
      authors: post.author ? [`${SITE_URL}/avtory/${post.author.slug}/`] : undefined,
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

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Блог', href: '/blog/' },
    { name: post.title, href: `/blog/${post.slug}/` },
  ]

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

  return (
    <>
      <section className="bg-bg-alt py-10 sm:py-14">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} />
          <span className="bg-card text-ink-soft mt-4 inline-block rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.h1}
          </h1>
          <div className="text-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.author && (
              <span>
                ·{' '}
                <Link
                  href={`/avtory/${post.author.slug}/`}
                  className="hover:text-ink hover:underline"
                >
                  {post.author.firstName} {post.author.lastName}
                </Link>
              </span>
            )}
            {post.lastReviewedAt && (
              <span>
                · обновлено{' '}
                <time dateTime={post.lastReviewedAt}>{formatDate(post.lastReviewedAt)}</time>
              </span>
            )}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-[var(--pad)] py-12">
        {post.heroImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.heroImage.url}
            alt={post.heroImage.alt ?? post.title}
            className="mb-8 aspect-[16/9] w-full rounded-[var(--radius)] object-cover"
          />
        )}

        <p className="text-ink-soft text-lg leading-relaxed">{post.intro}</p>

        <div className="prose-content mt-8">
          <RichTextRenderer data={post.body} className="text-ink-soft leading-relaxed" />
        </div>

        {post.faqBlock && post.faqBlock.length > 0 && (
          <section className="mt-12">
            <h2 className="text-ink text-2xl font-semibold">Вопросы и ответы</h2>
            <ul className="mt-4 space-y-4">
              {post.faqBlock.map((item, i) => (
                <li
                  key={item.id ?? `faq-${i}`}
                  className="border-line bg-card rounded-[var(--radius)] border p-5"
                >
                  <h3 className="text-ink font-semibold">{item.question}</h3>
                  <div className="text-ink-soft mt-2 text-sm">
                    <RichTextRenderer data={item.answer} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {post.author && (
          <aside className="border-line bg-bg-alt mt-12 rounded-[var(--radius)] border p-5">
            <p className="text-muted text-sm">Об авторе</p>
            <Link
              href={`/avtory/${post.author.slug}/`}
              className="text-ink mt-1 inline-block text-base font-semibold hover:underline"
            >
              {post.author.firstName} {post.author.lastName}
            </Link>
            {post.author.jobTitle && (
              <p className="text-ink-soft mt-1 text-sm">{post.author.jobTitle}</p>
            )}
          </aside>
        )}

        <div className="mt-12">
          <CtaMessengers />
        </div>
      </article>

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
