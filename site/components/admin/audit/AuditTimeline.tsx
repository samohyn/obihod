'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'

/**
 * AuditTimeline — client orchestrator для /admin/audit.
 *
 * Spec: PANEL-AUDIT-LOG AC1 + AC2 + AC9.
 * Brand-guide §11 list pattern + §12.4 states.
 */

interface AuditEntry {
  id: string
  source: 'audit_log' | 'version'
  collection: string
  docId: string | null
  docTitle: string | null
  userId: number | null
  userEmail: string | null
  action: string
  changedAt: string
  ip?: string | null
  affectedIds?: string[] | null
  metadata?: Record<string, unknown>
}

interface ListResponse {
  data: { entries: AuditEntry[]; nextCursor: string | null }
  took_ms: number
}

const COLLECTION_LABELS: Record<string, string> = {
  cases: 'Кейсы',
  blog: 'Блог',
  services: 'Услуги',
  'b2b-pages': 'B2B страницы',
  'service-districts': 'Услуга × Район',
  districts: 'Районы',
  authors: 'Авторы',
  leads: 'Заявки',
  users: 'Пользователи',
  media: 'Медиа',
  redirects: 'Редиректы',
  __auth: 'Вход / выход',
  __bulk: 'Массовые действия',
}

const ACTION_LABELS: Record<string, string> = {
  create: 'Создал',
  update: 'Изменил',
  delete: 'Удалил',
  publish: 'Опубликовал',
  unpublish: 'Снял с публикации',
  archive: 'Архивировал',
  login: 'Вошёл',
  logout: 'Вышел',
  login_failed: 'Неудачный вход',
  bulk_action: 'Массовое действие',
  rbac_change: 'Изменил роль',
}

const ACTION_COLORS: Record<string, string> = {
  create: 'rgba(45, 90, 61, 0.12)',
  update: 'rgba(160, 130, 50, 0.12)',
  delete: 'rgba(180, 60, 60, 0.14)',
  publish: 'rgba(45, 90, 61, 0.18)',
  login: 'rgba(80, 110, 180, 0.12)',
  logout: 'rgba(120, 120, 120, 0.12)',
  rbac_change: 'rgba(180, 60, 60, 0.14)',
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const filtersBarStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  padding: 16,
  background: '#fff',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-md, 10px)',
  alignItems: 'center',
}

const inputStyle: CSSProperties = {
  padding: '6px 10px',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 6,
  fontSize: 14,
  minWidth: 180,
}

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

const listStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-md, 10px)',
  overflow: 'hidden',
}

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 110px 1fr 180px',
  gap: 16,
  padding: '12px 16px',
  borderBottom: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'background-color 120ms',
  textDecoration: 'none',
  color: 'inherit',
}

const actionBadgeStyle = (action: string): CSSProperties => ({
  display: 'inline-block',
  padding: '3px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  background: ACTION_COLORS[action] ?? 'rgba(120, 120, 120, 0.12)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  whiteSpace: 'nowrap',
})

const collectionBadgeStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
  whiteSpace: 'nowrap',
}

const titleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const dateStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
  textAlign: 'right',
  whiteSpace: 'nowrap',
}

function relativeTime(iso: string): string {
  const ts = new Date(iso).getTime()
  const now = Date.now()
  const diffSec = Math.round((now - ts) / 1000)
  if (diffSec < 60) return `${diffSec} сек назад`
  if (diffSec < 3600) return `${Math.round(diffSec / 60)} мин назад`
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)} ч назад`
  return new Date(iso).toLocaleString('ru-RU')
}

const COLLECTIONS = [
  'cases',
  'blog',
  'services',
  'b2b-pages',
  'service-districts',
  'districts',
  'authors',
  'leads',
  'users',
  'media',
  'redirects',
  '__auth',
]

const ACTIONS = Object.keys(ACTION_LABELS)

export default function AuditTimeline() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filterCollections, setFilterCollections] = useState<string[]>([])
  const [filterActions, setFilterActions] = useState<string[]>([])
  const [filterQ, setFilterQ] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const buildQuery = useCallback(
    (cursor?: string | null) => {
      const params = new URLSearchParams()
      if (filterCollections.length > 0) params.set('collections', filterCollections.join(','))
      if (filterActions.length > 0) params.set('actions', filterActions.join(','))
      if (filterQ.trim()) params.set('q', filterQ.trim())
      if (filterFrom) params.set('from', new Date(filterFrom).toISOString())
      if (filterTo) params.set('to', new Date(filterTo).toISOString())
      if (cursor) params.set('cursor', cursor)
      return params.toString()
    },
    [filterCollections, filterActions, filterQ, filterFrom, filterTo],
  )

  const load = useCallback(
    async (reset: boolean) => {
      setLoading(true)
      setError(null)
      try {
        const cursor = reset ? null : nextCursor
        const url = `/api/admin/audit${buildQuery(cursor) ? '?' + buildQuery(cursor) : ''}`
        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) {
          if (res.status === 403) throw new Error('Доступ только для admin.')
          throw new Error(`HTTP ${res.status}`)
        }
        const json: ListResponse = await res.json()
        setEntries((prev) => (reset ? json.data.entries : [...prev, ...json.data.entries]))
        setNextCursor(json.data.nextCursor)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить историю.')
      } finally {
        setLoading(false)
      }
    },
    [buildQuery, nextCursor],
  )

  // Initial load + при смене filters.
  // setState через `load()` — это async fetch, не синхронный setState; eslint
  // плагин react-hooks/set-state-in-effect false-positive.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCollections, filterActions, filterQ, filterFrom, filterTo])

  const isEmpty = !loading && entries.length === 0 && !error

  const collectionMultiSelect = useMemo(
    () => (
      <select
        multiple
        value={filterCollections}
        onChange={(e) => {
          const opts = Array.from(e.currentTarget.selectedOptions).map((o) => o.value)
          setFilterCollections(opts)
        }}
        style={{ ...selectStyle, height: 100, minWidth: 200 }}
        aria-label="Фильтр по коллекции"
        data-testid="audit-filter-collections"
      >
        {COLLECTIONS.map((c) => (
          <option key={c} value={c}>
            {COLLECTION_LABELS[c] ?? c}
          </option>
        ))}
      </select>
    ),
    [filterCollections],
  )

  const actionMultiSelect = useMemo(
    () => (
      <select
        multiple
        value={filterActions}
        onChange={(e) => {
          const opts = Array.from(e.currentTarget.selectedOptions).map((o) => o.value)
          setFilterActions(opts)
        }}
        style={{ ...selectStyle, height: 100, minWidth: 180 }}
        aria-label="Фильтр по действию"
        data-testid="audit-filter-actions"
      >
        {ACTIONS.map((a) => (
          <option key={a} value={a}>
            {ACTION_LABELS[a] ?? a}
          </option>
        ))}
      </select>
    ),
    [filterActions],
  )

  return (
    <div style={containerStyle} data-testid="audit-timeline">
      <div style={filtersBarStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
            Коллекция
          </label>
          {collectionMultiSelect}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
            Действие
          </label>
          {actionMultiSelect}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
            Поиск
          </label>
          <input
            type="search"
            value={filterQ}
            onChange={(e) => setFilterQ(e.currentTarget.value)}
            placeholder="email, телефон, заголовок"
            style={inputStyle}
            aria-label="Поиск по истории"
            data-testid="audit-filter-q"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
            От
          </label>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.currentTarget.value)}
            style={inputStyle}
            aria-label="С даты"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
            До
          </label>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.currentTarget.value)}
            style={inputStyle}
            aria-label="По дату"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: 12,
            background: 'rgba(180, 60, 60, 0.06)',
            border: '1px solid rgba(180, 60, 60, 0.2)',
            borderRadius: 8,
            color: 'var(--brand-obihod-ink, #1c1c1c)',
            fontSize: 14,
          }}
        >
          Ошибка: {error}
        </div>
      )}

      <div style={listStyle} data-testid="audit-list">
        {entries.map((e) => (
          <Link
            key={e.id}
            href={`/admin/audit/${encodeURIComponent(e.id)}`}
            style={rowStyle}
            data-testid="audit-row"
          >
            <span style={actionBadgeStyle(e.action)}>{ACTION_LABELS[e.action] ?? e.action}</span>
            <span style={collectionBadgeStyle}>
              {COLLECTION_LABELS[e.collection] ?? e.collection}
            </span>
            <span style={titleStyle}>
              {e.docTitle ?? (e.docId ? `#${e.docId}` : '—')}
              {e.userEmail ? (
                <span style={{ color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
                  {' · '}
                  {e.userEmail}
                </span>
              ) : null}
            </span>
            <span style={dateStyle}>{relativeTime(e.changedAt)}</span>
          </Link>
        ))}

        {isEmpty && (
          <div
            style={{
              padding: 32,
              textAlign: 'center',
              color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
              fontSize: 14,
            }}
          >
            Записей нет.
          </div>
        )}
      </div>

      {nextCursor && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
          <button
            type="button"
            onClick={() => void load(false)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
              borderRadius: 6,
              background: '#fff',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: 14,
            }}
            data-testid="audit-load-more"
          >
            {loading ? 'Загружаю…' : 'Показать ещё'}
          </button>
        </div>
      )}

      {loading && entries.length === 0 && (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
            fontSize: 14,
          }}
        >
          Загружаю историю…
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
          textAlign: 'right',
        }}
      >
        PII (телефон, email) маскируются на записи. Сырых данных в журнале нет.
      </div>
    </div>
  )
}

export { COLLECTION_LABELS, ACTION_LABELS }
