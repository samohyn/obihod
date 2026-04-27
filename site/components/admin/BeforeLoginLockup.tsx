import type { CSSProperties, FC } from 'react'

/**
 * BeforeLoginLockup — master brand lockup над native Payload login form.
 *
 * OBI-28 / Wave 2 из OBI-19 admin redesign. Anatomy: design-system/
 * brand-guide.html §12.1 «Login screen» — точное соответствие mockup:
 * SVG-знак «Круг сезонов» + wordmark «ОБИХОД» крупно + admin-tagline
 * «порядок под ключ · admin» mono uppercase. Через
 * admin.components.beforeLogin slot — без переопределения auth-flow.
 *
 * Inline SVG (а не <img>) — гарантия отрисовки в admin без зависимости
 * от static-assets pipeline и без CORS-сюрпризов.
 *
 * RSC — Payload подхватывает через importMap.
 */

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  padding: '56px 16px 32px',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const lockupStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
}

const wordmarkStyle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 700,
  fontSize: 36,
  letterSpacing: '-0.025em',
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  lineHeight: 1,
}

const taglineStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  margin: 0,
  marginTop: 4,
}

/**
 * SeasonsCircleMark — упрощённый «Круг сезонов» (master mark).
 * Внешний круг + крест + 4 квадранта (хвоя · снежинка · план двора · контейнер).
 * 56×56 px, currentColor — наследуется от parent.
 */
const SeasonsCircleMark: FC = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="32" cy="32" r="28" />
    <line x1="32" y1="4" x2="32" y2="60" />
    <line x1="4" y1="32" x2="60" y2="32" />
    {/* Top-left: ёлочка (весна-осень) */}
    <path d="M18 12 L18 24 M14 18 L18 14 L22 18 M15 22 L18 19 L21 22" />
    {/* Top-right: снежинка (зима) */}
    <path d="M46 12 L46 24 M40 18 L52 18 M42 14 L50 22 M50 14 L42 22" />
    {/* Bottom-left: план двора (круглый год) */}
    <path d="M12 42 L24 42 L24 54 L12 54 Z M12 48 L24 48 M18 42 L18 54" />
    {/* Bottom-right: контейнер вывоза */}
    <path d="M40 44 L52 44 L50 56 L42 56 Z M40 44 L40 42 L52 42 L52 44" />
  </svg>
)

const BeforeLoginLockup: FC = () => (
  <div style={wrapStyle}>
    <div style={lockupStyle}>
      <span style={{ color: 'var(--brand-obihod-primary, #2d5a3d)' }}>
        <SeasonsCircleMark />
      </span>
      <span style={wordmarkStyle}>ОБИХОД</span>
    </div>
    <p style={taglineStyle}>порядок под ключ · admin</p>
  </div>
)

export default BeforeLoginLockup
