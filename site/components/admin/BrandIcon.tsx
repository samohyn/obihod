import type { FC } from 'react'

/**
 * BrandIcon — 32×32 монограмма «О» для левой навигации Payload admin
 * (collapsed sidebar, splash и favicon-fallback).
 *
 * Композиция:
 *   • brand-зелёный круг (#2d5a3d) — read-only «штамп», лучше отделим от
 *     прямоугольных чипов Payload, чем rect-вариант
 *   • кремовая «О» (#f7f5f0) Inter 700 — кириллица, не подменяется на лат. O
 *   • тонкий внутренний контур rgba(255,255,255,0.18) — добавляет глубину
 *     на кремовом фоне админки и не теряется в свернутом sidebar (~20px)
 *
 * Контраст #f7f5f0 на #2d5a3d ≈ 8.9:1 — AAA.
 * Временная заглушка до утверждения TM-знака Обихода.
 */
const BrandIcon: FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Обиход"
    style={{ display: 'block' }}
  >
    <circle cx="16" cy="16" r="15" fill="var(--brand-obihod-primary, #2d5a3d)" />
    <circle
      cx="16"
      cy="16"
      r="13.5"
      fill="none"
      stroke="rgba(247, 245, 240, 0.18)"
      strokeWidth="1"
    />
    <text
      x="16"
      y="22"
      textAnchor="middle"
      fontFamily="'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif"
      fontSize="19"
      fontWeight="700"
      fill="var(--brand-obihod-on-primary, #f7f5f0)"
      letterSpacing="-0.02em"
    >
      О
    </text>
  </svg>
)

export default BrandIcon
