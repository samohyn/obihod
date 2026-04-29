import type { FC } from 'react'

/**
 * BrandLogo — wordmark для login-страницы и welcome-screen Payload admin.
 *
 * Art-концепт: текст без символа (specs/admin-visual/art-concept.md §4).
 * TM-знак Обихода пока не утверждён — любой временный символ = самодеятельность.
 * Кириллическое «ОБИХОД» плотным sans-serif работает как штамп само по себе.
 *
 * RSC — Payload подхватывает через importMap (pnpm generate:importmap).
 */
const BrandLogo: FC = () => (
  <div
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 2,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: 'var(--brand-obihod-ink, #1c1c1c)',
    }}
  >
    <span
      style={{
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}
    >
      ОБИХОД
    </span>
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--brand-obihod-primary, #2d5a3d)',
      }}
    >
      порядок под ключ · admin
    </span>
  </div>
)

export default BrandLogo
