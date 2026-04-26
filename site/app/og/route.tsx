import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

/**
 * Динамический OG-image endpoint — US-5 REQ-5.11.
 *
 * Использование в `generateMetadata()`:
 *   openGraph: {
 *     images: [{
 *       url: `${SITE_URL}/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`,
 *       width: 1200, height: 630
 *     }]
 *   }
 *
 * Дизайн: brand colors (зелёный #2d5a3d + кремовый bg + янтарный акцент).
 * Без логотипа-картинки — слово «ОБИХОД» рендерится текстом.
 *
 * Edge runtime (`next/og` использует @vercel/og внутри) — быстрый ответ,
 * не нагружает PM2-процесс. Кэширование Next 16 ISR — `revalidate = 31536000`
 * (год; OG-image меняется редко, при правке title — другой URL → другой кэш).
 */

export const runtime = 'edge'
export const revalidate = 31536000

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Обиход').slice(0, 80)
  const subtitle = (searchParams.get('subtitle') || 'Порядок под ключ').slice(0, 100)
  // type — pillar/service/case/blog — определяет иконку/цвет акцента.
  // Сейчас все одинаково; расширение в US-6 при необходимости.
  const type = searchParams.get('type') ?? 'default'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fdf8ec', // brand cream
          padding: 80,
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#2d5a3d', // brand green
              color: '#fdf8ec',
              fontSize: 56,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            О
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#2d5a3d',
              letterSpacing: '-0.02em',
            }}
          >
            ОБИХОД
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#5a5a5a',
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '4px solid #d97706', // brand amber
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 24, color: '#5a5a5a' }}>obikhod.ru · Москва и МО</div>
          <div
            style={{
              fontSize: 24,
              color: '#2d5a3d',
              fontWeight: 600,
            }}
          >
            {labelByType(type)}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

function labelByType(type: string): string {
  switch (type) {
    case 'pillar':
      return 'Услуга'
    case 'case':
      return 'Кейс'
    case 'blog':
      return 'Блог'
    case 'b2b':
      return 'Для бизнеса'
    default:
      return 'Фикс-цена · 10 мин'
  }
}
