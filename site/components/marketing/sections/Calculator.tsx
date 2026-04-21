'use client'

import { useMemo, useState } from 'react'
import { Icon, type IconName } from '../_shared/Icon'

type Slider = {
  key: string
  label: string
  min: number
  max: number
  step: number
  unit: string
  default: number
  per?: number
  factor?: number
}

type Option = { key: string; label: string; price: number }

type CalcService = {
  label: string
  icon: Extract<IconName, 'Tree' | 'Snow' | 'Brick' | 'Container'>
  base: number
  sliders: Slider[]
  options: Option[]
}

const SERVICES_CALC: Record<string, CalcService> = {
  spil: {
    label: 'Спил деревьев',
    icon: 'Tree',
    base: 4500,
    sliders: [
      {
        key: 'count',
        label: 'Количество деревьев',
        min: 1,
        max: 10,
        step: 1,
        unit: 'шт',
        default: 2,
        per: 4500,
      },
      {
        key: 'height',
        label: 'Средняя высота',
        min: 5,
        max: 25,
        step: 1,
        unit: 'м',
        default: 12,
        factor: 320,
      },
    ],
    options: [
      { key: 'narrow', label: 'Стеснённые условия', price: 3000 },
      { key: 'stump', label: 'Фрезеровка пней', price: 2500 },
      { key: 'permit', label: 'Порубочный билет', price: 4500 },
      { key: 'remove', label: 'Вывоз порубочных остатков', price: 5500 },
    ],
  },
  sneg: {
    label: 'Уборка снега',
    icon: 'Snow',
    base: 3800,
    sliders: [
      {
        key: 'area',
        label: 'Площадь участка',
        min: 100,
        max: 2500,
        step: 50,
        unit: 'м²',
        default: 800,
        factor: 3.8,
      },
      {
        key: 'visits',
        label: 'Выездов за сезон',
        min: 1,
        max: 15,
        step: 1,
        unit: 'раз',
        default: 6,
        factor: 820,
      },
    ],
    options: [
      { key: 'roof', label: 'Чистка кровли', price: 6500 },
      { key: 'ice', label: 'Удаление наледи', price: 2800 },
      { key: 'reagent', label: 'Обработка реагентом', price: 1800 },
      { key: 'night', label: 'Ночной выезд', price: 2200 },
    ],
  },
  demontazh: {
    label: 'Демонтаж',
    icon: 'Brick',
    base: 45000,
    sliders: [
      {
        key: 'area',
        label: 'Площадь строения',
        min: 10,
        max: 250,
        step: 5,
        unit: 'м²',
        default: 60,
        factor: 1350,
      },
      {
        key: 'floors',
        label: 'Этажность',
        min: 1,
        max: 3,
        step: 1,
        unit: 'эт',
        default: 1,
        factor: 15000,
      },
    ],
    options: [
      { key: 'found', label: 'Демонтаж фундамента', price: 18000 },
      { key: 'export', label: 'Вывоз строймусора', price: 12000 },
      { key: 'plan', label: 'Планировка участка', price: 9500 },
      { key: 'docs', label: 'Документы под ключ', price: 6500 },
    ],
  },
  musor: {
    label: 'Вывоз мусора',
    icon: 'Container',
    base: 6900,
    sliders: [
      {
        key: 'volume',
        label: 'Объём контейнера',
        min: 8,
        max: 27,
        step: 1,
        unit: 'м³',
        default: 20,
        factor: 340,
      },
      {
        key: 'days',
        label: 'Срок аренды',
        min: 1,
        max: 14,
        step: 1,
        unit: 'дн',
        default: 2,
        factor: 380,
      },
    ],
    options: [
      { key: 'kgm', label: 'КГМ (крупногабарит)', price: 2500 },
      { key: 'loader', label: 'Грузчики 2 чел.', price: 4800 },
      { key: 'remote', label: 'Удалённость >50 км', price: 3200 },
      { key: 'pass', label: 'Паспорт отходов', price: 3500 },
    ],
  },
}

const URGENCY = ['Стандарт · 3–7 дней', 'В эту неделю', 'Срочно, 24 часа'] as const
const URGENCY_MUL = [1.0, 1.08, 1.25]

type SliderValues = Record<string, Record<string, number>>
type OptionFlags = Record<string, boolean>

function initSliders(): SliderValues {
  const o: SliderValues = {}
  for (const k of Object.keys(SERVICES_CALC)) {
    o[k] = {}
    for (const sl of SERVICES_CALC[k].sliders) {
      o[k][sl.key] = sl.default
    }
  }
  return o
}

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

export function Calculator() {
  const [svc, setSvc] = useState<keyof typeof SERVICES_CALC>('spil')
  const service = SERVICES_CALC[svc]
  const [sliders, setSliders] = useState<SliderValues>(initSliders)
  const [opts, setOpts] = useState<OptionFlags>({})
  const [urg, setUrg] = useState(0)

  const calc = useMemo(() => {
    const cur = sliders[svc]
    const lines: Array<{ label: string; v: number }> = []

    service.sliders.forEach((sl) => {
      const val = cur[sl.key] ?? sl.default
      if (sl.per) {
        lines.push({ label: `${sl.label} · ${val} ${sl.unit}`, v: val * sl.per })
      } else if (sl.factor) {
        const add = Math.round(val * sl.factor)
        lines.push({ label: `${sl.label} · ${val} ${sl.unit}`, v: add })
      }
    })

    let sum: number
    if (service.sliders[0].per) {
      sum = lines[0].v + lines.slice(1).reduce((a, b) => a + b.v, 0)
    } else {
      sum = service.base + lines.reduce((a, b) => a + b.v, 0)
      lines.unshift({ label: 'Базовый выезд бригады', v: service.base })
    }

    const activeOpts = service.options.filter((o) => opts[`${svc}.${o.key}`])
    activeOpts.forEach((o) => {
      sum += o.price
      lines.push({ label: o.label, v: o.price })
    })

    const mul = URGENCY_MUL[urg] ?? 1
    if (mul !== 1) {
      const add = Math.round(sum * (mul - 1))
      lines.push({
        label: urg === 1 ? 'Срочность (эта неделя)' : 'Срочность (24 часа)',
        v: add,
      })
      sum += add
    }

    const lo = Math.round((sum * 0.92) / 500) * 500
    const hi = Math.round((sum * 1.08) / 500) * 500
    return { lines, sum, lo, hi }
  }, [svc, sliders, opts, urg, service])

  return (
    <section id="calc">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;02 · Калькулятор</span>
            <h2 className="h-xl">
              Цена до&nbsp;замера.
              <br />
              Без&nbsp;сюрпризов.
            </h2>
          </div>
          <p className="section-sub">
            Двигайте ползунки — считаем ориентир на&nbsp;лету. Итог попадёт в&nbsp;договор
            с&nbsp;фиксированной ценой: любая доплата — только с&nbsp;вашего письменного согласия.
          </p>
        </div>

        <div className="calc-shell">
          <div className="calc-left">
            <div className="calc-tabs" role="tablist" aria-label="Выбор услуги">
              {Object.entries(SERVICES_CALC).map(([k, v]) => {
                const IconCmp = Icon[v.icon]
                const isActive = svc === k
                return (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={'calc-tab ' + (isActive ? 'is-active' : '')}
                    onClick={() => setSvc(k as keyof typeof SERVICES_CALC)}
                  >
                    <IconCmp size={16} />
                    {v.label}
                  </button>
                )
              })}
            </div>

            {service.sliders.map((sl) => {
              const val = sliders[svc][sl.key] ?? sl.default
              return (
                <div className="calc-field" key={sl.key}>
                  <label className="calc-field-label">
                    <span>{sl.label}</span>
                    <span className="calc-field-value">
                      {val} {sl.unit}
                    </span>
                  </label>
                  <input
                    type="range"
                    className="calc-slider"
                    min={sl.min}
                    max={sl.max}
                    step={sl.step}
                    value={val}
                    onChange={(e) =>
                      setSliders((p) => ({
                        ...p,
                        [svc]: { ...p[svc], [sl.key]: Number(e.target.value) },
                      }))
                    }
                    aria-label={sl.label}
                  />
                </div>
              )
            })}

            <div className="calc-field">
              <div className="calc-field-label">
                <span>Срочность</span>
              </div>
              <div className="calc-segments" role="radiogroup" aria-label="Срочность">
                {URGENCY.map((u, i) => (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={urg === i}
                    className={'calc-seg ' + (urg === i ? 'is-active' : '')}
                    onClick={() => setUrg(i)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-field" style={{ marginBottom: 0 }}>
              <div className="calc-field-label">
                <span>Дополнительно</span>
              </div>
              <div className="calc-check">
                {service.options.map((o) => {
                  const key = `${svc}.${o.key}`
                  const on = !!opts[key]
                  return (
                    <button
                      key={o.key}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className={'calc-chk ' + (on ? 'is-on' : '')}
                      onClick={() => setOpts((p) => ({ ...p, [key]: !p[key] }))}
                    >
                      <span className="box">{on && <Icon.Check size={12} />}</span>
                      <span style={{ flex: 1, textAlign: 'left' }}>{o.label}</span>
                      <span className="mono" style={{ fontSize: '12px', opacity: 0.7 }}>
                        +{(o.price / 1000).toFixed(o.price < 10000 ? 1 : 0)}к
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="calc-right">
            <div>
              <span className="eyebrow">Ориентир по&nbsp;калькулятору</span>
              <div className="calc-price tnum">
                {(calc.sum / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1 })}
                <span className="unit"> тыс&nbsp;₽</span>
              </div>
              <div className="calc-range">
                вилка: {fmt(calc.lo)} – {fmt(calc.hi)}
              </div>

              <div className="calc-breakdown">
                {calc.lines.map((l, i) => (
                  <div key={i} className="calc-line">
                    <span>{l.label}</span>
                    <span>{fmt(l.v)}</span>
                  </div>
                ))}
                <div className="calc-line total">
                  <span>Итого ориентир</span>
                  <span>{fmt(calc.sum)}</span>
                </div>
              </div>
            </div>

            <div className="calc-cta">
              <a
                href="#contact"
                className="btn btn-accent btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Заказать бесплатный замер
                <Icon.ArrowRight size={20} />
              </a>
              <div
                style={{
                  fontSize: '11px',
                  color: 'color-mix(in oklab, var(--c-bg) 60%, transparent)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                }}
              >
                ЗАМЕРЩИК ПРИЕДЕТ В&nbsp;ТЕЧЕНИЕ 24&nbsp;ЧАСОВ · БЕСПЛАТНО
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
