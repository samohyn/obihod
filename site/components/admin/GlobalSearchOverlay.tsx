'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * GlobalSearchOverlay — Cmd+K top-bar global search по 7 коллекциям.
 *
 * PANEL-GLOBAL-SEARCH (ADR-0013) · spec specs/PANEL-GLOBAL-SEARCH/sa-panel.md
 * brand-guide §12.2 ad-search input + dropdown panel.
 *
 * Architecture:
 * - Cmd/Ctrl+K (или /) — opens modal centered overlay (Linear/Notion pattern).
 * - Esc — close. ↑/↓ — navigate hits. Enter — go to URL. Click outside — close.
 * - Debounce 300ms на input.
 * - Empty state «Ничего не найдено» (после ≥2 chars + non-loading).
 * - Loading state — skeleton row × 3.
 * - Error toast inline — «Поиск временно недоступен».
 *
 * Renders ничего по умолчанию, открывается по hotkey/click. CSS — в
 * site/app/(payload)/custom.scss блок «GLOBAL SEARCH».
 */

interface SearchHit {
  id: string
  title: string
  subtitle: string | null
  url: string
  rank: number
}

interface SearchGroup {
  collection: string
  label: string
  hits: SearchHit[]
}

interface SearchResponse {
  data: {
    groups: SearchGroup[]
    total: number
    took_ms: number
  }
}

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

export default function GlobalSearchOverlay() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState<SearchGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Flat list of hits for keyboard navigation.
  const flatHits: SearchHit[] = groups.flatMap((g) => g.hits)

  // ── Open / close
  const openOverlay = useCallback(() => {
    setOpen(true)
    setActiveIndex(0)
  }, [])
  const closeOverlay = useCallback(() => {
    setOpen(false)
    setQuery('')
    setGroups([])
    setError(false)
    setActiveIndex(0)
    abortRef.current?.abort()
  }, [])

  // ── Cmd/Ctrl+K global hotkey + custom event from top-bar trigger button
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (cmdK) {
        e.preventDefault()
        if (open) closeOverlay()
        else openOverlay()
      }
    }
    const onOpenEvent = () => {
      if (!open) openOverlay()
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('panel-global-search:open', onOpenEvent)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('panel-global-search:open', onOpenEvent)
    }
  }, [open, openOverlay, closeOverlay])

  // ── Focus input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  // ── Debounced fetch
  // Все setState вызовы помещены внутри setTimeout / async коллбэков,
  // чтобы не триггерить cascading renders (eslint react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!open) return
    const trimmed = query.trim()
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const t = setTimeout(async () => {
      if (trimmed.length < MIN_QUERY_LENGTH) {
        setGroups([])
        setLoading(false)
        setError(false)
        return
      }
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(trimmed)}`, {
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok) {
          setError(true)
          setGroups([])
        } else {
          const json = (await res.json()) as SearchResponse
          setGroups(json.data?.groups ?? [])
          setActiveIndex(0)
        }
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return
        setError(true)
        setGroups([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query, open])

  // ── Keyboard nav inside overlay
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeOverlay()
      return
    }
    if (flatHits.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % flatHits.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + flatHits.length) % flatHits.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = flatHits[activeIndex]
      if (hit) {
        window.location.assign(hit.url)
      }
    }
  }

  // ── Click outside / backdrop
  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeOverlay()
  }

  if (!open) return null

  let activeCounter = -1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Глобальный поиск"
      className="ad-gs-backdrop"
      onClick={onBackdropClick}
    >
      <div className="ad-gs-panel" role="combobox" aria-expanded="true" aria-haspopup="listbox">
        <div className="ad-gs-input-row">
          <svg
            className="ad-gs-icon"
            width="16"
            height="16"
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
          <input
            ref={inputRef}
            type="search"
            className="ad-gs-input"
            placeholder="Поиск по всему — услуги, районы, заявки, статьи…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            aria-controls="ad-gs-results"
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="ad-gs-kbd" aria-hidden="true">
            Esc
          </kbd>
        </div>

        <div id="ad-gs-results" className="ad-gs-results" role="listbox">
          {error && (
            <div className="ad-gs-error" role="status">
              Поиск временно недоступен. Попробуйте ещё раз.
            </div>
          )}
          {loading && !error && (
            <div className="ad-gs-loading" aria-live="polite">
              <div className="ad-gs-skeleton" />
              <div className="ad-gs-skeleton" />
              <div className="ad-gs-skeleton" />
            </div>
          )}
          {!loading && !error && query.trim().length >= MIN_QUERY_LENGTH && groups.length === 0 && (
            <div className="ad-gs-empty">Ничего не найдено</div>
          )}
          {!loading && !error && query.trim().length < MIN_QUERY_LENGTH && (
            <div className="ad-gs-empty">Введите минимум 2 символа</div>
          )}
          {!loading &&
            !error &&
            groups.map((group) => (
              <div key={group.collection} className="ad-gs-group">
                <div className="ad-gs-group-label">{group.label}</div>
                <ul className="ad-gs-hits">
                  {group.hits.map((hit) => {
                    activeCounter += 1
                    const isActive = activeCounter === activeIndex
                    return (
                      <li
                        key={`${group.collection}-${hit.id}`}
                        className={isActive ? 'ad-gs-hit ad-gs-hit--active' : 'ad-gs-hit'}
                        role="option"
                        aria-selected={isActive}
                      >
                        <a
                          href={hit.url}
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.assign(hit.url)
                          }}
                        >
                          <span className="ad-gs-hit-title">{hit.title}</span>
                          {hit.subtitle && (
                            <span className="ad-gs-hit-subtitle">{hit.subtitle}</span>
                          )}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
        </div>

        <div className="ad-gs-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> навигация
          </span>
          <span>
            <kbd>Enter</kbd> открыть
          </span>
          <span>
            <kbd>Esc</kbd> закрыть
          </span>
        </div>
      </div>
    </div>
  )
}
