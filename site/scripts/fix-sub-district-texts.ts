/**
 * Черновики «подуслуга в районе» (записи «Услуга × район» с подуслугой, страницы
 * /направление/подуслуга/район/) — убрать ошибки шаблона, которым их заполнили:
 *   — «Делаем чистка крыш…», «приезжает в Истре на «санитарная обрезка»» — падежи;
 *   — удалённость от МКАД не та, что у района (на странице рядом — блок фактов района);
 *   — «Аварийная (24/7) — за 2 часа по тарифу 18 400 ₽» для любой подуслуги и района: за аварийной
 *     зоной аварийную бригаду не обещаем (оффер, п. 5), тариф — не этой подуслуги;
 *   — ссылка на блок «… — общие правила и цены», которого на странице нет;
 *   — заметка о цене со строчной буквы.
 *
 *   pnpm fix:sub-district-texts            — отчёт «было → стало»
 *   pnpm fix:sub-district-texts --apply    — записать черновиком (прежнее — в «Версиях»)
 *
 * Правит последнюю версию черновика (её показывают админка и сайт); опубликованные записи не трогает.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { DEFAULT_COMPANY } from '../lib/offer'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }
const FIELDS = ['leadParagraph', 'localFaq', 'localPriceNote'] as const
const SKIP_KEYS =
  /^(id|blockType|format|type|version|direction|mode|style|indent|detail|textFormat|textStyle|tag)$/

type Rule = [RegExp, string]

/** Правила для района: km — его удалённость от МКАД, far — дальше аварийной зоны. */
function rulesFor(km: number | null, far: boolean): Rule[] {
  return [
    [/^Делаем санитарная обрезка /, 'Делаем санитарную обрезку '],
    [/^Делаем (расчистк|чистк|уборк)а /, 'Делаем $1у '],
    [/^Делаем аренда контейнера /, 'Сдаём контейнеры в аренду '],
    [/^Делаем договор на сезон чистки кровель /, 'Заключаем договор на сезон чистки кровель '],
    ...(km !== null
      ? ([
          [/\d+ км от МКАД/g, `${km} км от МКАД`],
          [/(От МКАД до центра \S+) \d+ км/g, `$1 ${km} км`],
        ] as Rule[])
      : []),
    [
      /^Как быстро бригада приезжает (в|во) (.+?) на «.+»\?$/,
      'Как быстро приедет бригада, если объект $1 $2?',
    ],
    [/^Сколько стоит «(.+)» (в|во) (.+)\?$/, 'Сколько стоит $1 $2 $3?'],
    [
      /^Работаете в микрорайоне Истринское водохранилище\?$/,
      'Работаете у Истринского водохранилища?',
    ],
    [
      /Аварийная \(24\/7\) — за \{аварийный выезд\} по тарифу [\d\u00a0 ]+ ₽ за объект до \d+ м³\./,
      far
        ? 'Аварийный выезд — по согласованию, время назовём при звонке.'
        : 'Аварийная бригада 24/7 — за {аварийный выезд}.',
    ],
    [/Базовый прайс на работы: см\. блок «[^»]+» выше\./, 'Базовые цены — в блоке «Цены» выше.'],
  ]
}

type Change = { where: string; before: string; after: string }

function rewrite(v: unknown, path: string, rules: Rule[], out: Change[]): unknown {
  if (typeof v === 'string') {
    let s = v
    for (const [re, to] of rules) s = s.replace(re, to)
    if (s !== v) out.push({ where: path, before: v, after: s })
    return s
  }
  if (Array.isArray(v)) return v.map((x, i) => rewrite(x, `${path}[${i}]`, rules, out))
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(v))
      o[k] = SKIP_KEYS.test(k) ? x : rewrite(x, `${path}.${k}`, rules, out)
    return o
  }
  return v
}

async function main() {
  const payload = await getPayload({ config })
  const company = (await payload.findGlobal({ slug: 'company', depth: 0 })) as {
    emergencyRadiusKm?: number | null
  }
  const radius = company.emergencyRadiusKm ?? DEFAULT_COMPANY.emergencyRadiusKm
  const latest = await payload.find({
    collection: 'service-districts',
    where: { subServiceSlug: { exists: true } },
    limit: 1000,
    pagination: false,
    depth: 1,
    draft: true,
    context: RAW,
  })
  const writes: (() => Promise<unknown>)[] = []
  let places = 0
  for (const d of latest.docs as unknown as Record<string, unknown>[]) {
    if (!d.subServiceSlug || d._status !== 'draft') continue
    const district = d.district as { slug?: string; distanceFromMkad?: number | null } | null
    const service = d.service as { slug?: string } | null
    const km = district?.distanceFromMkad ?? null
    const rules = rulesFor(km, km !== null && km > radius)
    const changes: Change[] = []
    const data: Record<string, unknown> = {}
    for (const f of FIELDS) {
      if (d[f] === undefined || d[f] === null) continue
      // заметка о цене — отдельной строкой под ценами: с заглавной
      const own: Rule[] = f === 'localPriceNote' ? [...rules, [/^в /, 'В ']] : rules
      data[f] = rewrite(d[f], f, own, changes)
    }
    if (!changes.length) continue
    places += changes.length
    console.error(`\n${service?.slug}/${d.subServiceSlug}/${district?.slug} (${km ?? '?'} км)`)
    for (const c of changes) console.error(`  ${c.where}:\n    − ${c.before}\n    + ${c.after}`)
    writes.push(() =>
      payload.update({
        collection: 'service-districts',
        id: d.id as number,
        data: { ...data, _status: 'draft' } as never,
        draft: true,
        depth: 0,
        context: RAW,
      }),
    )
  }
  if (!APPLY) {
    console.error(
      `\n[fix:sub-district-texts] мест: ${places}, записей к записи: ${writes.length} (для записи — --apply)`,
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
  console.error(`\n[fix:sub-district-texts] записано: ${ok} из ${writes.length}`)
  if (ok) await requestSiteRevalidate('fix:sub-district-texts')
  process.exit(0)
}

main().catch((e) => {
  console.error('[fix:sub-district-texts] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
