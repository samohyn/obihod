'use client'

// Открытый прайс по вкладкам (Арбористик — по способам работ, MMusor — по зонам). Цены «от», единица — в шапке.

import { useRef, useState, type KeyboardEvent } from 'react'

import { Icon, Section, SectionHead, Wrap } from './shared'
import type { PriceTabsBlock, SectionTone } from './types'
import s from './PriceTabs.module.css'

export function PriceTabs(block: PriceTabsBlock & { tone?: SectionTone | null }) {
  const tabs = block.tabs ?? []
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  if (tabs.length === 0) return null
  const tab = tabs[active]
  const baseId = `price-${block.id ?? 'tabs'}`

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        {tabs.length > 1 && (
          <div className={s.tabs} role="tablist" aria-label="Направления" onKeyDown={onKey}>
            {tabs.map((t, i) => (
              <button
                key={i}
                ref={(el) => {
                  refs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={i === active ? s.tabOn : s.tab}
                onClick={() => setActive(i)}
              >
                <Icon name={t.icon} size={20} />
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Способ · {tab.unit}</th>
                {tab.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tab.rows.map((r, i) => (
                <tr key={i}>
                  <th scope="row">
                    <b>{r.name}</b>
                    {r.note && <small>{r.note}</small>}
                  </th>
                  {r.values.map((v, j) => (
                    <td key={j} data-col={tab.columns[j]}>
                      <i>от</i>
                      {v} ₽
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tab.notes && tab.notes.length > 0 && (
            <ul className={s.notes}>
              {tab.notes.map((n, i) => (
                <li key={i} className={i === tab.notes!.length - 1 ? s.noteAccent : undefined}>
                  <Icon name="check" size={17} />
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Wrap>
    </Section>
  )
}
