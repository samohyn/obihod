// Этапы работы со сроками (LiWood — 6 шагов, Мастер лес, MMusor).

import { Section, SectionHead, Wrap } from './shared'
import type { SectionTone, StepsBlock } from './types'
import s from './Steps.module.css'

export function Steps(block: StepsBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ol className={s.list} style={{ '--n': items.length } as React.CSSProperties}>
          {items.map((it, i) => (
            <li key={i}>
              {it.time && <span className={s.time}>{it.time}</span>}
              <b>{it.title}</b>
              {it.text && <span className={s.text}>{it.text}</span>}
            </li>
          ))}
        </ol>
      </Wrap>
    </Section>
  )
}
