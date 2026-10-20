// Документы и оформление (Мастер лес «Подготовка документации», Арборист «Оформление документов»).

import { Icon, Section, SectionHead, Wrap } from './shared'
import type { DocumentsBlock, SectionTone } from './types'
import s from './Documents.module.css'

export function Documents(block: DocumentsBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((d, i) => (
            <li key={i} className={s.card}>
              <div className={s.sheet} aria-hidden>
                <Icon name={d.icon} size={44} strokeWidth={1.4} />
              </div>
              <h3>{d.title}</h3>
              {d.text && <p>{d.text}</p>}
              {d.metaValue && (
                <div className={s.meta}>
                  <span>{d.metaLabel}</span>
                  <b>{d.metaValue}</b>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
