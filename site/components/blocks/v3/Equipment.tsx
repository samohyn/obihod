// Техника — в работе и в аренду (Арборист «Аренда техники», Мастер лес «Арендовать»).

import Link from 'next/link'

import { Picture, Section, SectionHead, Wrap } from './shared'
import type { EquipmentBlock, SectionTone } from './types'
import s from './Equipment.module.css'

export function Equipment(block: EquipmentBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <ul className={s.grid}>
          {items.map((it, i) => (
            <li key={i} className={s.card}>
              <Picture
                image={it.image}
                sizes="(max-width: 767px) 120px, (max-width: 1199px) 50vw, 25vw"
                className={s.photo}
              />
              <div className={s.col}>
                <div className={s.body}>
                  <h3>{it.title}</h3>
                  {it.text && <p>{it.text}</p>}
                </div>
                <div className={s.foot}>
                  {it.price && <b>{it.price}</b>}
                  {it.href && (
                    <Link href={it.href} className={s.rent}>
                      Арендовать
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
