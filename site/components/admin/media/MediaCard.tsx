'use client'

import type { CSSProperties } from 'react'

/**
 * MediaCard — единичная карточка в grid view.
 *
 * PANEL-MEDIA-LIBRARY · sa-panel.md AC2.
 *
 * Отображение:
 *   - image → thumbnail (Payload `imageSizes.thumb` 320×240, fallback на url)
 *   - non-image → universal file icon (49-glyph набор §9 не имеет file-icon
 *     в текущей версии, поэтому используем generic SVG; обновится при
 *     поставке от art через cpo)
 *   - caption: filename (truncate 1 line) + size + uploaded ago
 *   - hover: overlay с «Открыть» + (опционально) «Удалить» actions
 *   - orphan: badge правый-верх угол, brand-danger
 *   - selected: визуальный border + checkbox indicator
 */

export interface MediaDoc {
  id: string | number
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  alt?: string | null
  url?: string | null
  thumbnailURL?: string | null
  createdAt: string
  sizes?: Record<string, { url?: string | null; width?: number; height?: number }>
}

interface Props {
  doc: MediaDoc
  isOrphan: boolean
  isSelected: boolean
  hasDeletePermission: boolean
  onToggleSelect: () => void
  onOpen: () => void
}

const cardStyle = (isSelected: boolean): CSSProperties => ({
  position: 'relative',
  background: 'var(--brand-obihod-card, #fff)',
  border: `1px solid ${isSelected ? 'var(--brand-obihod-primary, #2d5a3d)' : 'var(--brand-obihod-line, #e6e1d6)'}`,
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'border-color var(--brand-obihod-duration-base, 200ms) ease',
  outline: 'none',
})

const thumbWrapStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  paddingTop: '75%' /* 4:3 aspect ratio */,
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  overflow: 'hidden',
}

const thumbImgStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}

const thumbIconStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const captionStyle: CSSProperties = {
  padding: 12,
  fontSize: 13,
  lineHeight: 1.4,
}

const filenameStyle: CSSProperties = {
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const metaStyle: CSSProperties = {
  marginTop: 4,
  fontSize: 11,
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const orphanBadgeStyle: CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  padding: '4px 8px',
  background: 'var(--brand-obihod-danger, #b54828)',
  color: '#fff',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  zIndex: 2,
}

const checkboxStyle: CSSProperties = {
  position: 'absolute',
  top: 8,
  left: 8,
  width: 22,
  height: 22,
  cursor: 'pointer',
  zIndex: 2,
  margin: 0,
  accentColor: 'var(--brand-obihod-primary, #2d5a3d)',
}

function formatBytes(bytes?: number | null): string {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function timeAgo(isoString: string): string {
  const then = new Date(isoString).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.floor((Date.now() - then) / 1000)
  if (seconds < 60) return 'только что'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} мин назад`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ч назад`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} дн назад`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} мес назад`
  return `${Math.floor(months / 12)} г назад`
}

function isImage(mime?: string | null): boolean {
  return Boolean(mime && mime.startsWith('image/'))
}

function getThumbUrl(doc: MediaDoc): string | null {
  // priority: thumb size → thumbnailURL → url
  if (doc.sizes?.thumb?.url) return doc.sizes.thumb.url
  if (doc.thumbnailURL) return doc.thumbnailURL
  return doc.url ?? null
}

const FileIcon = ({ mime }: { mime?: string | null }) => {
  // Универсальная иконка для не-image файлов (PDF / video / docx / etc.).
  // §9 line-art набор пока не содержит generic file-icon, поэтому используем
  // нейтральный SVG в brand-стиле (тонкая обводка, currentColor).
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 8 L34 8 L44 18 L44 48 L14 48 Z" />
      <path d="M34 8 L34 18 L44 18" />
      {mime?.startsWith('video/') && <polygon points="22,28 22,40 34,34" fill="currentColor" />}
      {mime?.includes('pdf') && (
        <text
          x="28"
          y="40"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="currentColor"
          stroke="none"
        >
          PDF
        </text>
      )}
    </svg>
  )
}

export default function MediaCard({
  doc,
  isOrphan,
  isSelected,
  hasDeletePermission,
  onToggleSelect,
  onOpen,
}: Props) {
  const thumb = isImage(doc.mimeType) ? getThumbUrl(doc) : null
  const filename = doc.filename ?? `media-${doc.id}`

  return (
    <div
      style={cardStyle(isSelected)}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Открыть ${filename}`}
      data-testid="media-card"
      data-orphan={isOrphan ? 'true' : 'false'}
    >
      {hasDeletePermission && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          style={checkboxStyle}
          aria-label={`Выбрать ${filename}`}
        />
      )}
      {isOrphan && (
        <span style={orphanBadgeStyle} data-testid="media-orphan-badge">
          Не используется
        </span>
      )}
      <div style={thumbWrapStyle}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={doc.alt ?? filename} style={thumbImgStyle} loading="lazy" />
        ) : (
          <div style={thumbIconStyle}>
            <FileIcon mime={doc.mimeType} />
          </div>
        )}
      </div>
      <div style={captionStyle}>
        <div style={filenameStyle} title={filename}>
          {filename}
        </div>
        <div style={metaStyle}>
          {formatBytes(doc.filesize)}
          {doc.filesize ? ' · ' : ''}
          {timeAgo(doc.createdAt)}
        </div>
      </div>
    </div>
  )
}
