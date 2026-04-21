import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number, defaultSize: number) => ({
  width: size || defaultSize,
  height: size || defaultSize,
})

export const Icon = {
  Tree: ({ size = 20, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 20)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <path d="M12 2 L5 11 L9 11 L4 18 L10 18 L10 22 L14 22 L14 18 L20 18 L15 11 L19 11 Z" />
    </svg>
  ),
  Snow: ({ size = 20, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 20)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      {...p}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
      <path d="M9 3 L12 5 L15 3" />
      <path d="M9 21 L12 19 L15 21" />
    </svg>
  ),
  Brick: ({ size = 20, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 20)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <rect x="3" y="5" width="18" height="14" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="9" y1="5" x2="9" y2="12" />
      <line x1="15" y1="5" x2="15" y2="12" />
      <line x1="6" y1="12" x2="6" y2="19" />
      <line x1="12" y1="12" x2="12" y2="19" />
      <line x1="18" y1="12" x2="18" y2="19" />
    </svg>
  ),
  Container: ({ size = 20, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 20)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <path d="M3 7 L21 7 L19 21 L5 21 Z" />
      <line x1="8" y1="11" x2="8" y2="17" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="16" y1="11" x2="16" y2="17" />
      <path d="M7 7 L9 3 L15 3 L17 7" />
    </svg>
  ),
  ArrowRight: ({ size = 20, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 20)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  ),
  Phone: ({ size = 18, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 18)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Plus: ({ size = 20, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 20)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      {...p}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: ({ size = 18, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 18)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Star: ({ size = 16, ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" {...base(size, 16)} fill="currentColor" aria-hidden="true" {...p}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Phone2: ({ size = 22, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 22)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  ),
  Clipboard: ({ size = 22, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 22)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <rect x="6" y="4" width="12" height="18" rx="1" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  ),
  Truck: ({ size = 22, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 22)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <rect x="2" y="7" width="12" height="10" />
      <path d="M14 10 L19 10 L22 13 L22 17 L14 17 Z" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  ),
  Camera: ({ size = 22, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 22)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <path d="M4 7 L8 7 L10 4 L14 4 L16 7 L20 7 L20 19 L4 19 Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  Hand: ({ size = 22, ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      {...base(size, 22)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      <path d="M7 11 L7 6 C7 5 7.5 4 9 4 C10.5 4 11 5 11 6 L11 11" />
      <path d="M11 11 L11 4.5 C11 3.5 11.5 2.5 13 2.5 C14.5 2.5 15 3.5 15 4.5 L15 11" />
      <path d="M15 11 L15 5 C15 4 15.5 3 17 3 C18.5 3 19 4 19 5 L19 13" />
      <path d="M7 11 L7 16 L4 13 L3 14 L4 18 C5 21 7 22 10 22 L14 22 C17 22 19 20 19 17 L19 11" />
    </svg>
  ),
}

export type IconName = keyof typeof Icon
