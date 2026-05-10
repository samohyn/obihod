/**
 * Read-only аудит Payload коллекций на упоминания shop / магазин / саженц / питомник.
 *
 * EPIC-SHOP-REMOVAL W5 — pre-deploy verification, что в richText (Lexical) нет
 * orphan-ссылок и упоминаний после ADR-0020 (магазин выведен из проекта).
 *
 * Запуск (локально):
 *   PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=.env.local scripts/audit-shop-mentions.ts
 *
 * Замечание: PAYLOAD_DISABLE_PUSH=1 нужен из-за audit_log push:true escape-hatch
 * (любая dev-сессия Payload без него триггерит drift-push на startup, ADR-0014).
 *
 * Read-only: только find() / no mutations. Hits выводит в stdout — оператор
 * правит руками через admin UI или дополнительным mutation-скриптом.
 *
 * Сохраняем `/dizain-landshafta/` ссылки (landshaft = 5-й pillar, ADR-0020).
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

// Match: /shop, /shop/..., но не /shopping (граница слова) — после `shop` либо
// конец, либо `/`, либо нелатиница. Также «магазин/саженц/питомник» как RU-слова.
// Landshaft (`/dizain-landshafta/`) не матчится — slug содержит «landshaft», не
// «shop|магазин|саженц|питомник».
const SHOP_REGEX = /(\/shop(?:[/"'\s]|$)|магазин|саженц|питомник)/i

const COLLECTIONS = ['services', 'b2b-pages', 'blog', 'cases', 'service-districts'] as const

interface Hit {
  collection: string
  id: string | number
  slug?: string
  title?: string
  matches: string[]
}

async function main(): Promise<void> {
  console.log('[audit-shop-mentions] Подключение к Payload Local API…')
  const payload = await getPayload({ config })
  console.log('[audit-shop-mentions] OK\n')

  const allHits: Hit[] = []
  let totalDocs = 0

  for (const slug of COLLECTIONS) {
    let docs: Array<Record<string, unknown>> = []
    try {
      const r = await payload.find({
        collection: slug,
        limit: 1000,
        pagination: false,
        depth: 0,
        draft: true, // включая drafts для полной картины
      })
      docs = r.docs as Array<Record<string, unknown>>
    } catch (err) {
      console.error(`[${slug}] FAIL: ${(err as Error).message}`)
      continue
    }

    console.log(`[${slug}] docs: ${docs.length}`)
    totalDocs += docs.length

    for (const doc of docs) {
      const json = JSON.stringify(doc)
      const matches = json.match(new RegExp(SHOP_REGEX.source, 'gi'))
      if (matches && matches.length > 0) {
        allHits.push({
          collection: slug,
          id: doc.id as string | number,
          slug: typeof doc.slug === 'string' ? doc.slug : undefined,
          title: typeof doc.title === 'string' ? doc.title : undefined,
          matches: Array.from(new Set(matches.map((m) => m.toLowerCase()))),
        })
      }
    }
  }

  console.log(`\n=== AUDIT RESULT (${totalDocs} docs scanned) ===`)
  if (allHits.length === 0) {
    console.log('OK: 0 hits — Payload контент чист от shop/магазин/саженц/питомник.')
  } else {
    console.log(`HITS: ${allHits.length} doc(s) с упоминаниями`)
    for (const hit of allHits) {
      console.log(
        `\n  - [${hit.collection}] id=${hit.id} slug=${hit.slug ?? '—'} title=${hit.title ?? '—'}`,
      )
      console.log(`    matches: ${hit.matches.join(', ')}`)
    }
    console.log('\nFix: открой каждый doc в /admin → найди richText/text поля → убери ссылки')
    console.log('     /shop/* → /uslugi/ или удали; «магазин саженцев» → удалить упоминание.')
    console.log('     /dizain-landshafta/ — НЕ ТРОГАЙ (5-й pillar per ADR-0020).')
  }
  console.log('\n[audit-shop-mentions] DONE')

  // Завершаем процесс — Payload может держать открытые pg pool connections.
  process.exit(allHits.length > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('[audit-shop-mentions] FATAL:', err)
  process.exit(2)
})
