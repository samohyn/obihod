'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { ACTION_LABELS, COLLECTION_LABELS } from './AuditTimeline'

/**
 * AuditDiffPanel — client side diff renderer.
 *
 * Spec: PANEL-AUDIT-LOG AC3.
 * Side-by-side panels (before / after), changed fields highlighted:
 *   - added (in after, missing in before) → green tint
 *   - removed (in before, missing in after) → red tint
 *   - changed → yellow tint
 *
 * PII масштабирование уже применено сервером (write-time). Render только
 * визуализирует diff — никакого decoded PII здесь нет.
 */

interface DiffPayload {
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
}

interface EntryPayload {
  id: string
  source: 'audit_log' | 'version'
  collection: string
  docId: string | null
  docTitle: string | null
  userEmail: string | null
  action: string
  changedAt: string
  ip?: string | null
  metadata?: Record<string, unknown>
}

interface ApiResponse {
  data: { entry: EntryPayload; diff: DiffPayload }
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const headerStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-md, 10px)',
  padding: 16,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 12,
}

const headerCellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const labelStyle: CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
}

const valueStyle: CSSProperties = {
  fontSize: 14,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  fontWeight: 500,
}

const sideBySideStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
}

const panelStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-md, 10px)',
  padding: 16,
}

const fieldRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  gap: 8,
  padding: '6px 8px',
  borderBottom: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  fontSize: 13,
  alignItems: 'baseline',
}

const fieldNameStyle: CSSProperties = {
  fontWeight: 500,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  wordBreak: 'break-all',
}

const fieldValueStyle: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace)',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const HIDDEN_FIELDS = new Set(['id', 'createdAt', 'updatedAt', '_status', 'hash', 'salt'])

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'string') return v.length > 240 ? v.slice(0, 240) + '…' : v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  try {
    const json = JSON.stringify(v, null, 2)
    return json.length > 600 ? json.slice(0, 600) + '…' : json
  } catch {
    return String(v)
  }
}

function fieldDiffColor(field: string, beforeVal: unknown, afterVal: unknown): string | undefined {
  const inBefore = beforeVal !== undefined && beforeVal !== null
  const inAfter = afterVal !== undefined && afterVal !== null
  if (!inBefore && inAfter) return 'rgba(45, 90, 61, 0.10)' // added
  if (inBefore && !inAfter) return 'rgba(180, 60, 60, 0.10)' // removed
  if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
    return 'rgba(160, 130, 50, 0.10)' // changed
  }
  return undefined
}

function getId(): string {
  if (typeof window === 'undefined') return ''
  const segs = window.location.pathname.split('/').filter(Boolean)
  // /admin/audit/<id> → id at index 2
  return decodeURIComponent(segs[2] ?? '')
}

export default function AuditDiffPanel() {
  const [data, setData] = useState<ApiResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initial fetch одноразовый. setError/setLoading в no-id branch — синхронные;
  // eslint react-hooks/set-state-in-effect формально trip'ает, но это валидный
  // mount-time guard pattern.
  useEffect(() => {
    const id = getId()
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('id не передан')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }
    fetch(`/api/admin/audit/${encodeURIComponent(id)}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Запись не найдена.')
          if (res.status === 403) throw new Error('Доступ только для admin.')
          throw new Error(`HTTP ${res.status}`)
        }
        const json: ApiResponse = await res.json()
        setData(json.data)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p style={{ color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>Загружаю…</p>
  }
  if (error || !data) {
    return (
      <div
        role="alert"
        style={{
          padding: 16,
          background: 'rgba(180, 60, 60, 0.06)',
          border: '1px solid rgba(180, 60, 60, 0.2)',
          borderRadius: 8,
          color: 'var(--brand-obihod-ink, #1c1c1c)',
        }}
      >
        {error ?? 'Не удалось загрузить.'}
      </div>
    )
  }

  const { entry, diff } = data
  const beforeFields = Object.keys(diff.before ?? {}).filter((f) => !HIDDEN_FIELDS.has(f))
  const afterFields = Object.keys(diff.after ?? {}).filter((f) => !HIDDEN_FIELDS.has(f))
  const allFields = Array.from(new Set([...beforeFields, ...afterFields])).sort()

  return (
    <div style={containerStyle} data-testid="audit-diff">
      <div style={headerStyle}>
        <div style={headerCellStyle}>
          <span style={labelStyle}>Действие</span>
          <span style={valueStyle}>{ACTION_LABELS[entry.action] ?? entry.action}</span>
        </div>
        <div style={headerCellStyle}>
          <span style={labelStyle}>Коллекция</span>
          <span style={valueStyle}>{COLLECTION_LABELS[entry.collection] ?? entry.collection}</span>
        </div>
        <div style={headerCellStyle}>
          <span style={labelStyle}>Документ</span>
          <span style={valueStyle}>{entry.docTitle ?? entry.docId ?? '—'}</span>
        </div>
        <div style={headerCellStyle}>
          <span style={labelStyle}>Кто</span>
          <span style={valueStyle}>{entry.userEmail ?? '—'}</span>
        </div>
        <div style={headerCellStyle}>
          <span style={labelStyle}>Когда</span>
          <span style={valueStyle}>{new Date(entry.changedAt).toLocaleString('ru-RU')}</span>
        </div>
        {entry.ip && (
          <div style={headerCellStyle}>
            <span style={labelStyle}>IP</span>
            <span style={valueStyle}>{entry.ip}</span>
          </div>
        )}
      </div>

      <div style={sideBySideStyle}>
        <div style={panelStyle}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
              marginBottom: 12,
              color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Было
          </h2>
          {allFields.length === 0 ? (
            <p style={{ color: 'var(--brand-obihod-ink-muted, #6b6b6b)', fontSize: 13 }}>—</p>
          ) : (
            allFields.map((field) => {
              const v = (diff.before ?? {})[field]
              const color = fieldDiffColor(field, v, (diff.after ?? {})[field])
              return (
                <div key={field} style={{ ...fieldRowStyle, background: color }}>
                  <span style={fieldNameStyle}>{field}</span>
                  <span style={fieldValueStyle}>{formatValue(v)}</span>
                </div>
              )
            })
          )}
        </div>
        <div style={panelStyle}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
              marginBottom: 12,
              color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Стало
          </h2>
          {allFields.length === 0 ? (
            <p style={{ color: 'var(--brand-obihod-ink-muted, #6b6b6b)', fontSize: 13 }}>—</p>
          ) : (
            allFields.map((field) => {
              const v = (diff.after ?? {})[field]
              const color = fieldDiffColor(field, (diff.before ?? {})[field], v)
              return (
                <div key={field} style={{ ...fieldRowStyle, background: color }}>
                  <span style={fieldNameStyle}>{field}</span>
                  <span style={fieldValueStyle}>{formatValue(v)}</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
          textAlign: 'right',
        }}
      >
        PII-поля (телефон, email, имя) показаны в маскированном виде — оригинал доступен в edit-view
        соответствующего документа при наличии прав.
      </div>
    </div>
  )
}
