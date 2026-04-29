import type { CSSProperties, FC } from 'react'

/**
 * SkeletonForm — loading skeleton для edit-views (Wave 5 · PAN-4 part 3).
 *
 * Используется как `admin.components.views.edit.Loading` в CollectionConfig
 * через тонкий wrapper. Pulse animation в custom.scss + reduced-motion.
 */

interface SkeletonFormProps {
  fields?: number
}

const wrapStyle: CSSProperties = {
  padding: '32px',
  fontFamily: 'var(--font-body)',
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  margin: '24px auto',
  maxWidth: 720,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const labelBarStyle: CSSProperties = {
  height: 11,
  width: '20%',
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
}

const inputBarStyle: CSSProperties = {
  height: 38,
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
}

const SkeletonForm: FC<SkeletonFormProps> = ({ fields = 5 }) => {
  const arr = Array.from({ length: fields })
  return (
    <section
      style={wrapStyle}
      aria-busy="true"
      aria-label="Загрузка формы"
      className="brand-skeleton"
    >
      {arr.map((_, i) => (
        <div key={i} style={fieldStyle}>
          <div className="brand-skeleton__bar" style={labelBarStyle} />
          <div className="brand-skeleton__bar" style={inputBarStyle} />
        </div>
      ))}
    </section>
  )
}

export default SkeletonForm
