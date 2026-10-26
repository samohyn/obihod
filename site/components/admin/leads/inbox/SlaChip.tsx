'use client'

import { createContext, useContext, useSyncExternalStore } from 'react'

import {
  formatClockMsk,
  formatDuration,
  slaLabel,
  slaState,
  type LeadSlaFields,
} from '@/lib/leads/sla'

/**
 * Таймер «ответить до» (план 09, этап 5.1–5.2; brand-guide §32 «Таймер ответа»).
 * Одни часы на весь экран: тикают раз в секунду, пока на экране есть хоть один таймер.
 * До гидрации — время сервера, чтобы разметка сервера и браузера совпала.
 */

const listeners = new Set<() => void>()
let now = Date.now()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((l) => l())
    }, 1000)
  }
  return () => {
    listeners.delete(cb)
    if (!listeners.size && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

export const ServerNowContext = createContext(0)

export function useNow(): number {
  const serverNow = useContext(ServerNowContext)
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => serverNow,
  )
}

const ICON: Record<'ok' | 'soon' | 'overdue', string> = {
  // часы
  ok: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  // песочные часы
  soon: 'M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9',
  // восклицательный знак в треугольнике
  overdue:
    'M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
}

export function SlaChip({ lead, size = 'sm' }: { lead: LeadSlaFields; size?: 'sm' | 'lg' }) {
  const current = useNow()
  const state = slaState(lead, new Date(current))
  if (state.kind === 'none') return null
  const label = slaLabel(state)
  const extra = state.kind === 'ok' ? ` · ${formatDuration(state.remainingMs)}` : ''
  return (
    <span
      className={`lead-sla lead-sla--${state.kind} lead-sla--${size}`}
      title={state.dueAt ? `Ответить до ${formatClockMsk(state.dueAt)}` : undefined}
    >
      <svg
        className="lead-sla__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={ICON[state.kind]} />
      </svg>
      <span>
        {label}
        {extra && <span className="lead-sla__rest">{extra}</span>}
      </span>
    </span>
  )
}
