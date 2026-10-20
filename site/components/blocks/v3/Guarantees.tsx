// Гарантии с условиями — нет ни у одного конкурента. Условия выделены отдельной строкой (38-ФЗ: без «скрытых» оговорок).

import { Icon, Section, SectionHead, Wrap } from './shared'
import type { GuaranteesBlock, SectionTone } from './types'
import s from './Guarantees.module.css'

export function Guarantees(block: GuaranteesBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((g, i) => (
            <li key={i} className={s.card}>
              <h3>
                <Icon name={g.icon} size={26} />
                {g.title}
              </h3>
              <p>{g.text}</p>
              <p className={s.cond}>
                {g.conditionLabel} — <b>{g.conditionValue}</b>
              </p>
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
