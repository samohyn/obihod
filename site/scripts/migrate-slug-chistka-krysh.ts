/**
 * Slug migration: ochistka-krysh → chistka-krysh (US-0 Track C, AC-8).
 *
 * Что делает (idempotent):
 *   1) Если в Services есть запись slug='ochistka-krysh' — переименовать в
 *      'chistka-krysh' (если уже chistka-krysh — пропуск).
 *   2) В коллекции Redirects добавить 301:
 *        /ochistka-krysh/                                    → /chistka-krysh/
 *        /ochistka-krysh/<sub>/                              → /chistka-krysh/<sub>/   (через wildcard via общий префикс)
 *        /ochistka-krysh/<district>/                         → /chistka-krysh/<district>/
 *        /ochistka-krysh/<sub>/<district>/                   → /chistka-krysh/<sub>/<district>/
 *      Так как Redirects.from — обычное поле text, мы добавляем КОРНЕВУЮ
 *      запись `/ochistka-krysh/` → `/chistka-krysh/` и оставляем wildcard
 *      обработку на middleware/next.config.ts (см. AC-8.3 — TODO для do).
 *
 * Запуск:
 *   pnpm migrate:slug-chistka            # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:slug-chistka:prod   # prod
 *
 * Источник контракта: ADR-uМ-13 (seosite/04-url-map/decisions.md).
 * Skill `claude-api` не нужен — простая Payload-миграция через Local API.
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен. Запуск отменён.')
    console.error('Чтобы запустить: OBIKHOD_SEED_CONFIRM=yes pnpm migrate:slug-chistka:prod')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  // ─── 1. Service slug migration ───
  const ochistka = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'ochistka-krysh' } },
    limit: 1,
  })

  if (ochistka.docs.length > 0) {
    const existing = ochistka.docs[0] as { id: string | number }
    // Проверяем — может быть уже есть chistka-krysh (конфликт unique)
    const target = await payload.find({
      collection: 'services',
      where: { slug: { equals: 'chistka-krysh' } },
      limit: 1,
    })
    if (target.docs.length > 0) {
      console.log(
        '⚠ Конфликт: slug chistka-krysh уже существует. ochistka-krysh оставлен для ручного разруливания (возможно дубль).',
      )
    } else {
      await payload.update({
        collection: 'services',
        id: existing.id,
        data: { slug: 'chistka-krysh' } as never,
      })
      console.log(`✓ Service slug: ochistka-krysh → chistka-krysh (id=${existing.id})`)
    }
  } else {
    console.log(
      '• Service slug ochistka-krysh не найден — пропуск (уже chistka-krysh либо нет записи)',
    )
  }

  // ─── 2. Redirects entries ───
  // Корневой 301 на pillar URL. Wildcard под-URL должен обрабатывать
  // middleware (через regex from-pattern) — это TODO для do (AC-8.3).
  const redirectEntries: { from: string; to: string; note: string }[] = [
    {
      from: '/ochistka-krysh/',
      to: '/chistka-krysh/',
      note: 'ADR-uМ-13: канон pillar — chistka-krysh (888 wsfreq vs 0)',
    },
  ]

  for (const entry of redirectEntries) {
    const existing = await payload.find({
      collection: 'redirects',
      where: { from: { equals: entry.from } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`• Redirect ${entry.from} уже есть, пропуск`)
      continue
    }
    await payload.create({
      collection: 'redirects',
      data: {
        from: entry.from,
        to: entry.to,
        statusCode: '301',
        note: entry.note,
      } as never,
    })
    console.log(`✓ Redirect создан: ${entry.from} → ${entry.to} (301)`)
  }

  console.log('')
  console.log('Готово. TODO (do):')
  console.log('  1. Регенерировать sitemap.xml через next build')
  console.log(
    '  2. middleware.ts должен матчить /ochistka-krysh/* → /chistka-krysh/* (wildcard 301), а не только корневой URL',
  )
  console.log('  3. Smoke на staging: curl -I https://staging.obikhod.ru/ochistka-krysh/ → 301')

  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-slug-chistka-krysh] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
