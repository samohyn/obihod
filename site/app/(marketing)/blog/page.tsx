import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getPublishedBlogPosts } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Блог Обихода — справочник по 4 услугам',
  description:
    'Спил, чистка крыш, вывоз мусора, демонтаж — что делаем, как считаем, что важно знать перед заказом. Гиды от арбористов и B2B-экспертов Обихода.',
  alternates: { canonical: canonicalFor('/blog/') },
}

const CATEGORY_LABELS: Record<string, string> = {
  arbo: 'Арбористика',
  sneg: 'Снегоуборка',
  musor: 'Вывоз мусора',
  demontazh: 'Демонтаж',
  b2b: 'B2B / УК',
  regulyatorika: 'Регуляторика',
  evergreen: 'Evergreen',
}

type BlogPost = {
  id: number
  slug: string
  title: string
  intro: string
  category: keyof typeof CATEGORY_LABELS
  publishedAt: string
  modifiedAt: string
  heroImage?: { url?: string; alt?: string } | null
  author?: { firstName: string; lastName: string; jobTitle?: string } | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogIndex() {
  const posts = (await getPublishedBlogPosts()) as unknown as BlogPost[]

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Блог', href: '/blog/' },
  ]

  return (
    <>
      <section className="bg-bg-alt py-12 sm:py-16">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-ink mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Блог Обихода — справочник по 4 услугам
          </h1>
          <p className="text-muted mt-3 max-w-2xl text-lg">
            Спил, чистка крыш, вывоз мусора, демонтаж — что делаем, как считаем, что важно знать
            перед заказом.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] py-12">
        {posts.length === 0 ? (
          <p className="text-muted">Статьи появятся скоро.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="border-line bg-card hover:border-primary/40 rounded-[var(--radius)] border transition"
              >
                <Link
                  href={`/blog/${post.slug}/`}
                  className="focus-visible:outline-accent block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {post.heroImage?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.heroImage.url}
                      alt={post.heroImage.alt ?? post.title}
                      className="aspect-[16/9] w-full rounded-t-[var(--radius)] object-cover"
                    />
                  )}
                  <div className="p-6">
                    <span className="bg-bg-alt text-ink-soft inline-block rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <h2 className="text-ink mt-3 text-xl leading-snug font-semibold">
                      {post.title}
                    </h2>
                    <p className="text-muted mt-2 line-clamp-3 text-sm">{post.intro}</p>
                    <div className="text-muted mt-4 flex flex-wrap gap-x-3 text-xs">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      {post.author && (
                        <span>
                          · {post.author.firstName} {post.author.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] pb-16">
        <CtaMessengers />
      </section>

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
