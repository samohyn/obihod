'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { LEAD_STATUS_LABELS } from '@/lib/leads/status'

import { LeadCard } from './LeadCard'
import { ServerNowContext, SlaChip } from './SlaChip'
import { INBOX_TABS, QUEUE_LIMIT, type InboxData, type InboxTab } from './types'

const REFRESH_MS = 30_000

/**
 * Экран «Заявки» (план 09, этап 5.2, вариант 1 «Очередь и карточка»): слева очередь, справа
 * выбранная заявка; на телефоне — очередь, карточка поверх. Состояние — в адресе (?tab, ?lead,
 * фильтры), поэтому ссылка из письма открывает нужную заявку. Раз в 30 секунд, пока вкладка
 * браузера видна, сервер пересобирает экран — новые заявки встают в очередь сами.
 */
export function LeadsInbox({ data }: { data: InboxData }) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState(data.filters.q)
  const seen = useRef<Set<number> | null>(null)
  const [fresh, setFresh] = useState<Set<number>>(new Set())

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh()
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [router])

  // Новая заявка после обновления — подсвечиваем строку, пока менеджер её не откроет.
  useEffect(() => {
    const ids = new Set(data.rows.map((r) => r.id))
    if (seen.current) {
      const added = [...ids].filter((id) => !seen.current!.has(id))
      if (added.length) setFresh((prev) => new Set([...prev, ...added]))
    }
    seen.current = new Set([...(seen.current ?? []), ...ids])
  }, [data.rows])

  const href = (
    patch: Partial<Record<'tab' | 'lead' | 'q' | 'service' | 'district' | 'source', string | null>>,
  ) => {
    const params = new URLSearchParams()
    const current: Record<string, string> = {
      tab: data.tab,
      q: data.filters.q,
      service: data.filters.service,
      district: data.filters.district,
      source: data.filters.source,
      lead: data.selected ? String(data.selected.id) : '',
    }
    for (const [k, v] of Object.entries({ ...current, ...patch })) if (v) params.set(k, v)
    const s = params.toString()
    return s ? `${pathname}?${s}` : pathname
  }

  const go = (patch: Parameters<typeof href>[0]) => router.push(href(patch), { scroll: false })

  const selectedId = data.selected?.id ?? null
  const index = data.rows.findIndex((r) => r.id === selectedId)
  const next = index >= 0 ? data.rows[index + 1] : data.rows.find((r) => r.id !== selectedId)
  const tabLabel = INBOX_TABS.find((t) => t.id === data.tab)?.label ?? ''

  return (
    <ServerNowContext.Provider value={data.serverNow}>
      <div className={data.selected ? 'leads-inbox leads-inbox--open' : 'leads-inbox'}>
        <section className="leads-inbox__queue" aria-label="Очередь заявок">
          <div className="leads-inbox__top">
            <h1 className="leads-inbox__title">Заявки</h1>
            <div className="leads-inbox__links">
              <Link className="leads-inbox__add" href="/admin/collections/leads/create">
                Добавить вручную
              </Link>
              <details className="leads-inbox__export">
                <summary>Выгрузить CSV</summary>
                <div className="leads-inbox__export-menu">
                  <a href="/api/admin/leads/export" download>
                    Без персональных данных
                  </a>
                  <a href="/api/admin/leads/export?pd=1" download>
                    С именем, телефоном и адресом
                  </a>
                </div>
              </details>
            </div>
          </div>

          <nav className="leads-inbox__tabs" aria-label="Вкладки очереди">
            {INBOX_TABS.map((t) => (
              <Link
                key={t.id}
                href={href({ tab: t.id, lead: null })}
                scroll={false}
                className="leads-inbox__tab"
                aria-current={t.id === data.tab ? 'page' : undefined}
                title={t.hint}
                data-urgent={t.id === 'urgent' && data.counts.urgent > 0 ? '' : undefined}
              >
                {t.label}
                <span className="leads-inbox__count">{data.counts[t.id as InboxTab]}</span>
              </Link>
            ))}
          </nav>

          <form
            className="leads-inbox__filters"
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              go({ q: q.trim() || null, lead: null })
            }}
          >
            <label className="leads-inbox__search">
              <span className="lead-sr">Поиск по телефону, имени или адресу</span>
              <input
                type="search"
                value={q}
                placeholder="Телефон, имя или адрес"
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <button type="submit" className="lead-btn">
              Найти
            </button>
            <FilterSelect
              label="Услуга"
              allLabel="Все услуги"
              value={data.filters.service}
              options={data.options.services}
              onChange={(v) => go({ service: v, lead: null })}
            />
            <FilterSelect
              label="Район"
              allLabel="Все районы"
              value={data.filters.district}
              options={data.options.districts}
              onChange={(v) => go({ district: v, lead: null })}
            />
            <FilterSelect
              label="Источник"
              allLabel="Все источники"
              value={data.filters.source}
              options={data.options.sources}
              onChange={(v) => go({ source: v, lead: null })}
            />
          </form>

          {data.rows.length === 0 ? (
            <p className="leads-inbox__empty">
              {data.tab === 'urgent'
                ? 'Срочных заявок нет — все в срок.'
                : `Во вкладке «${tabLabel}» заявок нет.`}
            </p>
          ) : (
            <ol className="leads-inbox__list">
              {data.rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={href({ lead: String(r.id) })}
                    scroll={false}
                    className="lead-row"
                    aria-current={r.id === selectedId ? 'true' : undefined}
                    data-fresh={fresh.has(r.id) && r.id !== selectedId ? '' : undefined}
                    onClick={() =>
                      setFresh((prev) => {
                        const s = new Set(prev)
                        s.delete(r.id)
                        return s
                      })
                    }
                  >
                    <span className="lead-row__line">
                      <span className="lead-row__name">{r.name ?? 'Без имени'}</span>
                      <SlaChip lead={r} />
                    </span>
                    <span className="lead-row__line lead-row__line--sub">
                      <span className="lead-row__phone">{r.phone}</span>
                      <span className={`lead-status-badge lead-status-badge--${r.status}`}>
                        {LEAD_STATUS_LABELS[r.status]}
                      </span>
                    </span>
                    <span className="lead-row__line lead-row__line--sub">
                      <span>
                        {[r.serviceTitle, r.districtTitle].filter(Boolean).join(' · ') ||
                          'Услуга не указана'}
                      </span>
                      {r.photoCount > 0 && (
                        <span className="lead-row__photos">{r.photoCount} фото</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
          {data.total > QUEUE_LIMIT && (
            <p className="leads-inbox__more">
              Показаны {QUEUE_LIMIT} из {data.total}. Уточните поиск или фильтры.
            </p>
          )}
        </section>

        <section className="leads-inbox__detail" aria-label="Заявка">
          {data.selected ? (
            <LeadCard
              key={data.selected.id}
              lead={data.selected}
              queueHref={href({ lead: null })}
              nextHref={next ? href({ lead: String(next.id) }) : null}
            />
          ) : (
            <p className="leads-inbox__placeholder">
              Выберите заявку слева — здесь будет телефон, кнопка «Позвонить» и всё, что прислал
              клиент.
            </p>
          )}
        </section>
      </div>
    </ServerNowContext.Provider>
  )
}

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string
  allLabel: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string | null) => void
}) {
  return (
    <label className="leads-inbox__select">
      <span className="lead-sr">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
