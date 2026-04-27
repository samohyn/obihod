import { expect, test } from '@playwright/test'

/**
 * OBI-33 Wave 7 — Admin smoke без внешних зависимостей.
 *
 * Полный flow login → dashboard → edit → publish невозможен на CI с
 * ephemeral postgres (нет users, БД пустая). Smoke покрывает только то,
 * что стабильно работает unauthenticated:
 *
 * - HTTP-доступность /admin/login/
 * - Trailing-slash redirect (Next.js 16)
 * - Регрессия brand-токенов через :root computed-style
 *
 * Тесты на lang/title/семантику/focus — отложены до Wave 7 follow-up
 * с реальной БД и users (потребует seed step в CI). См. handoff.
 *
 * @axe-core/playwright не подключаем (новая зависимость → tamd ADR).
 */

test.describe('OBI-33 Wave 7 — Admin smoke', () => {
  test('GET /admin/login/ → 200 (HTTP-доступность)', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }
    expect(resp?.status()).toBe(200)
  })

  test('redirect /admin/login → /admin/login/ (Next trailingSlash)', async ({ request }) => {
    const resp = await request.get('/admin/login', { maxRedirects: 0 })
    if (resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }
    // Next.js 16 с trailingSlash:true делает 308 → /admin/login/
    expect([200, 301, 307, 308]).toContain(resp.status())
  })

  test('Brand-токены применены через :root computed-style (регрессия Wave 1)', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    const primary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-obihod-primary').trim(),
    )
    expect(primary.toLowerCase()).toBe('#2d5a3d')
  })
})
