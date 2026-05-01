import { expect, test } from '@playwright/test'

/**
 * PANEL-SERVICES-PREVIEW-TAB · e2e smoke.
 *
 * Полный flow login → open service → click tab «Превью» → assert button
 * требует БД с seed-юзером + минимум 1 service. На CI с ephemeral postgres
 * этих условий нет, поэтому тесты skip-ятся при отсутствии prerequisites.
 *
 * AC5 (sa-panel.md): tab visible, button с правильным href, empty-slug case.
 *
 * Pattern взят из admin-design-compliance.spec.ts + admin-smoke.spec.ts —
 * проверка отвечает ли admin вообще, иначе test.skip(true, '...').
 */

const ADMIN_LOGIN = '/admin/login/'
const SERVICES_LIST = '/admin/collections/services'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@obikhod.local'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'obikhod_dev_test'

async function login(page: import('@playwright/test').Page): Promise<boolean> {
  const resp = await page.goto(ADMIN_LOGIN, { waitUntil: 'domcontentloaded' })
  if (!resp || resp.status() >= 500) return false

  // Поля login могут иметь native Payload `id="field-email"` либо custom
  // AdminLogin с `name="email"`. Используем gracious fallback.
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

test.describe('PANEL-SERVICES-PREVIEW-TAB — Превью tab в Services edit-view', () => {
  test('tab «Превью» видим в Services edit-view (6-й tab)', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const listResp = await page.goto(SERVICES_LIST, { waitUntil: 'domcontentloaded' })
    if (!listResp || listResp.status() >= 400) {
      test.skip(true, `Services list status=${listResp?.status()} — пропуск`)
    }

    // Открываем первую услугу из списка. Если их нет — skip.
    const firstRow = page.locator('table tbody tr a').first()
    if (!(await firstRow.isVisible().catch(() => false))) {
      test.skip(true, 'Нет ни одной услуги в БД — пропуск')
    }
    await firstRow.click()
    await page.waitForLoadState('domcontentloaded')

    const previewTab = page.locator('button[role="tab"], .tabs-field__tab-button', {
      hasText: 'Превью',
    })
    await expect(previewTab.first()).toBeVisible({ timeout: 10000 })
  })

  test('button «Открыть на сайте» — target=_blank + rel=noopener для published doc', async ({
    page,
  }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const listResp = await page.goto(SERVICES_LIST, { waitUntil: 'domcontentloaded' })
    if (!listResp || listResp.status() >= 400) {
      test.skip(true, `Services list status=${listResp?.status()} — пропуск`)
    }

    const firstRow = page.locator('table tbody tr a').first()
    if (!(await firstRow.isVisible().catch(() => false))) {
      test.skip(true, 'Нет услуг — пропуск')
    }
    await firstRow.click()
    await page.waitForLoadState('domcontentloaded')

    const previewTab = page
      .locator('button[role="tab"], .tabs-field__tab-button', { hasText: 'Превью' })
      .first()
    await previewTab.click()

    // Любая интерактивная primary-button (link или button) внутри section[aria-label="Превью услуги"].
    const previewSection = page.locator('section[aria-label="Превью услуги"]').first()
    await expect(previewSection).toBeVisible({ timeout: 5000 })

    const link = previewSection.locator('a[target="_blank"]').first()
    if (await link.isVisible().catch(() => false)) {
      // Published doc → direct link `/<slug>/`.
      await expect(link).toHaveAttribute('rel', /noopener/)
      await expect(link).toHaveAttribute('href', /^\/[a-z][a-z0-9-]+\/$/)
    } else {
      // Draft case — button (не link), скип link assertions.
      const button = previewSection.locator('button').first()
      await expect(button).toBeVisible()
    }
  })

  test('a11y target-size — primary CTA ≥44×44 (WCAG 2.5.5)', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const listResp = await page.goto(SERVICES_LIST, { waitUntil: 'domcontentloaded' })
    if (!listResp || listResp.status() >= 400) {
      test.skip(true, `Services list status=${listResp?.status()} — пропуск`)
    }

    const firstRow = page.locator('table tbody tr a').first()
    if (!(await firstRow.isVisible().catch(() => false))) {
      test.skip(true, 'Нет услуг — пропуск')
    }
    await firstRow.click()
    await page.waitForLoadState('domcontentloaded')

    const previewTab = page
      .locator('button[role="tab"], .tabs-field__tab-button', { hasText: 'Превью' })
      .first()
    await previewTab.click()

    const cta = page
      .locator('section[aria-label="Превью услуги"] a, section[aria-label="Превью услуги"] button')
      .first()
    await expect(cta).toBeVisible({ timeout: 5000 })
    const box = await cta.boundingBox()
    expect(box).not.toBeNull()
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  })
})
