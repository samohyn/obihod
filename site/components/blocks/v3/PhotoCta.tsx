// Баннер с фото и призывом — «Пришлите фото — цена через 30 минут» (Мастер лес «Предварительная оценка по фото»).

import { ButtonLink, Eyebrow, Picture, Wrap } from './shared'
import type { PhotoCtaBlock } from './types'
import s from './PhotoCta.module.css'

export function PhotoCta(block: PhotoCtaBlock) {
  return (
    <section id={block.anchor ?? undefined} className={s.band}>
      <Picture image={block.image} sizes="100vw" className={s.bg} tagPosition="tr" />
      <Wrap className={s.inner}>
        <div>
          {block.eyebrow && <Eyebrow onDark>{block.eyebrow}</Eyebrow>}
          {block.title && <h2 className={s.title}>{block.title}</h2>}
          {block.text && <p className={s.text}>{block.text}</p>}
        </div>
        <div className={s.ctas}>
          <ButtonLink
            href={block.primary.href}
            variant="light"
            size="lg"
            icon={block.primary.icon ?? 'upload'}
          >
            {block.primary.label}
          </ButtonLink>
          {block.secondary && (
            <ButtonLink
              href={block.secondary.href}
              variant="ghostLight"
              size="lg"
              icon={block.secondary.icon ?? 'send'}
            >
              {block.secondary.label}
            </ButtonLink>
          )}
        </div>
      </Wrap>
    </section>
  )
}
