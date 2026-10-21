// Районы плиткой-ссылкой — список /raiony/: собирается из коллекции «Районы», не из блоков.

import Link from 'next/link'

import { Icon, Section, SectionHead, Wrap } from './shared'
import type { SectionTone } from './types'
import s from './DistrictGrid.module.css'

export type DistrictLink = { slug: string; name: string; km?: number | null }

export function DistrictGrid({
  title,
  eyebrow,
  items,
  tone,
}: {
  title: string
  eyebrow?: string
  items: DistrictLink[]
  tone?: SectionTone | null
}) {
  if (items.length === 0) return null
  return (
    <Section tone={tone ?? 'default'} anchor="raiony">
      <Wrap>
        <SectionHead eyebrow={eyebrow} title={title} />
        <ul className={s.grid}>
          {items.map((d) => (
            <li key={d.slug}>
              <Link href={`/raiony/${d.slug}/`} className={s.item}>
                <span className={s.name}>{d.name}</span>
                {typeof d.km === 'number' && <span className={s.km}>{d.km} км от МКАД</span>}
                <span className={s.go} aria-hidden>
                  <Icon name="arrow" size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </Section>
  )
}
