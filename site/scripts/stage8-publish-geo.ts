/**
 * План 09, этап 8 — публикация всех страниц «услуга в районе» и «подуслуга в районе»
 * (команда владельца 28.10.2026 «выкати все страницы», после открытия индексации).
 *
 *   pnpm stage8:publish-geo            — отчёт: что будет опубликовано (ничего не пишет)
 *   pnpm stage8:publish-geo --apply    — опубликовать
 *
 * Каждому черновику: статус «опубликовано», `publishStatus: published`, снят флаг «noindex до
 * кейса» — страница попадает в sitemap и в индекс. Текст не меняется: публикуется последняя
 * правка (та, что сайт уже показывал с noindex). Правило «без мини-кейса из района не
 * публикуем» (requireGatesForPublish) для этой команды обходится — `context.keepPublished`.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }

type R = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

async function main() {
  const payload = await getPayload({ config })
  const latest = await payload.find({
    collection: 'service-districts',
    limit: 1000,
    pagination: false,
    depth: 1,
    draft: true,
    context: RAW,
  })
  const drafts = (latest.docs as unknown as R[]).filter(
    (d) => d._status !== 'published' || d.publishStatus !== 'published' || d.noindexUntilCase,
  )
  const url = (d: R) =>
    `/${d.service?.slug}/${d.subServiceSlug ? `${d.subServiceSlug}/` : ''}${d.district?.slug}/`
  console.error(drafts.map((d) => `  ${url(d)}`).join('\n'))
  console.error(`\n[stage8:publish-geo] к публикации: ${drafts.length} из ${latest.docs.length}`)
  if (!APPLY) process.exit(0)

  let ok = 0
  for (const d of drafts) {
    try {
      await payload.update({
        collection: 'service-districts',
        id: d.id as number,
        data: { _status: 'published', publishStatus: 'published', noindexUntilCase: false } as never,
        draft: false,
        depth: 0,
        context: RAW,
      })
      ok++
    } catch (e) {
      console.error(`  ✗ ${url(d)}: ${e instanceof Error ? e.message : e}`)
    }
  }
  console.error(`\n[stage8:publish-geo] опубликовано: ${ok} из ${drafts.length}`)
  if (ok) await requestSiteRevalidate('stage8:publish-geo')
  process.exit(0)
}

main().catch((e) => {
  console.error('[stage8:publish-geo] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
