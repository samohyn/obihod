'use client'

// Первый экран со слайдами (макет C4: каркас Арборист + LiWood).
// Слайды переключаются вручную; автопрокрутка — только если задана в админке,
// пауза при наведении/фокусе и выключена при prefers-reduced-motion.
// Первый слайд целиком в HTML — его фото грузится сразу (LCP).

import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'

import { ButtonLink, Icon, IllustrationTag, Picture, Wrap } from './shared'
import type { HeroSliderBlock } from './types'
import s from './HeroSlider.module.css'

export function HeroSlider(block: HeroSliderBlock) {
  const slides = block.slides ?? []
  const [index, setIndex] = useState(0)
  const paused = useRef(false)
  const count = slides.length

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    const seconds = block.autoplaySeconds ?? 0
    if (count < 2 || seconds <= 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count)
    }, seconds * 1000)
    return () => window.clearInterval(timer)
  }, [block.autoplaySeconds, count])

  if (count === 0) return null
  const slide = slides[index]
  const anyIllustration = slides[index]?.image?.illustration

  return (
    <section
      id={block.anchor ?? undefined}
      className={s.hero}
      aria-roledescription={count > 1 ? 'карусель' : undefined}
      aria-label="Главное"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      {slides.map((sl, i) => (
        <Picture
          key={i}
          image={{ ...sl.image, illustration: false }}
          sizes="100vw"
          eager={i === 0}
          className={[s.bg, i === index ? s.bgOn : ''].join(' ')}
        />
      ))}
      <div className={s.shade} />
      {anyIllustration && <IllustrationTag position="tr" />}

      <Wrap className={s.inner}>
        <div className={s.copy} aria-live="polite">
          {slide.kicker && (
            <p className={s.kicker}>
              <Icon name="leaf" size={16} />
              {slide.kicker}
            </p>
          )}
          <h1 className={s.title}>{slide.title}</h1>
          {slide.lead && <p className={s.lead}>{slide.lead}</p>}
          <div className={s.ctas}>
            <ButtonLink
              href={slide.primary.href}
              variant="light"
              size="lg"
              icon={slide.primary.icon ?? 'camera'}
            >
              {slide.primary.label}
            </ButtonLink>
            {slide.secondary && (
              <ButtonLink href={slide.secondary.href} variant="ghostLight" size="lg">
                {slide.secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
        {block.badge && (
          <aside className={s.badge}>
            {/* длина значения → размер цифры в CSS: «100%» крупно, «от 3 800 ₽» мельче, всегда в плашке */}
            <b style={{ '--len': block.badge.value.length } as CSSProperties}>
              {block.badge.value}
            </b>
            <p>{block.badge.text}</p>
            {block.badge.note && <small>{block.badge.note}</small>}
          </aside>
        )}
      </Wrap>

      {count > 1 && (
        <Wrap className={s.ctrl}>
          <div className={s.dots}>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === index ? s.dotOn : s.dot}
                aria-label={`Слайд ${i + 1} из ${count}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className={s.arrows}>
            <button type="button" aria-label="Предыдущий слайд" onClick={() => go(index - 1)}>
              <Icon name="arrow" size={20} className={s.flip} />
            </button>
            <button type="button" aria-label="Следующий слайд" onClick={() => go(index + 1)}>
              <Icon name="arrow" size={20} />
            </button>
          </div>
        </Wrap>
      )}

      {block.strip?.length > 0 && (
        <div className={s.strip}>
          <Wrap>
            <ul>
              {block.strip.map((it, i) => (
                <li key={i}>
                  <Icon name={it.icon} size={32} />
                  <div>
                    <b>{it.title}</b>
                    {it.text && <span>{it.text}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </Wrap>
        </div>
      )}
    </section>
  )
}
