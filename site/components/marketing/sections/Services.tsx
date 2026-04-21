'use client'

import { useState } from 'react'
import { Icon, type IconName } from '../_shared/Icon'

type Service = {
  n: string
  season: string
  icon: Extract<IconName, 'Tree' | 'Snow' | 'Brick' | 'Container'>
  title: string
  price: string
  desc: string
}

const SERVICES: Service[] = [
  {
    n: '01',
    season: 'Весна · Осень',
    icon: 'Tree',
    title: 'Спил и арбористика',
    price: 'от 4 500 ₽',
    desc: 'Аварийные деревья, обрезка крон, фрезеровка пней. С порубочным билетом.',
  },
  {
    n: '02',
    season: 'Зима',
    icon: 'Snow',
    title: 'Уборка снега',
    price: 'от 3 800 ₽',
    desc: 'Ручная и техникой, чистка кровли от наледи. До 10 выездов за сезон.',
  },
  {
    n: '03',
    season: 'Круглый год',
    icon: 'Brick',
    title: 'Демонтаж и снос',
    price: 'от 99 500 ₽',
    desc: 'Баня, сарай, старый дом, фундамент. Планировка участка под стройку.',
  },
  {
    n: '04',
    season: 'Круглый год',
    icon: 'Container',
    title: 'Вывоз мусора',
    price: 'от 6 900 ₽',
    desc: 'КГМ, строительный, садовый. Контейнер 8/20/27 м³. Паспорт отходов.',
  },
]

export function Services() {
  const [active, setActive] = useState(0)

  return (
    <section id="services" className="band-alt">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;01 · Что мы делаем</span>
            <h2 className="h-xl">
              Четыре задачи.
              <br />
              Одна бригада.
            </h2>
          </div>
          <p className="section-sub">
            «Обиход» — круглогодичный подрядчик для загородного участка. Четыре услуги, которые
            обычно ищут по&nbsp;отдельности, мы&nbsp;закрываем одним звонком и&nbsp;одним договором.
          </p>
        </div>

        <div className="circle-wrap">
          <div className="circle-stage">
            <BigSeasonsCircle active={active} />
          </div>

          <div className="services-list">
            {SERVICES.map((s, i) => {
              const IconCmp = Icon[s.icon]
              return (
                <div
                  key={s.n}
                  className={'service-row ' + (i === active ? 'is-active' : '')}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={i === active}
                >
                  <div style={{ color: 'var(--c-primary)' }}>
                    <IconCmp size={32} />
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'baseline',
                        marginBottom: '6px',
                      }}
                    >
                      <span className="service-num">{s.n}</span>
                      <span className="service-season">{s.season}</span>
                    </div>
                    <div className="service-title">{s.title}</div>
                    <div style={{ color: 'var(--c-muted)', fontSize: '14px', marginTop: '4px' }}>
                      {s.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="service-price">{s.price}</div>
                    <div className="service-arrow" style={{ marginLeft: 'auto', marginTop: '8px' }}>
                      <Icon.ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function BigSeasonsCircle({ active }: { active: number }) {
  const sw = (idx: number, on: string, off: string) => (active === idx ? on : off)
  return (
    <svg
      viewBox="0 0 520 520"
      width="100%"
      style={{ color: 'var(--c-primary)' }}
      aria-hidden="true"
    >
      <circle cx="260" cy="260" r="255" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="260"
        cy="260"
        r="200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle
        cx="260"
        cy="260"
        r="140"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <line
        x1="260"
        y1="5"
        x2="260"
        y2="515"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <line
        x1="5"
        y1="260"
        x2="515"
        y2="260"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />

      <text
        x="130"
        y="44"
        fontSize="11"
        letterSpacing="2"
        fill="currentColor"
        opacity="0.6"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        ВЕСНА — ОСЕНЬ
      </text>
      <text
        x="320"
        y="44"
        fontSize="11"
        letterSpacing="2"
        fill="currentColor"
        opacity="0.6"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        ЗИМА
      </text>
      <text
        x="110"
        y="500"
        fontSize="11"
        letterSpacing="2"
        fill="currentColor"
        opacity="0.6"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        КРУГЛЫЙ ГОД
      </text>
      <text
        x="310"
        y="500"
        fontSize="11"
        letterSpacing="2"
        fill="currentColor"
        opacity="0.6"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        КРУГЛЫЙ ГОД
      </text>

      {/* NW — хвоя */}
      <g
        stroke="currentColor"
        strokeWidth={sw(0, '3.5', '2.2')}
        strokeLinecap="round"
        fill="none"
        opacity={active === 0 ? 1 : 0.85}
      >
        <line x1="135" y1="90" x2="135" y2="230" />
        <line x1="135" y1="110" x2="95" y2="130" />
        <line x1="135" y1="110" x2="175" y2="130" />
        <line x1="135" y1="150" x2="95" y2="170" />
        <line x1="135" y1="150" x2="175" y2="170" />
        <line x1="135" y1="190" x2="100" y2="205" />
        <line x1="135" y1="190" x2="170" y2="205" />
        <line x1="135" y1="220" x2="110" y2="230" />
        <line x1="135" y1="220" x2="160" y2="230" />
      </g>

      {/* NE — снежинка */}
      <g
        stroke="currentColor"
        strokeWidth={sw(1, '3', '2')}
        strokeLinecap="round"
        fill="none"
        opacity={active === 1 ? 1 : 0.85}
      >
        <line x1="385" y1="90" x2="385" y2="230" />
        <line x1="315" y1="160" x2="455" y2="160" />
        <line x1="335" y1="110" x2="435" y2="210" />
        <line x1="435" y1="110" x2="335" y2="210" />
        <circle cx="385" cy="160" r="8" />
        <path d="M385 100 L378 107 M385 100 L392 107" />
        <path d="M385 220 L378 213 M385 220 L392 213" />
        <path d="M325 160 L332 153 M325 160 L332 167" />
        <path d="M445 160 L438 153 M445 160 L438 167" />
      </g>

      {/* SW — кирпич */}
      <g
        stroke="currentColor"
        strokeWidth={sw(2, '3', '2')}
        fill="none"
        opacity={active === 2 ? 1 : 0.85}
      >
        <rect x="75" y="305" width="130" height="130" rx="1" />
        <line x1="75" y1="370" x2="205" y2="370" />
        <line x1="140" y1="305" x2="140" y2="370" />
        <line x1="107" y1="370" x2="107" y2="435" />
        <line x1="173" y1="370" x2="173" y2="435" />
      </g>

      {/* SE — контейнер/стрелка */}
      <g
        stroke="currentColor"
        strokeWidth={sw(3, '3', '2')}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={active === 3 ? 1 : 0.85}
      >
        <path d="M320 325 L320 430 L450 430 L450 325" />
        <path d="M305 325 L465 325" />
        <path d="M350 355 L350 405 M385 355 L385 405 M420 355 L420 405" />
        <path d="M385 345 L400 355 M385 345 L370 355" />
      </g>

      <text
        x="260"
        y="250"
        textAnchor="middle"
        fontWeight="700"
        fontSize="20"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ОБИХОД
      </text>
      <text
        x="260"
        y="275"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2"
        fill="currentColor"
        opacity="0.55"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        КРУГ СЕЗОНОВ
      </text>
    </svg>
  )
}
