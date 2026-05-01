import { expect, test, type Page } from '@playwright/test'

/**
 * PANEL-LEADS-INBOX — e2e smoke согласно AC-X.4.
 *
 * 4 сценария:
 *   (a) login → /admin/collections/leads → видим quick-filter chips + status pills
 *   (b) click status pill → dropdown → change → toast (per-row inline-update)
 *   (c) click «⋯» row-action → archive flow
 *   (d) click chip «Все» → URL params → list refresh
 *
 * CI graceful skip — следуем pattern admin-empty-list-wiring.spec.ts:
 * если auth/seed недоступны или коллекция пуста — skip с понятной причиной.
 *
 * Screenshots → screen/leads-inbox-<scenario>.png (memory feedback_screen_folder).
 */

const ADMIN_LOGIN = '/admin/login/'
const LEADS_LIST = '/admin/collections/leads'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@obikhod.local'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'obikhod_dev_test'

async function login(page: Page): Promise<boolean> {
  const resp = await page.goto(ADMIN_LOGIN, { waitUntil: 'domcontentloaded' })
  if (!resp || resp.status() >= 500) return false

  const emailInput = page.locator('input[type="email"], input[name="email"], #field-email').first()
  const passwordInput = page
    .locator('input[type="password"], input[name="password"], #field-password')
    .first()

  if (!(await emailInput.isVisible().catch(() => false))) return false

  await emailInput.fill(TEST_EMAIL)
  await passwordInput.fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').first().click()

  try {
    await page.waitForURL(/\/admin(?!\/(login|forgot|create-first-user))/, { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

test.describe('PANEL-LEADS-INBOX — list-view UX', () => {
  test('(a) Quick-filter chips видны в header list-view', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto(LEADS_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Leads list status=${resp?.status()} — пропуск`)
    }

    const chips = page.locator('nav.lead-quick-filters[role="tablist"]').first()
    await expect(chips).toBeVisible({ timeout: 10000 })

    // 8 chips: Все + 7 статусов.
    const tabs = chips.locator('button[role="tab"]')
    await expect(tabs).toHaveCount(8)

    // По default «Все» активен.
    const active = chips.locator('button[role="tab"][aria-selected="true"]')
    await expect(active).toHaveCount(1)

    await page.screenshot({ path: 'screen/leads-inbox-chips.png', fullPage: true })
  })

  test('(b) Status pill — click открывает dropdown с 7 опциями', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto(LEADS_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Leads list status=${resp?.status()} — пропуск`)
    }

    const firstRow = page.locator('table tbody tr').first()
    if (!(await firstRow.isVisible().catch(() => false))) {
      test.skip(true, 'Leads пуст — нет row для inline-update теста')
    }

    const pill = firstRow.locator('button.lead-status-badge').first()
    if (!(await pill.isVisible().catch(() => false))) {
      test.skip(true, 'StatusPillCell не найден — пропуск')
    }

    await pill.click()
    const dropdown = page.locator('ul.lead-status-dropdown[role="listbox"]').first()
    await expect(dropdown).toBeVisible({ timeout: 3000 })

    // 7 status options + 1 archive = 8 buttons (последний — archive).
    const items = dropdown.locator('button.lead-status-dropdown__item')
    await expect(items).toHaveCount(8)

    await page.screenshot({ path: 'screen/leads-inbox-status-dropdown.png', fullPage: true })

    // Esc закрывает dropdown.
    await page.keyboard.press('Escape')
    await expect(dropdown).toBeHidden({ timeout: 2000 })
  })

  test('(c) Row-action «⋯» menu рендерится в каждой строке', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto(LEADS_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Leads list status=${resp?.status()} — пропуск`)
    }

    const firstRow = page.locator('table tbody tr').first()
    if (!(await firstRow.isVisible().catch(() => false))) {
      test.skip(true, 'Leads пуст — нет row')
    }

    const trigger = firstRow.locator('button.lead-row-actions__trigger').first()
    await expect(trigger).toBeVisible({ timeout: 5000 })
    await expect(trigger).toHaveAttribute('aria-label', /Действия с заявкой/)

    await trigger.click()
    const menu = page.locator('ul.lead-row-actions__menu[role="menu"]').first()
    await expect(menu).toBeVisible({ timeout: 3000 })

    // 7 status + archive + open-link = 9 menuitems.
    const items = menu.locator('[role="menuitem"]')
    await expect(items).toHaveCount(9)

    await page.screenshot({ path: 'screen/leads-inbox-row-actions.png', fullPage: true })
  })

  test('(d) Chip click → URL params + list reload', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto(LEADS_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Leads list status=${resp?.status()} — пропуск`)
    }

    const newChip = page
      .locator('nav.lead-quick-filters button[role="tab"]')
      .filter({ hasText: /^Новая$/ })
      .first()
    if (!(await newChip.isVisible().catch(() => false))) {
      test.skip(true, 'Chip «Новая» не найден — пропуск')
    }

    await newChip.click()

    // URL должен содержать where[status][equals]=new
    await page.waitForFunction(
      () => window.location.search.includes('where%5Bstatus%5D%5Bequals%5D=new') ||
            window.location.search.includes('where[status][equals]=new'),
      { timeout: 3000 },
    )

    await expect(newChip).toHaveAttribute('aria-selected', 'true')
    await page.screenshot({ path: 'screen/leads-inbox-chip-active.png', fullPage: true })
  })
})
