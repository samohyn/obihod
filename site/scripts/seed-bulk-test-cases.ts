/**
 * Seed test cases for PANEL-BULK-PUBLISH local browser smoke.
 * Создаёт 14 test-cases в draft. Идемпотентно (skip если slug уже есть).
 *
 * Удаление: `pnpm tsx --env-file=.env.local scripts/seed-bulk-test-cases.ts --cleanup`
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })

  if (process.argv.includes('--cleanup')) {
    const stale = await payload.find({
      collection: 'cases',
      where: { slug: { like: 'test-bulk-' } },
      limit: 50,
      depth: 0,
    })
    for (const doc of stale.docs) {
      await payload.delete({ collection: 'cases', id: doc.id })
      console.log(`[seed:bulk] deleted ${doc.slug}`)
    }
    console.log(`[seed:bulk] cleanup done (${stale.docs.length} cases)`)
    process.exit(0)
  }

  const baseCases = await payload.find({
    collection: 'cases',
    where: { slug: { equals: 'snyali-pen-gostitsa-2026' } },
    limit: 1,
    depth: 0,
  })
  if (baseCases.docs.length === 0) {
    console.error('[seed:bulk] base case snyali-pen-gostitsa-2026 not found, run pnpm seed first')
    process.exit(1)
  }
  const base = baseCases.docs[0] as unknown as {
    service: number | string
    district: number | string
    dateCompleted: string
    description: unknown
    photosBefore?: Array<{ image: number | string; caption?: string }>
    photosAfter?: Array<{ image: number | string; caption?: string }>
  }

  const stripIds = (arr?: Array<{ image: number | string; caption?: string }>) =>
    (arr || []).map((p) => ({ image: p.image, caption: p.caption }))

  for (let i = 1; i <= 14; i++) {
    const slug = `test-bulk-${i}`
    const exists = await payload.find({
      collection: 'cases',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (exists.docs.length > 0) {
      console.log(`[seed:bulk] ${slug} already exists, skip`)
      continue
    }
    await payload.create({
      collection: 'cases',
      draft: true,
      data: {
        slug,
        title: `Тестовый кейс bulk #${i}`,
        h1: `H1 тестовый bulk #${i}`,
        service: base.service,
        district: base.district,
        dateCompleted: base.dateCompleted,
        description: base.description as never,
        photosBefore: stripIds(base.photosBefore),
        photosAfter: stripIds(base.photosAfter),
      },
    })
    console.log(`[seed:bulk] ${slug} created (draft)`)
  }
  console.log('[seed:bulk] done')
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed:bulk] failed:', err)
  process.exit(1)
})
