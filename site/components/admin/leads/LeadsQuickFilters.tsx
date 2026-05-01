'use client'

import { useEffect, useState } from 'react'

import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from '@/lib/leads/status'

/**
 * PANEL-LEADS-INBOX § B.2 — quick-filter chips для list-view.
 *
 * Отображается через Payload `views.list.actions` slot (collections/Leads.ts).
 *
 * Логика:
 *   - 8 chips: Все + 7 статусов (per Q7 PO default — "Все" = всё КРОМЕ archived)
 *   - При первом mount читаем активный фильтр из URL (lazy initialiser).
 *   - Click chip → URL update через History API + custom event для list refresh.
 *   - Chip counters обновляются через GET /api/admin/leads/count?status=...
 *
 * a11y: chips — `<button role="tab">` (tablist).
 */

const CHIPS: Array<{ value: 'all' | LeadStatus; label: string }> = [
  { value: 'all', label: 'Все' },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABELS[s] })),
]

type Counts = Partial<Record<'all' | LeadStatus, number>>

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

function readActiveFromUrl(): 'all' | LeadStatus {
  if (typeof window === 'undefined') return 'all'
  const params = new URLSearchParams(window.location.search)
  const eq = params.get('where[status][equals]')
  if (eq && (LEAD_STATUSES as readonly string[]).includes(eq)) return eq as LeadStatus
  return 'all'
}

export function LeadsQuickFilters() {
  // Lazy initialiser — читаем URL только на client mount, без useEffect setState.
  const [active, setActive] = useState<'all' | LeadStatus>(readActiveFromUrl)
  const [counts, setCounts] = useState<Counts>({})

  // Re-read active filter on URL changes (popstate, при навигации browser).
  useEffect(() => {
    const onPop = () => setActive(readActiveFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Initial counts fetch + listen to leads:updated событие.
  useEffect(() => {
    let cancelled = false

    const refresh = async () => {
      try {
        const params = new URLSearchParams()
        LEAD_STATUSES.forEach((s) => params.append('status', s))
        const res = await fetch(`/api/admin/leads/count?${params.toString()}`, {
          credentials: 'include',
        })
        if (cancelled || !res.ok) return
        const json = (await res.json()) as { data?: { counts?: Counts; total?: number } }
        const next: Counts = json.data?.counts ?? {}
        if (typeof json.data?.total === 'number') next.all = json.data.total
        setCounts(next)
      } catch {
        // silent — counts опциональны
      }
    }

    void refresh()
    const onUpdated = () => void refresh()
    window.addEventListener('leads:updated', onUpdated as EventListener)
    return () => {
      cancelled = true
      window.removeEventListener('leads:updated', onUpdated as EventListener)
    }
  }, [])

  const onPick = (value: 'all' | LeadStatus) => {
    setActive(value)
    const url = new URL(window.location.href)
    for (const key of Array.from(url.searchParams.keys())) {
      if (key.startsWith('where[status]')) url.searchParams.delete(key)
    }
    if (value !== 'all') {
      url.searchParams.set('where[status][equals]', value)
    }
    url.searchParams.delete('page')
    window.history.pushState({}, '', url.toString())
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <nav className="lead-quick-filters" role="tablist" aria-label="Быстрые фильтры по статусу">
      {CHIPS.map((chip) => {
        const isActive = chip.value === active
        const count = counts[chip.value]
        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={cn('lead-quick-filters__chip', isActive && 'is-active')}
            onClick={() => onPick(chip.value)}
          >
            <span className="lead-quick-filters__label">{chip.label}</span>
            {typeof count === 'number' ? (
              <span className="lead-quick-filters__count" aria-label={`${count} заявок`}>
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

export default LeadsQuickFilters
