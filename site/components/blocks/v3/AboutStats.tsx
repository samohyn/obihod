// О компании + цифры + баннер калькулятора (LiWood: счётчики и «Рассчитать стоимость online»).

import type { CSSProperties } from 'react'
import Link from 'next/link'

import { Eyebrow, Icon, Section, Wrap } from './shared'
import type { AboutStatsBlock, SectionTone } from './types'
import s from './AboutStats.module.css'

export function AboutStats(block: AboutStatsBlock & { tone?: SectionTone | null }) {
  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor}>
      <Wrap>
        <div className={s.grid}>
          <div>
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            {block.title && <h2 className={s.title}>{block.title}</h2>}
            <p className={s.text}>{block.text}</p>
            {block.checklist && block.checklist.length > 0 && (
              <ul className={s.list}>
                {block.checklist.map((t, i) => (
                  <li key={i}>
                    <Icon name="check" size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <dl className={s.stats}>
            {block.stats.map((st, i) => (
              <div key={i}>
                <dt>{st.label}</dt>
                <dd style={{ '--len': st.value.length } as CSSProperties}>{st.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {block.banner && (
          <div className={s.banner}>
            <p>
              <Icon name="list" size={26} />
              {block.banner.text}
            </p>
            <Link href={block.banner.href} className={s.bannerBtn}>
              {block.banner.label}
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        )}
      </Wrap>
    </Section>
  )
}
