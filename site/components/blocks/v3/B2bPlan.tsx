// Для УК, ТСЖ и организаций: абонемент со сроками реакции (SLA — нет ни у кого), типы клиентов, работа по договору.

import { ButtonLink, Eyebrow, Icon, Section, Wrap } from './shared'
import type { B2bPlanBlock, SectionTone } from './types'
import s from './B2bPlan.module.css'

export function B2bPlan(block: B2bPlanBlock & { tone?: SectionTone | null }) {
  return (
    <Section tone={block.tone ?? 'dark'} anchor={block.anchor}>
      <Wrap className={s.grid}>
        <div>
          {block.eyebrow && <Eyebrow onDark>{block.eyebrow}</Eyebrow>}
          {block.title && <h2 className={s.title}>{block.title}</h2>}
          {block.text && <p className={s.text}>{block.text}</p>}
          <dl className={s.kpis}>
            {block.kpis.map((k, i) => (
              <div key={i}>
                <dt>{k.label}</dt>
                <dd>{k.value}</dd>
              </div>
            ))}
          </dl>
          <div className={s.ctas}>
            <ButtonLink href={block.primary.href} variant="light" size="lg">
              {block.primary.label}
            </ButtonLink>
            {block.secondary && (
              <ButtonLink href={block.secondary.href} variant="ghostLight" size="lg">
                {block.secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
        <div>
          <ul className={s.aud}>
            {block.audiences.map((a, i) => (
              <li key={i}>
                <Icon name={a.icon} size={28} />
                <b>{a.title}</b>
                {a.text && <span>{a.text}</span>}
              </li>
            ))}
          </ul>
          {block.note && (
            <div className={s.note}>
              <Icon name="shield" size={32} />
              <div>
                <b>{block.note.title}</b>
                <span>{block.note.text}</span>
              </div>
            </div>
          )}
        </div>
      </Wrap>
    </Section>
  )
}
