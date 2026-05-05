'use client'

import { useMemo, useState } from 'react'

/**
 * PricingCalculator — секция §04.5 (быстрый расчёт стоимости).
 * Source: newui/homepage-classic.html · 4 tabs × 3 sliders × 3 checkboxes + price formula.
 * Phase 1: hardcoded formulas, identical to mockup. Phase 2: pricing config из Payload.
 */

type TabKey = 'arbo' | 'kryshi' | 'musor' | 'demo'

type SliderConfig = {
  key: string
  label: string
  unit: string
  min: number
  max: number
  step: number
  default: number
  ariaLabel: string
}

type OptionConfig = {
  label: string
  add?: number
  mult?: number
  defaultChecked?: boolean
}

type TabConfig = {
  label: string
  sliders: [SliderConfig, SliderConfig, SliderConfig]
  options: [OptionConfig, OptionConfig, OptionConfig]
  meta: (vals: Record<string, number>) => string
  formula: (vals: Record<string, number>) => number
}

const TABS: Record<TabKey, TabConfig> = {
  arbo: {
    label: 'Арбористика',
    sliders: [
      {
        key: 'height',
        label: 'Высота дерева',
        unit: 'м',
        min: 3,
        max: 40,
        step: 1,
        default: 18,
        ariaLabel: 'Высота дерева в метрах',
      },
      {
        key: 'diameter',
        label: 'Диаметр ствола',
        unit: 'см',
        min: 10,
        max: 120,
        step: 1,
        default: 40,
        ariaLabel: 'Диаметр ствола в сантиметрах',
      },
      {
        key: 'count',
        label: 'Количество деревьев',
        unit: '',
        min: 1,
        max: 10,
        step: 1,
        default: 1,
        ariaLabel: 'Количество деревьев',
      },
    ],
    options: [
      { label: 'Удаление пня (фрезой, +3 200 ₽)', add: 3200, defaultChecked: true },
      { label: 'Вывоз веток и щепы (+1 800 ₽)', add: 1800, defaultChecked: true },
      { label: 'Аварийное дерево — коэффициент ×1.4', mult: 1.4 },
    ],
    formula: (v) => (2200 + v.height * 380 + v.diameter * 60) * v.count,
    meta: (v) => {
      const hrs = Math.max(1, Math.round((v.height * v.count) / 6))
      return `СПИЛ + ПЕНЬ + ВЫВОЗ<br>~${hrs} ЧАС${hrs > 1 ? 'А' : ''} · 2 ЧЕЛОВЕКА<br>СТРАХОВКА 5 МЛН ₽`
    },
  },
  kryshi: {
    label: 'Чистка крыш',
    sliders: [
      {
        key: 'area',
        label: 'Площадь крыши',
        unit: 'м²',
        min: 50,
        max: 2000,
        step: 10,
        default: 350,
        ariaLabel: 'Площадь крыши в квадратных метрах',
      },
      {
        key: 'snow',
        label: 'Толщина снега',
        unit: 'см',
        min: 5,
        max: 80,
        step: 1,
        default: 25,
        ariaLabel: 'Толщина снежного покрова',
      },
      {
        key: 'slope',
        label: 'Уклон крыши',
        unit: '°',
        min: 10,
        max: 60,
        step: 1,
        default: 25,
        ariaLabel: 'Уклон крыши в градусах',
      },
    ],
    options: [
      { label: 'Сбивание сосулек (+800 ₽)', add: 800, defaultChecked: true },
      { label: 'Удаление наледи (+1 500 ₽)', add: 1500 },
      { label: 'Промальп (вместо автовышки) ×1.3', mult: 1.3 },
    ],
    formula: (v) => v.area * (25 + v.snow * 0.6) + v.slope * 40,
    meta: () => 'СНЕГ + НАЛЕДЬ + СОСУЛЬКИ<br>С АВТОВЫШКИ ИЛИ АЛЬП.<br>АКТ ПО ФОРМЕ',
  },
  musor: {
    label: 'Вывоз мусора',
    sliders: [
      {
        key: 'volume',
        label: 'Объём контейнера',
        unit: 'м³',
        min: 1,
        max: 30,
        step: 1,
        default: 8,
        ariaLabel: 'Объём в кубических метрах',
      },
      {
        key: 'distance',
        label: 'Расстояние от МКАД',
        unit: 'км',
        min: 0,
        max: 120,
        step: 5,
        default: 25,
        ariaLabel: 'Расстояние от МКАД в километрах',
      },
      {
        key: 'trips',
        label: 'Количество ходок',
        unit: '',
        min: 1,
        max: 6,
        step: 1,
        default: 1,
        ariaLabel: 'Количество ходок',
      },
    ],
    options: [
      { label: 'Грузчики 2 чел. (+4 800 ₽)', add: 4800 },
      { label: 'Сортировка (+2 200 ₽)', add: 2200 },
      { label: 'Срочно (в день обращения) ×1.3', mult: 1.3 },
    ],
    formula: (v) => 2400 + v.volume * 320 + v.distance * 80 + v.trips * 1800,
    meta: () => 'КОНТЕЙНЕР · 2–7 ДНЕЙ<br>С АКТОМ НА ПОЛИГОН<br>ТКО / СТРОИТЕЛЬНЫЙ',
  },
  demo: {
    label: 'Демонтаж',
    sliders: [
      {
        key: 'area',
        label: 'Площадь строения',
        unit: 'м²',
        min: 10,
        max: 300,
        step: 5,
        default: 60,
        ariaLabel: 'Площадь строения в квадратных метрах',
      },
      {
        key: 'floors',
        label: 'Этажность',
        unit: '',
        min: 1,
        max: 3,
        step: 1,
        default: 1,
        ariaLabel: 'Количество этажей',
      },
      {
        key: 'wall',
        label: 'Толщина стен',
        unit: 'см',
        min: 10,
        max: 60,
        step: 2,
        default: 20,
        ariaLabel: 'Толщина стен в сантиметрах',
      },
    ],
    options: [
      { label: 'Снос фундамента (+15 000 ₽)', add: 15000 },
      { label: 'Вывоз отходов (+8 000 ₽)', add: 8000, defaultChecked: true },
      { label: 'Разрешительные документы (+5 000 ₽)', add: 5000 },
    ],
    formula: (v) => v.area * (320 + v.wall * 8) * v.floors,
    meta: () => 'СНОС + ВЫВОЗ ОТХОДОВ<br>С РАЗРЕШ. ДОКУМЕНТАМИ<br>ВСЁ В ОДНОМ ДОГОВОРЕ',
  },
}

const TAB_KEYS: TabKey[] = ['arbo', 'kryshi', 'musor', 'demo']

const initialValues = (tab: TabKey): Record<string, number> =>
  Object.fromEntries(TABS[tab].sliders.map((s) => [s.key, s.default]))

const initialChecks = (tab: TabKey): boolean[] =>
  TABS[tab].options.map((o) => o.defaultChecked ?? false)

export function PricingCalculator() {
  const [activeTab, setActiveTab] = useState<TabKey>('arbo')
  const [valuesByTab, setValuesByTab] = useState<Record<TabKey, Record<string, number>>>(() => ({
    arbo: initialValues('arbo'),
    kryshi: initialValues('kryshi'),
    musor: initialValues('musor'),
    demo: initialValues('demo'),
  }))
  const [checksByTab, setChecksByTab] = useState<Record<TabKey, boolean[]>>(() => ({
    arbo: initialChecks('arbo'),
    kryshi: initialChecks('kryshi'),
    musor: initialChecks('musor'),
    demo: initialChecks('demo'),
  }))

  const cfg = TABS[activeTab]
  const vals = valuesByTab[activeTab]
  const checks = checksByTab[activeTab]

  const { price, metaHtml } = useMemo(() => {
    let base = cfg.formula(vals)
    cfg.options.forEach((o, i) => {
      if (!checks[i]) return
      if (o.add) base += o.add
      if (o.mult) base *= o.mult
    })
    return {
      price: Math.round(base / 100) * 100,
      metaHtml: cfg.meta(vals),
    }
  }, [cfg, vals, checks])

  const updateValue = (key: string, value: number) => {
    setValuesByTab((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [key]: value } }))
  }

  const toggleCheck = (i: number) => {
    setChecksByTab((prev) => {
      const next = [...prev[activeTab]]
      next[i] = !next[i]
      return { ...prev, [activeTab]: next }
    })
  }

  return (
    <section className="hp-section" id="calc">
      <div className="wrap">
        <div className="eyebrow">§ 04.5 · Калькулятор · быстрый расчёт</div>
        <h2 style={{ maxWidth: '20ch' }}>Знаете параметры — посчитайте сами</h2>
        <p className="lead">
          Для тех, кто знает высоту дерева, объём контейнера или площадь крыши.{' '}
          <a className="hp-cross" href="#foto-smeta" style={{ marginLeft: '6px' }}>
            Не знаете объём? → Пришлите фото →
          </a>
        </p>

        <div style={{ marginTop: '28px' }}>
          <div className="hp-calc-tabs" role="tablist" aria-label="Выбор калькулятора услуги">
            {TAB_KEYS.map((key) => (
              <button
                key={key}
                className={activeTab === key ? 'hp-calc-tab is-active' : 'hp-calc-tab'}
                role="tab"
                aria-selected={activeTab === key}
                type="button"
                onClick={() => setActiveTab(key)}
              >
                {TABS[key].label}
              </button>
            ))}
          </div>

          <div className="hp-calc">
            <div className="hp-calc-fields">
              {cfg.sliders.map((s) => {
                const value = vals[s.key]
                const fillPct = ((value - s.min) / (s.max - s.min)) * 100
                return (
                  <div className="hp-calc-row" key={s.key}>
                    <label className="lbl">
                      <span>{s.label}</span>
                      <span>
                        {value}
                        {s.unit ? ` ${s.unit}` : ''}
                      </span>
                    </label>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={value}
                      className="hpc-range"
                      style={{ ['--fill' as string]: `${fillPct}%` }}
                      aria-label={s.ariaLabel}
                      aria-valuemin={s.min}
                      aria-valuemax={s.max}
                      aria-valuenow={value}
                      onChange={(e) => updateValue(s.key, Number(e.target.value))}
                    />
                  </div>
                )
              })}

              <div className="hp-calc-options" role="group" aria-label="Дополнительные опции">
                {cfg.options.map((o, i) => (
                  <label className="hp-calc-opt" key={`${activeTab}-${i}`}>
                    <input
                      type="checkbox"
                      className="hp-calc-opt-input"
                      checked={checks[i]}
                      onChange={() => toggleCheck(i)}
                    />
                    <span className="box" aria-hidden="true">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <span className="hp-calc-opt-text">{o.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="hp-calc-result" aria-live="polite" aria-atomic="true">
              <div>
                <div className="lbl">Стоимость</div>
                <div className="num">
                  {price.toLocaleString('ru-RU')}
                  <span className="currency"> ₽</span>
                </div>
                <div className="meta" dangerouslySetInnerHTML={{ __html: metaHtml }} />
              </div>
              <div className="hp-calc-disclaimer">
                Ориентировочная цена. Точная — в смете после бесплатного замера.
              </div>
              <a
                className="btn btn-primary"
                href="#cta"
                style={{ marginTop: '16px', justifyContent: 'center', display: 'flex' }}
              >
                Заказать бесплатный замер →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
