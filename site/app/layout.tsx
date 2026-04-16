import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { JsonLd } from '@/components/seo/JsonLd'
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from '@/lib/seo/jsonld'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru',
  ),
  title: {
    default:
      'Обиход — порядок под ключ. Арбо, снег, мусор, демонтаж по Москве и МО',
    template: '%s | Обиход',
  },
  description:
    'Спил деревьев, чистка крыш от снега, вывоз мусора, демонтаж — комплексный подрядчик 4-в-1 для Москвы и МО. Фикс-цена за объект, смета по фото за 10 минут.',
  applicationName: 'Обиход',
  authors: [{ name: 'ООО «Обиход»' }],
  generator: 'Next.js 16',
  keywords: [
    'спил деревьев',
    'чистка крыш',
    'вывоз мусора',
    'демонтаж',
    'Москва',
    'Московская область',
    'Обиход',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Обиход',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <JsonLd
          schema={[organizationSchema(), websiteSchema(), localBusinessSchema()]}
        />
        {children}
      </body>
    </html>
  )
}
