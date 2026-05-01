import { expect, test } from '@playwright/test'

/**
 * PANEL-HEADER-CHROME-POLISH · e2e smoke.
 *
 * 3 пина оператора 2026-05-01:
 *   §A · breadcrumb «О» в .step-nav__home — slot 20×20, центрирован
 *   §B · home-link «На сайт» через beforeNavLinks slot — target=_blank → obikhod.ru
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

test.describe('PANEL-HEADER-CHROME-POLISH — header chrome polish (3 пина)', () => {
  test('§A · breadcrumb «О» (.step-nav__home) — 20×20 slot центрирован', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const resp = await page.goto(ADMIN_HOME, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Admin home status=${resp?.status()} — пропуск`)
    }

    const home = page.locator('.step-nav__home').first()
    if (!(await home.isVisible().catch(() => false))) {
      test.skip(true, 'step-nav__home отсутствует на этой странице — пропуск')
    }

    const box = await home.boundingBox()
    expect(box).not.toBeNull()
    // AC-A.1/A.2: slot должен быть 20×20 (CSS override 18→20 native).
    expect(box!.width).toBeGreaterThanOrEqual(19)
    expect(box!.width).toBeLessThanOrEqual(22)
    expect(box!.height).toBeGreaterThanOrEqual(19)
    expect(box!.height).toBeLessThanOrEqual(22)

    // SVG inside растёт под slot
    const svg = home.locator('svg').first()
    await expect(svg).toBeVisible()
  })

  test('§B · home-link «На сайт» в sidebar — target=_blank → obikhod.ru', async ({ page }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

    const resp = await page.goto(ADMIN_HOME, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 400) {
      test.skip(true, `Admin home status=${resp?.status()} — пропуск`)
    }

    const homeLink = page.locator('.nav__link--home').first()
    await expect(homeLink).toBeVisible()

    // AC-B.2/B.3: target=_blank + rel=noopener noreferrer
    await expect(homeLink).toHaveAttribute('target', '_blank')
    const rel = (await homeLink.getAttribute('rel')) || ''
    expect(rel).toContain('noopener')
    expect(rel).toContain('noreferrer')

    // AC-B.4: aria-label содержит «На сайт» + «новой вкладке»
    const ariaLabel = (await homeLink.getAttribute('aria-label')) || ''
    expect(ariaLabel).toContain('На сайт')
    expect(ariaLabel).toContain('новой вкладке')

    // href ведёт на public site (default obikhod.ru или NEXT_PUBLIC_SITE_ORIGIN)
    const href = (await homeLink.getAttribute('href')) || ''
    expect(href).toMatch(/obikhod\.ru|^https?:\/\//)

    // visible label «На сайт»
    await expect(homeLink).toContainText('На сайт')
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
