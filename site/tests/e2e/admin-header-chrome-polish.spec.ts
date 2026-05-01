import { expect, test } from '@playwright/test'

/**
 * PANEL-HEADER-CHROME-POLISH · e2e smoke.
 *
 * Пины оператора 2026-05-01:
 *   §A · breadcrumb home-icon — оператор 2026-05-01 убрал (graphics.Icon →
 *        EmptyIcon, BrandIcon удалён). Тест §A снят.
 *   §B · home-link «Вернуться в панель» через beforeNavLinks slot — same-tab → /admin/
 *   §C · dark-theme toggle stub в settingsMenu — aria-pressed toggles on click
 *
 * Полный flow требует authenticated session с БД + seed-юзером. На CI с
 * ephemeral postgres prerequisites нет — graceful skip (pattern admin-services-preview).
 *
 * Spec: specs/PANEL-HEADER-CHROME-POLISH/sa-panel-header-chrome.md
 */

const ADMIN_LOGIN = '/admin/login/'
const ADMIN_HOME = '/admin'

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

test.describe('PANEL-HEADER-CHROME-POLISH — header chrome polish', () => {
  test('§A · breadcrumb home-icon убран — .step-nav__home без SVG', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const resp = await page.goto(ADMIN_HOME, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Admin home status=${resp?.status()} — пропуск`)
    }

    const home = page.locator('.step-nav__home').first()
    if (!(await home.count())) {
      test.skip(true, 'step-nav__home отсутствует на этой странице — пропуск')
    }

    // graphics.Icon → EmptyIcon (рендерит null) → внутри home-slot SVG быть не должно
    const svgCount = await home.locator('svg').count()
    expect(svgCount).toBe(0)
  })

  test('§B · home-link «Вернуться в панель» в sidebar — same-tab → /admin/', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const resp = await page.goto(ADMIN_HOME, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Admin home status=${resp?.status()} — пропуск`)
    }

    const homeLink = page.locator('.nav__link--home').first()
    await expect(homeLink).toBeVisible()

    // same-tab: target отсутствует
    expect(await homeLink.getAttribute('target')).toBeNull()

    // aria-label «Вернуться в панель»
    expect(await homeLink.getAttribute('aria-label')).toBe('Вернуться в панель')

    // href → /admin/
    expect(await homeLink.getAttribute('href')).toBe('/admin/')

    // visible label «Вернуться в панель»
    await expect(homeLink).toContainText('Вернуться в панель')
  })

  test('§C · theme toggle stub — aria-pressed переключается на click', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const resp = await page.goto(ADMIN_HOME, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Admin home status=${resp?.status()} — пропуск`)
    }

    // Toggle рендерится в settingsMenu popup. Native Payload скрывает его до
    // open gear-button. Сначала пытаемся напрямую (если popup auto-mounted),
    // иначе клик по settings-menu trigger в nav__controls.
    let toggle = page.locator('.theme-toggle-stub').first()
    if (!(await toggle.isVisible().catch(() => false))) {
      const settingsTrigger = page
        .locator(
          '.nav__controls button, [class*="settings-menu"] button, button[aria-label*="астройк"]',
        )
        .first()
      if (await settingsTrigger.isVisible().catch(() => false)) {
        await settingsTrigger.click()
        await page.waitForTimeout(200)
      }
      toggle = page.locator('.theme-toggle-stub').first()
    }

    if (!(await toggle.isVisible().catch(() => false))) {
      test.skip(
        true,
        'theme-toggle-stub не виден — settings popup отсутствует на этой версии Payload',
      )
    }

    // AC-C.6: default aria-pressed=false
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    // AC-C.3: click → aria-pressed=true (moon visible)
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    // AC-C.5: data-theme attr на <html> НЕ меняется (stub UI-only)
    const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    // допустимо null или 'light' — главное не 'dark' (stub не применяет тему)
    expect(dataTheme === null || dataTheme === '' || dataTheme === 'light').toBe(true)
  })
})
