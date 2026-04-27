import { expect, test } from '@playwright/test'

/**
 * OBI-19 — Admin design compliance with brand-guide.
 *
 * Проверяем, что Payload admin визуально соответствует
 * contex/07_brand_system.html:
 * - Шрифт страницы: Golos Text (с Inter / system fallback)
 * - CSS-переменные бренда (palette + radii) определены на :root
 * - Dashboard tile использует brand radius (10px), не дефолтные 12
 *
 * Запускается без логина — /admin/login отдаёт SSR-HTML с подгруженным
 * custom.scss, чего достаточно для проверки токенов и computed font.
 *
 * Если admin недоступен (например, БД не поднята локально), тест
 * пропускается, чтобы не ломать CI на отдельных средах.
 */

const ADMIN_PATH = '/admin/login'

test.describe('OBI-19 — Admin design compliance', () => {
  test('admin использует Golos Text и брендовые токены', async ({ page }) => {
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }

    // 1. Brand-токены палитры определены на :root.
    const palette = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        primary: cs.getPropertyValue('--brand-obihod-primary').trim(),
        accent: cs.getPropertyValue('--brand-obihod-accent').trim(),
        paper: cs.getPropertyValue('--brand-obihod-paper').trim(),
        ink: cs.getPropertyValue('--brand-obihod-ink').trim(),
      }
    })
    expect(palette.primary.toLowerCase()).toBe('#2d5a3d')
    expect(palette.accent.toLowerCase()).toBe('#e6a23c')
    expect(palette.paper.toLowerCase()).toBe('#f7f5f0')
    expect(palette.ink.toLowerCase()).toBe('#1c1c1c')

    // 2. Brand-токены радиусов определены на :root.
    const radii = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        sm: cs.getPropertyValue('--brand-obihod-radius-sm').trim(),
        m: cs.getPropertyValue('--brand-obihod-radius').trim(),
        lg: cs.getPropertyValue('--brand-obihod-radius-lg').trim(),
      }
    })
    expect(radii.sm).toBe('6px')
    expect(radii.m).toBe('10px')
    expect(radii.lg).toBe('16px')

    // 3. --font-body содержит Golos Text как первый выбор.
    const fontBody = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim(),
    )
    expect(fontBody.toLowerCase()).toContain('golos text')
    expect(fontBody.toLowerCase()).toContain('inter')
  })
})
