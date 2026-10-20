// Акции с условиями (LiWood, Арборист «Максимум выгоды», MMusor); у каждой — ссылка на условия.

import Link from 'next/link'

import { Icon, Section, SectionHead, Wrap } from './shared'
import type { PromotionsBlock, SectionTone } from './types'
import s from './Promotions.module.css'

export function Promotions(block: PromotionsBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((it, i) => (
            <li key={i} className={[s.card, it.dark ? s.dark : ''].join(' ')}>
              <span className={s.value}>{it.value}</span>
              <h3>{it.title}</h3>
              {it.text && <p>{it.text}</p>}
              {it.link && (
                <Link href={it.link.href} className={s.cond}>
                  {it.link.label}
                  <Icon name="arrow" size={15} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
