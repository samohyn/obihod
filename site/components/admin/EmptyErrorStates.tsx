import type { CSSProperties, FC, ReactNode } from 'react'

/**
 * EmptyState · ErrorState · ForbiddenState — standalone компоненты для
 * пустых / ошибочных / запрещённых состояний admin.
 *
 * OBI-31 / Wave 5 из OBI-19 admin redesign. Anatomy — specs/
 * US-12-admin-redesign/art-concept-v2.md §7 + brand-guide.html §12.6.
 *
 * Принцип: eyebrow с кодом (для ошибок) + заголовок-факт + текст + 1-2 CTA.
 * Без «Упс! / Что-то пошло не так» — matter-of-fact (anti-TOV из brand-guide).
 *
 * В Wave 5 компоненты — **standalone exports**. Подключение к Payload
 * (через admin.components.providers / notFound / forbidden) — отдельная
 * итерация в OBI-31 хвост или Wave 7 admin smoke. Это безопаснее: компоненты
 * используют brand-токены, доступны для импорта в любом контексте, не ломают
 * native Payload error-handling.
 *
 * RSC — Payload подхватывает через importMap при подключении.
 */

interface ActionLink {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

interface StatePanelProps {
  eyebrow?: string
  title: string
  text: ReactNode
  actions?: ActionLink[]
  icon?: ReactNode
}

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '60px 24px',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  maxWidth: 480,
  margin: '32px auto',
}

const iconStyle: CSSProperties = {
  width: 56,
  height: 56,
  color: 'var(--brand-obihod-muted, #6b6256)',
  opacity: 0.6,
  marginBottom: 16,
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-muted, #6b6256)',
  margin: 0,
  marginBottom: 8,
}

const titleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: '-0.015em',
  lineHeight: 1.2,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  margin: 0,
  marginBottom: 8,
}

const textStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: 'var(--brand-obihod-ink-soft, #2b2b2b)',
  margin: 0,
  marginBottom: 20,
  maxWidth: 320,
}

const actionsRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'center',
}

const actionPrimaryStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  border: '1px solid var(--brand-obihod-accent, #e6a23c)',
  background: 'var(--brand-obihod-accent, #e6a23c)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  fontWeight: 600,
  fontSize: 13,
  textDecoration: 'none',
  minHeight: 40,
}

const actionSecondaryStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  background: 'transparent',
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  fontWeight: 500,
  fontSize: 13,
  textDecoration: 'none',
  minHeight: 40,
}

/**
 * StatePanel — общий wrapper для empty/error/403. Не экспортируется наружу;
 * три именованных компонента ниже — публичный API.
 */
const StatePanel: FC<StatePanelProps> = ({ eyebrow, title, text, actions, icon }) => (
  <section style={wrapStyle} role="region" aria-label={title}>
    {icon ? <div style={iconStyle}>{icon}</div> : null}
    {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
    <h2 style={titleStyle}>{title}</h2>
    <p style={textStyle}>{text}</p>
    {actions && actions.length > 0 ? (
      <div style={actionsRowStyle}>
        {actions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            style={action.variant === 'secondary' ? actionSecondaryStyle : actionPrimaryStyle}
          >
            {action.label}
          </a>
        ))}
      </div>
    ) : null}
  </section>
)

const FolderIcon: FC = () => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 16 L8 48 L48 48 L48 22 L36 22 L32 16 Z" />
    <line x1="14" y1="32" x2="42" y2="32" />
  </svg>
)

const AlertIcon: FC = () => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="28" cy="28" r="22" />
    <path d="M28 16 L28 30" />
    <circle cx="28" cy="38" r="1.5" fill="currentColor" />
  </svg>
)

const LockIcon: FC = () => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="14" y="24" width="28" height="22" rx="2" />
    <path d="M20 24 L20 18 C 20 14, 24 10, 28 10 C 32 10, 36 14, 36 18 L36 24" />
    <circle cx="28" cy="34" r="2" />
    <path d="M28 36 L28 40" />
  </svg>
)

interface EmptyStateProps {
  title?: string
  text?: string
  actionLabel?: string
  actionHref?: string
}

export const EmptyState: FC<EmptyStateProps> = ({
  title = 'Пока пусто',
  text = 'Добавьте первую запись — она появится в каталоге сайта и в виджете dashboard.',
  actionLabel = '+ Добавить',
  actionHref = '#',
}) => (
  <StatePanel
    icon={<FolderIcon />}
    title={title}
    text={text}
    actions={[{ label: actionLabel, href: actionHref, variant: 'primary' }]}
  />
)

interface ErrorStateProps {
  code?: string
  title?: string
  text?: string
  retryHref?: string
  homeHref?: string
}

export const ErrorState: FC<ErrorStateProps> = ({
  code = '500',
  title = 'Не удалось загрузить',
  text = 'Скорее всего — временная проблема. Попробуйте обновить страницу через минуту.',
  retryHref = '#',
  homeHref = '/admin',
}) => (
  <StatePanel
    icon={<AlertIcon />}
    eyebrow={`SERVER ERROR · ${code}`}
    title={title}
    text={text}
    actions={[
      { label: 'Обновить', href: retryHref, variant: 'primary' },
      { label: 'На дашборд', href: homeHref, variant: 'secondary' },
    ]}
  />
)

interface ForbiddenStateProps {
  title?: string
  text?: string
  homeHref?: string
}

export const ForbiddenState: FC<ForbiddenStateProps> = ({
  title = 'Нет доступа к коллекции',
  text = 'Спросите у администратора — выдадут.',
  homeHref = '/admin',
}) => (
  <StatePanel
    icon={<LockIcon />}
    eyebrow="ACCESS · 403"
    title={title}
    text={text}
    actions={[{ label: 'На дашборд', href: homeHref, variant: 'secondary' }]}
  />
)

export default EmptyState
