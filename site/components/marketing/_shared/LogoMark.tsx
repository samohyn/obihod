type Props = { size?: number; animated?: boolean }

export function LogoMark({ size = 36, animated = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={animated ? 'circle-mark' : undefined}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <line x1="24" y1="2" x2="24" y2="46" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <line x1="2" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      {/* NW — хвоя */}
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <line x1="13" y1="8" x2="13" y2="20" />
        <line x1="13" y1="10" x2="9" y2="12" />
        <line x1="13" y1="10" x2="17" y2="12" />
        <line x1="13" y1="14" x2="9" y2="16" />
        <line x1="13" y1="14" x2="17" y2="16" />
        <line x1="13" y1="18" x2="10" y2="19.5" />
        <line x1="13" y1="18" x2="16" y2="19.5" />
      </g>
      {/* NE — снежинка */}
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
        <line x1="35" y1="8" x2="35" y2="20" />
        <line x1="29" y1="14" x2="41" y2="14" />
        <line x1="31" y1="10" x2="39" y2="18" />
        <line x1="39" y1="10" x2="31" y2="18" />
      </g>
      {/* SW — кирпич */}
      <g stroke="currentColor" strokeWidth="1.3" fill="none">
        <rect x="7" y="29" width="12" height="11" rx="0.5" />
        <line x1="7" y1="34.5" x2="19" y2="34.5" />
        <line x1="13" y1="29" x2="13" y2="34.5" />
        <line x1="10" y1="34.5" x2="10" y2="40" />
        <line x1="16" y1="34.5" x2="16" y2="40" />
      </g>
      {/* SE — контейнер/стрелка */}
      <g
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M29 30 L29 40 L41 40 L41 30" />
        <path d="M27 30 L43 30" />
        <path d="M33 33 L33 37 M37 33 L37 37" />
      </g>
    </svg>
  )
}
