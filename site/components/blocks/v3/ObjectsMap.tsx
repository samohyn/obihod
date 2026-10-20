// Карта выполненных объектов (LiWood) + районы (Арбористик, MMusor) + зоны выезда.
// Схема без внешних карт: МКАД в центре, кольца 30 и 50 км, точки — по углу и расстоянию.

import { useId } from 'react'

import { Section, SectionHead, Wrap } from './shared'
import type { ObjectsMapBlock, SectionTone } from './types'
import s from './ObjectsMap.module.css'

const CX = 280
const CY = 230
const MKAD_R = 50
const PX_PER_KM = 3.12

function point(angle: number, km: number) {
  const r = MKAD_R + km * PX_PER_KM
  const a = ((angle - 90) * Math.PI) / 180
  return {
    x: Math.round((CX + r * Math.cos(a)) * 10) / 10,
    y: Math.round((CY + r * Math.sin(a)) * 10) / 10,
  }
}

const LEGEND_COLOR: Record<string, string> = {
  primary: 'var(--c-primary)',
  success: 'var(--c-success)',
  muted: 'var(--c-muted)',
  accent: 'var(--c-accent)',
}

export function ObjectsMap(block: ObjectsMapBlock & { tone?: SectionTone | null }) {
  // useId даёт «:r0:» — в url(#…) двоеточия ломают ссылку, оставляем только буквы и цифры
  const gridId = `omap-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const r30 = MKAD_R + 30 * PX_PER_KM
  const r50 = MKAD_R + 50 * PX_PER_KM
  const base = block.base ? point(block.base.angle, block.base.km) : null
  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap className={s.grid}>
        <svg
          className={s.map}
          viewBox="0 0 560 460"
          role="img"
          aria-label={`Схема объектов: ${block.points.length} точек в Москве и области`}
        >
          <defs>
            <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="var(--c-bg-alt)" />
            </pattern>
          </defs>
          <rect width="560" height="460" fill={`url(#${gridId})`} />
          <circle cx={CX} cy={CY} r={r50} className={s.ring50} />
          <circle cx={CX} cy={CY} r={r30} className={s.ring30} />
          <circle cx={CX} cy={CY} r={MKAD_R} className={s.mkad} />
          <text x={CX} y={CY + 4} textAnchor="middle" className={s.mkadLabel}>
            МКАД
          </text>
          {block.points.map((p, i) => {
            const { x, y } = point(p.angle, p.km)
            return <circle key={i} cx={x} cy={y} r={5} className={s.dot} />
          })}
          {[
            [r30, '+30 КМ'],
            [r50, '+50 КМ'],
          ].map(([r, label]) => (
            <g key={label as string}>
              <rect
                x={CX - 30}
                y={CY - (r as number) - 10}
                width="60"
                height="20"
                rx="4"
                fill="#fff"
              />
              <text x={CX} y={CY - (r as number) + 4} textAnchor="middle" className={s.ringLabel}>
                {label}
              </text>
            </g>
          ))}
          {base && block.base && (
            <g>
              <circle cx={base.x} cy={base.y} r={9} className={s.base} />
              <rect x={base.x + 12} y={base.y - 16} width="110" height="36" rx="6" fill="#fff" />
              <text x={base.x + 20} y={base.y - 1} className={s.baseTitle}>
                {block.base.label}
              </text>
              <text x={base.x + 20} y={base.y + 13} className={s.ringLabel}>
                БАЗА · ТЕХНИКА
              </text>
            </g>
          )}
        </svg>
        <div>
          {block.title && <SectionHead eyebrow={block.eyebrow} title={block.title} />}
          <ul className={s.legend}>
            {block.legend.map((l, i) => (
              <li key={i}>
                <i style={{ background: LEGEND_COLOR[l.color ?? 'primary'] }} aria-hidden />
                <span>{l.label}</span>
                <b>{l.count}</b>
              </li>
            ))}
          </ul>
          <ul className={s.chips}>
            {block.districts.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <dl className={s.zones}>
            {block.zones.map((z, i) => (
              <div key={i}>
                <dt>{z.value}</dt>
                <dd>{z.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Wrap>
    </Section>
  )
}
