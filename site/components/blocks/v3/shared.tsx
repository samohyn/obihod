// Общие элементы библиотеки блоков v3 (этап 2 плана 09, эталон — макет главной C4).
// Server-компоненты: иконки, секция, заголовок секции, картинка с подписью «Иллюстрация».

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { SERVICE_ICON_PATHS, type ServiceIconName } from './serviceIconPaths'
import { UI_ICON_PATHS, type UiIconName } from './uiIconPaths'
import type { BlockImage, SectionTone } from './types'
import s from './shared.module.css'

// ─── иконки ───────────────────────────────────────────────────────────────────

export type IconName = UiIconName | ServiceIconName

function iconMarkup(name: IconName): string {
  return (
    (UI_ICON_PATHS as Record<string, string>)[name] ??
    (SERVICE_ICON_PATHS as Record<string, string>)[name] ??
    UI_ICON_PATHS.check
  )
}

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.5,
  className,
}: {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}) {
  // Разметка — константы из этого модуля и design-system, пользовательский ввод сюда не попадает.
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: iconMarkup(name) }}
    />
  )
}

// ─── знак «Круг сезонов» (design-system/logo/mark.svg) ───────────────────────

export function BrandMark({ className, thick = 44 }: { className?: string; thick?: number }) {
  const main = thick * 0.9
  const soft = thick * 0.6
  return (
    <svg
      className={className}
      viewBox="0 0 1200 1200"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="600" cy="600" r="560" strokeWidth={thick} />
      <circle cx="600" cy="600" r="435" strokeWidth={soft} opacity=".75" />
      <line x1="40" y1="600" x2="1160" y2="600" strokeWidth={soft} opacity=".75" />
      <line x1="600" y1="40" x2="600" y2="1160" strokeWidth={soft} opacity=".75" />
      <g strokeWidth={main}>
        <g transform="translate(300 330)">
          <line x1="0" y1="-150" x2="0" y2="150" />
          <path d="M0 -20 L-60 12 M0 -20 L60 12 M0 30 L-72 64 M0 30 L72 64 M0 78 L-72 112 M0 78 L72 112 M0 122 L-52 150 M0 122 L52 150" />
        </g>
        <g transform="translate(900 330)">
          <path d="M0 -130 V130 M-130 0 H130 M-92 -92 L92 92 M92 -92 L-92 92" />
        </g>
        <g transform="translate(300 900)">
          <rect x="-115" y="-70" width="230" height="140" />
          <path d="M-115 -4 H115 M18 -70 V-4 M-42 -4 V70" />
        </g>
        <g transform="translate(900 900)">
          <path d="M-100 60 V-60 H100 V60 M-118 -60 H118 M-48 50 V-20 M0 50 V-36 M-14 -20 L0 -36 L14 -20 M48 50 V-20" />
        </g>
      </g>
    </svg>
  )
}

// ─── секция и заголовок ──────────────────────────────────────────────────────

export function Section({
  tone = 'default',
  anchor,
  className,
  label,
  children,
}: {
  tone?: SectionTone
  anchor?: string | null
  className?: string
  label?: string
  children: ReactNode
}) {
  return (
    <section
      id={anchor ?? undefined}
      aria-label={label}
      className={[s.section, s[`tone-${tone}`], className].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  )
}

export function Wrap({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={[s.wrap, className].filter(Boolean).join(' ')}>{children}</div>
}

export function SectionHead({
  eyebrow,
  title,
  link,
  as: Tag = 'h2',
  onDark = false,
}: {
  eyebrow?: string | null
  title: string
  link?: { label: string; href: string } | null
  as?: 'h1' | 'h2'
  onDark?: boolean
}) {
  return (
    <div className={[s.head, link ? s.headRow : '', onDark ? s.onDark : ''].join(' ')}>
      <div className={s.headText}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <Tag className={s.title}>{title}</Tag>
      </div>
      {link && (
        <Link href={link.href} className={s.headLink}>
          {link.label}
          <Icon name="arrow" size={18} />
        </Link>
      )}
    </div>
  )
}

export function Eyebrow({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return <p className={[s.eyebrow, onDark ? s.onDarkEyebrow : ''].join(' ')}>{children}</p>
}

// ─── картинка с подписью «Иллюстрация» (правило 2 плана 09) ──────────────────

export function Picture({
  image,
  sizes,
  eager = false,
  className,
  tagPosition = 'br',
  quality,
}: {
  image: BlockImage | null | undefined
  sizes: string
  /** Качество сжатия (из images.qualities в next.config); по умолчанию 75. */
  quality?: 60 | 75
  /** Картинка первого экрана (LCP): грузится сразу и с высоким приоритетом. */
  eager?: boolean
  className?: string
  tagPosition?: 'br' | 'tr' | 'bl'
}) {
  if (!image?.url) return <div className={[s.picture, s.pictureEmpty, className].join(' ')} />
  return (
    <div className={[s.picture, className].filter(Boolean).join(' ')}>
      <Image
        src={image.url}
        alt={image.alt ?? ''}
        fill
        sizes={sizes}
        // LCP: preload — <link rel="preload"> в <head>, картинка не ждёт разбора тела (Next 16;
        // вместе с loading/fetchPriority не задаётся). SEO-аудит 28.10: задержка загрузки 2,5 с.
        {...(eager ? { preload: true } : { loading: 'lazy' as const })}
        quality={quality}
        style={{ objectFit: 'cover', objectPosition: image.focus ?? 'center' }}
      />
      {image.illustration && (
        <span className={[s.illu, s[`illu-${tagPosition}`]].join(' ')}>Иллюстрация</span>
      )}
    </div>
  )
}

export function IllustrationTag({ position = 'br' }: { position?: 'br' | 'tr' | 'bl' }) {
  return <span className={[s.illu, s[`illu-${position}`]].join(' ')}>Иллюстрация</span>
}

// ─── кнопка-ссылка ────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'ghost' | 'light' | 'ghostLight'

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
}: {
  href: string
  variant?: ButtonVariant
  size?: 'md' | 'lg'
  icon?: IconName
  children: ReactNode
  className?: string
}) {
  const external = /^(tel:|mailto:|https?:)/.test(href)
  const cls = [s.btn, s[`btn-${variant}`], size === 'lg' ? s.btnLg : '', className]
    .filter(Boolean)
    .join(' ')
  const inner = (
    <>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </>
  )
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}
