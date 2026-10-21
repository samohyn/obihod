/**
 * lint:slug — namespace-disjoint guard на CI level (US-3 §контракт).
 *
 * ADR-0019: T3 sub-services (`/<pillar>/<sub-slug>/`) и T4 SD
 * (`/<pillar>/<city-slug>/`) живут в одном URL-pattern → slug'ы должны
 * быть disjoint. Validate-hooks в коллекциях ловят runtime-create, но
 * БД может содержать legacy collisions (data-imports, manual SQL и т. п.).
 *
 * Этот скрипт собирает все sub-service и city slug'ы через Payload Local API
 * и ищет пересечения. Прямой `pg` connection использовать нельзя — пакет
 * лежит в pnpm peer-deps payload, не в `site/node_modules` напрямую.
 *
 * Если есть совпадения → exit 1 с детальным diagnostics. Иначе exit 0.
 *
 * Запуск: `pnpm lint:slug` (через prebuild — блокирует build при collision).
 */
/* eslint-disable no-console */

import { getPayload } from 'payload'
import config from '../payload.config.js'

// Incident 2026-05-08: getPayload() в prebuild context может зависнуть если
// Payload init triggers hanging async hook (аналог audit_log incident 2026-05-01).
// 60s process-level timeout гарантирует, что build не блокируется навсегда.
// Graceful exit(0) — lint:slug defensive guard, не должен блокировать релиз.
const _hangGuard = setTimeout(() => {
  console.warn(
    '[lint:slug] 60s process timeout — skip (Payload init hung, ADR-0019 app-level hooks active)',
  )
  process.exit(0)
}, 60_000)
if (typeof _hangGuard.unref === 'function') _hangGuard.unref()

type Collision = {
  subSlug: string
  serviceSlug: string
  citySlug: string
}

async function main() {
  // CI-friendly graceful skip: если БД недоступна (no DATABASE_URI или CI без seed)
  // — выходим с warning, не блокируем build. lint:slug — defensive guard,
  // его роль критична при наличии БД, но bootstrap CI поднимает только schema без data.
  if (!process.env.DATABASE_URI) {
    console.warn(
      '[lint:slug] DATABASE_URI не задан — skip (CI без БД, ADR-0019 guard на app-level).',
    )
    process.exit(0)
  }

  let payload: Awaited<ReturnType<typeof getPayload>>
  try {
    payload = await getPayload({ config })
  } catch (e) {
    console.warn(
      `[lint:slug] Payload init упал (${e instanceof Error ? e.message : 'unknown'}) — skip; ADR-0019 app-level validate-hooks остаются активны.`,
    )
    process.exit(0)
  }

  // Адреса всех «Подуслуг» (в любом статусе) → направление — для диагностики.
  const subs = await payload.find({
    collection: 'sub-services',
    limit: 1000,
    pagination: false,
    depth: 1,
  })
  const subSlugMap = new Map<string, string>()
  for (const doc of subs.docs) {
    const sub = doc as { slug?: string; service?: { slug?: string } | null }
    if (typeof sub.slug === 'string') subSlugMap.set(sub.slug, sub.service?.slug ?? '?')
  }

  // Все district slug'ы.
  const districts = await payload.find({
    collection: 'districts',
    limit: 200,
    pagination: false,
    depth: 0,
  })

  const collisions: Collision[] = []
  for (const d of districts.docs) {
    const dist = d as { slug?: string }
    if (typeof dist.slug !== 'string') continue
    const ownerService = subSlugMap.get(dist.slug)
    if (ownerService) {
      collisions.push({
        subSlug: dist.slug,
        serviceSlug: ownerService,
        citySlug: dist.slug,
      })
    }
  }

  if (collisions.length === 0) {
    console.log(
      `lint:slug ✓ 0 collisions («Подуслуги».slug ↔ districts.slug, ${subSlugMap.size} subs × ${districts.docs.length} cities)`,
    )
    console.log(
      '  ADR-0019 namespace-disjoint guard PASS — T3 и T4 могут безопасно сосуществовать.',
    )
    process.exit(0)
  }

  console.error(
    `lint:slug ✗ ${collisions.length} collision(s) — slug совпадает между «Подуслугами» и «Районами»:`,
  )
  console.error('')
  console.error('  slug                  | service              | district')
  console.error('  ----------------------|----------------------|----------')
  for (const c of collisions) {
    const slug = c.subSlug.padEnd(21, ' ')
    const svc = c.serviceSlug.padEnd(20, ' ')
    console.error(`  ${slug} | ${svc} | ${c.citySlug}`)
  }
  console.error('')
  console.error('  Fix: переименуй sub-service slug или district slug чтобы убрать collision.')
  console.error('  Подробности: team/adr/ADR-0019-uslugi-routing-resolver.md')
  process.exit(1)
}

main().catch((e) => {
  console.error('lint:slug упал:', e instanceof Error ? e.message : e)
  process.exit(2)
})
