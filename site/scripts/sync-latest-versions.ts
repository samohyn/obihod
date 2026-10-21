/**
 * Последняя версия документа = опубликованное (план 09, этап 4: «ничего не теряется»).
 *
 *   pnpm sync:latest-versions            — отчёт: у каких опубликованных документов последняя
 *                                          версия в истории не совпадает с тем, что на сайте
 *   pnpm sync:latest-versions --apply    — сохранить опубликованное как новую последнюю версию
 *
 * Откуда берётся: ручной откат основных таблиц из дампа (21.10, после `clean:geo-legacy`) вернул
 * основные строки, но не историю — последней версией остался старый черновик. Админка открывает
 * последнюю версию: владелец увидел бы старый черновик, а «Опубликовать» вернуло бы его на сайт.
 * Опубликованное содержимое скрипт не меняет — только добавляет версию.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'

const APPLY = process.argv.includes('--apply')
const COLLECTIONS = [
  'pages',
  'sub-services',
  'blog',
  'cases',
  'authors',
  'districts',
  'service-districts',
] as const
const RAW = { rawOffer: true, keepPublished: true }
const SKIP = new Set(['id', 'createdAt', 'updatedAt'])
const comparable = (doc: Record<string, unknown>) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

async function main() {
  const payload = await getPayload({ config })
  let found = 0
  let ok = 0
  for (const collection of COLLECTIONS) {
    const live = await payload.find({
      collection,
      limit: 1000,
      pagination: false,
      depth: 0,
      context: RAW,
    })
    const latest = await payload.find({
      collection,
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
      // Только опубликованные: у черновика последняя версия и должна отличаться
      if (d._status !== 'published') continue
      const l = latestById.get(d.id as number)
      if (!l || comparable(l) === comparable(d)) continue
      found++
      const differs = Object.keys(d).filter(
        (k) => !SKIP.has(k) && JSON.stringify(d[k]) !== JSON.stringify(l[k]),
      )
      console.error(
        `  ${collection}/${d.slug ?? d.id}: последняя версия «${l._status}», отличается: ${differs.join(', ')}`,
      )
      if (!APPLY) continue
      const data = Object.fromEntries(Object.entries(d).filter(([k]) => !SKIP.has(k)))
      try {
        await payload.update({
          collection,
          id: d.id as number,
          data: data as never,
          draft: false,
          depth: 0,
          context: RAW,
        })
        ok++
      } catch (e) {
        console.error(`    ✗ ${e instanceof Error ? e.message : e}`)
      }
    }
  }
  console.error(
    `[sync:latest-versions] расходится: ${found}${APPLY ? `, сохранено: ${ok}` : ' (для записи — --apply)'}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[sync:latest-versions] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
