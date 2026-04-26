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
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const securityHeaders = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
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
        ],
      },
    ]
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
