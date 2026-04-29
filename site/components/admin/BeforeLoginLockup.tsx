import type { CSSProperties, FC } from 'react'

/**
 * BeforeLoginLockup — master brand lockup над native Payload login form.
 *
 * Source: agents/brand/logo/horizontal-compact.svg (детальный 4-квадрант знак
 * «Круг сезонов» + wordmark «ОБИХОД» внутри одного SVG). PAN-18 / Wave 2.A v2
 * pixel-perfect §12.1.
 *
 * Inline JSX (а не <img src="..."/>) — гарантия отрисовки без зависимости от
 * static-asset pipeline и без CORS-сюрпризов; bundle ~2KB.
 *
 * Через admin.components.beforeLogin slot — без переопределения auth-flow.
 */

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  padding: '60px 16px 32px',
  fontFamily: 'var(--font-body)',
}

const lockupSvgStyle: CSSProperties = {
  height: 56,
  width: 'auto',
  display: 'block',
}

const taglineStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#2d5a3d',
  margin: 0,
}

const BeforeLoginLockup: FC = () => (
  <div style={wrapStyle}>
    <svg viewBox="0 0 1280 480" style={lockupSvgStyle} role="img" aria-label="Обиход">
      <title>Обиход</title>
      <g color="#2d5a3d">
        <g transform="translate(240 240) scale(0.36)">
          <circle
            cx="0"
            cy="0"
            r="560"
            fill="none"
            stroke="currentColor"
            strokeWidth="7.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="0"
            cy="0"
            r="435"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          <line
            x1="-560"
            y1="0"
            x2="560"
            y2="0"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          <line
            x1="0"
            y1="-560"
            x2="0"
            y2="560"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />

          <g
            transform="translate(-300 -270)"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="0" y1="-150" x2="0" y2="150" />
            <line x1="0" y1="-20" x2="-60" y2="12" />
            <line x1="0" y1="-20" x2="60" y2="12" />
            <line x1="0" y1="30" x2="-72" y2="64" />
            <line x1="0" y1="30" x2="72" y2="64" />
            <line x1="0" y1="78" x2="-72" y2="112" />
            <line x1="0" y1="78" x2="72" y2="112" />
            <line x1="0" y1="122" x2="-52" y2="150" />
            <line x1="0" y1="122" x2="52" y2="150" />
          </g>

          <g
            transform="translate(300 -270)"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="0" y1="-130" x2="0" y2="130" />
            <line x1="-130" y1="0" x2="130" y2="0" />
            <line x1="-92" y1="-92" x2="92" y2="92" />
            <line x1="92" y1="-92" x2="-92" y2="92" />
            <polyline points="-10,-118 0,-130 10,-118" />
            <polyline points="-10,118 0,130 10,118" />
            <polyline points="-118,-10 -130,0 -118,10" />
            <polyline points="118,-10 130,0 118,10" />
            <circle cx="0" cy="0" r="9" />
            <circle cx="0" cy="0" r="2.6" fill="currentColor" stroke="none" />
          </g>

          <g
            transform="translate(-300 300)"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="-115" y="-70" width="230" height="140" />
            <line x1="-115" y1="-4" x2="115" y2="-4" />
            <line x1="18" y1="-70" x2="18" y2="-4" />
            <line x1="-42" y1="-4" x2="-42" y2="70" />
          </g>

          <g
            transform="translate(300 300)"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="-100,60 -100,-60 100,-60 100,60" />
            <line x1="-118" y1="-60" x2="118" y2="-60" />
            <line x1="-48" y1="50" x2="-48" y2="-20" />
            <line x1="0" y1="50" x2="0" y2="-36" />
            <polyline points="-14,-20 0,-36 14,-20" />
            <line x1="48" y1="50" x2="48" y2="-20" />
          </g>
        </g>

        <text
          x="520"
          y="295"
          fontFamily="Inter, 'Helvetica Neue', Arial, sans-serif"
          fontSize="160"
          fontWeight="800"
          letterSpacing="-4"
          fill="currentColor"
        >
          ОБИХОД
        </text>
      </g>
    </svg>
    <p style={taglineStyle}>порядок под ключ · admin</p>
  </div>
)

export default BeforeLoginLockup
