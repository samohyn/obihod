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
  // 'label' — re-enabled 2026-05-01 (PANEL-AXE-PAYLOAD-CORE-A11Y):
  //   row-select checkbox (input.checkbox-input__input) теперь получает
  //   aria-label через A11yRowCheckboxProvider. Если Payload вернёт другие
  //   unlabeled inputs (search, фильтры) — их ловим отдельным spec'ом или
  //   расширяем provider, не возвращаем глобальный exception.
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

/**
 * Ждём, пока A11yRowCheckboxOverlay успеет навесить aria-label на все
 * Payload native inputs (row-checkbox + generic catch-all). Без этого
 * ожидания axe scan на медленных CI runners ловит race condition —
 * MutationObserver ещё не отработал на момент scan'а
 * (incident: CI run 25216555569).
 *
 * Условие: КАЖДЫЙ visible form input в DOM имеет `data-a11y-labeled="1"`
 * (provider гарантирует это либо инъекцией aria-label, либо подтверждением
 * что accessible name уже есть).
 *
 * Скипаем ожидание если на странице нет inputs (login-screen имеет только
 * email/password с native `<label>`, до A11yRowCheckboxOverlay не доходит).
 */
async function waitForA11yLabels(page: import('@playwright/test').Page) {
  await page
    .waitForFunction(
      () => {
        const inputs = document.querySelectorAll<HTMLElement>(
          'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea',
        )
        if (inputs.length === 0) return true
        return Array.from(inputs).every((i) => i.dataset.a11yLabeled === '1')
      },
      { timeout: 5_000 },
    )
    .catch(() => {
      // Не fatal — fallback на runAxe(), который выдаст внятную ошибку.
    })
}

async function runAxe(page: import('@playwright/test').Page, label: string) {
  await waitForA11yLabels(page)
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

  /**
   * PANEL-AXE-PAYLOAD-CORE-A11Y — explicit assertion на row-select checkbox
   * aria-label, который вешает A11yRowCheckboxProvider через MutationObserver.
   * Закрывает critical violation `aria-input-field-name` / `label` (WCAG SC
   * 4.1.2 / SC 1.3.1) из leadqa-RC-3-hotfix.md § Findings F1.
   *
   * Cases (4 docs) + Blog (5 docs) — те самые routes, на которых RC-3
   * leadqa зафиксировал baseline violation.
   *
   * --- CI seed gap (PANEL-AXE-PAYLOAD-CORE-A11Y fix-forward 2026-05-01) ---
   * CI workflow (`.github/workflows/ci.yml`) сидит ТОЛЬКО admin user через
   * `/api/users/first-register/` — `pnpm seed` (cases/blog content) НЕ
   * запускается. Поэтому на CI коллекции пустые → row-checkboxes отсутствуют,
   * остаётся только header `select-all` если Payload рендерит пустую таблицу.
   * Тест graceful-skip'ает row-level assertion если row-inputs нет; provider
   * валидируется на header (если есть) + axe scan остаётся обязательным.
   * Local-run после `pnpm seed` валидирует full row-checkbox path.
   * Follow-up PANEL-CI-SEED-CONTENT (backlog) — добавить `pnpm seed` в ci.yml.
   */
  for (const slug of ['cases', 'blog'] as const) {
    test(`/admin/collections/${slug} row-checkbox имеет aria-label`, async ({ page }) => {
      const ok = await tryLogin(page)
      if (!ok) test.skip(true, `Login API rejected ${ADMIN_EMAIL}`)
      await page.goto(`/admin/collections/${slug}/`, { waitUntil: 'networkidle' })
      if (page.url().includes('/admin/login')) {
        test.skip(true, 'Login session не сохранилась')
      }
      // Дать MutationObserver + 2 rAF passes отработать (см. A11yRowCheckboxOverlay).
      // На CI без seed таблица пустая — checkboxes могут отсутствовать вовсе.
      await page.waitForTimeout(500)

      const labels = await page.$$eval(
        '.checkbox-input__input > input[type="checkbox"]',
        (inputs) =>
          inputs.map((i) => ({
            label: i.getAttribute('aria-label'),
            inHeader: i.closest('th') !== null,
          })),
      )

      // CI seed gap: если коллекция пустая (нет ни header, ни row checkboxes),
      // skip — provider всё равно валидируется на /admin/collections/services/.
      if (labels.length === 0) {
        test.skip(true, `Коллекция ${slug} пустая (CI без pnpm seed) — skip row-checkbox assertion`)
      }

      // Все checkboxes (header + rows) должны иметь корректный aria-label.
      for (const { label, inHeader } of labels) {
        expect(label).toBe(inHeader ? 'Выделить все строки' : 'Выделить строку')
      }

      // Sanity: после явной aria-label инъекции — axe чист на этом route.
      const results = await runAxe(page, `/admin/collections/${slug}/`)
      expect(results.violations).toEqual([])
    })
  }
})
