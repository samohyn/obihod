// Услуги плиткой с фото и ценой «от» (у всех пяти конкурентов; цены «от» — Арбористик, Мастер лес, MMusor).

import Link from 'next/link'

import { Icon, Picture, Section, SectionHead, Wrap } from './shared'
import type { ServicesTilesBlock, SectionTone } from './types'
import s from './ServicesTiles.module.css'

export function ServicesTiles(block: ServicesTilesBlock & { tone?: SectionTone | null }) {
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
            <li key={i}>
              <Link href={it.href} className={s.tile}>
                <Picture
                  image={it.image}
                  sizes="(max-width: 767px) 50vw, (max-width: 1199px) 50vw, 25vw"
                  className={s.photo}
                  tagPosition="tr"
                />
                {it.price && <span className={s.price}>{it.price}</span>}
                <span className={s.body}>
                  <b>{it.title}</b>
                  {it.text && <span className={s.text}>{it.text}</span>}
                </span>
                <span className={s.go} aria-hidden>
                  <Icon name="arrow" size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
