import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getPublishedAuthors } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Эксперты Обихода — арбористы, бригадиры, B2B-эксперты',
  description:
    'Кто отвечает за качество работ Обихода: старший арборист, координатор photo→quote, эксперт по договорам УК и ТСЖ. Опыт, сертификаты, темы экспертизы.',
  alternates: { canonical: canonicalFor('/avtory/') },
}

type Author = {
  id: number
  slug: string
  fullName?: string | null
  firstName: string
  lastName: string
  jobTitle?: string | null
  bio?: string | null
  knowsAbout?: Array<{ topic: string; id?: string }> | null
  avatar?: { url?: string; alt?: string } | null
}

export default async function AuthorsIndex() {
  const authors = (await getPublishedAuthors()) as unknown as Author[]

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Авторы', href: '/avtory/' },
  ]

  return (
    <>
      <section className="bg-bg-alt py-12 sm:py-16">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-ink mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Эксперты Обихода
          </h1>
          <p className="text-muted mt-3 max-w-2xl text-lg">
            Бригадиры, эксперты по договорам и арбористы — кто отвечает за качество работ на каждом
            объекте.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--maxw)] px-[var(--pad)] py-12">
        {authors.length === 0 ? (
          <p className="text-muted">Эксперты появятся скоро.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <li
                key={author.id}
                className="border-line bg-card hover:border-primary/40 rounded-[var(--radius)] border p-6 transition"
              >
                <Link
                  href={`/avtory/${author.slug}/`}
                  className="focus-visible:outline-accent block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <div className="flex items-start gap-4">
                    {author.avatar?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={author.avatar.url}
                        alt={author.fullName ?? `${author.firstName} ${author.lastName}`}
                        width={64}
                        height={64}
                        className="border-line h-16 w-16 rounded-full border object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="bg-bg-alt text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold"
                      >
                        {author.firstName.charAt(0)}
                        {author.lastName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-ink text-lg font-semibold">
                        {author.fullName ?? `${author.firstName} ${author.lastName}`}
                      </h2>
                      {author.jobTitle && (
                        <p className="text-muted mt-1 text-sm">{author.jobTitle}</p>
                      )}
                    </div>
                  </div>
                  {author.knowsAbout && author.knowsAbout.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {author.knowsAbout.slice(0, 4).map((item, i) => (
                        <li
                          key={item.id ?? `${author.id}-${i}`}
                          className="bg-bg-alt text-ink-soft rounded-[var(--radius-sm)] px-2.5 py-1 text-xs"
                        >
                          {item.topic}
                        </li>
                      ))}
                    </ul>
                  )}
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
