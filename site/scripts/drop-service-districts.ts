#!/usr/bin/env tsx
/**
 * Удаляет все записи коллекции service-districts из БД.
 * Гео-страницы service×district упразднены — SEO-данные подтвердили нулевой трафик.
 *
 * Запуск: pnpm tsx --require=./scripts/_payload-cjs-shim.cjs scripts/drop-service-districts.ts
 */
import { payloadClient } from '../lib/payload'

async function main() {
  const payload = await payloadClient()

  const { totalDocs } = await payload.find({
    collection: 'service-districts',
    limit: 1,
    pagination: false,
  })

  if (totalDocs === 0) {
    console.log('[drop-service-districts] Коллекция уже пуста.')
    process.exit(0)
  }

  console.log(`[drop-service-districts] Найдено ${totalDocs} записей. Удаляю...`)

  const result = await payload.delete({
    collection: 'service-districts',
    where: { id: { exists: true } },
  })

  console.log(`[drop-service-districts] Удалено: ${result.docs.length} записей.`)
  process.exit(0)
}

main().catch((e) => {
  console.error('[drop-service-districts] Ошибка:', e)
  process.exit(1)
})
