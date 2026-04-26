/**
 * Временный скрипт OBI-16: публикует все services которые лежат в `_status: 'draft'`.
 *
 * Запуск (prod через SSH):
 *   pnpm publish-services:prod
 *
 * Зачем нужен (один раз):
 *   После первого seed (US-1) все 4 services создались в `_status: 'draft'`.
 *   Pillar-страницы 404 потому что getServiceBySlug() фильтрует на published.
 *   `unstable_cache` blocker уже починен (PR #28). Осталось — physically published.
 *
 * После merge OBI-17 (cms-agent + bot user) этот скрипт становится не нужен —
 * `cms` запускает `pnpm tsx scripts/admin/publish.ts services <slug>` локально.
 *
 * Идемпотентен: уже опубликованные services пропускаются.
 *
 * Source: devteam/specs/EPIC-SITE-MANAGEABILITY (см. OBI-16, OBI-17).
 */
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

type Stat = { slug: string; status: string; action: 'published' | 'skipped' }

async function publishDraftServices(payload: Payload): Promise<Stat[]> {
  const all = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 100,
    pagination: false,
    draft: true, // включает black draft-документы в выборку
  })

  const stats: Stat[] = []

  for (const svc of all.docs as Array<{
    id: string | number
    slug: string
    _status?: 'draft' | 'published'
  }>) {
    if (svc._status === 'published') {
      stats.push({ slug: svc.slug, status: 'published', action: 'skipped' })
      continue
    }

    await payload.update({
      collection: 'services',
      id: svc.id,
      data: {
        _status: 'published' as never,
      },
      draft: false,
    })

    stats.push({ slug: svc.slug, status: 'draft → published', action: 'published' })
  }

  return stats
}

async function main() {
  const payload = await getPayload({ config })

  console.log('>> Publishing draft services...')
  const stats = await publishDraftServices(payload)

  console.log('\n=== Result ===')
  for (const s of stats) {
    const icon = s.action === 'published' ? '✓' : '·'
    console.log(`${icon} ${s.slug.padEnd(20)} ${s.status}`)
  }

  const publishedCount = stats.filter((s) => s.action === 'published').length
  console.log(
    `\nTotal: ${stats.length} services, ${publishedCount} published, ${stats.length - publishedCount} skipped (already published).`,
  )

  process.exit(0)
}

main().catch((err) => {
  console.error('publish-services failed:', err)
  process.exit(1)
})
