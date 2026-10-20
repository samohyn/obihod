// Отзывы + рейтинг Яндекс Карт (Мастер лес — тексты на главной, MMusor — рейтинг Яндекса).
// Только настоящие отзывы из админки (журнал плана 09, 19.10.2026): нет отзывов — блок не выводится.

import { ButtonLink, Section, SectionHead, Wrap } from './shared'
import type { ReviewsBlock, SectionTone } from './types'
import s from './Reviews.module.css'

function Stars({ value = 5 }: { value?: number }) {
  const full = Math.round(Math.max(0, Math.min(5, value)))
  return (
    <span className={s.stars} aria-label={`Оценка ${full} из 5`}>
      {'★'.repeat(full)}
      <span className={s.starsOff}>{'★'.repeat(5 - full)}</span>
    </span>
  )
}

export function Reviews(block: ReviewsBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <div className={[s.grid, block.rating ? '' : s.noRating].join(' ')}>
          {block.rating && (
            <div className={s.rating}>
              <p className={s.source}>
                <span aria-hidden>Я</span>
                {block.rating.source}
              </p>
              <p className={s.value}>{block.rating.value}</p>
              <Stars value={Number(block.rating.value.replace(',', '.'))} />
              {block.rating.href && (
                <ButtonLink href={block.rating.href} variant="ghost">
                  Все отзывы
                </ButtonLink>
              )}
            </div>
          )}
          <ul className={s.list}>
            {items.map((r, i) => (
              <li key={i} className={s.card}>
                <div className={s.who}>
                  <span className={s.avatar} aria-hidden>
                    {r.author.slice(0, 1)}
                  </span>
                  <div>
                    <b>{r.author}</b>
                    <span>
                      {r.place}
                      {r.place ? ' · ' : ''}
                      <Stars value={r.rating ?? 5} />
                    </span>
                  </div>
                </div>
                <p>{r.text}</p>
                {r.service && <span className={s.service}>{r.service}</span>}
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </Section>
  )
}
