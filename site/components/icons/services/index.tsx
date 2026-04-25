import type { SVGProps } from 'react'

/**
 * Service icons for header mega-menu — stroke-only, currentColor, 20×20.
 *
 * Источник эталона: design-system/brand-guide.html секция «Mega-menu
 * каталога услуг» → live demo (~строка 1216+). Каждый pathset скопирован
 * 1:1 из эталона. Оставшиеся (без эталонного path) — стилистически
 * совместимые stroke-only placeholder'ы в той же эстетике чертежа-циркуляра.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const baseProps = (size: number, p: IconProps) => ({
  width: p.width ?? size,
  height: p.height ?? size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

// ───── Арбористика ─────

export const SpilIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M12 3 L12 14" />
    <path d="M9 6 L12 3 L15 6" />
    <path d="M8 9 L12 6 L16 9" />
    <path d="M7 12 L12 9 L17 12" />
    <path d="M6 15 L18 15" strokeDasharray="2 1.5" />
    <path d="M12 15 L12 21" />
    <path d="M9 21 L15 21" />
  </svg>
)

export const ValkaIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M4 20 L20 20" />
    <g transform="rotate(35 10 18)">
      <path d="M10 9 L10 18" />
      <path d="M8 11 L10 9 L12 11" />
      <path d="M7.5 13 L10 11 L12.5 13" />
      <path d="M7 15 L10 13 L13 15" />
    </g>
    <path d="M16 14 L20 14 L20 10" />
    <path d="M20 14 L17 17" />
  </svg>
)

export const UdalenieCelikomIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M12 3 L12 18" />
    <path d="M9 6 L12 3 L15 6" />
    <path d="M8 10 L12 6 L16 10" />
    <path d="M7 14 L12 10 L17 14" />
    <path d="M9 21 L15 21" />
    <path d="M5 18 L19 18" strokeDasharray="2 2" />
  </svg>
)

export const UdalenieChastiamiIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M12 4 L12 21" />
    <path d="M9 21 L15 21" />
    <path d="M9 7 L12 4 L15 7" />
    <path d="M5 11 L19 11" strokeDasharray="1.5 1.5" />
    <path d="M5 15 L19 15" strokeDasharray="1.5 1.5" />
    <circle cx="6" cy="9" r="1" />
    <circle cx="18" cy="13" r="1" />
  </svg>
)

export const KorchevaniyeIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <ellipse cx="12" cy="10" rx="5" ry="1.5" />
    <path d="M7 10 L7 13" />
    <path d="M17 10 L17 13" />
    <path d="M7 13 C 9 14, 15 14, 17 13" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M6 16 C 5 17, 4 18, 3 19" />
    <path d="M9 16 L8 20" />
    <path d="M15 16 L16 20" />
    <path d="M18 16 C 19 17, 20 18, 21 19" />
  </svg>
)

export const KronirovaniyeIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M12 11 L12 21" />
    <path d="M9 21 L15 21" />
    <path d="M5 11 C 5 6, 19 6, 19 11" />
    <path d="M8 11 L8 13" />
    <path d="M12 11 L12 8" />
    <path d="M16 11 L16 13" />
    <path d="M3 4 L6 7" />
    <path d="M4 4 L6 4 L6 6" />
  </svg>
)

export const SanitarnayaIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M12 11 L12 21" />
    <path d="M9 21 L15 21" />
    <path d="M5 11 C 5 6, 19 6, 19 11" />
    <path d="M9 9 L11 11" strokeDasharray="1 1" />
    <path d="M15 9 L13 11" strokeDasharray="1 1" />
    <circle cx="9" cy="8" r="0.8" fill="currentColor" />
    <circle cx="15" cy="8" r="0.8" fill="currentColor" />
  </svg>
)

export const KablingIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M6 3 L6 21" />
    <path d="M18 3 L18 21" />
    <path d="M6 10 C 9 9, 15 9, 18 10" strokeDasharray="2 1.5" />
    <circle cx="6" cy="10" r="1.2" fill="currentColor" />
    <circle cx="18" cy="10" r="1.2" fill="currentColor" />
    <path d="M4 21 L8 21" />
    <path d="M16 21 L20 21" />
  </svg>
)

// ───── Крыши и территория ─────

export const UborkaSnegaIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 14 L12 6 L21 14" />
    <path d="M5 14 L5 20 L19 20 L19 14" />
    <circle cx="8" cy="4" r="0.8" fill="currentColor" />
    <path d="M8 3 L8 5" />
    <path d="M7 4 L9 4" />
    <circle cx="16" cy="4" r="0.8" fill="currentColor" />
    <path d="M16 3 L16 5" />
    <path d="M15 4 L17 4" />
  </svg>
)

export const VyvozSnegaIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <rect x="2" y="9" width="11" height="8" />
    <path d="M13 11 L18 11 L21 14 L21 17 L13 17 Z" />
    <circle cx="6" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
    <path d="M5 5 L7 7" />
    <path d="M9 5 L9 7" />
    <path d="M11 5 L13 7" />
  </svg>
)

export const ChistkaVodostokovIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M6 3 L18 3 L18 6 L6 6 Z" />
    <path d="M10 6 L10 18" />
    <path d="M14 6 L14 18" />
    <path d="M10 18 C 10 20, 14 20, 14 18" />
    <path d="M10 9 L14 9" strokeDasharray="1.5 1.5" />
    <path d="M10 13 L14 13" strokeDasharray="1.5 1.5" />
    <path d="M12 20 L12 22" />
    <path d="M11 21 L13 21" />
  </svg>
)

export const AlpinizmIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M4 3 L20 3" />
    <path d="M12 3 L12 18" />
    <circle cx="12" cy="10" r="2" />
    <path d="M10 13 L12 12 L14 13" />
    <path d="M10 16 L12 14 L14 16" />
    <path d="M9 19 L15 19" />
    <path d="M12 19 L12 21" />
  </svg>
)

export const AvtovyshkaIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M2 20 L22 20" />
    <path d="M4 20 L4 16 L10 16 L10 20" />
    <circle cx="6" cy="20" r="1.2" />
    <circle cx="8" cy="20" r="1.2" />
    <path d="M10 18 L15 13" />
    <path d="M15 13 L18 10" strokeDasharray="1.8 1.2" />
    <path d="M17 8 L21 8 L21 12 L17 12 Z" />
    <path d="M19 10 L19 8" />
  </svg>
)

export const PokosTravyIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 18 L21 18" />
    <path d="M5 18 L5 14" />
    <path d="M9 18 L9 12" />
    <path d="M13 18 L13 13" />
    <path d="M17 18 L17 14" />
    <path d="M3 14 L21 14" strokeDasharray="2 2" />
    <circle cx="20" cy="9" r="2" />
    <path d="M14 11 L18 9" />
  </svg>
)

// ───── Мусор и демонтаж ─────

export const VyvozBytovogoIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 8 L21 8" />
    <path d="M5 8 L5 19 L19 19 L19 8" />
    <circle cx="7.5" cy="20.5" r="1.4" />
    <circle cx="16.5" cy="20.5" r="1.4" />
    <path d="M9 14 L9 11" />
    <path d="M7.5 12.5 L9 11 L10.5 12.5" />
    <path d="M12 14 L12 11" />
    <path d="M10.5 12.5 L12 11 L13.5 12.5" />
    <path d="M15 14 L15 11" />
    <path d="M13.5 12.5 L15 11 L16.5 12.5" />
  </svg>
)

export const VyvozStroitelnogoIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 10 L21 10" />
    <path d="M5 10 L5 19 L19 19 L19 10" />
    <circle cx="7.5" cy="20.5" r="1.4" />
    <circle cx="16.5" cy="20.5" r="1.4" />
    <rect x="8" y="13" width="3" height="3" />
    <rect x="13" y="13" width="3" height="3" />
    <path d="M8 6 L16 6" />
    <path d="M9 4 L9 8" />
    <path d="M15 4 L15 8" />
  </svg>
)

export const KonteynerIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 7 L21 7 L19 21 L5 21 Z" />
    <path d="M8 11 L8 17" />
    <path d="M12 11 L12 17" />
    <path d="M16 11 L16 17" />
    <path d="M7 7 L9 3 L15 3 L17 7" />
  </svg>
)

export const DemontazhSaraevIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M4 11 L12 5 L20 11" />
    <path d="M6 11 L6 20 L18 20 L18 11" />
    <path d="M10 20 L10 14 L14 14 L14 20" />
    <path d="M3 4 L7 8" strokeWidth="2" />
    <path d="M5 2 L9 6" strokeWidth="2" />
    <path d="M6 7 L2 11 L5 14 L9 10" />
  </svg>
)

export const DemontazhPeregorodokIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 5 L21 5" />
    <path d="M3 21 L21 21" />
    <path d="M5 5 L5 21" />
    <path d="M19 5 L19 21" />
    <path d="M9 5 L9 13" strokeDasharray="2 1.5" />
    <path d="M14 9 L14 21" strokeDasharray="2 1.5" />
    <path d="M5 13 L21 13" strokeDasharray="2 1.5" />
    <path d="M11 7 L17 11" strokeWidth="2" />
  </svg>
)

export const RaschistkaIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...baseProps(size, p)} {...p}>
    <path d="M3 18 L21 18" />
    <path d="M5 18 L7 14 L11 14 L13 18" strokeDasharray="2 1.2" />
    <path d="M14 18 L16 12 L19 18" />
    <circle cx="9" cy="11" r="1" />
    <circle cx="6" cy="9" r="0.8" />
    <path d="M3 21 L21 21" />
    <path d="M5 6 L9 4" />
    <path d="M14 5 L18 7" />
  </svg>
)
