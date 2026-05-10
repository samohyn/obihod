import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  /**
   * 301-редиректы для миграции canonical slug.
   *
   * - /ochistka-krysh/* → /chistka-krysh/* (US-5 REQ-5.3, ADR-uМ-13).
   *   Wsfreq 888 для «чистка» vs 0 для «очистка» (Wave 2 US-4).
   * - /arboristika/spil/ → /arboristika/spil-derevev/ (C3 task).
   *   Короткий «спил» — частая SEO-форма (liwood.ru/services/udalenie-derevev/spil),
   *   canonical sub-service slug в Payload — `spil-derevev`.
   * - /<pillar>/ramenskoe/ → /<pillar>/ramenskoye/ (C3 task).
   *   Транслитерация Раменское — две формы; canonical district slug в Payload —
   *   `ramenskoye` (по сидам W11/W13). Алиас покрывает все 5 pillar.
   *
   * Дальнейшая стратегия (US-5 REQ-5.3): когда количество таких миграций
   * вырастет — переехать на middleware.ts, читающий коллекцию `Redirects`
   * из Payload (она существует, но сейчас не подключена к runtime).
   */
  async redirects() {
    return [
      {
        source: '/ochistka-krysh/',
        destination: '/chistka-krysh/',
        permanent: true,
      },
      {
        source: '/ochistka-krysh/:path*',
        destination: '/chistka-krysh/:path*',
        permanent: true,
      },
      {
        source: '/arboristika/spil/',
        destination: '/arboristika/spil-derevev/',
        permanent: true,
      },
      {
        source: '/:pillar(arboristika|chistka-krysh|demontazh|vyvoz-musora|uborka-territorii)/ramenskoe/',
        destination: '/:pillar/ramenskoye/',
        permanent: true,
      },
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const baseHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(self), geolocation=(self), microphone=()',
      },
    ]
    // HSTS нельзя ставить в dev: браузер кэширует его для localhost и начинает
    // апгрейдить HTTP → HTTPS, ломая /admin после логина (редирект на https://localhost).
    if (isProd) {
      baseHeaders.unshift({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      })
    }
    const securityHeaders = [{ source: '/:path*', headers: baseHeaders }]
    // Long Cache-Control только в production — в dev это ломает HMR Turbopack
    if (isProd) {
      securityHeaders.push({
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      })
    }
    return securityHeaders
  },
}

export default withPayload(nextConfig)
