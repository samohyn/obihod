/**
 * Seed admin user для local dev + Playwright fixtures (TASK-PANEL-DEV-SEED-ADMIN).
 *
 * Запуск (локально, после `pnpm db:up`):
 *   pnpm seed:admin
 *
 * Env (см. .env.example):
 *   ADMIN_EMAIL, ADMIN_PASSWORD — обязательно.
 *   TEST_USER_EMAIL, TEST_USER_PASSWORD — опционально (Playwright fixture).
 *
 * Идемпотентен: повторный запуск пропускает существующих юзеров.
 * Production safeguard: NODE_ENV=production без --force → exit 1.
 *
 * Источник контракта: specs/TASK-PANEL-DEV-SEED-ADMIN/sa-panel.md (approved 2026-04-29)
 */
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

async function ensureUser(payload: Payload, email: string, password: string, label: string) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    console.log(`[seed:admin] ${label} already exists (${email}), skipping`)
    return
  }
  await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin' },
  })
  console.log(`[seed:admin] ${label} created (${email})`)
}

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    console.error('[seed:admin] refusing to run in NODE_ENV=production without --force')
    process.exit(1)
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    console.error('[seed:admin] missing ADMIN_EMAIL or ADMIN_PASSWORD in env')
    process.exit(1)
  }

  const testEmail = process.env.TEST_USER_EMAIL
  const testPassword = process.env.TEST_USER_PASSWORD
  if (testEmail && testEmail === adminEmail) {
    console.error('[seed:admin] TEST_USER_EMAIL must differ from ADMIN_EMAIL')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  await ensureUser(payload, adminEmail, adminPassword, 'admin')
  if (testEmail && testPassword) {
    await ensureUser(payload, testEmail, testPassword, 'test-user')
  }

  process.exit(0)
}

main().catch((e) => {
  console.error('[seed:admin] failed:', e)
  process.exit(1)
})
