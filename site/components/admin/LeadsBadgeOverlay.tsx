'use client'

import { useEffect, useState } from 'react'

/**
 * LeadsBadgeOverlay — client polling counter новых заявок (status=new) для
 * sidebar пункта /admin/collections/leads (Wave 3 · PAN-6 part 3).
 *
 * Plan B per ADR-0005 §2 + sa-panel-wave3.md §3.5: DOM injection через
 * MutationObserver + CSS `[data-leads-count]::after` selector в custom.scss.
 *
 * Renders nothing (только side-effect). Polling 30s.
 *
 * a11y: aria-live announce через скрытый span.
 */

export default function LeadsBadgeOverlay() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    let intervalId: ReturnType<typeof setInterval> | null = null
    let observer: MutationObserver | null = null

    const fetchCount = async () => {
      try {
        const res = await fetch('/api/admin/leads/count?status=new', {
          credentials: 'same-origin',
          cache: 'no-store',
        })
        if (cancelled || !res.ok) return
        const json = (await res.json()) as { data?: { count?: number } }
        const next = typeof json.data?.count === 'number' ? json.data.count : 0
        setCount(next)
      } catch {
        // network errors — keep last known count
      }
    }

    const inject = () => {
      const link = document.querySelector('a[href*="/admin/collections/leads"]')
      if (!link || count === null) return
      if (count > 0) {
        link.setAttribute('data-leads-count', String(count))
      } else {
        link.removeAttribute('data-leads-count')
      }
    }

    fetchCount()
    intervalId = setInterval(fetchCount, 30_000)

    observer = new MutationObserver(inject)
    observer.observe(document.body, { childList: true, subtree: true })
    inject()

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
      if (observer) observer.disconnect()
    }
  }, [count])

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {count !== null && count > 0 ? `Новых заявок: ${count}` : ''}
    </span>
  )
}
