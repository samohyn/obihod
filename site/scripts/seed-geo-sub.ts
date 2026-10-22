/**
 * Местное наполнение 61 страницы «подуслуга в районе» (решение владельца 22.10.2026: «скорректируйте
 * с Perplexity логику, чтобы было не шаблонно») — тексты из site/content/geo-sub/.
 *
 *   pnpm seed:geo-sub            — отчёт: что поменяется и насколько страницы одной подуслуги
 *                                  в разных городах похожи друг на друга сейчас и после
 *   pnpm seed:geo-sub --apply    — записать черновиками «Услуги × район» (прежнее — в «Версиях»)
 *                                  и поправить карточки пяти районов (удалённость, ориентиры)
 *
 * Похожесть — доля общих 5-словных фраз (Жаккар) местного текста страниц одной подуслуги,
 * названия городов перед сравнением убраны: так проверяем «если поменять город, текст останется
 * верным?». Записи «Услуги × район» не опубликованы — пишем черновиком; районы опубликованы —
 * пропускаем, если их последняя версия отличается от опубликованной.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { DISTRICT_FIXES, GEO_SUB, type GeoSubContent } from '../content/geo-sub'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }

type Doc = Record<string, unknown>

const lexical = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textStyle: '',
        textFormat: 0,
        children: [
          { mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 },
        ],
      },
    ],
  },
})

function plain(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(plain).join(' ')
  if (value && typeof value === 'object') {
    const o = value as Doc
    if (typeof o.text === 'string') return o.text
    return Object.entries(o)
      .filter(
        ([k]) => !['id', 'icon', 'type', 'format', 'version', 'direction', 'mode'].includes(k),
      )
      .map(([, v]) => plain(v))
      .join(' ')
  }
  return ''
}

/** Местный текст записи: лид, карточки, вопросы, заметка о цене. */
const localText = (d: Doc) =>
  [d.leadParagraph, d.localInfo, d.localFaq, d.localPriceNote].map(plain).join(' ')

const CITY = /\b(истр|дедовск|химк|пушкин|ивантеевк|жуковск|одинцов)[а-яё]*/giu

function shingles(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(CITY, 'город')
    .replace(/[^а-яёa-z0-9\s]/giu, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const out = new Set<string>()
  for (let i = 0; i + 5 <= words.length; i++) out.add(words.slice(i, i + 5).join(' '))
  return out
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 0
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  return inter / (a.size + b.size - inter)
}

/** Похожесть по группам «направление/подуслуга»: среднее и максимум по парам городов. */
function similarity(texts: Map<string, string>) {
  const groups = new Map<string, [string, Set<string>][]>()
  for (const [key, text] of texts) {
    const g = key.split('/').slice(0, 2).join('/')
    groups.set(g, [...(groups.get(g) ?? []), [key, shingles(text)]])
  }
  const rows: { group: string; mean: number; max: number }[] = []
  for (const [group, items] of groups) {
    const scores: number[] = []
    for (let i = 0; i < items.length; i++)
      for (let j = i + 1; j < items.length; j++) scores.push(jaccard(items[i][1], items[j][1]))
    if (scores.length)
      rows.push({
        group,
        mean: scores.reduce((s, x) => s + x, 0) / scores.length,
        max: Math.max(...scores),
      })
  }
  return rows.sort((a, b) => b.max - a.max)
}

function data(c: GeoSubContent) {
  const first = c.lead.split(/(?<=[.!?])\s/)[0]
  return {
    leadParagraph: lexical(c.lead),
    localInfo: c.info.map((i) => ({
      icon: i.icon,
      title: i.title,
      text: i.text,
      metaLabel: i.metaLabel ?? null,
      metaValue: i.metaValue ?? null,
    })),
    localFaq: c.faq.map(([question, answer]) => ({ question, answer: lexical(answer) })),
    localLandmarks: c.landmarks.map((landmarkName) => ({ landmarkName })),
    localPriceNote: c.price,
    seoDescription: first.length <= 160 ? first : `${first.slice(0, 157).replace(/\s\S*$/, '')}…`,
  }
}

const comparable = (doc: unknown) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

async function main() {
  const payload = await getPayload({ config })
  const latest = await payload.find({
    collection: 'service-districts',
    where: { subServiceSlug: { exists: true } },
    limit: 1000,
    pagination: false,
    depth: 1,
    draft: true,
    context: RAW,
  })
  const byKey = new Map<string, Doc>()
  for (const d of latest.docs as unknown as Doc[]) {
    const service = (d.service as { slug?: string } | null)?.slug
    const district = (d.district as { slug?: string } | null)?.slug
    if (d.subServiceSlug && service && district)
      byKey.set(`${service}/${d.subServiceSlug}/${district}`, d)
  }
  const missing = Object.keys(GEO_SUB).filter((k) => !byKey.has(k))
  const extra = [...byKey.keys()].filter((k) => !(k in GEO_SUB))
  if (missing.length) console.error(`нет записи «Услуги × район» для: ${missing.join(', ')}`)
  if (extra.length) console.error(`нет текста для записей: ${extra.join(', ')}`)

  const before = new Map([...byKey].map(([k, d]) => [k, localText(d)]))
  const after = new Map(
    Object.entries(GEO_SUB).map(([k, c]) => [k, localText(data(c) as unknown as Doc)]),
  )
  const sBefore = new Map(similarity(before).map((r) => [r.group, r]))
  console.error('\n== похожесть страниц одной подуслуги в разных городах (5-словные фразы)')
  console.error('   группа                                   было: ср / макс   станет: ср / макс')
  for (const r of similarity(after)) {
    const b = sBefore.get(r.group)
    const pct = (x?: number) => (x === undefined ? '  —' : `${Math.round(x * 100)}%`.padStart(4))
    console.error(
      `   ${r.group.padEnd(40)} ${pct(b?.mean)} / ${pct(b?.max)}       ${pct(r.mean)} / ${pct(r.max)}`,
    )
  }

  const writes: (() => Promise<unknown>)[] = []
  for (const [key, content] of Object.entries(GEO_SUB)) {
    const d = byKey.get(key)
    if (!d) continue
    if (d._status !== 'draft') {
      console.error(`  пропуск ${key}: запись опубликована — правьте в админке`)
      continue
    }
    writes.push(() =>
      payload.update({
        collection: 'service-districts',
        id: d.id as number,
        data: { ...data(content), _status: 'draft' } as never,
        draft: true,
        depth: 0,
        // без rawOffer: пересчитать оценку уникальности записи
        context: { keepPublished: true },
      }),
    )
  }

  const districts = await payload.find({
    collection: 'districts',
    where: { slug: { in: Object.keys(DISTRICT_FIXES) } },
    limit: 10,
    depth: 0,
    context: RAW,
  })
  const districtsLatest = await payload.find({
    collection: 'districts',
    where: { slug: { in: Object.keys(DISTRICT_FIXES) } },
    limit: 10,
    depth: 0,
    draft: true,
    context: RAW,
  })
  const latestById = new Map(districtsLatest.docs.map((d) => [d.id, d]))
  console.error('\n== карточки районов')
  for (const d of districts.docs as unknown as Doc[]) {
    const fix = DISTRICT_FIXES[d.slug as string]
    const was = (d.landmarks as { name?: string }[] | null)?.map((l) => l.name).join(', ')
    console.error(
      `  ${d.slug}: км ${d.distanceFromMkad} → ${fix.distanceFromMkad ?? d.distanceFromMkad}; ориентиры: ${was} → ${fix.landmarks.map((l) => l.name).join(', ')}`,
    )
    const last = latestById.get(d.id as number)
    if (last && comparable(last) !== comparable(d)) {
      console.error(
        `    пропуск: последняя версия отличается от опубликованной — правьте в админке`,
      )
      continue
    }
    writes.push(() =>
      payload.update({
        collection: 'districts',
        id: d.id as number,
        data: {
          ...(fix.distanceFromMkad ? { distanceFromMkad: fix.distanceFromMkad } : {}),
          landmarks: fix.landmarks,
          _status: d._status,
        } as never,
        draft: false,
        depth: 0,
        context: RAW,
      }),
    )
  }

  if (!APPLY) {
    console.error(`\n[seed:geo-sub] к записи: ${writes.length} документов (для записи — --apply)`)
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
  console.error(`\n[seed:geo-sub] записано: ${ok} из ${writes.length}`)
  if (ok) await requestSiteRevalidate('seed:geo-sub')
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed:geo-sub] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
