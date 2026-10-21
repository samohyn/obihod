/**
 * Цифры оффера в текстах документов → метки «Компания и контакты» (план 09, этап 4.3b).
 *
 *   pnpm offer:tokens            — отчёт: что заменим, что расходится с оффером, что пропустим
 *   pnpm offer:tokens --apply    — записать метки (статус документа не меняется)
 *
 * Метки и значения — lib/offer.ts (OFFER_TOKENS). Заменяем только там, где число в тексте равно
 * числу оффера и фраза про него, — на сайте текст не меняется (проверка — pnpm snapshot:pages до
 * и после). Документы с неопубликованным черновиком не трогаем: правка опубликовала бы черновик.
 */
import { getPayload, type Payload } from 'payload'

import config from '../payload.config.js'
import { DEFAULT_COMPANY, fillOffer, type Company } from '../lib/offer'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, skipMasterTemplateGate: true, keepPublished: true }

/**
 * Поля, которые выводятся на сайте (старые `blocks` не выводятся — не трогаем). Кейсы — истории
 * конкретных заказов: их цифры — факт прошлого, с оффером не меняются.
 */
const FIELDS: Record<string, string[]> = {
  pages: ['title', 'metaTitle', 'metaDescription', 'layout'],
  'sub-services': ['title', 'metaTitle', 'metaDescription', 'layout'],
  blog: ['title', 'h1', 'intro', 'body', 'faqBlock', 'metaTitle', 'metaDescription'],
  authors: ['bio', 'jobTitle', 'metaTitle', 'metaDescription'],
  'service-districts': ['seoH1', 'leadParagraph', 'localFaq', 'localPriceNote'],
}
const SKIP_KEYS =
  /^(id|_status|slug|blockType|blockName|url|href|filename|mimeType|anchor|icon|tone|focus|format|type|version|direction|mode|style|indent|detail|textFormat|textStyle|tag|listType|kind)$/

// Граница слова для кириллицы: \b в JavaScript её не видит. Точку после «мин» не захватываем.
const E = '(?![а-яё])'
const NUM = `\\d+(?:[.,]\\d+)?\\s*(?:минут[аыу]?${E}|мин${E}|час(?:а|ов)?${E}|ч${E}|км${E}|%|₽)`

/**
 * Число + единица → метка по слову-признаку, ближайшему к числу в той же фразе: «Фото или звонок →
 * смета за 30 минут» — смета, «Запросите расчёт — перезвоним за 10 минут» — перезвон. Одно
 * «ответ» — по числу (как в оффере).
 */
const MINUTE_SIGNS = {
  estimate: /смет|фото|расч[её]т|оцен|посчита/giu,
  call: /перезвон|позвон|свяж|звонок|звоним/giu,
}
const HOUR_SIGNS = { emergency: /авари/giu, window: /окн/giu, snow: /снегопад/giu }

function nearest<K extends string>(context: string, signs: Record<K, RegExp>): K | null {
  let best: K | null = null
  let at = -1
  for (const [k, re] of Object.entries(signs) as [K, RegExp][])
    for (const m of context.matchAll(re))
      if ((m.index ?? 0) > at) {
        at = m.index ?? 0
        best = k
      }
  return best
}

function ruleFor(match: string, context: string, c: Company): string | null {
  const m = norm(match)
  const n = Number(m.match(/^\d+/)?.[0])
  const short = /\d\s*(мин|ч)$/u.test(m)
  if (/мин/u.test(m)) {
    const sign =
      nearest(context, MINUTE_SIGNS) ??
      (/ответ|отвеча/iu.test(context) ? (n === c.photoEstimateMinutes ? 'estimate' : 'call') : null)
    if (sign === 'estimate') return short ? '{смета по фото, мин}' : '{смета по фото}'
    if (sign === 'call') return short ? '{перезвон, мин}' : '{перезвон}'
    return null
  }
  if (/^\d+\s*(час|ч$)/u.test(m)) {
    const sign = nearest(context, HOUR_SIGNS)
    if (sign === 'emergency') return short ? '{аварийный выезд, ч}' : '{аварийный выезд}'
    if (sign === 'window') return short ? '{окно приезда, ч}' : '{окно приезда}'
    if (sign === 'snow') return short ? '{снегопад, ч}' : '{снегопад}'
    return null
  }
  if (/км/u.test(m)) {
    if (/оценщик|бесплатн/iu.test(context)) return '{бесплатный выезд}'
    if (/аварий/iu.test(context)) return '{аварийная зона}'
    return null
  }
  if (/%/u.test(m)) return /опозд/iu.test(context) ? '{скидка за опоздание}' : null
  if (/₽/u.test(m)) return /перезвон|позвон|вовремя/iu.test(context) ? '{скидка за перезвон}' : null
  return null
}

const FIXED: { re: RegExp; token: string }[] = [
  { re: /(?<![\d:])8:00–22:00(?![\d:])/gu, token: '{часы работы}' },
  { re: /\+7 \(985\) 170-51-11/gu, token: '{телефон}' },
]

const norm = (s: string) => s.replace(/\s+/gu, ' ').trim()

type Plan = { at: number; len: number; token: string; match: string; line: string }
type Report = { replace: Map<string, string[]>; differs: string[]; skipped: string[] }

/** Замены в одной строке. `hint` — подпись рядом (у цифры в плашке — её подпись). */
function planString(text: string, hint: string, c: Company, where: string, report: Report): Plan[] {
  const plans: Plan[] = []
  for (const f of FIXED)
    for (const m of text.matchAll(f.re))
      plans.push({
        at: m.index ?? 0,
        len: m[0].length,
        token: f.token,
        match: m[0],
        line: `${where}: «${norm(text.slice(Math.max(0, (m.index ?? 0) - 50), (m.index ?? 0) + m[0].length + 20))}»`,
      })
  for (const m of text.matchAll(new RegExp(NUM, 'giu'))) {
    const at = m.index ?? 0
    const before =
      text
        .slice(0, at)
        .split(/[.!?;:·\n]|,\s/u)
        .pop() ?? ''
    const context = `${hint} ${before}`
    const token = ruleFor(m[0], context, c)
    if (!token) continue
    // «за 1–2 часа» — диапазон: метка на верхнюю границу исказит его при смене цифры
    if (/\d\s*[–—-]\s*$/u.test(text.slice(0, at))) {
      report.differs.push(
        `${where}: «${norm(text.slice(Math.max(0, at - 50), at + m[0].length + 20))}» — диапазон, не трогаем`,
      )
      continue
    }
    const value = fillOffer(token, c)
    const line = `${where}: «${norm(text.slice(Math.max(0, at - 50), at + m[0].length + 20))}»`
    if (norm(value) === norm(m[0])) plans.push({ at, len: m[0].length, token, match: m[0], line })
    else report.differs.push(`${line} — в оффере ${norm(value)}`)
  }
  return plans.sort((a, b) => b.at - a.at)
}

/** Обход документа: строки заменяются на месте; возвращает число замен. */
function rewrite(node: unknown, c: Company, where: string, report: Report, hint = ''): number {
  if (Array.isArray(node))
    return node.reduce((n, v, i) => {
      if (typeof v === 'string') {
        const plans = planString(v, hint, c, where, report)
        for (const p of plans) {
          node[i] =
            (node[i] as string).slice(0, p.at) + p.token + (node[i] as string).slice(p.at + p.len)
          report.replace.set(p.token, [...(report.replace.get(p.token) ?? []), p.line])
        }
        return n + plans.length
      }
      return n + rewrite(v, c, where, report, hint)
    }, 0)
  if (!node || typeof node !== 'object') return 0
  const obj = node as Record<string, unknown>
  let n = 0
  for (const [k, v] of Object.entries(obj)) {
    if (SKIP_KEYS.test(k)) continue
    if (typeof v === 'string') {
      // Соседние короткие поля того же объекта — тоже контекст: «10 мин» + подпись «перезвоним
      // после заявки», «за 30 минут» + заголовок «Смета по фото»
      const siblings = Object.entries(obj)
        .filter(([sk, sv]) => sk !== k && typeof sv === 'string' && sv.length <= 80)
        .map(([, sv]) => sv)
        .join(' ')
      const h = `${hint} ${siblings}`
      const plans = planString(v, h, c, where, report)
      let s = v
      for (const p of plans) {
        s = s.slice(0, p.at) + p.token + s.slice(p.at + p.len)
        report.replace.set(p.token, [...(report.replace.get(p.token) ?? []), p.line])
      }
      obj[k] = s
      n += plans.length
    } else n += rewrite(v, c, where, report, hint)
  }
  return n
}

/** Документ без служебных полей, которые отличаются у версии и опубликованного всегда. */
const comparable = (doc: Record<string, unknown>) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

async function main() {
  const payload: Payload = await getPayload({ config })
  const c: Company = {
    ...DEFAULT_COMPANY,
    ...(await payload.findGlobal({ slug: 'company', depth: 0, context: RAW })),
  }
  const report: Report = { replace: new Map(), differs: [], skipped: [] }
  const writes: (() => Promise<unknown>)[] = []

  for (const [collection, fields] of Object.entries(FIELDS)) {
    const live = await payload.find({
      collection: collection as 'pages',
      limit: 1000,
      pagination: false,
      depth: 0,
      context: RAW,
    })
    const latest = await payload.find({
      collection: collection as 'pages',
      limit: 1000,
      pagination: false,
      depth: 0,
      draft: true,
      context: RAW,
    })
    const latestById = new Map(
      latest.docs.map((d) => [d.id, d as unknown as Record<string, unknown>]),
    )
    for (const d of live.docs as unknown as Record<string, unknown>[]) {
      const where = `${collection}/${d.slug ?? d.id}`
      const data: Record<string, unknown> = {}
      for (const f of fields)
        if (d[f] !== undefined && d[f] !== null) data[f] = structuredClone(d[f])
      const before = JSON.stringify(data)
      const n = rewrite(data, c, where, report)
      if (!n) continue
      // Payload сохраняет поверх ПОСЛЕДНЕЙ версии документа. Если она отличается от того, что на сайте,
      // хоть в одном поле (черновик, старая версия после ручного отката базы) — запись вернула бы её
      // целиком: статус, noindex, ориентиры (так было на проде 21.10). Такие документы не трогаем.
      const latest = latestById.get(d.id as number)
      if (!latest || comparable(latest) !== comparable(d)) {
        report.skipped.push(
          `${where} — последняя версия отличается от опубликованной (${n} замен не сделано)`,
        )
        continue
      }
      if (JSON.stringify(data) !== before)
        writes.push(() =>
          payload.update({
            collection: collection as 'pages',
            id: d.id as number,
            data: { ...data, _status: d._status } as never,
            draft: false,
            depth: 0,
            context: RAW,
          }),
        )
    }
  }

  const chrome = (await payload.findGlobal({
    slug: 'site-chrome',
    depth: 0,
    context: RAW,
  })) as Record<string, Record<string, unknown>>
  const chromeData = {
    header: structuredClone(chrome.header),
    footer: structuredClone(chrome.footer),
  }
  if (rewrite(chromeData, c, 'site-chrome', report))
    writes.push(() =>
      payload.updateGlobal({
        slug: 'site-chrome',
        data: chromeData as never,
        depth: 0,
        context: RAW,
      }),
    )

  for (const [token, list] of [...report.replace].sort((a, b) => b[1].length - a[1].length)) {
    console.error(`\n== ${token}: ${list.length}`)
    for (const l of process.env.OFFER_ALL ? list : list.slice(0, 3)) console.error(`  ${l}`)
  }
  console.error(
    `\n== расходится с оффером (не трогаем, на проверку фактов): ${report.differs.length}`,
  )
  for (const l of report.differs) console.error(`  ${l}`)
  console.error(`\n== пропущено: ${report.skipped.length}`)
  for (const l of report.skipped) console.error(`  ${l}`)

  if (!APPLY) {
    console.error(`\n[offer:tokens] документов к записи: ${writes.length} (для записи — --apply)`)
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
  console.error(`\n[offer:tokens] записано документов: ${ok} из ${writes.length}`)
  if (ok) await requestSiteRevalidate('offer:tokens')
  process.exit(0)
}

main().catch((e) => {
  console.error('[offer:tokens] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
