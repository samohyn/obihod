import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, personSchema, type Author as AuthorSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getAllAuthorSlugs, getAuthorBySlug } from '@/lib/seo/queries'

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
      author.bio?.slice(0, 155) ??
      `${fullName} — ${author.jobTitle ?? 'эксперт'} в Обиходе.`,
    alternates: { canonical: canonicalFor(`/avtory/${author.slug}/`) },
    openGraph: {
      type: 'profile',
      locale: 'ru_RU',
      url: `/avtory/${author.slug}/`,
      title: fullName,
      description: author.bio?.slice(0, 200) ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = (await getAuthorBySlug(slug)) as unknown as AuthorDoc | null
  if (!author) notFound()

  const fullName = author.fullName ?? `${author.firstName} ${author.lastName}`
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Авторы', href: '/avtory/' },
    { name: fullName, href: `/avtory/${author.slug}/` },
  ]

  const authorForSchema: AuthorSchema = {
    slug: author.slug,
    firstName: author.firstName,
    lastName: author.lastName,
    jobTitle: author.jobTitle ?? undefined,
    bio: author.bio ?? undefined,
    imageUrl: author.avatar?.url ?? undefined,
    sameAs: (author.sameAs ?? []).map((s) => s.url).filter(Boolean),
    knowsAbout: (author.knowsAbout ?? []).map((k) => k.topic).filter(Boolean),
  }

  return (
    <>
      <section className="bg-bg-alt py-10 sm:py-14">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-ink mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {fullName}
          </h1>
          {author.jobTitle && <p className="text-muted mt-2 text-lg">{author.jobTitle}</p>}
        </div>
      </section>

      <article className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] py-12">
        <div className="grid gap-10 md:grid-cols-[200px_minmax(0,1fr)]">
          <aside>
            {author.avatar?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatar.url}
                alt={fullName}
                width={200}
                height={200}
                className="border-line aspect-square w-full rounded-[var(--radius)] border object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="bg-bg-alt text-primary flex aspect-square w-full items-center justify-center rounded-[var(--radius)] text-5xl font-semibold"
              >
                {author.firstName.charAt(0)}
                {author.lastName.charAt(0)}
              </div>
            )}
            {author.sameAs && author.sameAs.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm">
                {author.sameAs.map((profile, i) => (
                  <li key={profile.id ?? `same-${i}`}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {new URL(profile.url).hostname.replace(/^www\./, '')}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div>
            {author.bio && (
              <section>
                <h2 className="text-ink text-xl font-semibold">О специалисте</h2>
                <p className="text-ink-soft mt-3 leading-relaxed">{author.bio}</p>
              </section>
            )}

            {author.knowsAbout && author.knowsAbout.length > 0 && (
              <section className="mt-8">
                <h2 className="text-ink text-xl font-semibold">Темы экспертизы</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {author.knowsAbout.map((item, i) => (
                    <li
                      key={item.id ?? `topic-${i}`}
                      className="bg-bg-alt text-ink-soft rounded-[var(--radius-sm)] px-3 py-1.5 text-sm"
                    >
                      {item.topic}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {author.credentials && author.credentials.length > 0 && (
              <section className="mt-8">
                <h2 className="text-ink text-xl font-semibold">Сертификаты и образование</h2>
                <ul className="text-ink-soft mt-3 space-y-2">
                  {author.credentials.map((c, i) => (
                    <li key={c.id ?? `cred-${i}`}>
                      <span className="text-ink font-medium">{c.name}</span>
                      {c.issuer && <span className="text-muted"> · {c.issuer}</span>}
                      {c.issuedAt && (
                        <span className="text-muted">
                          {' · '}
                          {new Date(c.issuedAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <div className="mt-12">
          <CtaMessengers />
        </div>
      </article>

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
