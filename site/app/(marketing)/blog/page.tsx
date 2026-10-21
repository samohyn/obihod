import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { getPublishedBlogPosts } from '@/lib/seo/queries'
import type { V3BlockWithTone } from '@/components/blocks/v3/types'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { toImage } from '@/lib/blocks/v3/fromPayload'
import { BLOG_CATEGORY, blogTopic } from '@/lib/blog-topics'
import { getContacts } from '@/lib/chrome'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400

type BlogPost = {
  slug: string
  title: string
  intro: string
  category: string
  publishedAt: string
  heroImage?: { url?: string; alt?: string } | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('blog')
  return page ? buildBlocksPageMetadata(page, '/blog/') : {}
}

/** Блог — документ «Страницы» blog, статьи из коллекции «Блог» — под первым экраном; нет документа — 404. */
export default async function BlogIndex() {
  const [page, rawPosts, contacts] = await Promise.all([
    getPage('blog'),
    getPublishedBlogPosts(),
    getContacts(),
  ])
  if (!page) notFound()
  // без slug у поста нет страницы — иначе ссылка /blog/null/
  const posts = (rawPosts as unknown as BlogPost[]).filter((p) => p.slug)
  const [hero, ...rest] = page.blocks
  const list: V3BlockWithTone = {
    blockType: 'articles',
    anchor: 'stati',
    eyebrow: 'Статьи',
    title: 'Все статьи',
    items: posts.map((p) => ({
      kicker: `${BLOG_CATEGORY[p.category] ?? 'Статья'} · ${formatDate(p.publishedAt)}`,
      title: p.title,
      text: p.intro?.length > 160 ? `${p.intro.slice(0, 157).trimEnd()}…` : p.intro,
      href: `/blog/${p.slug}/`,
      image: toImage(p.heroImage) ?? blogTopic(p.slug).image,
    })),
  }
  return (
    <>
      <Breadcrumbs items={trail('blog')} />
      <V3BlockRenderer
        blocks={retone([hero, list, ...rest])}
        phoneDisplay={contacts.phoneDisplay}
      />
    </>
  )
}
