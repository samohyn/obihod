import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import '../homepage-classic.css'

import { SiteFooter } from '@/components/chrome/SiteFooter'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { PreviewBanner } from '@/components/chrome/PreviewBanner'
import { AnalyticsConsent } from '@/components/analytics/AnalyticsConsent'
import { RumProvider } from '@/components/analytics/RumProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteChrome } from '@/lib/chrome'
import { organizationSchema, websiteSchema } from '@/lib/seo/jsonld'
import { getSeoSettings } from '@/lib/seo/queries'

// Шрифты локально (план 09, раздел 5): сборка не ходит в Google Fonts — раньше сбой их сервера
// ронял сборку. Файлы — app/fonts/: вариативные Golos Text и JetBrains Mono, латиница + кириллица,
// лицензия SIL OFL (app/fonts/OFL-*.txt).
const golosText = localFont({
  src: '../fonts/GolosText-Variable.woff2',
  variable: '--font-golos-text',
  weight: '400 900',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: '../fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-jetbrains-mono',
  weight: '400 500',
  display: 'swap',
})

const baseMetadata: Metadata = {
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

/**
 * Коды подтверждения прав из «Настроек SEO» → <meta name="yandex-verification"> и др.: нужны
 * Яндекс Вебмастеру и Search Console при запуске (план 09, этапы 7–8).
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = (await getSeoSettings()) as {
    verification?: {
      yandexWebmaster?: string | null
      googleSearchConsole?: string | null
      mailRu?: string | null
    } | null
  } | null
  const v = seo?.verification
  return {
    ...baseMetadata,
    verification: {
      yandex: v?.yandexWebmaster?.trim() || undefined,
      google: v?.googleSearchConsole?.trim() || undefined,
      other: v?.mailRu?.trim() ? { 'mailru-domain': v.mailRu.trim() } : undefined,
    },
  }
}

/** Номер счётчика Метрики из «Настроек SEO»; нет — ни Метрики, ни баннера о cookie. */
function metrikaId(seo: unknown): number | null {
  const v = (seo as { metrikaId?: string | null } | null)?.metrikaId
  return v && /^\d{5,12}$/.test(v) ? Number(v) : null
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
        <JsonLd schema={[organizationSchema(chrome, seo), websiteSchema()]} />
        <AnalyticsConsent counterId={metrikaId(seo)} />
        <RumProvider />
        <PreviewBanner />
        <SiteHeader />
        <main className="min-h-[60vh] flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
