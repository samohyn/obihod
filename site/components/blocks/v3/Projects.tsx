// Проекты «было — стало» с суммой из акта (Арборист «Результат нашей работы» + «смета = акт» — нет ни у кого).

import Link from 'next/link'

import { Icon, IllustrationTag, Picture, Section, SectionHead, Wrap } from './shared'
import type { ProjectsBlock, SectionTone } from './types'
import s from './Projects.module.css'

export function Projects(block: ProjectsBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((it, i) => {
            const illustration = it.before.illustration || it.after.illustration
            const body = (
              <>
                <div className={s.pair}>
                  <div className={s.frame}>
                    <Picture
                      image={{ ...it.before, illustration: false }}
                      sizes="(max-width: 1023px) 50vw, 17vw"
                      className={s.photo}
                    />
                    <span className={s.label}>ДО</span>
                  </div>
                  <div className={s.frame}>
                    <Picture
                      image={{ ...it.after, illustration: false }}
                      sizes="(max-width: 1023px) 50vw, 17vw"
                      className={s.photo}
                    />
                    <span className={[s.label, s.labelOn].join(' ')}>
                      {it.afterLabel ?? 'ПОСЛЕ'}
                    </span>
                  </div>
                  {illustration && <IllustrationTag />}
                </div>
                <div className={s.body}>
                  <p className={s.meta}>
                    {it.place}
                    {it.duration ? ` · ${it.duration}` : ''}
                  </p>
                  <h3>{it.title}</h3>
                  <div className={s.sum}>
                    <b>{it.sum}</b>
                    {it.matched !== false && (
                      <span>
                        <Icon name="checkCircle" size={15} />
                        смета = акт
                      </span>
                    )}
                  </div>
                </div>
              </>
            )
            return (
              <li key={i} className={s.card}>
                {it.href ? (
                  <Link href={it.href} className={s.link}>
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            )
          })}
        </ul>
      </Wrap>
    </Section>
  )
}
