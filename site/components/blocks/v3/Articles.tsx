// Статьи (LiWood «Статьи», Арборист «Все самое интересное», MMusor «Полезные статьи»).

import Link from 'next/link'

import { Picture, Section, SectionHead, Wrap } from './shared'
import type { ArticlesBlock, SectionTone } from './types'
import s from './Articles.module.css'

export function Articles(block: ArticlesBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((a, i) => (
            <li key={i}>
              <Link href={a.href} className={s.card}>
                <Picture
                  image={a.image}
                  sizes="(max-width: 1023px) 110px, 33vw"
                  className={s.photo}
                />
                <span className={s.body}>
                  {a.kicker && <span className={s.kicker}>{a.kicker}</span>}
                  <b>{a.title}</b>
                  {a.text && <span className={s.text}>{a.text}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
