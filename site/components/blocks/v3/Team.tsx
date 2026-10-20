// Сотрудники (Арборист «Сотрудники», Арбористик «Наши арбористы», Мастер лес). Фото — без узнаваемых лиц.

import { Picture, Section, SectionHead, Wrap } from './shared'
import type { SectionTone, TeamBlock } from './types'
import s from './Team.module.css'

export function Team(block: TeamBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((m, i) => (
            <li key={i} className={s.card}>
              <Picture image={m.photo} sizes="(max-width: 1199px) 50vw, 25vw" className={s.photo} />
              <div className={s.body}>
                <h3>{m.role}</h3>
                {m.text && <p>{m.text}</p>}
                {m.chip && <span className={s.chip}>{m.chip}</span>}
              </div>
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
