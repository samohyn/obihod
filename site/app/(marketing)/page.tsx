import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { getContacts } from '@/lib/chrome'
import { getPage } from '@/lib/pages'
import { canonicalFor } from '@/lib/seo/canonical'
import { ogCard } from '@/lib/seo/og'
import { JsonLdGraph } from '@/components/marketing/_shared/JsonLdGraph'

export const revalidate = 600

/** Картинка для соцсетей, пока у документа главной не задана своя: фирменная карточка, а не
 * сгенерированное фото — в превью мессенджеров нет подписи «Иллюстрация». */
const OG_IMAGE = ogCard('Порядок под ключ на участке')

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  if (!page) return {}
  const title = page.metaTitle ?? page.title
  const description = page.metaDescription ?? undefined
  const images = page.ogImage ? [{ url: page.ogImage.url, alt: page.ogImage.alt }] : [OG_IMAGE]
  return {
    title,
    description,
    alternates: { canonical: canonicalFor('/') },
    openGraph: {
      type: 'website',
      siteName: 'Обиход',
      locale: 'ru_RU',
      url: 'https://obikhod.ru/',
      title: page.metaTitle ?? undefined,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
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
}

/** Главная — документ «Страницы» home (блоки v3); нет опубликованного — 404. */
export default async function Home() {
  const [page, contacts] = await Promise.all([getPage('home'), getContacts()])
  if (!page) notFound()
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
