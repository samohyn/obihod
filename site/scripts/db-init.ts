/**
 * Инициализирует Payload (push: true в адаптере postgres) и выходит.
 * Используется перед `next build` на чистой БД, чтобы generateStaticParams
 * не падал на отсутствующих таблицах.
 *
 * Запуск: pnpm run db:init
 * Читает DATABASE_URI / PAYLOAD_SECRET из process.env.
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

const payload = await getPayload({ config })
console.log('[db-init] Payload initialized, schema pushed to', process.env.DATABASE_URI?.split('@')[1])
await payload.db.destroy?.()
process.exit(0)
