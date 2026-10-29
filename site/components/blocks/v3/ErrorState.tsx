// Страница ошибки по brand-guide §11.5: иллюстрация 96×96 → код → заголовок → пояснение →
// 1–2 действия → запасной контакт. Без хуков и серверных импортов — годится и для 404 (сервер),
// и для границы ошибок error.tsx (клиент).

import type { ReactNode } from 'react'

import { ButtonLink, Eyebrow, Section, Wrap, type ButtonVariant, type IconName } from './shared'
import ph from './PageHeader.module.css'
import sh from './shared.module.css'
import s from './ErrorState.module.css'

/** Line-art из brand-guide §11.5 (stroke 2, currentColor): компас — 404, пила — 500. */
const ILLUSTRATIONS = {
  compass: (
    <>
      <circle cx="48" cy="48" r="34" />
      <circle cx="48" cy="48" r="28" strokeDasharray="2 4" />
      <path d="M48 18 L48 22" />
      <path d="M48 74 L48 78" />
      <path d="M18 48 L22 48" />
      <path d="M74 48 L78 48" />
      <path d="M48 48 L36 28" />
      <path d="M44 36 L40 40" />
      <path d="M48 48 L56 60" />
      <circle cx="48" cy="48" r="3" fill="currentColor" />
    </>
  ),
  saw: (
    <>
      <rect x="14" y="40" width="22" height="22" rx="3" />
      <path d="M14 40 L8 34" />
      <path d="M14 50 L36 50" />
      <path d="M36 46 L72 46" />
      <path d="M36 56 L72 56" />
      <path d="M72 46 C 78 46, 78 56, 72 56" />
      <path d="M40 46 L42 42 L44 46" />
      <path d="M48 46 L50 42 L52 46" />
      <path d="M56 46 L58 42 L60 46" />
      <path d="M64 46 L66 42 L68 46" />
      <path d="M40 56 L42 60 L44 56" />
      <path d="M48 56 L50 60 L52 56" />
      <path d="M58 56 L60 62 L62 56" strokeDasharray="2 2" />
      <path d="M30 32 L26 22" />
      <path d="M34 32 L34 18" />
      <path d="M38 32 L42 22" />
      <circle cx="34" cy="14" r="2" />
    </>
  ),
}

export type ErrorAction = {
  label: string
  variant?: Extract<ButtonVariant, 'primary' | 'ghost'>
  icon?: IconName
} & ({ href: string } | { onClick: () => void })

export function ErrorState({
  illustration,
  code,
  title,
  text,
  actions,
  fallback,
}: {
  illustration: keyof typeof ILLUSTRATIONS
  /** «Ошибка 404» — виден, но не доминирует (eyebrow) */
  code: string
  title: string
  text: ReactNode
  actions: ErrorAction[]
  /** запасной канал под кнопками — телефон */
  fallback?: ReactNode
}) {
  return (
    <Section className={s.section}>
      <Wrap>
        <svg
          className={s.illu}
          viewBox="0 0 96 96"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {ILLUSTRATIONS[illustration]}
        </svg>
        <Eyebrow>{code}</Eyebrow>
        <h1 className={ph.title}>{title}</h1>
        <p className={ph.lead}>{text}</p>
        <div className={s.actions}>
          {actions.map(({ label, variant = 'primary', icon, ...a }) =>
            'href' in a ? (
              <ButtonLink key={label} href={a.href} variant={variant} icon={icon}>
                {label}
              </ButtonLink>
            ) : (
              <button
                key={label}
                type="button"
                onClick={a.onClick}
                className={[sh.btn, sh[`btn-${variant}`]].join(' ')}
              >
                {label}
              </button>
            ),
          )}
        </div>
        {fallback && <p className={s.fallback}>{fallback}</p>}
      </Wrap>
    </Section>
  )
}
