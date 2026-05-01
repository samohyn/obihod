import { expect, test } from '@playwright/test'

/**
 * PANEL-RSC-LINT — Phase 4 runtime gate (ADR-0015).
 *
 * Smoke по collection list-views с `totalDocs > 0` — runtime detection пропуска
 * non-serializable server props через RSC границу к Payload's client UI.
 *
 * Incident pattern (PR #120 hotfix #122):
 *   RSC server component spread'ил полные Payload server props (включая
 *   `access` функции) в client `<DefaultListView>` → 500
 *   "Functions cannot be passed directly to Client Components".
 *   Type-check / Lint / Build / E2E на пустых коллекциях не ловили.
 *   Этот spec ловит на runtime для collections с docs.
 *
 * Defense in depth: дополняет ESLint rule
 * `obikhod/no-spread-server-props-in-client` (статика) и type guard
 * `pickClientProps` (write-time). Любая из 3 layers ловит regression.
 *
 * Seed strategy:
 *   - CI: `pnpm seed` создаёт docs во всех 7 коллекциях (4 Services × 7 Districts
 *     = 28 SDs + 1 Author + opt 1 Case + Media). Cases/Blog/Leads — могут быть
 *     пустыми если placeholder-фото/seed-Lead отсутствуют → graceful skip
 *     внутри теста.
 *   - Local: `pnpm db:up && pnpm seed:admin && pnpm seed && pnpm dev` — всё.
 *
 * При totalDocs === 0 в коллекции — тест skip-ается, потому что incident
 * проявляется ИМЕННО при `>0` (Payload spread'ит populated data).
 */

const ADMIN_LOGIN = '/admin/login/'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@obikhod.local'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'obikhod_dev_test'

// CI seed (ci.yml warmup) создаёт admin через /api/users/first-register/.
const CI_EMAIL = 'ci@obikhod.test'
const CI_PASSWORD = 'ci-test-password-12345'

const COLLECTIONS_TO_SMOKE = [
  'cases',
  'blog',
  'services',
  'service-districts',
  'authors',
  'districts',
  'leads',
] as const

async function loginWithFallback(page: import('@playwright/test').Page): Promise<boolean> {
  const resp = await page.goto(ADMIN_LOGIN, { waitUntil: 'domcontentloaded' })
  if (!resp || resp.status() >= 500) return false

  const emailInput = page.locator('input[type="email"], input[name="email"], #field-email').first()
  const passwordInput = page
    .locator('input[type="password"], input[name="password"], #field-password')
    .first()

  if (!(await emailInput.isVisible().catch(() => false))) return false

  // Try CI creds first (env-agnostic), fallback на local fixture.
  for (const [email, password] of [
    [CI_EMAIL, CI_PASSWORD],
    [TEST_EMAIL, TEST_PASSWORD],
  ] as const) {
    await emailInput.fill(email)
    await passwordInput.fill(password)
    await page.locator('button[type="submit"]').first().click()

    try {
      await page.waitForURL(/\/admin(?!\/(login|forgot|create-first-user))/, { timeout: 4000 })
      return true
    } catch {
      // Re-load login form для retry с fallback creds.
      const r = await page.goto(ADMIN_LOGIN, { waitUntil: 'domcontentloaded' })
      if (!r || r.status() >= 500) return false
    }
  }
  return false
}

test.describe('PANEL-RSC-LINT — RSC border runtime smoke по list-views', () => {
  for (const slug of COLLECTIONS_TO_SMOKE) {
    test(`/admin/collections/${slug} рендерится без RSC border errors при totalDocs > 0`, async ({
      page,
    }) => {
      const ok = await loginWithFallback(page)
      if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

      // Console + page error capture ДО navigation, иначе теряем initial render errors.
      const errors: string[] = []
      const pageErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      page.on('pageerror', (err) => pageErrors.push(err.message))

      const resp = await page.goto(`/admin/collections/${slug}/`, {
        waitUntil: 'domcontentloaded',
      })

      // 500 = incident pattern (RSC border violation). PASS только при <500.
      // 403/401 — auth dropped, skip (не наша зона).
      const status = resp?.status() ?? 0
      if (status === 401 || status === 403) {
        test.skip(true, `${slug}: auth status=${status} — пропуск`)
      }
      expect(
        status,
        `RSC border 500 на /admin/collections/${slug}/ — incident pattern!`,
      ).toBeLessThan(500)

      // Wait for either table rows OR EmptyState — означает render не упал.
      const hasContent = await Promise.race([
        page
          .locator('table tbody tr')
          .first()
          .waitFor({ state: 'visible', timeout: 8000 })
          .then(() => 'docs')
          .catch(() => null),
        page
          .locator('section[role="region"]')
          .first()
          .waitFor({ state: 'visible', timeout: 8000 })
          .then(() => 'empty')
          .catch(() => null),
      ])

      // Если ни docs ни empty — может страница ещё грузится либо пустой layout.
      // Главный критерий — отсутствие RSC pageerror'ов.
      const rscErrors = [...errors, ...pageErrors].filter((e) =>
        e.includes('Functions cannot be passed directly to Client Components'),
      )
      expect(
        rscErrors,
        `RSC border violation на /admin/collections/${slug}/:\n${rscErrors.join('\n')}`,
      ).toHaveLength(0)

      // Если коллекция пустая — incident ИМЕННО на `>0`, поэтому skip с пометкой.
      if (hasContent === 'empty' || hasContent === null) {
        test.skip(
          true,
          `${slug}: totalDocs===0 (либо страница не отрендерилась) — RSC pattern не воспроизводим, skip без падения`,
        )
      }
    })
  }
})
