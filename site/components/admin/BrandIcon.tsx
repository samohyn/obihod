import type { FC } from 'react'

/**
 * BrandIcon — 20×20 монограмма «О» для top-bar (.step-nav__home) Payload admin.
 *
 * Композиция:
 *   • brand-зелёный круг (#2d5a3d) — read-only «штамп»
 *   • кремовая «О» (#f7f5f0) Inter 700 — кириллица, не подменяется на лат. O
 *
 * Размер 20×20 верифицирован 2026-04-30 W9: `.step-nav` height = 20px на
 * /admin (Payload native top-bar). При размере 32×32 (W1 default) иконка
 * клиппилась сверху-снизу — оператор называл «кривой лого». Контраст
 * #f7f5f0 на #2d5a3d ≈ 8.9:1 — AAA.
 *
 * Временная заглушка до утверждения TM-знака Обихода.
 */
const BrandIcon: FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Обиход"
    style={{ display: 'block' }}
  >
    <circle cx="10" cy="10" r="9.5" fill="var(--brand-obihod-primary, #2d5a3d)" />
    <text
      x="10"
      y="14"
      textAnchor="middle"
      fontFamily="'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif"
      fontSize="12"
      fontWeight="700"
      fill="var(--brand-obihod-on-primary, #f7f5f0)"
      letterSpacing="-0.02em"
    >
      О
    </text>
  </svg>
)

export default BrandIcon
