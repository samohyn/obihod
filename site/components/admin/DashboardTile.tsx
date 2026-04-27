'use client'

import type { CSSProperties, FC, ReactNode } from 'react'

/**
 * DashboardTile — карточка-сценарий на /admin.
 *
 * Сетка 3×2 на десктопе. Цвета — брендовые токены из app/globals.css.
 * Sa-spec ui-mockups §2.1.
 */

interface DashboardTileProps {
  href: string
  /** SVG-компонент (см. components/admin/icons.tsx) или эмодзи-строка. */
  icon: ReactNode
  title: string
  caption?: string
  /** primary = зелёная заливка, ghost = белая. По умолчанию ghost. */
  variant?: 'ghost' | 'primary' | 'accent'
}

export const DashboardTile: FC<DashboardTileProps> = ({
  href,
  icon,
  title,
  caption,
  variant = 'ghost',
}) => {
  const tileStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 156,
    padding: '20px 24px',
    borderRadius: 'var(--brand-obihod-radius, 10px)',
    border: '1px solid var(--brand-obihod-line, #e6e1d6)',
    background:
      variant === 'primary'
        ? 'var(--brand-obihod-primary, #2d5a3d)'
        : variant === 'accent'
          ? 'var(--brand-obihod-accent, #e6a23c)'
          : 'var(--brand-obihod-card, #ffffff)',
    color:
      variant === 'primary'
        ? 'var(--brand-obihod-on-primary, #f7f5f0)'
        : variant === 'accent'
          ? 'var(--brand-obihod-ink, #1c1c1c)'
          : 'var(--brand-obihod-ink, #1c1c1c)',
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
    transition:
      'transform var(--brand-obihod-duration-fast, 120ms) var(--brand-obihod-ease-standard, cubic-bezier(0.4,0,0.2,1)), box-shadow var(--brand-obihod-duration-fast, 120ms) var(--brand-obihod-ease-standard, cubic-bezier(0.4,0,0.2,1)), border-color var(--brand-obihod-duration-fast, 120ms) var(--brand-obihod-ease-standard, cubic-bezier(0.4,0,0.2,1))',
    cursor: 'pointer',
  }

  const iconBoxStyle: CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
    background:
      variant === 'primary'
        ? 'rgba(255,255,255,0.12)'
        : variant === 'accent'
          ? 'rgba(0,0,0,0.08)'
          : 'var(--brand-obihod-bg-alt, #efebe0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  }

  const titleStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
  }

  const captionStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.7,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  }

  return (
    <a href={href} style={tileStyle} aria-label={title}>
      <div style={iconBoxStyle} aria-hidden="true">
        {icon}
      </div>
      <div>
        <div style={titleStyle}>{title}</div>
        {caption && <div style={{ ...captionStyle, marginTop: 8 }}>{caption}</div>}
      </div>
    </a>
  )
}

export default DashboardTile
