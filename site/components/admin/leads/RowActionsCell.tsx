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
 * PANEL-LEADS-INBOX § C.2 + ADR-0012 Plan A — per-row «⋯» dropdown.
 *
 * Реализовано через virtual field `_actions` (см. Leads.ts).
 * Discoverable «⋯» icon в каждой строке (PO Q3 default).
 *
 * Действия:
 *   - 7 status опций
 *   - Архив (PATCH archivedAt)
 *   - «Открыть полностью →» (link to edit-view)
 */

type Props = {
  rowData?: { id?: string | number; status?: unknown; archivedAt?: string | null }
}

const ARCHIVE_ACTION = '__archive__'

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function RowActionsCell({ rowData }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const id = rowData?.id
  const currentStatus: LeadStatus = isLeadStatus(rowData?.status) ? rowData.status : 'new'

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
    if (!id) return
    setOpen(false)
    setPending(true)
    const isArchive = next === ARCHIVE_ACTION
    const body: Record<string, unknown> = isArchive
      ? { archivedAt: new Date().toISOString() }
      : { status: next }
    try {
      const res = await fetch(`/api/leads/${id}`, {
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
          detail: { id, status: isArchive ? currentStatus : next, archived: isArchive },
        }),
      )
    } catch (err) {
      toast.error('Не удалось обновить — попробуй ещё раз')
      console.error('[RowActionsCell] PATCH failed', err)
    } finally {
      setPending(false)
    }
  }

  if (!id) return null

  return (
    <div className="lead-row-actions" ref={containerRef}>
      <button
        type="button"
        className="lead-row-actions__trigger"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Действия с заявкой"
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <ul className="lead-row-actions__menu" role="menu" aria-label="Действия с заявкой">
          {LEAD_STATUSES.map((opt) => (
            <li key={opt} role="presentation">
              <button
                type="button"
                role="menuitem"
                className={cn('lead-row-actions__item', opt === currentStatus && 'is-current')}
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
          <li role="separator" className="lead-row-actions__separator" />
          <li role="presentation">
            <button
              type="button"
              role="menuitem"
              className="lead-row-actions__item lead-row-actions__item--archive"
              onClick={(e) => {
                e.stopPropagation()
                void apply(ARCHIVE_ACTION)
              }}
            >
              Отправить в архив
            </button>
          </li>
          <li role="presentation">
            <a
              role="menuitem"
              className="lead-row-actions__item lead-row-actions__item--link"
              href={`/admin/collections/leads/${id}`}
              onClick={(e) => e.stopPropagation()}
            >
              Открыть полностью →
            </a>
          </li>
        </ul>
      )}
    </div>
  )
}

export default RowActionsCell
