// FAQ — нет ни у одного конкурента на главной. <details> работает без JS; JSON-LD FAQPage добавляет страница.

import { Icon, Section, SectionHead, Wrap } from './shared'
import type { FaqV3Block, SectionTone } from './types'
import s from './FaqV3.module.css'

export function FaqV3(block: FaqV3Block & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <div className={s.grid}>
          {items.map((q, i) => (
            <details key={i} className={s.item} open={i === 0}>
              <summary>
                {q.question}
                <Icon name="plus" size={22} className={s.icon} />
              </summary>
              <p>{q.answer}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </Section>
  )
}
