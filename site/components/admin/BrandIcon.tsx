import type { FC } from 'react'

/**
 * BrandIcon — 28×28 монограмма «О» для левой навигации Payload admin.
 *
 * Белая кириллическая «О» на квадрате бренд-зелёного (rx 6 px).
 * Контраст #f7f5f0 на #2d5a3d = ~8.9:1 (AAA для large text).
 * Временная заглушка до утверждения TM-знака Обихода.
 */
const BrandIcon: FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <rect width="28" height="28" rx="6" fill="var(--brand-obihod-primary, #2d5a3d)" />
    <text
      x="14"
      y="20"
      textAnchor="middle"
      fontFamily="'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif"
      fontSize="18"
      fontWeight="700"
      fill="var(--brand-obihod-on-primary, #f7f5f0)"
      letterSpacing="-0.02em"
    >
      О
    </text>
  </svg>
)

export default BrandIcon
