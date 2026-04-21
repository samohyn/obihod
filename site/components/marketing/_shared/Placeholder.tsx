type Props = {
  label: string
  aspect?: string
}

/**
 * Полосатый SVG-плейсхолдер для будущих фото объектов.
 * Мы оставляем его в MVP, пока нет реальных фото кейсов из Payload Media.
 */
export function Placeholder({ label, aspect = '4/3' }: Props) {
  return (
    <div
      className="ph"
      style={{
        aspectRatio: aspect,
        width: '100%',
        height: aspect === 'fill' ? '100%' : undefined,
        borderRadius: 'inherit',
      }}
      role="img"
      aria-label={label}
    >
      <span>{label}</span>
    </div>
  )
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="review-avatar"
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--c-bg-alt)',
        color: 'var(--c-primary)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '16px',
      }}
    >
      {initials}
    </div>
  )
}
