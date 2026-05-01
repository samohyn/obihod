import { expect, test } from '@playwright/test'

/**
 * PANEL-EMPTY-LIST-WIRING — EmptyState wired в Cases + Blog list-view.
 *
 * AC4: при `data.totalDocs === 0` коллекция показывает §12.6 EmptyState
 * с CTA «+ Добавить ...» вместо native пустого Payload-table. Filtered-empty
 * (есть docs, фильтр исключает все) → native «No results» (out of scope).
 *
 * CI ephemeral postgres — auth/seed может отсутствовать, поэтому login
 * graceful-skip как в admin-services-preview.spec.ts. Если коллекция
 * содержит docs (env с seed) → skip empty-state assertion (out of scope).
 */

const ADMIN_LOGIN = '/admin/login/'
const CASES_LIST = '/admin/collections/cases'
const BLOG_LIST = '/admin/collections/blog'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@obikhod.local'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'obikhod_dev_test'

async function login(page: import('@playwright/test').Page): Promise<boolean> {
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

test.describe('PANEL-EMPTY-LIST-WIRING — EmptyState в collection list-views', () => {
  test('Cases: EmptyState с CTA «+ Добавить кейс» при пустой коллекции', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const resp = await page.goto(CASES_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Cases list status=${resp?.status()} — пропуск`)
    }

    // Если коллекция содержит docs (seed-данные) — empty-state не должен
    // быть rendered, тест skip-ается (out of scope для filled-list assertion).
    const tableRow = page.locator('table tbody tr').first()
    if (await tableRow.isVisible().catch(() => false)) {
      test.skip(true, 'Cases содержит docs — global empty не воспроизводится')
    }

    // Region с aria-label === heading (см. EmptyErrorStates.tsx StatePanel).
    const empty = page.locator('section[role="region"][aria-label="Кейсов пока нет"]').first()
    await expect(empty).toBeVisible({ timeout: 10000 })

    const cta = empty.locator('a', { hasText: '+ Добавить кейс' }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/admin/collections/cases/create')

    await page.screenshot({ path: 'screen/panel-empty-cases.png', fullPage: true })
  })

  test('Blog: EmptyState с CTA «+ Написать пост» при пустой коллекции', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto(BLOG_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Blog list status=${resp?.status()} — пропуск`)
    }

    const tableRow = page.locator('table tbody tr').first()
    if (await tableRow.isVisible().catch(() => false)) {
      test.skip(true, 'Blog содержит docs — global empty не воспроизводится')
    }

    const empty = page.locator('section[role="region"][aria-label="Постов пока нет"]').first()
    await expect(empty).toBeVisible({ timeout: 10000 })

    const cta = empty.locator('a', { hasText: '+ Написать пост' }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/admin/collections/blog/create')

    await page.screenshot({ path: 'screen/panel-empty-blog.png', fullPage: true })
  })

  test('CTA «+ Добавить кейс» ведёт на create route при клике', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto(CASES_LIST, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Cases list status=${resp?.status()} — пропуск`)
    }

    const tableRow = page.locator('table tbody tr').first()
    if (await tableRow.isVisible().catch(() => false)) {
      test.skip(true, 'Cases содержит docs — empty-CTA не рендерится')
    }

    const cta = page
      .locator('section[role="region"][aria-label="Кейсов пока нет"] a', {
        hasText: '+ Добавить кейс',
      })
      .first()
    if (!(await cta.isVisible().catch(() => false))) {
      test.skip(true, 'EmptyState CTA не виден — пропуск click-test')
    }

    await cta.click()
    await page.waitForURL(/\/admin\/collections\/cases\/create/, { timeout: 10000 })
    expect(page.url()).toMatch(/\/admin\/collections\/cases\/create/)
  })
})
