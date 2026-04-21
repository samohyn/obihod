/**
 * Графические элементы «Обиход»: годичные кольца, топо-паттерн,
 * янтарная печать, сезонный календарь. Чистые RSC — без state.
 */

type RingsProps = { opacity?: number; color?: string; id?: string }

export function RingsPattern({
  opacity = 0.12,
  color = 'currentColor',
  id = 'ringsptn',
}: RingsProps) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        color,
      }}
    >
      <defs>
        <pattern id={id} x="0" y="0" width="360" height="360" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity={opacity}>
            <circle cx="180" cy="180" r="12" />
            <circle cx="180" cy="180" r="30" />
            <circle cx="180" cy="180" r="52" />
            <circle cx="180" cy="180" r="78" />
            <circle cx="180" cy="180" r="108" />
            <circle cx="180" cy="180" r="142" />
            <circle cx="180" cy="180" r="178" />
            <circle cx="180" cy="180" r="216" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function TopoPattern({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        color: 'currentColor',
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1440 600"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity={opacity}>
        <path d="M 0 120 C 200 100, 400 160, 600 140 S 1000 100, 1200 160 S 1440 140, 1440 140" />
        <path d="M 0 180 C 200 160, 400 220, 600 200 S 1000 160, 1200 220 S 1440 200, 1440 200" />
        <path d="M 0 240 C 200 220, 400 280, 600 260 S 1000 220, 1200 280 S 1440 260, 1440 260" />
        <path d="M 0 300 C 200 280, 400 340, 600 320 S 1000 280, 1200 340 S 1440 320, 1440 320" />
        <path d="M 0 360 C 200 340, 400 400, 600 380 S 1000 340, 1200 400 S 1440 380, 1440 380" />
        <path d="M 0 420 C 200 400, 400 460, 600 440 S 1000 400, 1200 460 S 1440 440, 1440 440" />
        <path d="M 0 480 C 200 460, 400 520, 600 500 S 1000 460, 1200 520 S 1440 500, 1440 500" />
      </g>
    </svg>
  )
}

type SealProps = { size?: number; label?: string; center?: string }

export function AmberSeal({
  size = 108,
  label = 'ГАРАНТИЯ · 12 МЕСЯЦЕВ · ОБИХОД · ',
  center = '12\nмес',
}: SealProps) {
  const r = size / 2 - 10
  const cx = size / 2
  const cy = size / 2
  const lines = center.split('\n')
  const pathId = `seal-path-${size}-${label.length}`

  return (
    <div
      className="amber-seal"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <path
            id={pathId}
            d={`M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 -${2 * r} 0`}
          />
        </defs>
        <circle cx={cx} cy={cy} r={r + 4} fill="var(--c-accent)" opacity="0.22" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.5"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r - 18}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
        <text fill="currentColor" fontSize="9" letterSpacing="2.2" style={{ fontFamily: 'var(--font-mono)' }}>
          <textPath href={`#${pathId}`} startOffset="0">
            {label.repeat(3)}
          </textPath>
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
        }}
      >
        {lines.map((l, i) => (
          <span
            key={i}
            style={{
              fontWeight: i === 0 ? 700 : 500,
              fontSize: i === 0 ? size * 0.28 : size * 0.11,
              letterSpacing: i === 0 ? '-0.03em' : '0.12em',
              textTransform: i === 0 ? 'none' : 'uppercase',
              color: 'var(--c-accent-ink)',
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

const MONTHS = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д']
const MONTH_FULL = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const LEVELS = ['не сезон', 'средний', 'пик']

type Peak = 0 | 1 | 2
const CALENDAR_DATA: Array<{ name: string; short: string; peaks: Peak[] }> = [
  { name: 'Спил и арбористика', short: 'АРБО', peaks: [1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 2, 1] },
  { name: 'Уборка снега', short: 'СНЕГ', peaks: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2] },
  { name: 'Демонтаж и снос', short: 'ДЕМО', peaks: [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1] },
  { name: 'Вывоз мусора', short: 'ВЫВ.', peaks: [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1] },
]

export function SeasonCalendar() {
  return (
    <div className="season-cal">
      <div className="season-cal-head">
        <div className="season-cal-title">Когда какая услуга</div>
        <div className="season-cal-legend">
          <span><em style={{ background: 'var(--c-primary)' }} /> пик сезона</span>
          <span><em style={{ background: 'var(--c-primary)', opacity: 0.45 }} /> средний спрос</span>
          <span><em style={{ background: 'var(--c-line)' }} /> не сезон</span>
        </div>
      </div>
      <div className="season-cal-grid">
        <div className="season-cal-months">
          <div />
          {MONTHS.map((m, i) => (
            <div key={i} className="season-cal-m">
              <span>{m}</span>
            </div>
          ))}
        </div>
        {CALENDAR_DATA.map((row) => (
          <div key={row.name} className="season-cal-row">
            <div className="season-cal-label">
              <span className="n">{row.name}</span>
              <span className="s">{row.short}</span>
            </div>
            {row.peaks.map((v, i) => (
              <div
                key={i}
                className="season-cal-cell"
                data-level={v}
                title={`${row.name} · ${MONTH_FULL[i]} · ${LEVELS[v]}`}
              >
                {v === 2 && <span className="peak-dot" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="season-cal-foot">
        <span>Москва и МО · усреднённый спрос за 2023–2025</span>
        <span>Работаем круглый год</span>
      </div>
    </div>
  )
}
