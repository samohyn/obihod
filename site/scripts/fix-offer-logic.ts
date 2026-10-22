/**
 * Тексты, которые расходятся с оффером и реальностью, — привести в соответствие (решение владельца
 * 22.10.2026: «скорректируй, чтобы сходилось по логике»; оффер — contex/10_offer.md, подтверждён).
 *
 *   pnpm fix:offer-logic            — отчёт «было → стало» по каждому месту
 *   pnpm fix:offer-logic --apply    — записать (статус документа не меняется, прежнее — в «Версиях»)
 *
 * Что правим: смета по фото — 30 минут, а не 10 (метка {смета по фото}); аварийная бригада — за 2 часа,
 * а не «1–2 часа» ({аварийный выезд}); перезвон — 10 минут ({перезвон}); мессенджеров пока нет —
 * фото и документы на почту ({почта}). Длительность работ («погрузка за 1–2 часа»), даты законов,
 * личные контакты автора и документы ПДн не трогаем.
 * Документы, у которых последняя версия отличается от опубликованной, пропускаем (как offer:tokens);
 * черновики правим по последней версии и сохраняем черновиком.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }

const FIELDS: Record<string, string[]> = {
  pages: ['title', 'metaTitle', 'metaDescription', 'layout'],
  'sub-services': ['title', 'metaTitle', 'metaDescription', 'layout'],
  blog: ['title', 'h1', 'intro', 'body', 'faqBlock', 'metaTitle', 'metaDescription'],
  cases: ['title', 'h1', 'description', 'metaTitle', 'metaDescription'],
  authors: ['bio', 'jobTitle', 'metaTitle', 'metaDescription'],
  'service-districts': ['seoH1', 'leadParagraph', 'localFaq', 'localPriceNote'],
  districts: ['metaDescription'],
  services: ['h1', 'intro', 'metaTitle', 'metaDescription'],
}
/** Не трогаем: документы ПДн (общая формулировка «в мессенджере»), личные контакты автора. */
const EXCLUDE = new Set([
  'pages/politika-konfidentsialnosti',
  'pages/soglasie-na-obrabotku-personalnyh-dannyh',
  'authors/georgy-s',
])
const SKIP_KEYS =
  /^(id|_status|slug|blockType|blockName|url|href|filename|mimeType|anchor|icon|tone|focus|format|type|version|direction|mode|style|indent|detail|textFormat|textStyle|tag|listType|kind)$/

const PHOTO_SECTION =
  '## Куда присылать фото\n\nФото и короткое описание задачи присылайте на почту {почта}: три снимка объекта с разных сторон. Ответим за {перезвон} в рабочие часы, смету пришлём за {смета по фото}. Если удобнее голосом — звоните {телефон}.\n\n'

/** Порядок важен: сначала целые разделы и длинные фразы, потом короткие. */
const RULES: [RegExp, string][] = [
  // разделы про каналы мессенджеров — целиком
  [/## Telegram, MAX, WhatsApp — выбор канала[\s\S]*?(?=\n## |$)/, PHOTO_SECTION],
  [/^Какие каналы — Telegram, MAX, WhatsApp$/, 'Куда присылать фото'],
  [
    /^Мы принимаем фото по трём каналам мессенджеров:[\s\S]*$/,
    'Фото и короткое описание задачи присылайте на почту {почта}: три снимка объекта с разных сторон. Если удобнее голосом — звоните {телефон}, менеджер подскажет, какие снимки нужны.',
  ],
  [
    /^Номер бригадира общий для всех трёх каналов:[\s\S]*$/,
    'Менеджер на связи ежедневно {часы работы}: на заявку отвечаем за {перезвон}, смету по фото присылаем за {смета по фото}.',
  ],
  // мессенджеры → почта
  [
    /Электронная смета приходит в Telegram, MAX или WhatsApp/g,
    'Электронная смета приходит на почту',
  ],
  [/смета по фото за 10 минут в Telegram, MAX или WhatsApp/g, 'смета по фото за {смета по фото}'],
  [/ в Telegram, MAX или WhatsApp на номер бригадира/g, ' на почту {почта}'],
  [/ в Telegram, MAX или WhatsApp/g, ' на почту {почта}'],
  [/ в Telegram или MAX/g, ' на почту'],
  [/копия в Telegram \+ email/g, 'копия на почту'],
  [/ушли в Telegram собственнику/g, 'ушли собственнику на почту'],
  [/по заявке в Telegram или ЭДО/g, 'по заявке на почту или через ЭДО'],
  [/ в Telegram →/g, ' на почту →'],
  [/в тот же мессенджер/g, 'на почту'],
  [/смету в виде сообщения/g, 'смету письмом'],
  // смета по фото — 30 минут
  [/([Сс]мет[аеуы]) за 10 минут по фото/g, '$1 по фото за {смета по фото}'],
  [/за 10 минут после трёх фото/g, 'за {смета по фото} после трёх фото'],
  [/([Сс]мет[аеуы](?: по (?:3 )?фото)?) (за|через) 10 минут/g, '$1 $2 {смета по фото}'],
  [/(считает|оценим|оценивает) за 5[–-]10 минут/g, '$1 за {смета по фото}'],
  [/считает за 10 минут/g, 'считает за {смета по фото}'],
  [/обычно за 5[–-]10 минут/g, 'обычно за {смета по фото}'],
  [/^за 5[–-]10 минут$/, 'за {смета по фото}'],
  [/Через 10 минут (отправля[а-яё]+)/g, 'Через {смета по фото} $1'],
  [/или 10 минут по фото/g, 'или {смета по фото} по фото'],
  [/приходит за 10 минут/g, 'приходит за {смета по фото}'],
  [/за объект за 10 минут/g, 'за объект за {смета по фото}'],
  [/цену работ за 10 минут/g, 'цену работ за {смета по фото}'],
  [/что считается за 10 минут/g, 'что считается за {смета по фото}'],
  [/работает за 10 минут/g, 'работает за {смета по фото}'],
  [/На всё это уходит 10[–-]15 минут/g, 'На всё это уходит до {смета по фото}'],
  // перезвон — 10 минут
  [/отвечает в течение 15 минут/g, 'отвечает в течение {перезвон}'],
  [/скорость ответа — в среднем 10[–-]15 минут/g, 'ответ — за {перезвон}'],
  [/ответ за 10 минут/g, 'ответ за {перезвон}'],
  // аварийная бригада — за 2 часа, до 30 км
  [/Аварийно — до 30 км, за 2 часа/g, 'Аварийно — до {аварийная зона}, за {аварийный выезд}'],
  [/навес снега\) — бригада за 2 часа/g, 'навес снега) — бригада за {аварийный выезд}'],
  [/Аварийная \(24\/7\) — за 1[–-]2 часа/g, 'Аварийная (24/7) — за {аварийный выезд}'],
  [/аварийный режим 24\/7 за 1[–-]2 часа/g, 'аварийный режим 24/7 за {аварийный выезд}'],
  [/за 1[–-]2 часа (аварийный )?24\/7/g, 'за {аварийный выезд} $124/7'],
  [/выезд в течение 1[–-]2 часов/g, 'выезд в течение {аварийный выезд}'],
]

/** В текстах из seed между числом и словом — неразрывный пробел: правила принимают оба. */
const NBSP_RULES: [RegExp, string][] = RULES.map(([re, to]) => [
  new RegExp(re.source.replace(/ /g, '[ \\u00a0]'), re.flags),
  to,
])

type Change = { where: string; before: string; after: string }

function rewrite(v: unknown, path: string, out: Change[]): unknown {
  if (typeof v === 'string') {
    let s = v
    for (const [re, to] of NBSP_RULES) s = s.replace(re, to)
    if (s !== v) out.push({ where: path, before: v, after: s })
    return s
  }
  if (Array.isArray(v)) return v.map((x, i) => rewrite(x, `${path}[${i}]`, out))
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(v))
      o[k] = SKIP_KEYS.test(k) ? x : rewrite(x, `${path}.${k}`, out)
    return o
  }
  return v
}

const comparable = (doc: unknown) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

/** Фрагмент вокруг первого отличия — для отчёта. */
function diffSnippet(a: string, b: string): string {
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  let j = 0
  while (j < a.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++
  const pre = a.slice(Math.max(0, i - 40), i)
  return `…${pre}[${a.slice(i, a.length - j)}] → [${b.slice(i, b.length - j)}]${a.slice(a.length - j, a.length - j + 30)}…`
}

async function main() {
  const payload = await getPayload({ config })
  const writes: (() => Promise<unknown>)[] = []
  const skipped: string[] = []
  let places = 0
  for (const [collection, fields] of Object.entries(FIELDS)) {
    const col = collection as 'pages'
    const [live, latest] = await Promise.all([
      payload.find({ collection: col, limit: 1000, pagination: false, depth: 0, context: RAW }),
      payload.find({
        collection: col,
        limit: 1000,
        pagination: false,
        depth: 0,
        draft: true,
        context: RAW,
      }),
    ])
    const latestById = new Map(
      latest.docs.map((d) => [d.id, d as unknown as Record<string, unknown>]),
    )
    for (const row of live.docs as unknown as Record<string, unknown>[]) {
      const last = latestById.get(row.id as number)
      const isDraft = row._status === 'draft' && last?._status === 'draft'
      const d = isDraft ? last! : row
      const where = `${collection}/${d.slug ?? d.id}`
      if (EXCLUDE.has(where)) continue
      const changes: Change[] = []
      const data: Record<string, unknown> = {}
      for (const f of fields)
        if (d[f] !== undefined && d[f] !== null) data[f] = rewrite(d[f], f, changes)
      if (!changes.length) continue
      if (!isDraft && last && comparable(last) !== comparable(d)) {
        skipped.push(
          `${where} — последняя версия отличается от опубликованной (${changes.length} мест)`,
        )
        continue
      }
      places += changes.length
      console.error(`\n${where}${isDraft ? ' (черновик)' : ''}`)
      for (const c of changes) console.error(`  ${c.where}: ${diffSnippet(c.before, c.after)}`)
      writes.push(() =>
        payload.update({
          collection: col,
          id: d.id as number,
          data: { ...data, ...(d._status ? { _status: d._status } : {}) } as never,
          draft: isDraft,
          depth: 0,
          context: RAW,
        }),
      )
    }
  }
  if (skipped.length) console.error(`\n== пропущено: ${skipped.length}\n  ${skipped.join('\n  ')}`)
  if (!APPLY) {
    console.error(
      `\n[fix:offer-logic] мест: ${places}, документов к записи: ${writes.length} (для записи — --apply)`,
    )
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
  console.error(`\n[fix:offer-logic] записано документов: ${ok} из ${writes.length}`)
  if (ok) await requestSiteRevalidate('fix:offer-logic')
  process.exit(0)
}

main().catch((e) => {
  console.error('[fix:offer-logic] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
