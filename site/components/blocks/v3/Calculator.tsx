'use client'

// Калькулятор (LiWood, MMusor): услуга → вид работ → объём → зона. Цена — ориентир,
// твёрдая фиксируется после фото или осмотра. Уборка и вывоз — строками «включено».

import { goal } from '@/lib/analytics/goal'
import Link from 'next/link'
import { useId, useState } from 'react'

import { CALC_EVENT } from '@/lib/leads/calcEvent'

import { Eyebrow, Icon, Section, Wrap } from './shared'
import type { CalculatorBlock, SectionTone } from './types'
import s from './Calculator.module.css'

const rub = (n: number) =>
  `${Math.round(n / 100) * 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'

export function Calculator(block: CalculatorBlock & { tone?: SectionTone | null }) {
  const services = block.services ?? []
  const uid = useId()
  const [svcIdx, setSvcIdx] = useState(0)
  const [kindIdx, setKindIdx] = useState(0)
  const [volIdx, setVolIdx] = useState(1)
  const [zoneIdx, setZoneIdx] = useState(1)
  if (services.length === 0) return null

  const svc = services[svcIdx]
  const kind = svc.kinds[Math.min(kindIdx, svc.kinds.length - 1)]
  const vol = svc.volumes[Math.min(volIdx, svc.volumes.length - 1)]
  const zone = svc.zones[Math.min(zoneIdx, svc.zones.length - 1)]
  const price = kind.base * vol.factor * zone.factor

  const pickService = (i: number) => {
    setSvcIdx(i)
    setKindIdx(0)
    setVolIdx(Math.min(1, services[i].volumes.length - 1))
    setZoneIdx(Math.min(1, services[i].zones.length - 1))
  }

  return (
    <Section tone={block.tone ?? 'alt'} anchor={block.anchor ?? 'calc'}>
      <Wrap className={s.row}>
        <div>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          {block.title && <h2 className={s.title}>{block.title}</h2>}
          {block.lead && <p className={s.lead}>{block.lead}</p>}
        </div>

        <div className={s.calc}>
          <div className={s.tabs} role="group" aria-label="Услуга">
            {services.map((sv, i) => (
              <button
                key={sv.key}
                type="button"
                aria-pressed={i === svcIdx}
                className={i === svcIdx ? s.tabOn : s.tab}
                onClick={() => pickService(i)}
              >
                <Icon name={sv.icon} size={20} />
                {sv.label}
              </button>
            ))}
          </div>

          <label className={s.label} htmlFor={`${uid}-kind`}>
            {svc.kindLabel}
          </label>
          <div className={s.select}>
            <select
              id={`${uid}-kind`}
              value={Math.min(kindIdx, svc.kinds.length - 1)}
              onChange={(e) => setKindIdx(Number(e.target.value))}
            >
              {svc.kinds.map((k, i) => (
                <option key={k.label} value={i}>
                  {k.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={18} />
          </div>

          <label className={s.label} htmlFor={`${uid}-vol`}>
            {svc.volumeLabel} <b>{vol.label}</b>
          </label>
          <input
            id={`${uid}-vol`}
            className={s.range}
            type="range"
            min={0}
            max={svc.volumes.length - 1}
            step={1}
            value={Math.min(volIdx, svc.volumes.length - 1)}
            aria-valuetext={vol.label}
            style={
              {
                '--fill': `${(Math.min(volIdx, svc.volumes.length - 1) / Math.max(1, svc.volumes.length - 1)) * 100}%`,
              } as React.CSSProperties
            }
            onChange={(e) => setVolIdx(Number(e.target.value))}
          />
          <div className={s.ticks} aria-hidden>
            {svc.volumes.map((v) => (
              <span key={v.label}>{v.label}</span>
            ))}
          </div>

          <p className={s.label} id={`${uid}-zone`}>
            Куда приехать
          </p>
          <div className={s.seg} role="group" aria-labelledby={`${uid}-zone`}>
            {svc.zones.map((z, i) => (
              <button
                key={z.label}
                type="button"
                aria-pressed={i === zoneIdx}
                className={i === zoneIdx ? s.segOn : s.segBtn}
                onClick={() => setZoneIdx(i)}
              >
                {z.label}
              </button>
            ))}
          </div>

          <div className={s.result} aria-live="polite">
            <p className={s.resHead}>
              <span>Ориентир по цене</span>
              <span>
                {zone.label} · {vol.label}
              </span>
            </p>
            <p className={s.price}>{rub(price)}</p>
            <ul>
              <li>
                <span>
                  {kind.label}, {kind.unit}
                </span>
                <b>{rub(price)}</b>
              </li>
              {svc.included.map((inc) => (
                <li key={inc} className={s.inc}>
                  <span>{inc}</span>
                  <b>включено</b>
                </li>
              ))}
            </ul>
            <Link
              href="#zayavka"
              className={s.cta}
              onClick={() => {
                goal('calc_lead')
                window.dispatchEvent(
                  new CustomEvent(CALC_EVENT, {
                    detail: `Расчёт на сайте: ${svc.label} · ${svc.kindLabel}: ${kind.label} · ${svc.volumeLabel}: ${vol.label} · ${zone.label} — ${rub(price)} (ориентир)`,
                  }),
                )
              }}
            >
              {block.ctaLabel ?? 'Получить твёрдую смету'}
              <Icon name="arrow" size={18} />
            </Link>
            {block.note && <small>{block.note}</small>}
          </div>
        </div>
      </Wrap>
    </Section>
  )
}
