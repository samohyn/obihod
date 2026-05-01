'use client'

import { useEffect } from 'react'

/**
 * GlobalSearchTrigger — кликабельная иконка-лупа в top-bar `actions` slot
 * (admin.components.actions). Открывает GlobalSearchOverlay через custom event
 * (overlay живёт в providers, тот слот не имеет прямого DOM-bridge → используем
 * window event bus).
 *
 * brand-guide §12.2 admin top-bar — `<input class="ad-search">` mockup; в нашем
 * impl input открывается как modal overlay (Linear/Notion pattern), а в top-bar
 * кнопка-trigger показывает hint «Поиск ⌘K».
 *
 * PANEL-GLOBAL-SEARCH (ADR-0013).
 */

const EVENT_OPEN = 'panel-global-search:open'

export default function GlobalSearchTrigger() {
  // Cmd/Ctrl+K hotkey handled in GlobalSearchOverlay; здесь только клик.
  useEffect(() => {
    // No-op effect — gateguard для SSR консистентности (в случае hydration).
  }, [])

  const onClick = () => {
    window.dispatchEvent(new CustomEvent(EVENT_OPEN))
  }

  return (
    <button
      type="button"
      className="ad-gs-trigger"
      onClick={onClick}
      aria-label="Глобальный поиск (Ctrl+K)"
      title="Глобальный поиск (⌘K / Ctrl+K)"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="ad-gs-trigger-label">Поиск</span>
      <kbd className="ad-gs-trigger-kbd">⌘K</kbd>
    </button>
  )
}
