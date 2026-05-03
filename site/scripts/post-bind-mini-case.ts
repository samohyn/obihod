/**
 * post-bind-mini-case — однопроходный пост-process для US-3 follow-up.
 *
 * US-4 W14 Track D step 4 (sustained US-3 mini-case binding).
 *
 * Что делает:
 *   1) Reads все cases (Stage 2 W11 + Stage 3 W13) из Payload.
 *   2) Для каждого case → smart-match SD по (service, district, subServiceSlug=null).
 *      Pillar-level only (subServiceSlug=null), чтобы binding шёл на «крупный»
 *      pillar SD priority-B без перезаписи sub-level.
 *   3) Update SD: miniCase=case.id + noindexUntilCase=false.
 *
 * Логика matching:
 *   - case.service === SD.service AND case.district === SD.district AND SD.subServiceSlug=null;
 *   - Если в случае несколько cases на одну (service, district) — берём первый.
 *   - Cases без service/district — skip.
 *
 * Идемпотентен: если SD.miniCase уже стоит — skip без изменений.
 *
 * Запуск:
 *   PAYLOAD_DISABLE_PUSH=1 pnpm exec tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=.env.local scripts/post-bind-mini-case.ts
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/sa-seo.md AC-2 (sub-cases).
 */

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

interface CaseRef {
  id: string | number
  slug: string
  serviceSlug: string
  districtSlug: string
}

interface SdRef {
  id: string | number
  serviceSlug: string
  districtSlug: string
  subServiceSlug: string | null
  miniCase: string | number | null
  noindexUntilCase: boolean
  publishStatus: string
}

interface BindResult {
  sdId: string | number
  serviceSlug: string
  districtSlug: string
  caseSlug: string
  status: 'bound' | 'skipped-already-set' | 'no-match' | 'error'
  message?: string
}

async function loadCases(payload: Payload): Promise<CaseRef[]> {
  const r = await payload.find({
    collection: 'cases',
    limit: 200,
    pagination: false,
    depth: 1,
    overrideAccess: true,
  })
  const out: CaseRef[] = []
  for (const c of r.docs as Array<{
    id: string | number
    slug: string
    service?: { slug?: string } | string | null
    district?: { slug?: string } | string | null
  }>) {
    const serviceSlug =
      typeof c.service === 'object' && c.service !== null ? (c.service.slug ?? '') : ''
    const districtSlug =
      typeof c.district === 'object' && c.district !== null ? (c.district.slug ?? '') : ''
    if (!serviceSlug || !districtSlug || !c.slug) continue
    out.push({ id: c.id, slug: c.slug, serviceSlug, districtSlug })
  }
  return out
}

async function loadPillarSds(payload: Payload): Promise<SdRef[]> {
  const r = await payload.find({
    collection: 'service-districts',
    limit: 500,
    pagination: false,
    depth: 1,
    overrideAccess: true,
  })
  const out: SdRef[] = []
  for (const sd of r.docs as Array<{
    id: string | number
    service?: { slug?: string } | string | null
    district?: { slug?: string } | string | null
    subServiceSlug?: string | null
    miniCase?: { id?: string | number } | string | number | null
    noindexUntilCase?: boolean
    publishStatus?: string
  }>) {
    const serviceSlug =
      typeof sd.service === 'object' && sd.service !== null ? (sd.service.slug ?? '') : ''
    const districtSlug =
      typeof sd.district === 'object' && sd.district !== null ? (sd.district.slug ?? '') : ''
    const sub = sd.subServiceSlug ?? null
    if (!serviceSlug || !districtSlug) continue
    // Pillar-level only — sub-level SD не трогаем (US-2 sub-content scope).
    if (sub) continue
    const miniCase =
      typeof sd.miniCase === 'object' && sd.miniCase !== null
        ? (sd.miniCase.id ?? null)
        : ((sd.miniCase as string | number | null) ?? null)
    out.push({
      id: sd.id,
      serviceSlug,
      districtSlug,
      subServiceSlug: null,
      miniCase,
      noindexUntilCase: sd.noindexUntilCase ?? true,
      publishStatus: sd.publishStatus ?? 'draft',
    })
  }
  return out
}

function matchCaseToSd(sd: SdRef, cases: CaseRef[]): CaseRef | null {
  for (const c of cases) {
    if (c.serviceSlug === sd.serviceSlug && c.districtSlug === sd.districtSlug) {
      return c
    }
  }
  return null
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_BIND_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_BIND_CONFIRM=yes не выставлен.')
    process.exit(1)
  }

  console.log('[post-bind-mini-case] DATABASE_URI:', dbUri.replace(/:[^@]+@/, ':***@'))

  const payload = await getPayload({ config })

  const cases = await loadCases(payload)
  console.log(`[post-bind-mini-case] cases с service+district: ${cases.length}`)

  const sds = await loadPillarSds(payload)
  console.log(`[post-bind-mini-case] pillar-level SD (subServiceSlug=null): ${sds.length}`)

  const results: BindResult[] = []

  for (const sd of sds) {
    const match = matchCaseToSd(sd, cases)
    if (!match) {
      // Skip — pillar SD без cases остаются noindex-gate'нутыми.
      results.push({
        sdId: sd.id,
        serviceSlug: sd.serviceSlug,
        districtSlug: sd.districtSlug,
        caseSlug: '',
        status: 'no-match',
      })
      continue
    }

    if (sd.miniCase) {
      results.push({
        sdId: sd.id,
        serviceSlug: sd.serviceSlug,
        districtSlug: sd.districtSlug,
        caseSlug: match.slug,
        status: 'skipped-already-set',
        message: `miniCase уже = ${sd.miniCase}`,
      })
      continue
    }

    try {
      await payload.update({
        collection: 'service-districts',
        id: sd.id,
        data: {
          miniCase: match.id,
          noindexUntilCase: false,
        } as never,
        overrideAccess: true,
      })
      results.push({
        sdId: sd.id,
        serviceSlug: sd.serviceSlug,
        districtSlug: sd.districtSlug,
        caseSlug: match.slug,
        status: 'bound',
        message: `noindexUntilCase=false`,
      })
    } catch (e) {
      results.push({
        sdId: sd.id,
        serviceSlug: sd.serviceSlug,
        districtSlug: sd.districtSlug,
        caseSlug: match.slug,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }

  console.log('')
  console.log('================ POST-BIND MINI-CASE SUMMARY ================')
  const counts = {
    bound: results.filter((r) => r.status === 'bound').length,
    alreadySet: results.filter((r) => r.status === 'skipped-already-set').length,
    noMatch: results.filter((r) => r.status === 'no-match').length,
    errors: results.filter((r) => r.status === 'error').length,
  }
  console.log(
    `bound ${counts.bound} · skipped-already-set ${counts.alreadySet} · no-match ${counts.noMatch} · errors ${counts.errors} (всего pillar SD ${results.length})`,
  )
  console.log('==============================================================')
  console.log('')
  console.log('Bound SD (noindex removed):')
  for (const r of results.filter((rr) => rr.status === 'bound')) {
    console.log(
      `  ✓ ${r.serviceSlug} × ${r.districtSlug}   →   /kejsy/${r.caseSlug}/   (sd id=${r.sdId})`,
    )
  }

  if (counts.errors > 0) {
    console.log('')
    console.log('Errors:')
    for (const r of results.filter((rr) => rr.status === 'error')) {
      console.log(`  ✗ ${r.serviceSlug} × ${r.districtSlug} → ${r.message}`)
    }
  }

  process.exit(counts.errors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('post-bind-mini-case failed:', err)
  process.exit(1)
})
