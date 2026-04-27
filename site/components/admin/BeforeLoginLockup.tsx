import type { CSSProperties, FC } from 'react'

/**
 * BeforeLoginLockup — brand-strip над native Payload login form.
 *
 * OBI-28 / Wave 2 из OBI-19 admin redesign. Anatomy — devteam/specs/
 * US-12-admin-redesign/art-concept-v2.md §1 + brand-guide.html §12.1.
 *
 * Не заменяет login form (anti-pattern: брать на себя auth-flow Payload).
 * Через admin.components.beforeLogin slot — добавляем визуальный заголовок
 * над дефолтной карточкой. Wordmark остаётся в `graphics.Logo` внутри
 * карточки (без двойной отрисовки).
 *
 * RSC — Payload подхватывает через importMap (pnpm generate:importmap).
 */

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  padding: '48px 16px 32px',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-muted, #6b6256)',
  margin: 0,
}

const headingStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  margin: 0,
}

const dividerStyle: CSSProperties = {
  width: 48,
  height: 2,
  background: 'var(--brand-obihod-accent, #e6a23c)',
  borderRadius: 2,
  marginTop: 4,
}

const BeforeLoginLockup: FC = () => (
  <div style={wrapStyle}>
    <p style={eyebrowStyle}>obikhod.ru · admin</p>
    <h1 style={headingStyle}>Порядок под ключ</h1>
    <span style={dividerStyle} aria-hidden="true" />
  </div>
)

export default BeforeLoginLockup
