// Финальная форма + каналы связи (у всех пяти конкурентов форма внизу; каналы MAX/Telegram — Мастер лес).

import { Eyebrow, Icon, Picture, Wrap } from './shared'
import { getCompany } from '@/lib/company'

import { LeadFormV3 } from './LeadFormV3'
import type { FinalFormBlock } from './types'
import s from './FinalForm.module.css'

export async function FinalForm(block: FinalFormBlock & { phoneDisplay?: string }) {
  const company = await getCompany()
  const onPhoto = Boolean(block.background?.url)
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
          phoneDisplay={block.phoneDisplay ?? company.phoneDisplay}
          photoMinutes={company.photoEstimateMinutes}
          openDetails={block.openDetails ?? false}
          callback={{
            opens: company.opens,
            closes: company.closes,
            callbackMinutes: company.callbackMinutes,
            nightCallbackTime: company.nightCallbackTime,
          }}
        />
      </Wrap>
    </section>
  )
}
