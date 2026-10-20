import type { Metadata } from 'next'

import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { getContacts } from '@/lib/chrome'
import { getHomepage } from '@/lib/homepage'
import { getPage } from '@/lib/pages'
import { canonicalFor } from '@/lib/seo/canonical'
import { JsonLdGraph } from '@/components/marketing/_shared/JsonLdGraph'
import { Cases } from '@/components/marketing/sections/Cases'
import { Coverage } from '@/components/marketing/sections/Coverage'
import { CtaFooter } from '@/components/marketing/sections/CtaFooter'
import { Documents } from '@/components/marketing/sections/Documents'
import { FAQ, faqItems } from '@/components/marketing/sections/FAQ'
import { Gallery } from '@/components/marketing/sections/Gallery'
import { Hero } from '@/components/marketing/sections/Hero'
import { How } from '@/components/marketing/sections/How'
import { PhotoSmeta } from '@/components/marketing/sections/PhotoSmeta'
import { PricingCalculator } from '@/components/marketing/sections/PricingCalculator'
import { PricingTable } from '@/components/marketing/sections/PricingTable'
import { Reviews } from '@/components/marketing/sections/Reviews'
import { Services } from '@/components/marketing/sections/Services'

// Phase 2 (ADR-0017): re-render каждые 10 минут когда global обновляется через
// admin. Webhook `/api/revalidate` после `afterChange` hook на Homepage global
// — ещё не реализован (Phase 2 backlog), пока ISR.
export const revalidate = 600

/**
 * EPIC-HOMEPAGE-MIGRATION — Phase 1 visual 1:1 port from archive/newui/homepage-classic.html.
 * 13 sections + JSON-LD @graph (Organization, LocalBusiness, WebSite, FAQPage, Service).
 */
const LEGACY_METADATA: Metadata = {
  title: 'Удаление деревьев в Москве и МО · Обиход',
  description:
    'Арбористика, чистка крыш от снега, вывоз мусора, демонтаж в Москве и МО. Фикс-цена за объект, страховка 5 млн ₽. Смета за 10 минут по фото.',
  alternates: { canonical: canonicalFor('/') },
  openGraph: {
    type: 'website',
    siteName: 'Обиход',
    locale: 'ru_RU',
    url: 'https://obikhod.ru/',
    title: 'Удаление деревьев и хозяйственные работы в Москве и МО · Обиход',
    description:
      '4 направления в одном договоре: арбористика, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект. Смета за 10 минут по фото.',
    images: [
      {
        url: '/img-generated/hero-arborist-v1.jpg',
        width: 1200,
        height: 630,
        alt: 'Бригада Обихода спиливает аварийную берёзу с автовышки',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Удаление деревьев в Москве и МО · Обиход',
    description:
      'Арбористика, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, страховка 5 млн ₽.',
    images: ['/img-generated/hero-arborist-v1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  other: {
    'theme-color': '#2d5a3d',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  if (!page) return LEGACY_METADATA
  const title = page.metaTitle ?? LEGACY_METADATA.title
  const description = page.metaDescription ?? LEGACY_METADATA.description
  const og = page.ogImage
  return {
    ...LEGACY_METADATA,
    title,
    description,
    openGraph: {
      ...LEGACY_METADATA.openGraph,
      title: page.metaTitle ?? undefined,
      description: page.metaDescription ?? undefined,
      ...(og ? { images: [{ url: og.url, alt: og.alt }] } : {}),
    },
  }
}

export default async function Home() {
  // План 09, этап 2: главная из коллекции «Страницы» (slug «home», блоки v3), пока она опубликована.
  // Нет опубликованной — старая главная из глобала «Главная страница» (expand → switch → contract).
  const [page, contacts] = await Promise.all([getPage('home'), getContacts()])
  if (page) {
    const faq = page.blocks.flatMap((b) =>
      b.blockType === 'faq-v3' && b.enabled !== false ? b.items : [],
    )
    return (
      <>
        <JsonLdGraph faq={faq} />
        <V3BlockRenderer blocks={page.blocks} phoneDisplay={contacts.phoneDisplay} />
      </>
    )
  }
  const hp = await getHomepage()
  return (
    <>
      <JsonLdGraph faq={faqItems(hp)} />
      <Hero data={hp} />
      <Services />
      <How data={hp} />
      <PricingTable data={hp} />
      <PricingCalculator />
      <PhotoSmeta data={hp} />
      <Cases />
      <Reviews data={hp} />
      <Documents data={hp} />
      <Coverage />
      <Gallery data={hp} />
      <FAQ data={hp} />
      <CtaFooter phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
