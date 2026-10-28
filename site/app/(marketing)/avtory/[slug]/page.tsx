import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, personSchema, type Author as AuthorSchema } from '@/lib/seo/jsonld'
import { ogCard, OG_SITE_NAME } from '@/lib/seo/og'
import { canonicalFor } from '@/lib/seo/canonical'
import { getAllAuthorSlugs, getAuthorBySlug, getPublishedBlogPosts } from '@/lib/seo/queries'
import { truncateMeta } from '@/lib/seo/text'
import { PageHeader } from '@/components/blocks/v3/PageHeader'
import { Section, Wrap } from '@/components/blocks/v3/shared'
import type { V3BlockWithTone } from '@/components/blocks/v3/types'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { toImage } from '@/lib/blocks/v3/fromPayload'
import { BLOG_CATEGORY, blogTopic } from '@/lib/blog-topics'
import { getContacts } from '@/lib/chrome'

import s from '../avtory.module.css'
import { getPageTemplates } from '@/lib/page-templates-server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
export const dynamicParams = true

type AuthorDoc = {
  id: number
  slug: string
  firstName: string
  lastName: string
  fullName?: string | null
  jobTitle?: string | null
  bio?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  avatar?: { url?: string; alt?: string } | null
  knowsAbout?: Array<{ topic: string; id?: string }> | null
  sameAs?: Array<{ url: string; id?: string }> | null
  credentials?: Array<{
    name: string
    issuer?: string | null
    issuedAt?: string | null
    id?: string
  }> | null
}

type AuthorPost = {
  slug: string
  title: string
  intro: string
  category: string
  publishedAt: string
  heroImage?: unknown
  author?: { slug?: string } | null
}

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = (await getAuthorBySlug(slug)) as unknown as AuthorDoc | null
  if (!author) return {}
  const fullName = author.fullName ?? `${author.firstName} ${author.lastName}`
  return {
    title: { absolute: author.metaTitle ?? `${fullName} — эксперт Обихода` },
    description:
      author.metaDescription ??
      (author.bio ? truncateMeta(author.bio, 155) : undefined) ??
      `${fullName} — ${author.jobTitle ?? 'эксперт'} в Обиходе.`,
    alternates: { canonical: canonicalFor(`/avtory/${author.slug}/`) },
    openGraph: {
      type: 'profile',
      locale: 'ru_RU',
      url: `/avtory/${author.slug}/`,
      siteName: OG_SITE_NAME,
      title: fullName,
      description: author.bio ? truncateMeta(author.bio, 200) : undefined,
      images: [ogCard(fullName, author.jobTitle ?? 'Эксперт Обихода')],
    },
    robots: { index: true, follow: true },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = (await getAuthorBySlug(slug)) as unknown as AuthorDoc | null
  if (!author) notFound()

  const fullName = author.fullName ?? `${author.firstName} ${author.lastName}`
  const breadcrumbs = trail('avtory', { name: fullName, href: `/avtory/${author.slug}/` })

  // Ссылки-заглушки (корень соцсети, «…placeholder») — не профиль: не показываем и не отдаём в разметку
  const profiles = (author.sameAs ?? []).filter((p) => {
    try {
      return new URL(p.url).pathname.replace(/\/$/, '') !== '' && !/placeholder/i.test(p.url)
    } catch {
      return false
    }
  })

  const authorForSchema: AuthorSchema = {
    slug: author.slug,
    firstName: author.firstName,
    lastName: author.lastName,
    jobTitle: author.jobTitle ?? undefined,
    bio: author.bio ?? undefined,
    imageUrl: author.avatar?.url ?? undefined,
    sameAs: profiles.map((p) => p.url),
    knowsAbout: (author.knowsAbout ?? []).map((k) => k.topic).filter(Boolean),
  }

  const [posts, contacts, t] = await Promise.all([
    getPublishedBlogPosts() as unknown as Promise<AuthorPost[]>,
    getContacts(),
    getPageTemplates(),
  ])
  const mine = posts.filter((p) => p.slug && p.author?.slug === author.slug)
  const after: V3BlockWithTone[] = []
  if (mine.length) {
    after.push({
      blockType: 'articles',
      eyebrow: 'Статьи',
      title: t.authorPostsTitle,
      items: mine.map((p) => ({
        kicker: `${BLOG_CATEGORY[p.category] ?? 'Статья'} · ${new Date(p.publishedAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        title: p.title,
        text: p.intro?.length > 160 ? `${p.intro.slice(0, 157).trimEnd()}…` : p.intro,
        href: `/blog/${p.slug}/`,
        image: toImage(p.heroImage) ?? blogTopic(p.slug).image,
      })),
    })
  }
  after.push({
    blockType: 'final-form',
    anchor: 'zayavka',
    eyebrow: t.formEyebrow,
    title: t.authorFormTitle,
    background: null,
    channels: [],
    formTitle: 'Заявка',
    source: `avtor-${author.slug}`,
  })

  return (
    <>
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <PageHeader eyebrow="Автор" title={fullName} lead={author.jobTitle} />
      <Section tone="default">
        <Wrap className={s.profile}>
          <div>
            <span className={s.avatar} aria-hidden="true">
              {author.avatar?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatar.url} alt="" width={200} height={200} />
              ) : (
                `${author.firstName.charAt(0)}${author.lastName.charAt(0)}`
              )}
            </span>
            {profiles.length > 0 && (
              <ul className={s.links}>
                {profiles.map((profile, i) => (
                  <li key={profile.id ?? `same-${i}`}>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer me">
                      {new URL(profile.url).hostname.replace(/^www\./, '')}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {author.bio && (
              <>
                <h2 className={s.h2}>{t.authorAboutTitle}</h2>
                <p className={s.bio}>{author.bio}</p>
              </>
            )}
            {author.knowsAbout && author.knowsAbout.length > 0 && (
              <>
                <h2 className={s.h2}>{t.authorTopicsTitle}</h2>
                <ul className={s.chips}>
                  {author.knowsAbout.map((item, i) => (
                    <li key={item.id ?? `topic-${i}`}>{item.topic}</li>
                  ))}
                </ul>
              </>
            )}
            {author.credentials && author.credentials.length > 0 && (
              <>
                <h2 className={s.h2} style={{ marginTop: 32 }}>
                  Сертификаты и образование
                </h2>
                <ul className={s.creds}>
                  {author.credentials.map((c, i) => (
                    <li key={c.id ?? `cred-${i}`}>
                      {c.name}
                      {c.issuer && ` · ${c.issuer}`}
                      {c.issuedAt &&
                        ` · ${new Date(c.issuedAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}`}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Wrap>
      </Section>
      <V3BlockRenderer blocks={retone(after, true)} phoneDisplay={contacts.phoneDisplay} />

      <JsonLd
        schema={[
          personSchema(authorForSchema),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </>
  )
}
