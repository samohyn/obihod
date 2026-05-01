'use client'

import type { CSSProperties } from 'react'

/**
 * MediaFilters — панель фильтров над grid.
 *
 * PANEL-MEDIA-LIBRARY · sa-panel.md AC3.
 *
 * Фильтры:
 *   - type: image / video / document (multi-select через chips)
 *   - uploaded_by: text input (id юзера; relationship picker — фаза 2)
 *   - uploaded_after: date input
 *   - orphaned: toggle
 *
 * Простота: chips + native inputs, без сторонних UI-libs. Соответствует
 * brand-guide §12.4 admin styling.
 */

export interface MediaFilters {
  type: ('image' | 'video' | 'application')[]
  uploadedBy: string
  uploadedAfter: string
  orphaned: boolean
}

interface Props {
  value: MediaFilters
  onChange: (patch: Partial<MediaFilters>) => void
}

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'flex-end',
  padding: 16,
  marginBottom: 24,
  background: 'var(--brand-obihod-paper, #f7f5f0)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
}

const groupStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const inputStyle: CSSProperties = {
  padding: '8px 12px',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  background: 'var(--brand-obihod-card, #fff)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  minHeight: 36,
}

const chipStyle = (active: boolean): CSSProperties => ({
  padding: '6px 12px',
  border: `1px solid ${active ? 'var(--brand-obihod-primary, #2d5a3d)' : 'var(--brand-obihod-line, #e6e1d6)'}`,
  borderRadius: 999,
  background: active ? 'var(--brand-obihod-primary, #2d5a3d)' : 'var(--brand-obihod-card, #fff)',
  color: active ? '#fff' : 'var(--brand-obihod-ink, #1c1c1c)',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
})

const toggleStyle = (active: boolean): CSSProperties => ({
  ...chipStyle(active),
  background: active ? 'var(--brand-obihod-danger, #b54828)' : 'var(--brand-obihod-card, #fff)',
  borderColor: active ? 'var(--brand-obihod-danger, #b54828)' : 'var(--brand-obihod-line, #e6e1d6)',
})

const TYPE_OPTIONS: { value: 'image' | 'video' | 'application'; label: string }[] = [
  { value: 'image', label: 'Изображения' },
  { value: 'video', label: 'Видео' },
  { value: 'application', label: 'Документы' },
]

export default function MediaFilters({ value, onChange }: Props) {
  const toggleType = (t: 'image' | 'video' | 'application') => {
    const current = value.type
    const next = current.includes(t) ? current.filter((x) => x !== t) : [...current, t]
    onChange({ type: next })
  }

  return (
    <div style={wrapStyle} data-testid="media-filters">
      <div style={groupStyle}>
        <span style={labelStyle}>Тип</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleType(opt.value)}
              style={chipStyle(value.type.includes(opt.value))}
              data-testid={`media-filter-type-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={groupStyle}>
        <label htmlFor="media-uploaded-after" style={labelStyle}>
          Загружено после
        </label>
        <input
          id="media-uploaded-after"
          type="date"
          value={value.uploadedAfter}
          onChange={(e) => onChange({ uploadedAfter: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label htmlFor="media-uploaded-by" style={labelStyle}>
          Автор (ID)
        </label>
        <input
          id="media-uploaded-by"
          type="text"
          inputMode="numeric"
          placeholder="user id"
          value={value.uploadedBy}
          onChange={(e) => onChange({ uploadedBy: e.target.value.replace(/\D/g, '') })}
          style={{ ...inputStyle, width: 100 }}
        />
      </div>

      <div style={groupStyle}>
        <span style={labelStyle}>Только мусор</span>
        <button
          type="button"
          onClick={() => onChange({ orphaned: !value.orphaned })}
          style={toggleStyle(value.orphaned)}
          aria-pressed={value.orphaned}
          data-testid="media-filter-orphaned"
        >
          {value.orphaned ? 'Только не используются' : 'Не используется?'}
        </button>
      </div>

      {(value.type.length > 0 ||
        value.uploadedBy ||
        value.uploadedAfter ||
        value.orphaned) && (
        <div style={groupStyle}>
          <span style={labelStyle}>&nbsp;</span>
          <button
            type="button"
            onClick={() =>
              onChange({ type: [], uploadedBy: '', uploadedAfter: '', orphaned: false })
            }
            style={{
              ...inputStyle,
              cursor: 'pointer',
              background: 'transparent',
              fontWeight: 500,
            }}
          >
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}
