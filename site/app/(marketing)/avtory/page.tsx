import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { getPublishedAuthors } from '@/lib/seo/queries'
import { PageHeader } from '@/components/blocks/v3/PageHeader'
import { Section, Wrap } from '@/components/blocks/v3/shared'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { getContacts } from '@/lib/chrome'

import s from './avtory.module.css'
import { getCompany, minutes } from '@/lib/company'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Эксперты Обихода — арбористы, бригадиры, B2B-эксперты',
  description:
    'Кто отвечает за качество работ Обихода: бригадиры, арбористы и эксперты по договорам с УК и ТСЖ. Опыт и темы экспертизы.',
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
  const [authors, contacts, company] = await Promise.all([
    getPublishedAuthors() as unknown as Promise<Author[]>,
    getContacts(),
    getCompany(),
  ])

  const breadcrumbs = trail('avtory')

  return (
    <>
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <PageHeader
        eyebrow="Авторы"
        title="Эксперты Обихода"
        lead="Бригадиры, эксперты по договорам и арбористы — кто отвечает за качество работ на каждом объекте."
      />
      <Section tone="default">
        <Wrap>
          <ul className={s.grid}>
            {authors.map((author) => {
              const name = author.fullName ?? `${author.firstName} ${author.lastName}`
              return (
                <li key={author.id}>
                  <Link href={`/avtory/${author.slug}/`} className={s.card}>
                    <div className={s.who}>
                      <span className={s.avatar} aria-hidden="true">
                        {author.avatar?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={author.avatar.url} alt="" width={64} height={64} />
                        ) : (
                          `${author.firstName.charAt(0)}${author.lastName.charAt(0)}`
                        )}
                      </span>
                      <div>
                        <h2 className={s.name}>{name}</h2>
                        {author.jobTitle && <p className={s.job}>{author.jobTitle}</p>}
                      </div>
                    </div>
                    {author.knowsAbout && author.knowsAbout.length > 0 && (
                      <ul className={s.chips}>
                        {author.knowsAbout.slice(0, 4).map((item, i) => (
                          <li key={item.id ?? `${author.id}-${i}`}>{item.topic}</li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </Wrap>
      </Section>
      <V3BlockRenderer
        blocks={[
          {
            blockType: 'final-form',
            tone: 'alt',
            anchor: 'zayavka',
            eyebrow: `Заявка · ответ за ${minutes(company.callbackMinutes)}`,
            title: `Задайте вопрос — перезвоним за ${minutes(company.callbackMinutes)}`,
            background: null,
            channels: [],
            formTitle: 'Заявка',
            source: 'avtory',
          },
        ]}
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
