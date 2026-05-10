import type { Metadata } from 'next'
import { Golos_Text, JetBrains_Mono } from 'next/font/google'
import '../globals.css'
import '../homepage-classic.css'
import '../service-pages.css'

import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { YandexMetrika } from '@/components/analytics/YandexMetrika'
import { RumProvider } from '@/components/analytics/RumProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteChrome } from '@/lib/chrome'
import { localBusinessSchema, organizationSchema, websiteSchema } from '@/lib/seo/jsonld'
import { getSeoSettings } from '@/lib/seo/queries'

const golosText = Golos_Text({
  variable: '--font-golos-text',
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'),
  title: {
    default: 'Обиход — порядок под ключ. Арбо, снег, мусор, демонтаж по Москве и МО',
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
  // PANEL-FAVICON-BRAND (2026-05-01): бренд-favicon ОБИХОД на всём периметре.
  // Source assets от art (note-art.md) — §3 brand-guide master lockup
  // (скруглённый квадрат + кремовая «О» на primary `#2d5a3d`).
  // favicon.ico лежит в site/app/ (Next.js 16 auto-convention), но дублируем
  // через metadata API чтобы явно подвязать SVG + apple-touch + PWA-icons.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [chrome, seo] = await Promise.all([getSiteChrome(), getSeoSettings()])
  return (
    <html
      lang="ru"
      className={`${golosText.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd
          schema={[
            organizationSchema(chrome, seo),
            websiteSchema(),
            localBusinessSchema(chrome, seo),
          ]}
        />
        <YandexMetrika />
        <RumProvider />
        <Header />
        <main className="min-h-[60vh] flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
