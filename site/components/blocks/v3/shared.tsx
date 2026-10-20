// Общие элементы библиотеки блоков v3 (этап 2 плана 09, эталон — макет главной C4).
// Server-компоненты: иконки, секция, заголовок секции, картинка с подписью «Иллюстрация».

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { SERVICE_ICON_PATHS, type ServiceIconName } from './serviceIconPaths'
import type { BlockImage, SectionTone } from './types'
import s from './shared.module.css'

// ─── иконки ───────────────────────────────────────────────────────────────────

const UI_ICON_PATHS = {
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  camera:
    '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  cash: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  image:
    '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  upload:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  building:
    '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  alert:
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  stamp:
    '<path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
} as const

export type UiIconName = keyof typeof UI_ICON_PATHS
export type IconName = UiIconName | ServiceIconName

export const ICON_NAMES = [
  ...Object.keys(UI_ICON_PATHS),
  ...Object.keys(SERVICE_ICON_PATHS),
] as IconName[]

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
}: {
  image: BlockImage | null | undefined
  sizes: string
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
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
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
