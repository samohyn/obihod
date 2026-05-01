'use client'

import { toast } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'

import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type LeadStatus,
  isLeadStatus,
} from '@/lib/leads/status'

/**
 * PANEL-LEADS-INBOX § A.2 + ADR-0012 Plan A — per-row status pill в list-view.
 *
 * Поведение:
 *   - Рендерит цветную pill согласно brand-guide §32.4 + §12.5.
 *   - Click → открывает inline dropdown с 7 status опциями + Архив.
 *   - PATCH /api/leads/{id} через credentials cookie (Payload session).
 *   - Optimistic UI: pill меняет цвет immediately, на failure rollback + toast.error.
 *   - Toast confirmation: «Статус «<новый label>»» (matter-of-fact per §11).
 *
 * Рендерится Payload через `field.admin.components.Cell` (см. Leads.ts).
 * Props (cellData, rowData) — стандарт Payload 3.x DefaultCellComponentProps.
 *
 * React 19 / Next 16 (react-compiler): manual useCallback/useMemo не нужны.
 */

type Props = {
  cellData?: unknown
  rowData?: { id?: string | number; archivedAt?: string | null }
}

const ARCHIVE_ACTION = '__archive__'

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function StatusPillCell({ cellData, rowData }: Props) {
  // Optimistic override; null → используем cellData (server is source of truth).
  const [override, setOverride] = useState<LeadStatus | null>(null)
  const [pending, setPending] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const serverStatus: LeadStatus = isLeadStatus(cellData) ? cellData : 'new'
  const status: LeadStatus = override ?? serverStatus

  // Когда сервер прислал тот же status что мы выставили optimistically — clear override.
  useEffect(() => {
    if (override !== null && serverStatus === override) {
      setOverride(null)
    }
  }, [override, serverStatus])

  // Close dropdown on outside click + Escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const apply = async (next: LeadStatus | typeof ARCHIVE_ACTION) => {
    if (!rowData?.id) return
    setOpen(false)

    const isArchive = next === ARCHIVE_ACTION
    if (!isArchive) setOverride(next)
    setPending(true)

    const body: Record<string, unknown> = isArchive
      ? { archivedAt: new Date().toISOString() }
      : { status: next }

    try {
      const res = await fetch(`/api/leads/${rowData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      if (isArchive) {
        toast.success('Заявка отправлена в архив')
      } else {
        toast.success(`Статус «${LEAD_STATUS_LABELS[next]}»`)
      }

      window.dispatchEvent(
        new CustomEvent('leads:updated', {
          detail: { id: rowData.id, status: isArchive ? status : next, archived: isArchive },
        }),
      )
    } catch (err) {
      if (!isArchive) setOverride(null)
      toast.error('Не удалось обновить — попробуй ещё раз')
      console.error('[StatusPillCell] PATCH failed', err)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="lead-status-cell" ref={containerRef}>
      <button
        type="button"
        className={cn('lead-status-badge', `lead-status-badge--${status}`)}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Статус заявки: ${LEAD_STATUS_LABELS[status]}. Открыть смену статуса.`}
      >
        {LEAD_STATUS_LABELS[status]}
      </button>
      {open && (
        <ul className="lead-status-dropdown" role="listbox" aria-label="Сменить статус">
          {LEAD_STATUSES.map((opt) => (
            <li key={opt} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={opt === status}
                className={cn('lead-status-dropdown__item', opt === status && 'is-current')}
                onClick={(e) => {
                  e.stopPropagation()
                  void apply(opt)
                }}
              >
                <span className={cn('lead-status-badge', `lead-status-badge--${opt}`)}>
                  {LEAD_STATUS_LABELS[opt]}
                </span>
              </button>
            </li>
          ))}
          <li role="separator" className="lead-status-dropdown__separator" />
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={false}
              className="lead-status-dropdown__item lead-status-dropdown__item--archive"
              onClick={(e) => {
                e.stopPropagation()
                void apply(ARCHIVE_ACTION)
              }}
            >
              Отправить в архив
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

export default StatusPillCell
