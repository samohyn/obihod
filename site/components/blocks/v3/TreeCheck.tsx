// «Нужно ли убирать дерево» + консультация по фото (Арбористик «Как принять решение», Мастер лес — консультация дендролога).

import { BrandMark, ButtonLink, Eyebrow, Icon, Section, SectionHead, Wrap } from './shared'
import type { SectionTone, TreeCheckBlock } from './types'
import s from './TreeCheck.module.css'

export function TreeCheck(block: TreeCheckBlock & { tone?: SectionTone | null }) {
  const c = block.consult
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <div className={s.grid}>
          <div className={s.check}>
            <h3>{block.checklistTitle}</h3>
            <ul>
              {block.checklist.map((t, i) => (
                <li key={i}>
                  <Icon name="alert" size={22} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.consult}>
            <BrandMark className={s.mark} thick={12} />
            {c.eyebrow && <Eyebrow onDark>{c.eyebrow}</Eyebrow>}
            <h3>{c.title}</h3>
            {c.text && <p>{c.text}</p>}
            {c.points && c.points.length > 0 && (
              <ul>
                {c.points.map((t, i) => (
                  <li key={i}>
                    <Icon name="check" size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <ButtonLink href={c.cta.href} variant="light" size="lg" icon="camera" className={s.cta}>
              {c.cta.label}
            </ButtonLink>
          </div>
        </div>
      </Wrap>
    </Section>
  )
}
