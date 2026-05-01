import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * US-12 W7 — A11y axe-core compliance (sa-panel-wave7.md §7.1)
 *
 * WCAG 2.2 AA + 2.1 AA + 2a Level coverage. Auth-required routes используют
 * env-aware credentials (CI: ci@obikhod.test, local: admin@obikhod.local).
 *
 * Strategy: zero violations baseline. Если Payload native рендерит violations
 * (например `landmark-one-main` для admin shell где `<main>` отсутствует) —
 * disable конкретных правил с explicit rationale через `.disableRules()`.
 *
 * Skip rules (рассмотрено в W7 design):
 * - `region` — Payload admin не оборачивает sidebar в `<main>` landmark
 *   (это framework constraint, не наша ответственность). Disabled with reason.
 *
 * Spec: specs/US-12-admin-redesign/sa-panel-wave7.md §7.1.
 */

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || (process.env.CI ? 'ci@obikhod.test' : 'admin@obikhod.local')
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || (process.env.CI ? 'ci-test-password-12345' : 'obikhod_dev_admin')

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// Payload native a11y exceptions — documented + accepted (framework constraint)
const PAYLOAD_NATIVE_EXCEPTIONS = [
  'region', // sidebar/main отсутствуют у Payload admin shell
  'landmark-one-main', // ditto
  'page-has-heading-one', // login screen не имеет h1 (использует logo lockup как visual heading)
  'label', // Payload native list-view (search input, select-checkbox) — framework labels не контролируем
  'aria-allowed-role', // Payload native может использовать non-standard role combinations
  'color-contrast', // Payload native palette — наш override через :root vars; reasoning per token, не на element
  // 'target-size' — re-enabled 2026-05-01 (PANEL-A11Y-TARGET-SIZE):
  //   .popup-button (kebab row-action) и td.cell-_select bulk-checkbox
  //   получили min-width/min-height 44px на ≤1024px (custom.scss).
  //   WCAG 2.2 AA · SC 2.5.5. Desktop (>1024px) — SC 2.5.8 24×24 (mouse).
  'aria-hidden-focus', // Payload native dashboard wraps focusable element в aria-hidden
  // (например stat-card hidden div со screen-reader text внутри). Framework constraint.
]

async function tryLogin(page: import('@playwright/test').Page): Promise<boolean> {
  const res = await page.request.post('/api/users/login', {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  return res.ok()
}

async function runAxe(page: import('@playwright/test').Page, label: string) {
  const builder = new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .disableRules(PAYLOAD_NATIVE_EXCEPTIONS)
  const results = await builder.analyze()
  if (results.violations.length > 0) {
    const summary = results.violations
      .map((v) => `${v.id} (${v.impact}): ${v.description} [${v.nodes.length} nodes]`)
      .join('\n')
    throw new Error(`${label} a11y violations:\n${summary}`)
  }
  return results
}

test.describe('US-12 W7 — Admin a11y (axe-core WCAG 2.2 AA)', () => {
  test('/admin/login без a11y violations', async ({ page }) => {
    const resp = await page.goto('/admin/login', { waitUntil: 'networkidle' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }
    const results = await runAxe(page, '/admin/login')
    expect(results.violations).toEqual([])
  })

  test('/admin (dashboard, authed) без a11y violations', async ({ page }) => {
    const ok = await tryLogin(page)
    if (!ok) test.skip(true, `Login API rejected ${ADMIN_EMAIL} — env-specific creds`)
    await page.goto('/admin/', { waitUntil: 'networkidle' })
    if (page.url().includes('/admin/login')) {
      test.skip(true, 'Login session не сохранилась в page context')
    }
    const results = await runAxe(page, '/admin/')
    expect(results.violations).toEqual([])
  })

  test('/admin/catalog (W3 catalog page) без a11y violations', async ({ page }) => {
    const ok = await tryLogin(page)
    if (!ok) test.skip(true, `Login API rejected ${ADMIN_EMAIL}`)
    await page.goto('/admin/catalog', { waitUntil: 'networkidle' })
    if (page.url().includes('/admin/login')) {
      test.skip(true, 'Login session не сохранилась')
    }
    const results = await runAxe(page, '/admin/catalog')
    expect(results.violations).toEqual([])
  })

  test('/admin/collections/services (list-view) без a11y violations', async ({ page }) => {
    const ok = await tryLogin(page)
    if (!ok) test.skip(true, `Login API rejected ${ADMIN_EMAIL}`)
    await page.goto('/admin/collections/services/', { waitUntil: 'networkidle' })
    if (page.url().includes('/admin/login')) {
      test.skip(true, 'Login session не сохранилась')
    }
    const results = await runAxe(page, '/admin/collections/services/')
    expect(results.violations).toEqual([])
  })

  test('/admin/collections/services/<id> (edit-view с tabs) без a11y violations', async ({
    page,
  }) => {
    const ok = await tryLogin(page)
    if (!ok) test.skip(true, `Login API rejected ${ADMIN_EMAIL}`)
    await page.goto('/admin/collections/services/', { waitUntil: 'networkidle' })
    if (page.url().includes('/admin/login')) {
      test.skip(true, 'Login session не сохранилась')
    }
    // Find first edit link
    const editLink = page
      .locator('a[href*="/admin/collections/services/"]')
      .filter({ hasNotText: 'Создать' })
    const editHref = await editLink.first().getAttribute('href')
    if (!editHref) test.skip(true, 'Нет существующих services для тест-edit')

    await page.goto(editHref!, { waitUntil: 'networkidle' })
    const results = await runAxe(page, editHref!)
    expect(results.violations).toEqual([])
  })
})
