'use client'

import { useFormFields } from '@payloadcms/ui'

import { LEAD_STATUS_LABELS, isLeadStatus } from '@/lib/leads/status'

/**
 * PANEL-LEADS-INBOX § A.3 + ADR-0012 — read-only timeline смен статуса.
 *
 * Render для поля `statusHistory` (Leads.ts таб «Статус»).
 * Источник данных — form state Payload (синхронизирован с jsonb колонкой).
 * Hook beforeChange (Leads.ts) — единственный writer.
 *
 * Sorted desc by changedAt — последнее изменение сверху.
 */

type HistoryEntry = {
  from?: string | null
  to?: string
  changedBy?: string | number | null
  changedAt?: string
  note?: string
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function statusLabel(value: unknown): string {
  if (isLeadStatus(value)) return LEAD_STATUS_LABELS[value]
  return typeof value === 'string' && value.length > 0 ? value : '—'
}

export function StatusHistoryField() {
  const value = useFormFields(([fields]) => fields.statusHistory?.value)

  // Computed (no useMemo — react-compiler оптимизирует автоматически).
  const entries: HistoryEntry[] = !Array.isArray(value)
    ? []
    : [...(value as HistoryEntry[])].sort((a, b) => {
        const ta = a.changedAt ? Date.parse(a.changedAt) : 0
        const tb = b.changedAt ? Date.parse(b.changedAt) : 0
        return tb - ta
      })

  return (
    <div className="lead-status-history" data-field-name="statusHistory">
      <label className="field-label">История статуса</label>
      {entries.length === 0 ? (
        <p className="lead-status-history__empty">История появится после первой смены статуса.</p>
      ) : (
        <ol className="lead-status-history__list">
          {entries.map((entry, idx) => (
            <li key={`${entry.changedAt ?? 'na'}-${idx}`} className="lead-status-history__item">
              <time className="lead-status-history__time" dateTime={entry.changedAt}>
                {formatDate(entry.changedAt)}
              </time>
              <span className="lead-status-history__transition">
                {entry.from ? (
                  <>
                    <span>{statusLabel(entry.from)}</span>
                    <span aria-hidden="true"> → </span>
                  </>
                ) : null}
                <strong>{statusLabel(entry.to)}</strong>
              </span>
              {entry.changedBy != null ? (
                <span className="lead-status-history__actor">user #{String(entry.changedBy)}</span>
              ) : entry.note ? (
                <span className="lead-status-history__note">{entry.note}</span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default StatusHistoryField
