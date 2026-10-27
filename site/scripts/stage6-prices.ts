/**
 * Этап 6 плана 09 — новые цены по решению владельца 27.10.2026 (сверка с рынком МО, Perplexity).
 *
 *   pnpm stage6:prices            — отчёт: что поменяется (ничего не пишет)
 *   pnpm stage6:prices --apply    — записать (статус документа не меняется, прежнее — в «Версиях»)
 *
 * Что меняем (решения владельца):
 *   • спил дерева до 20 см: «от 700 ₽» → «от 2 500 ₽»; таблица «Простой» 2 500 / 4 500 / 6 500 / 8 500,
 *     «Сложный» 3 800 / 6 500 / 9 800 / 16 200, «Аварийный» без изменений;
 *   • кровли: частный дом (скатная) остаётся от 1 000 ₽/м² (как в реальных кейсах), плоские и
 *     большие — от 150 ₽/м² (слой 25–40 см — 225, свыше 40 см или наледь — 300: пропорции прежнего
 *     прайса); общая «от»-цена направления — «от 150 ₽/м²»;
 *   • покос — от 800 ₽ за сотку (было «80 ₽ за м²»), выравнивание — от 100 ₽/м², расчистка — от 8 000 ₽
 *     за сотку (средняя 10 000, густая 14 000 — пропорции прежнего прайса);
 *   • вывоз мусора и снос дачи — без изменений (владелец подтвердил);
 *   • главная: таблицы «Вывоз мусора» и «Крыши и снег» приведены к подтверждённым ценам.
 *
 * Свои правки владельца в админке не затираем: каждое правило меняет значение, только если оно равно
 * прежнему, иначе пропускает и пишет об этом. Опубликованные документы, у которых последняя версия
 * отличается от опубликованной, пропускаем; черновики правим по последней версии (как stage2:offer).
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }

type R = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
type Log = (msg: string) => void

const NB = '\u00a0'
const SP = '[\\s\\u00a0\\u202f]'
/** 2500 → «2 500» с неразрывным пробелом, как в хранимых строках. */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB)
const rub = (n: number) => `${fmt(n)}${NB}₽`
/** Регулярка по строке с «обычными» пробелами: терпима к неразрывным и узким. */
const loose = (s: string, flags = '') =>
  new RegExp(s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&').replace(/ /g, `${SP}`), flags)

const SIMPLE = [2500, 4500, 6500, 8500]
const COMPLEX = [3800, 6500, 9800, 16200]
const FREE_OLD = [700, 1800, 4200, 8400]
const COMPLEX_OLD = [2400, 4800, 9800, 16200]

// ── помощники по блокам ────────────────────────────────────────────────────────────────────────
const blocks = (doc: R, type: string): R[] =>
  ((doc.layout as R[] | undefined) ?? []).filter((b) => b.blockType === type)

const num = (v: unknown) => Number(String(v ?? '').replace(/[^\d]/g, ''))
/** Названия в БД с неразрывными пробелами («20 см»): для сравнения приводим к обычным. */
const norm = (v: unknown) => String(v ?? '').replace(/[\u00a0\u202f]/g, ' ')

function setStr(obj: R, key: string, from: RegExp | string, to: string, log: Log, where: string) {
  const cur = obj[key]
  if (typeof cur !== 'string') return
  const re = typeof from === 'string' ? loose(from) : from
  if (!re.test(cur)) return
  const next = cur.replace(re, to)
  if (next !== cur) {
    log(`${where}: «${cur.slice(0, 400)}» → «${next.slice(0, 400)}»`)
    obj[key] = next
  }
}

/** Строка таблицы цен по названию: подменяет значения, если они равны прежним. */
function setRow(
  doc: R,
  rowName: RegExp,
  oldVals: number[],
  newVals: number[],
  log: Log,
  tab?: RegExp,
) {
  for (const b of blocks(doc, 'price-tabs'))
    for (const t of (b.tabs as R[]) ?? []) {
      if (tab && !tab.test(norm(t.label))) continue
      for (const r of (t.rows as R[]) ?? []) {
        if (!rowName.test(norm(r.name))) continue
        const vals = (r.values as R[]) ?? []
        const cur = vals.map((v) => num(v.value))
        if (oldVals.every((o, i) => cur[i] === o)) {
          newVals.forEach((n, i) => {
            if (vals[i]) vals[i].value = fmt(n)
          })
          log(`строка «${r.name}»: ${cur.join(' / ')} → ${newVals.join(' / ')}`)
        } else if (newVals.every((n, i) => cur[i] === n)) {
          // уже новое
        } else
          log(
            `⚠ строка «${r.name}»: ${cur.join(' / ')} — не равна прежней ${oldVals.join(' / ')}, пропускаю`,
          )
      }
    }
}

/** Калькулятор: услуга с такими же прежними базами получает новые (подпись «N ₽ за м²» тоже). */
function setCalc(doc: R, oldBases: number[], newBases: number[], log: Log) {
  for (const b of blocks(doc, 'calculator-v3'))
    for (const s of (b.services as R[]) ?? []) {
      const kinds = (s.kinds as R[]) ?? []
      const cur = kinds.map((k) => Number(k.base))
      if (oldBases.every((o, i) => cur[i] === o)) {
        newBases.forEach((n, i) => {
          if (!kinds[i]) return
          kinds[i].base = n
          if (typeof kinds[i].unit === 'string' && /₽/.test(kinds[i].unit))
            kinds[i].unit = String(kinds[i].unit).replace(/[\d\s\u00a0\u202f]+₽/, `${rub(n)}`)
        })
        log(`калькулятор «${s.label}»: ${cur.join(' / ')} → ${newBases.join(' / ')}`)
      }
    }
}

/** Одна позиция калькулятора по подписи и старой базе (плоские кровли). */
function setKind(doc: R, label: RegExp, oldBase: number, newBase: number, log: Log) {
  for (const b of blocks(doc, 'calculator-v3'))
    for (const s of (b.services as R[]) ?? [])
      for (const k of (s.kinds as R[]) ?? [])
        if (label.test(norm(k.label)) && Number(k.base) === oldBase) {
          k.base = newBase
          if (typeof k.unit === 'string')
            k.unit = String(k.unit).replace(/[\d\s\u00a0\u202f]+₽/, rub(newBase))
          log(`калькулятор «${k.label}»: ${oldBase} → ${newBase}`)
        }
}

function hero(doc: R): { slide: R; badge: R } | null {
  const h = blocks(doc, 'hero-slider')[0]
  if (!h) return null
  return { slide: (h.slides as R[])[0] ?? {}, badge: (h.badge as R) ?? {} }
}

// ── плитки: «от N ₽» по названию (везде) ───────────────────────────────────────────────────────
const TILE_RULES: { title: RegExp; from: RegExp; to: string }[] = [
  {
    title: /^(Спил деревьев|Спил и уход за деревьями)$/,
    from: loose('от 700 ₽'),
    to: `от ${rub(2500)}`,
  },
  { title: /^Валка целиком$/, from: loose('от 700 ₽'), to: `от ${rub(2500)}` },
  { title: /^Валка целиком$/, from: loose('от 2 400 ₽'), to: `от ${rub(2500)}` },
  { title: /^По частям с альпинистом$/, from: loose('от 2 400 ₽'), to: `от ${rub(3800)}` },
  {
    title: /^(Крыши и снег|Очистка крыш от снега)$/,
    from: loose('от 1 000 ₽/м²'),
    to: `от ${rub(150)}/м²`,
  },
  { title: /^Расчистка участка$/, from: loose('от 28 000 ₽/сотка'), to: `от ${rub(8000)}/сотка` },
  {
    title: /^Расчистка участка$/,
    from: loose('от 28 000 ₽ за сотку'),
    to: `от ${rub(8000)} за сотку`,
  },
  { title: /^Выравнивание участка$/, from: loose('от 150 ₽/м²'), to: `от ${rub(100)}/м²` },
]

function tiles(doc: R, log: Log) {
  for (const b of [...blocks(doc, 'services-tiles'), ...blocks(doc, 'equipment')])
    for (const it of (b.items as R[]) ?? []) {
      if (typeof it.price !== 'string') continue
      for (const r of TILE_RULES)
        if (r.title.test(norm(it.title)) && r.from.test(it.price)) {
          log(`плитка «${it.title}»: ${it.price} → ${r.to}`)
          it.price = r.to
          break
        }
    }
}

// ── правила по документам ──────────────────────────────────────────────────────────────────────
type Rule = (doc: R, log: Log) => void
const RULES: Record<string, Rule> = {
  // дерево: спил до 20 см
  'pages/arboristika': (d, log) => {
    setStr(d, 'metaTitle', 'от 700 ₽', `от ${rub(2500)}`, log, 'метазаголовок')
    setStr(d, 'metaDescription', 'От 700 ₽ за дерево', `От ${rub(2500)} за дерево`, log, 'описание')
    const h = hero(d)
    if (h) {
      setStr(
        h.slide,
        'kicker',
        'от 700 ₽ за дерево',
        `от ${rub(2500)} за дерево`,
        log,
        'первый экран',
      )
      setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
    }
    setRow(d, /^Спил дерева до 20 см$/, [700], [2500], log)
    setRow(d, /^Расчистка участка$/, [28000], [8000], log)
  },
  'sub-services/spil-derevev': (d, log) => {
    setStr(d, 'metaTitle', 'от 700 ₽', `от ${rub(2500)}`, log, 'метазаголовок')
    const h = hero(d)
    if (h) {
      setStr(
        h.slide,
        'kicker',
        'от 700 ₽ за ствол',
        `от ${rub(2500)} за ствол`,
        log,
        'первый экран',
      )
      setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
    }
    setRow(d, /^Простой$/, FREE_OLD, SIMPLE, log)
    setRow(d, /^Сложный$/, COMPLEX_OLD, COMPLEX, log)
    for (const b of blocks(d, 'faq-v3'))
      for (const q of (b.items as R[]) ?? []) {
        setStr(
          q,
          'answer',
          'от 700 ₽ за ствол до 20 см',
          `от ${rub(2500)} за ствол до 20 см`,
          log,
          'FAQ',
        )
        setStr(q, 'answer', 'проводами — от 2 400 ₽', `проводами — от ${rub(3800)}`, log, 'FAQ')
      }
  },
  'sub-services/vyrubka-elok': (d, log) => {
    setStr(d, 'metaTitle', 'от 700 ₽', `от ${rub(2500)}`, log, 'метазаголовок')
    const h = hero(d)
    if (h) {
      setStr(
        h.slide,
        'kicker',
        'от 700 ₽ за ствол',
        `от ${rub(2500)} за ствол`,
        log,
        'первый экран',
      )
      setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
    }
    setRow(d, /^В свободную сторону$/, [700, 4800, 6800, 8400], SIMPLE, log)
    setRow(d, /^Сложный$/, [2400, 7800, 12600, 16200], [3800, 7800, 12600, 16200], log)
    setCalc(d, [700, 4800, 6800, 8400], SIMPLE, log)
    setCalc(d, [2400, 7800, 12600, 16200], [3800, 7800, 12600, 16200], log)
  },
  'sub-services/valka-derevev': (d, log) => {
    setStr(d, 'metaTitle', 'от 2 400 ₽', `от ${rub(2500)}`, log, 'метазаголовок')
    setStr(d, 'metaDescription', 'От 2 400 ₽ за ствол', `От ${rub(2500)} за ствол`, log, 'описание')
    const h = hero(d)
    if (h) {
      setStr(
        h.slide,
        'kicker',
        'от 2 400 ₽ за ствол',
        `от ${rub(2500)} за ствол`,
        log,
        'первый экран',
      )
      setStr(h.badge, 'value', 'от 2 400 ₽', `от ${rub(2500)}`, log, 'плашка')
    }
    setRow(d, /^Валка целиком$/, [2400, 4800, 6800, 8400], SIMPLE, log)
    setCalc(d, [2400, 4800, 6800, 8400], SIMPLE, log)
  },
  'sub-services/avariynyy-spil': (d, log) => {
    for (const b of blocks(d, 'tree-check')) {
      const c = b.consult as R | undefined
      if (c)
        setStr(
          c,
          'text',
          'от 700 ₽ за ствол до 20 см',
          `от ${rub(2500)} за ствол до 20 см`,
          log,
          'врезка',
        )
    }
  },

  // кровли: частный дом — 1 000, плоские и большие — 150
  'pages/chistka-krysh': (d, log) => {
    setStr(d, 'metaTitle', '— от 1 000 ₽/м²', `— от ${rub(150)}/м²`, log, 'метазаголовок')
    const h = hero(d)
    if (h) {
      setStr(h.slide, 'kicker', 'от 1 000 ₽ за м²', `от ${rub(150)} за м²`, log, 'первый экран')
      setStr(h.badge, 'value', 'от 1 000 ₽', `от ${rub(150)}`, log, 'плашка')
      setStr(
        h.badge,
        'text',
        'за м² скатной кровли без наледи',
        'за м² плоской или большой кровли',
        log,
        'плашка',
      )
      setStr(
        h.badge,
        'note',
        'Для УК — договор на сезон',
        `Частный дом — от ${rub(1000)}/м²`,
        log,
        'плашка',
      )
    }
    setRow(d, /^Плоская кровля$/, [1200], [150], log)
    for (const b of blocks(d, 'price-tabs'))
      for (const t of (b.tabs as R[]) ?? [])
        for (const r of (t.rows as R[]) ?? []) {
          if (norm(r.name) === 'Скатная кровля' && num((r.values as R[])[0]?.value) === 1000) {
            r.name = 'Скатная кровля частного дома'
            log('строка «Скатная кровля» → «Скатная кровля частного дома» (1 000 остаётся)')
          }
          if (norm(r.name) === 'Плоская кровля' && num((r.values as R[])[0]?.value) === 150) {
            r.name = 'Плоская или большая кровля'
            log('строка «Плоская кровля» → «Плоская или большая кровля»')
          }
        }
    setKind(d, /^Плоская, плановая$/, 1200, 150, log)
    setKind(d, /^Плоская, слой 25–40 см$/, 1800, 225, log)
  },
  'sub-services/ot-snega': (d, log) => {
    setStr(d, 'metaTitle', 'от 1 000 ₽/м²', `от ${rub(150)}/м²`, log, 'метазаголовок')
    setStr(
      d,
      'metaDescription',
      'плоская — от 1 200 ₽/м²',
      `плоская — от ${rub(150)}/м²`,
      log,
      'описание',
    )
    const h = hero(d)
    if (h) {
      setStr(h.slide, 'kicker', 'от 1 000 ₽ за м²', `от ${rub(150)} за м²`, log, 'первый экран')
      setStr(h.badge, 'value', 'от 1 000 ₽', `от ${rub(150)}`, log, 'плашка')
      setStr(
        h.badge,
        'text',
        'за м² скатной кровли без наледи',
        'за м² плоской или большой кровли',
        log,
        'плашка',
      )
      setStr(
        h.badge,
        'note',
        'Плоская кровля — от 1 200 ₽/м²',
        `Скатная частного дома — от ${rub(1000)}/м²`,
        log,
        'плашка',
      )
    }
    setRow(d, /^Плановая чистка$/, [1200], [150], log)
    setRow(d, /^Слой 25–40 см$/, [1800], [225], log)
    setRow(d, /^Слой свыше 40 см или наледь$/, [2400], [300], log)
    setKind(d, /^Плоская, плановая$/, 1200, 150, log)
    setKind(d, /^Плоская, слой 25–40 см$/, 1800, 225, log)
    for (const b of blocks(d, 'about-stats'))
      for (const s of (b.stats as R[]) ?? [])
        if (/плоской кровли/.test(norm(s.label)) && num(s.value) === 1200) {
          log(`цифра «${s.label}»: ${s.value} → ${rub(150)}`)
          s.value = rub(150)
        }
    for (const b of blocks(d, 'faq-v3'))
      for (const q of (b.items as R[]) ?? []) {
        setStr(
          q,
          'question',
          'Почему плоская кровля дороже?',
          'Почему цена плоской кровли зависит от слоя снега?',
          log,
          'FAQ',
        )
        setStr(
          q,
          'answer',
          'Цена зависит от слоя: 1 200, 1 800 или 2 400 ₽ за м².',
          `Цена зависит от слоя: ${fmt(150)}, ${fmt(225)} или ${fmt(300)} ₽ за м².`,
          log,
          'FAQ',
        )
      }
  },
  'sub-services/chistka-krysh-mkd': (d, log) => {
    setRow(d, /^Плоская кровля$/, [1200], [150], log)
  },

  // уборка территории: покос, выравнивание, расчистка
  'pages/uborka-territorii': (d, log) => {
    for (const b of blocks(d, 'price-tabs'))
      for (const t of (b.tabs as R[]) ?? [])
        for (const r of (t.rows as R[]) ?? []) {
          const v = (r.values as R[])[0]
          if (/^Покос травы$/.test(norm(r.name)) && num(v?.value) === 80) {
            log(`строка «Покос травы»: 80 ₽/м² → 800 ₽ за сотку`)
            v.value = fmt(800)
            r.note = 'за сотку, обычная трава'
          }
          if (/^Выравнивание участка$/.test(norm(r.name)) && num(v?.value) === 250) {
            log(`строка «Выравнивание участка»: 250 → 100 ₽/м²`)
            v.value = fmt(100)
          }
          if (/^Расчистка участка$/.test(norm(r.name)) && num(v?.value) === 28000) {
            log(`строка «Расчистка участка»: 28 000 → 8 000 за сотку`)
            v.value = fmt(8000)
          }
        }
  },
  'sub-services/raschistka-uchastka': (d, log) => {
    setStr(d, 'metaTitle', 'от 28 000 ₽ за сотку', `от ${rub(8000)} за сотку`, log, 'метазаголовок')
    setStr(
      d,
      'metaDescription',
      'От 28 000 ₽ за сотку',
      `От ${rub(8000)} за сотку`,
      log,
      'описание',
    )
    const h = hero(d)
    if (h) {
      setStr(
        h.slide,
        'kicker',
        'от 28 000 ₽ за сотку',
        `от ${rub(8000)} за сотку`,
        log,
        'первый экран',
      )
      setStr(h.badge, 'value', 'от 28 000 ₽', `от ${rub(8000)}`, log, 'плашка')
    }
    setRow(d, /^Лёгкая$/, [28000], [8000], log)
    setRow(d, /^Средняя$/, [36000], [10000], log)
    setRow(d, /^Густая$/, [48000], [14000], log)
    setRow(d, /^Лёгкое$/, [4200], [10000], log, /Выравнивание/)
    setCalc(d, [28000, 36000, 48000], [8000, 10000, 14000], log)
  },
  'pages/b2b/zastrojschikam': (d, log) => {
    for (const b of blocks(d, 'faq-v3'))
      for (const q of (b.items as R[]) ?? [])
        setStr(q, 'answer', 'от 28 000 ₽ за сотку', `от ${rub(8000)} за сотку`, log, 'FAQ')
  },

  // хабы и калькуляторы-лендинги
  'pages/uslugi': (d, log) => {
    const h = hero(d)
    if (h) setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
  },
  'pages/uslugi/tseny': (d, log) => {
    const h = hero(d)
    if (h) setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
  },
  'pages/uslugi/tseny/arboristika': (d, log) => {
    const h = hero(d)
    if (h) setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
  },
  'pages/uslugi/tseny/raschet-stoimosti': (d, log) => {
    const h = hero(d)
    if (h) setStr(h.badge, 'value', 'от 700 ₽', `от ${rub(2500)}`, log, 'плашка')
  },
  'pages/uslugi/tseny/chistka-krysh': (d, log) => {
    const h = hero(d)
    if (h) setStr(h.badge, 'value', 'от 1 000 ₽', `от ${rub(150)}`, log, 'плашка')
  },
  'pages/raschet-stoimosti': (d, log) => {
    setRow(d, /^Спил дерева$/, [700], [2500], log)
  },
}

/** Правила для всех документов: плитки и калькуляторы по сигнатуре цен. */
const COMMON: Rule = (d, log) => {
  tiles(d, log)
  setCalc(d, FREE_OLD, SIMPLE, log)
  setCalc(d, COMPLEX_OLD, COMPLEX, log)
  setKind(d, /^Плоская, плановая$/, 1200, 150, log)
  setKind(d, /^Плоская, слой 25–40 см$/, 1800, 225, log)
}

// ── главная: плитки направлений и таблицы «Вывоз мусора», «Крыши и снег» ────────────────────────
const row = (name: string, note: string, ...v: number[]) => ({
  name,
  note,
  values: v.map((n) => ({ value: fmt(n) })),
})
const HOME_TILES: Record<string, [RegExp, string]> = {
  Арбористика: [loose('от 4 500 ₽'), `от ${rub(2500)}`],
  'Вывоз мусора': [loose('от 5 500 ₽'), `от ${rub(12800)}`],
  'Чистка крыш и снег': [loose('от 25 ₽/м²'), `от ${rub(150)}/м²`],
  'Уборка территории': [loose('от 3 000 ₽'), `от ${rub(800)}/сотка`],
}
const HOME: Rule = (d, log) => {
  for (const b of blocks(d, 'services-tiles'))
    for (const it of (b.items as R[]) ?? []) {
      const r = HOME_TILES[norm(it.title)]
      if (r && typeof it.price === 'string' && r[0].test(it.price)) {
        log(`плитка «${it.title}»: ${it.price} → ${r[1]}`)
        it.price = r[1]
      }
    }
  for (const b of blocks(d, 'price-tabs'))
    for (const t of (b.tabs as R[]) ?? []) {
      if (t.label === 'Вывоз мусора' && t.unit === 'за рейс') {
        // строки и сноски — как на странице «Вывоз мусора» (подтверждено владельцем)
        t.unit = 'за подачу'
        t.columns = [{ value: 'Цена' }]
        t.rows = [
          row('Газель 5 м³ с грузчиками', 'два грузчика, погрузка, вывоз', 12800),
          row('Контейнер 8 м³', 'сутки на участке', 14800),
          row('Контейнер 20 м³', 'сутки на участке', 18500),
          row('Контейнер 27 м³', 'сутки на участке', 23500),
        ]
        t.notes = [
          { value: 'Цена за объект, а не за час' },
          { value: 'Все доплаты — в смете до подачи' },
        ]
        log(
          'таблица «Вывоз мусора»: цены по зонам → подтверждённый прайс (12 800 / 14 800 / 18 500 / 23 500), сноски как на странице услуги',
        )
      }
      if (
        t.label === 'Крыши и снег' &&
        t.unit === 'за м²' &&
        ((t.columns as R[]) ?? []).length > 1
      ) {
        t.columns = [{ value: 'Цена' }]
        t.rows = [
          row('Скатная кровля частного дома', 'за м², без наледи', 1000),
          row('Плоская или большая кровля', 'за м², плановая чистка', 150),
          row('Сосульки, козырёк входа', 'за выезд', 4200),
        ]
        log(
          'таблица «Крыши и снег»: 35 / 30 / 25 ₽/м² → частный дом 1 000, плоская и большая 150, сосульки за выезд 4 200',
        )
      }
    }
}

const comparable = (doc: unknown) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

async function main() {
  const payload = await getPayload({ config })
  const writes: (() => Promise<unknown>)[] = []
  const skipped: string[] = []
  const summary: string[] = []

  for (const collection of ['pages', 'sub-services'] as const) {
    const [live, latest] = await Promise.all([
      payload.find({ collection, limit: 1000, pagination: false, depth: 0, context: RAW }),
      payload.find({
        collection,
        limit: 1000,
        pagination: false,
        depth: 0,
        draft: true,
        context: RAW,
      }),
    ])
    const latestById = new Map(latest.docs.map((d) => [d.id, d as unknown as R]))
    for (const row0 of live.docs as unknown as R[]) {
      const last = latestById.get(row0.id as number)
      const isDraft = row0._status === 'draft' && last?._status === 'draft'
      const base = isDraft ? last! : row0
      const where = `${collection}/${base.slug}`
      const doc = JSON.parse(JSON.stringify(base)) as R
      const lines: string[] = []
      const log: Log = (m) => lines.push(m)
      COMMON(doc, log)
      RULES[where]?.(doc, log)
      if (where === 'pages/home') HOME(doc, log)
      if (!lines.length) continue
      if (!isDraft && last && comparable(last) !== comparable(base)) {
        skipped.push(`${where} — последняя версия отличается от опубликованной`)
        continue
      }
      summary.push(`\n== ${where}${isDraft ? ' (черновик)' : ''}\n  ${lines.join('\n  ')}`)
      const data: R = { layout: doc.layout, _status: base._status }
      for (const k of ['metaTitle', 'metaDescription']) if (doc[k] !== base[k]) data[k] = doc[k]
      writes.push(() =>
        payload.update({
          collection,
          id: base.id as number,
          data: data as never,
          draft: isDraft,
          depth: 0,
          context: RAW,
        }),
      )
    }
  }

  // коллекция «Услуги»: цена «от» для плиток без своей цены
  const services = await payload.find({
    collection: 'services',
    limit: 100,
    pagination: false,
    depth: 0,
    context: RAW,
  })
  const SERVICE_PRICES: Record<string, [number, number]> = {
    arboristika: [700, 2500],
    'chistka-krysh': [1000, 150],
  }
  for (const s of services.docs as unknown as R[]) {
    const p = SERVICE_PRICES[String(s.slug)]
    if (p && Number(s.priceFrom) === p[0]) {
      summary.push(`\n== services/${s.slug}\n  priceFrom: ${p[0]} → ${p[1]}`)
      writes.push(() =>
        payload.update({
          collection: 'services',
          id: s.id as number,
          data: { priceFrom: p[1] } as never,
          depth: 0,
          context: RAW,
        }),
      )
    }
  }

  // «Услуга × район»: местная заметка о цене (черновики гео-страниц) — точечные замены
  const NOTES: [RegExp, string][] = [
    [
      loose('700 ₽ ствол до 20 см, 4 200 ₽ до 60 см'),
      `${rub(2500)} ствол до 20 см, ${rub(6500)} до 60 см`,
    ],
    [
      loose('700 ₽ ствол до 20 см, 8 400 ₽ свыше 60 см'),
      `${rub(2500)} ствол до 20 см, ${rub(8500)} свыше 60 см`,
    ],
    [
      loose('600 ₽/м² плоская, 1 000 ₽/м² скатная'),
      `от ${rub(150)}/м² плоская, ${rub(1000)}/м² скатная (частный дом)`,
    ],
    [
      loose('1 000 ₽/м² скатная, 600 ₽/м² плоская'),
      `${rub(1000)}/м² скатная (частный дом), от ${rub(150)}/м² плоская`,
    ],
  ]
  const districts = await payload.find({
    collection: 'service-districts',
    limit: 1000,
    pagination: false,
    depth: 0,
    draft: true,
    context: RAW,
  })
  for (const d of districts.docs as unknown as R[]) {
    const note = typeof d.localPriceNote === 'string' ? d.localPriceNote : ''
    const rule = NOTES.find(([from]) => from.test(note))
    if (!rule) continue
    const next = note.replace(rule[0], rule[1])
    summary.push(`\n== service-districts/${d.id} (${d._status})\n  «${note}» → «${next}»`)
    writes.push(() =>
      payload.update({
        collection: 'service-districts',
        id: d.id as number,
        data: { localPriceNote: next } as never,
        draft: d._status === 'draft',
        depth: 0,
        context: RAW,
      }),
    )
  }

  console.error(summary.join('\n'))
  if (skipped.length) console.error(`\n== пропущено: ${skipped.length}\n  ${skipped.join('\n  ')}`)
  if (!APPLY) {
    console.error(`\n[stage6:prices] документов к записи: ${writes.length} (для записи — --apply)`)
    process.exit(0)
  }
  let ok = 0
  for (const w of writes) {
    try {
      await w()
      ok++
    } catch (e) {
      console.error(`  ✗ ${e instanceof Error ? e.message : e}`)
    }
  }
  console.error(`\n[stage6:prices] записано: ${ok} из ${writes.length}`)
  if (ok) await requestSiteRevalidate('stage6:prices')
  process.exit(0)
}

main().catch((e) => {
  console.error('[stage6:prices] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
