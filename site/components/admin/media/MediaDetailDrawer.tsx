'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import type { MediaDoc } from './MediaCard'

/**
 * MediaDetailDrawer — sliding panel с деталями media + actions.
 *
 * PANEL-MEDIA-LIBRARY · sa-panel.md AC4.
 *
 * Содержание:
 *   - Большое preview (640px max width)
 *   - Метаданные: filename, mime, size, dimensions, alt
 *   - «Used-in» список — fetch к `/api/admin/media/usage/<id>` (фаза 2),
 *     MVP показывает только orphan-флаг (если orphan — CTA «Удалить»).
 *   - Actions: Скачать, Удалить (с inline-confirm), Закрыть
 *
 * Реализация: client-side fetch к Payload REST `/api/media/<id>?depth=1` для
 * полного doc state (включая sizes URL-ов для preview). Already passed `doc`
 * — fallback initial state.
 *
 * Esc / overlay-click закрывает.
 */

interface UsageRef {
  collection: string
  collectionLabel: string
  id: string | number
  title: string
  field: string
}

interface Props {
  doc: MediaDoc
  isOrphan: boolean
  onClose: () => void
  onDelete: (() => Promise<void>) | null
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  zIndex: 150,
}

const drawerStyle: CSSProperties = {
  width: 'min(680px, 100vw)',
  height: '100vh',
  background: 'var(--brand-obihod-card, #fff)',
  borderLeft: '1px solid var(--brand-obihod-line, #e6e1d6)',
  padding: 24,
  overflowY: 'auto',
  boxShadow: '-12px 0 32px rgba(0, 0, 0, 0.12)',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  gap: 12,
}

const closeButtonStyle: CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  width: 36,
  height: 36,
  cursor: 'pointer',
  fontSize: 18,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const previewWrapStyle: CSSProperties = {
  width: '100%',
  maxHeight: 360,
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,
}

const previewImgStyle: CSSProperties = {
  maxWidth: '100%',
  maxHeight: 360,
  display: 'block',
}

const metaListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  gap: '8px 16px',
  fontSize: 13,
  marginBottom: 24,
}

const metaLabelStyle: CSSProperties = {
  color: 'var(--brand-obihod-muted, #6b6256)',
  fontWeight: 500,
}

const metaValueStyle: CSSProperties = {
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  wordBreak: 'break-all',
}

const usageBadgeOrphanStyle: CSSProperties = {
  display: 'inline-block',
  padding: '6px 12px',
  background: 'rgba(181, 72, 40, 0.12)',
  color: 'var(--brand-obihod-danger, #b54828)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 16,
}

const usageItemStyle: CSSProperties = {
  padding: '8px 12px',
  background: 'var(--brand-obihod-paper, #f7f5f0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontSize: 13,
  marginBottom: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
}

const linkStyle: CSSProperties = {
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  textDecoration: 'none',
  fontWeight: 500,
}

const actionsRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 24,
  paddingTop: 24,
  borderTop: '1px solid var(--brand-obihod-line, #e6e1d6)',
  flexWrap: 'wrap',
}

const buttonPrimary: CSSProperties = {
  padding: '10px 16px',
  background: 'var(--brand-obihod-accent, #e6a23c)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  border: 'none',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
}

const buttonDanger: CSSProperties = {
  ...buttonPrimary,
  background: 'var(--brand-obihod-danger, #b54828)',
  color: '#fff',
}

const buttonSecondary: CSSProperties = {
  ...buttonPrimary,
  background: 'transparent',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
}

function formatBytes(bytes?: number | null): string {
  if (!bytes && bytes !== 0) return '—'
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function isImage(mime?: string | null): boolean {
  return Boolean(mime && mime.startsWith('image/'))
}

function getPreviewUrl(doc: MediaDoc): string | null {
  // Prefer hero/og size, fallback на оригинал.
  return doc.sizes?.hero?.url ?? doc.sizes?.card?.url ?? doc.url ?? null
}

export default function MediaDetailDrawer({ doc, isOrphan, onClose, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [usage, setUsage] = useState<UsageRef[] | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Fetch detailed usage через тот же orphans endpoint в includeUsage режиме
  // (AC4 «Used-in» список). Если запрос упал — оставляем `usage: null`,
  // компонент покажет fallback (orphan badge или simple «Используется»).
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/admin/media/orphans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: [String(doc.id)], includeUsage: true }),
          credentials: 'include',
        })
        if (cancelled) return
        if (!res.ok) {
          setUsage(null)
          setUsageLoading(false)
          return
        }
        const data = (await res.json()) as { usage?: Record<string, UsageRef[]> }
        if (cancelled) return
        setUsage(data.usage?.[String(doc.id)] ?? [])
      } catch {
        if (!cancelled) setUsage(null)
      } finally {
        if (!cancelled) setUsageLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // React 19 fetch-then-setState pattern, см. MediaGrid.tsx комментарий.
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [doc.id])

  const previewUrl = isImage(doc.mimeType) ? getPreviewUrl(doc) : null
  const filename = doc.filename ?? `media-${doc.id}`

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
      role="presentation"
      data-testid="media-detail-drawer"
    >
      <aside
        style={drawerStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-detail-title"
      >
        <header style={headerStyle}>
          <h2
            id="media-detail-title"
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              wordBreak: 'break-all',
            }}
          >
            {filename}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div style={previewWrapStyle}>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={doc.alt ?? filename} style={previewImgStyle} />
          ) : (
            <div
              style={{
                padding: 60,
                color: 'var(--brand-obihod-muted, #6b6256)',
                fontSize: 14,
              }}
            >
              Превью недоступно — {doc.mimeType ?? 'неизвестный формат'}
            </div>
          )}
        </div>

        <dl style={metaListStyle}>
          <dt style={metaLabelStyle}>Тип</dt>
          <dd style={metaValueStyle}>{doc.mimeType ?? '—'}</dd>

          <dt style={metaLabelStyle}>Размер</dt>
          <dd style={metaValueStyle}>{formatBytes(doc.filesize)}</dd>

          {doc.width && doc.height && (
            <>
              <dt style={metaLabelStyle}>Размеры</dt>
              <dd style={metaValueStyle}>
                {doc.width} × {doc.height} px
              </dd>
            </>
          )}

          <dt style={metaLabelStyle}>Загружено</dt>
          <dd style={metaValueStyle}>
            {new Date(doc.createdAt).toLocaleString('ru-RU', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </dd>

          {doc.alt && (
            <>
              <dt style={metaLabelStyle}>Alt</dt>
              <dd style={metaValueStyle}>{doc.alt}</dd>
            </>
          )}
        </dl>

        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--brand-obihod-muted, #6b6256)',
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          Где используется
        </h3>

        {isOrphan && (
          <span style={usageBadgeOrphanStyle} data-testid="media-detail-orphan-badge">
            Не используется
          </span>
        )}

        {usageLoading ? (
          <p style={{ fontSize: 13, color: 'var(--brand-obihod-muted, #6b6256)', margin: 0 }}>
            Проверяем ссылки…
          </p>
        ) : usage && usage.length > 0 ? (
          <div>
            {usage.map((ref) => (
              <div key={`${ref.collection}-${ref.id}-${ref.field}`} style={usageItemStyle}>
                <span>
                  <strong>{ref.collectionLabel}</strong> — {ref.title}{' '}
                  <span style={{ color: 'var(--brand-obihod-muted, #6b6256)' }}>
                    · {ref.field}
                  </span>
                </span>
                <a
                  href={`/admin/collections/${ref.collection}/${ref.id}`}
                  style={linkStyle}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть →
                </a>
              </div>
            ))}
          </div>
        ) : !isOrphan ? (
          <p style={{ fontSize: 13, color: 'var(--brand-obihod-muted, #6b6256)', margin: 0 }}>
            Используется минимум в одном документе.
          </p>
        ) : null}

        <div style={actionsRowStyle}>
          {doc.url && (
            <a
              href={doc.url}
              download={filename}
              style={buttonSecondary}
              target="_blank"
              rel="noreferrer"
            >
              Скачать
            </a>
          )}
          <a href={`/admin/collections/media/${doc.id}`} style={buttonSecondary}>
            Редактировать
          </a>
          {onDelete && (
            <>
              {confirmDelete ? (
                <>
                  <button type="button" onClick={() => setConfirmDelete(false)} style={buttonSecondary}>
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    style={buttonDanger}
                    data-testid="media-detail-confirm-delete"
                  >
                    Точно удалить
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  style={isOrphan ? buttonDanger : buttonSecondary}
                  data-testid="media-detail-delete"
                >
                  Удалить
                </button>
              )}
            </>
          )}
          <button type="button" onClick={onClose} style={{ ...buttonPrimary, marginLeft: 'auto' }}>
            Закрыть
          </button>
        </div>
      </aside>
    </div>
  )
}
