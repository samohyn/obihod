'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import MediaCard, { type MediaDoc } from './MediaCard'
import MediaFilters, { type MediaFilters as Filters } from './MediaFilters'
import MediaDetailDrawer from './MediaDetailDrawer'

/**
 * MediaGrid — client-side grid view для коллекции `media`.
 *
 * PANEL-MEDIA-LIBRARY · sa-panel.md AC1-AC5.
 *
 * Состояние:
 *   - `filters` — { type, uploadedBy, uploadedAfter, orphaned, page }
 *   - `docs` — текущая страница media из `/api/media` (REST)
 *   - `orphanIds` — Set<string> id'шек, помеченных server-side как orphan
 *     (для badge + filter `orphaned: true` фильтрации)
 *   - `selectedIds` — Set<string> для bulk-cleanup
 *   - `drawerId` — id открытой карточки (detail view)
 *
 * Data flow:
 *   1. Fetch `/api/media?where[mimeType][...] &page=N&limit=50` — грузим
 *      страницу docs (фильтры по type через mimeType regex)
 *   2. Если filter `orphaned: true` ИЛИ есть docs → POST `/api/admin/media/
 *      orphans` body { ids: docs.map(d => d.id) } → `orphanIds` Set
 *   3. Render cards с badge на orphanIds
 *
 * Bulk cleanup:
 *   - Кнопка «Удалить N» активна когда selectedIds.size > 0
 *   - Confirmation modal → DELETE `/api/media/<id>` за каждый id
 *     (Payload REST поддерживает только single delete)
 *   - 409 от race-guard hook → показываем error в toast и пропускаем id
 *   - Refresh list после bulk
 */

const PAGE_LIMIT = 50

const containerStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 16,
  marginBottom: 24,
}

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  margin: 0,
}

const headerActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  alignItems: 'center',
}

const buttonPrimary: React.CSSProperties = {
  padding: '10px 16px',
  background: 'var(--brand-obihod-accent, #e6a23c)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  border: '1px solid var(--brand-obihod-accent, #e6a23c)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontWeight: 600,
  fontSize: 13,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  minHeight: 40,
}

const buttonDanger: React.CSSProperties = {
  ...buttonPrimary,
  background: 'var(--brand-obihod-danger, #b54828)',
  borderColor: 'var(--brand-obihod-danger, #b54828)',
  color: '#fff',
}

const buttonDisabled: React.CSSProperties = {
  ...buttonPrimary,
  background: 'var(--brand-obihod-line, #e6e1d6)',
  borderColor: 'var(--brand-obihod-line, #e6e1d6)',
  color: 'var(--brand-obihod-disabled-text, #b8b0a4)',
  cursor: 'not-allowed',
  opacity: 0.7,
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 16,
}

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 24px',
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  marginTop: 32,
  fontSize: 13,
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const toastErrorStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  padding: '12px 16px',
  background: 'var(--brand-obihod-danger, #b54828)',
  color: '#fff',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontSize: 13,
  maxWidth: 360,
  zIndex: 100,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
}

const modalCardStyle: React.CSSProperties = {
  background: 'var(--brand-obihod-card, #fff)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  padding: 24,
  maxWidth: 440,
  width: '90%',
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
}

interface Props {
  collectionSlug: string
  hasCreatePermission: boolean
  hasDeletePermission: boolean
  newDocumentURL: string
  listLabel: string
}

interface MediaApiResponse {
  docs: MediaDoc[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function buildMediaQuery(filters: Filters, page: number): string {
  const params = new URLSearchParams()
  params.set('limit', String(PAGE_LIMIT))
  params.set('page', String(page))
  params.set('sort', '-createdAt')
  params.set('depth', '0')

  // Type filter — Payload `mimeType` подходит для regex/like.
  if (filters.type && filters.type.length > 0) {
    // Multiple types: where[or][0][mimeType][like]=image
    filters.type.forEach((t, idx) => {
      params.set(`where[or][${idx}][mimeType][like]`, t)
    })
  }
  if (filters.uploadedBy) {
    params.set('where[uploadedBy][equals]', filters.uploadedBy)
  }
  if (filters.uploadedAfter) {
    params.set('where[createdAt][greater_than_equal]', filters.uploadedAfter)
  }
  return params.toString()
}

export default function MediaGrid({
  hasCreatePermission,
  hasDeletePermission,
  newDocumentURL,
  listLabel,
}: Props) {
  const [filters, setFilters] = useState<Filters>({
    type: [],
    uploadedBy: '',
    uploadedAfter: '',
    orphaned: false,
  })
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<MediaDoc[]>([])
  const [meta, setMeta] = useState<{ totalDocs: number; totalPages: number } | null>(null)
  const [orphanIds, setOrphanIds] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerId, setDrawerId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const queryString = useMemo(() => buildMediaQuery(filters, page), [filters, page])

  const fetchOrphans = useCallback(async (ids: string[]): Promise<Set<string>> => {
    if (ids.length === 0) return new Set()
    try {
      const res = await fetch('/api/admin/media/orphans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        credentials: 'include',
      })
      if (!res.ok) return new Set()
      const data = (await res.json()) as { orphans: string[] }
      return new Set(data.orphans.map(String))
    } catch {
      return new Set()
    }
  }, [])

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/media?${queryString}`, { credentials: 'include' })
      if (!res.ok) {
        setError(`Не удалось загрузить медиа (HTTP ${res.status}).`)
        setDocs([])
        setMeta(null)
        return
      }
      const data = (await res.json()) as MediaApiResponse
      const ids = data.docs.map((d) => String(d.id))
      const orphans = await fetchOrphans(ids)
      setDocs(data.docs)
      setMeta({ totalDocs: data.totalDocs, totalPages: data.totalPages })
      setOrphanIds(orphans)
      setSelectedIds(new Set())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
      setDocs([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [queryString, fetchOrphans])

  // React 19 flags синхронный setState в useEffect (`react-hooks/set-state-in-effect`).
  // Здесь эффект — fetch external data → setState внутри async callback. Это
  // легитимный data-fetching паттерн (а не sync state-derive), поэтому
  // подавляем правило для строки. Альтернатива (Suspense + use()) переписывает
  // компонент в RSC, что несовместимо с client-side filter state.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (cancelled) return
      await reload()
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [reload])

  // Filtered view: если orphaned: true — показываем только orphan docs.
  const visibleDocs = useMemo(() => {
    if (!filters.orphaned) return docs
    return docs.filter((d) => orphanIds.has(String(d.id)))
  }, [docs, orphanIds, filters.orphaned])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAllOrphans = useCallback(() => {
    setSelectedIds(new Set(Array.from(orphanIds)))
  }, [orphanIds])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return
    setDeleting(true)
    setError(null)
    const ids = Array.from(selectedIds)
    const failed: string[] = []
    for (const id of ids) {
      try {
        const res = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (!res.ok) failed.push(id)
      } catch {
        failed.push(id)
      }
    }
    setDeleting(false)
    setConfirmOpen(false)
    if (failed.length > 0) {
      setError(
        `Удалено ${ids.length - failed.length} из ${ids.length}. ${failed.length} файлов сейчас используются — обновите фильтр.`,
      )
    }
    await reload()
  }, [selectedIds, reload])

  const handleSingleDelete = useCallback(
    async (id: string) => {
      setError(null)
      try {
        const res = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (!res.ok) {
          setError('Не удалось удалить файл — возможно, он используется в документе.')
          return
        }
        setDrawerId(null)
        await reload()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось удалить файл.')
      }
    },
    [reload],
  )

  const updateFilters = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }, [])

  const drawerDoc = drawerId ? docs.find((d) => String(d.id) === drawerId) ?? null : null

  return (
    <div style={containerStyle} data-testid="media-library">
      <header style={headerStyle}>
        <h1 style={titleStyle}>{listLabel}</h1>
        <div style={headerActionsStyle}>
          {selectedIds.size > 0 && hasDeletePermission && (
            <>
              <span
                style={{ fontSize: 13, color: 'var(--brand-obihod-muted, #6b6256)' }}
                data-testid="media-selected-count"
              >
                Выбрано: {selectedIds.size}
              </span>
              <button
                type="button"
                onClick={clearSelection}
                style={{
                  ...buttonPrimary,
                  background: 'transparent',
                  borderColor: 'var(--brand-obihod-line, #e6e1d6)',
                  color: 'var(--brand-obihod-ink, #1c1c1c)',
                }}
              >
                Сбросить
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                style={deleting ? buttonDisabled : buttonDanger}
                data-testid="media-bulk-delete"
              >
                Удалить {selectedIds.size}
              </button>
            </>
          )}
          {filters.orphaned && orphanIds.size > 0 && selectedIds.size === 0 && (
            <button
              type="button"
              onClick={selectAllOrphans}
              style={buttonPrimary}
              data-testid="media-select-all-orphans"
            >
              Выбрать все ({orphanIds.size})
            </button>
          )}
          {hasCreatePermission && (
            <a href={newDocumentURL} style={buttonPrimary}>
              + Загрузить
            </a>
          )}
        </div>
      </header>

      <MediaFilters value={filters} onChange={updateFilters} />

      {loading ? (
        <div style={emptyStyle}>Загружаем медиа…</div>
      ) : visibleDocs.length === 0 ? (
        <div style={emptyStyle} data-testid="media-empty">
          {filters.orphaned
            ? 'Нет неиспользуемых файлов — порядок.'
            : meta?.totalDocs === 0
              ? 'Медиа-библиотека пуста. Загрузите первый файл.'
              : 'По выбранным фильтрам ничего не нашли.'}
        </div>
      ) : (
        <div style={gridStyle} data-testid="media-grid">
          {visibleDocs.map((doc) => (
            <MediaCard
              key={doc.id}
              doc={doc}
              isOrphan={orphanIds.has(String(doc.id))}
              isSelected={selectedIds.has(String(doc.id))}
              onToggleSelect={() => toggleSelect(String(doc.id))}
              onOpen={() => setDrawerId(String(doc.id))}
              hasDeletePermission={hasDeletePermission}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={page <= 1 ? buttonDisabled : buttonPrimary}
          >
            ←
          </button>
          <span>
            Стр. {page} из {meta.totalPages} · Всего: {meta.totalDocs}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            style={page >= meta.totalPages ? buttonDisabled : buttonPrimary}
          >
            →
          </button>
        </div>
      )}

      {drawerDoc && (
        <MediaDetailDrawer
          doc={drawerDoc}
          isOrphan={orphanIds.has(String(drawerDoc.id))}
          onClose={() => setDrawerId(null)}
          onDelete={hasDeletePermission ? () => handleSingleDelete(String(drawerDoc.id)) : null}
        />
      )}

      {confirmOpen && (
        <div
          style={modalOverlayStyle}
          onClick={() => !deleting && setConfirmOpen(false)}
          role="presentation"
        >
          <div
            style={modalCardStyle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-bulk-confirm-title"
          >
            <h2 id="media-bulk-confirm-title" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              Удалить {selectedIds.size}{' '}
              {selectedIds.size === 1 ? 'файл' : selectedIds.size < 5 ? 'файла' : 'файлов'}?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'var(--brand-obihod-muted, #6b6256)',
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              Действие необратимо. Файлы будут удалены из базы и из хранилища. Если файл уже
              используется — операция отменится для него отдельно.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                style={{
                  ...buttonPrimary,
                  background: 'transparent',
                  color: 'var(--brand-obihod-ink, #1c1c1c)',
                  borderColor: 'var(--brand-obihod-line, #e6e1d6)',
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={deleting}
                style={deleting ? buttonDisabled : buttonDanger}
                data-testid="media-bulk-confirm"
              >
                {deleting ? 'Удаляем…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={toastErrorStyle} role="alert" data-testid="media-error-toast">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            style={{
              marginLeft: 12,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 16,
            }}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
