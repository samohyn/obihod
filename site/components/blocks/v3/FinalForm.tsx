// Финальная форма + каналы связи (у всех пяти конкурентов форма внизу; каналы MAX/Telegram — Мастер лес).

import { Eyebrow, Icon, Picture, Wrap } from './shared'
import { LeadFormV3 } from './LeadFormV3'
import type { FinalFormBlock } from './types'
import s from './FinalForm.module.css'

export function FinalForm(block: FinalFormBlock & { phoneDisplay?: string }) {
  const onPhoto = Boolean(block.background?.url)
  // Фото принимаем через мессенджер или почту; нет такого канала — строку «фото» в форме не показываем.
  const photoChannel = block.channels.find((c) => c.icon === 'send' || c.icon === 'message')
  return (
    <section
      id={block.anchor ?? 'zayavka'}
      className={[s.section, onPhoto ? s.onPhoto : ''].join(' ')}
    >
      {onPhoto && (
        <Picture image={block.background} sizes="100vw" className={s.bg} tagPosition="tr" />
      )}
      <Wrap className={s.grid}>
        <div>
          {block.eyebrow && <Eyebrow onDark={onPhoto}>{block.eyebrow}</Eyebrow>}
          {block.title && <h2 className={s.title}>{block.title}</h2>}
          {block.lead && <p className={s.lead}>{block.lead}</p>}
          <ul className={s.channels}>
            {block.channels.map((c, i) => (
              <li key={i}>
                <a href={c.href}>
                  <span className={s.chIcon}>
                    <Icon name={c.icon} size={22} />
                  </span>
                  <span className={s.chText}>
                    <b>{c.title}</b>
                    <span>{c.text}</span>
                  </span>
                  <Icon name="arrow" size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <LeadFormV3
          title={block.formTitle}
          source={block.source}
          photoHref={photoChannel?.href ?? null}
          phoneDisplay={block.phoneDisplay ?? '+7 (985) 170-51-11'}
        />
      </Wrap>
    </section>
  )
}
