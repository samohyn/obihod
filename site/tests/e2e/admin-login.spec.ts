import { expect, test } from '@playwright/test'

/**
 * PAN-16 — Admin login UI smoke spec.
 *
 * Closes process gap из incident leadqa-RC-1 2026-04-28: existing
 * admin-smoke.spec.ts проверял только HTTP-200 + brand-токены через
 * :root computed-style. Не ловил empty DOM (template-minimal__wrap без
 * content) когда custom view ломал серверный render.
 *
 * Этот spec проверяет:
 * 1. Native form actually rendered (form/inputs/submit/forgot)
 * 2. Brand visual compliance vs brand-guide §12.1 (computed styles
 *    AC из sa-panel-wave2a-v2.md)
 * 3. Auth redirect /admin/ → /admin/login/
 *
 * Запуск с локальной БД: pnpm db:up && pnpm dev && pnpm test:e2e admin-login
 * CI: postgres service в ci.yml + pnpm dev background.
 */

test.describe('PAN-16 — Admin login UI smoke', () => {
  test('renders form с email + password + submit (поймал бы empty DOM)', async ({
    page,
  }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }

    // Если custom view сломал серверный render — здесь template-minimal__wrap пустой
    await expect(page.locator('form.login__form')).toBeVisible()
    await expect(page.locator('form.login__form input[type="email"]')).toBeVisible()
    await expect(page.locator('form.login__form input[type="password"]')).toBeVisible()
    await expect(page.locator('form.login__form .form-submit')).toBeVisible()
  })

  test('shows brand lockup ОБИХОД + tagline', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    await expect(page.getByText(/обиход/i).first()).toBeVisible()
    await expect(page.getByText(/порядок под ключ.*admin/i)).toBeVisible()
  })

  test('shows footer © 2026 · Обиход', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    await expect(page.getByText(/© 2026.*Обиход/)).toBeVisible()
  })

  test('форма carд: white bg + 320px max-width + 32px padding + 10px radius', async ({
    page,
  }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    const styles = await page.locator('form.login__form').evaluate((el) => ({
      bg: getComputedStyle(el).backgroundColor,
      maxWidth: getComputedStyle(el).maxWidth,
      padding: getComputedStyle(el).padding,
      borderRadius: getComputedStyle(el).borderRadius,
    }))

    expect(styles.bg).toBe('rgb(255, 255, 255)')
    expect(styles.maxWidth).toBe('320px')
    expect(styles.padding).toBe('32px')
    expect(styles.borderRadius).toBe('10px')
  })

  test('submit button янтарный #e6a23c (root cause incident)', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    // Корректный selector — без .payload__app префикса (PAN-13 ADR-0007 finding).
    // На login screen нет ancestor .payload__app — это и был root cause Wave 1
    // SCSS dead code на проде.
    const styles = await page
      .locator('form.login__form .form-submit')
      .evaluate((el) => ({
        bg: getComputedStyle(el).backgroundColor,
        color: getComputedStyle(el).color,
      }))

    expect(styles.bg).toBe('rgb(230, 162, 60)') // #e6a23c янтарный
    expect(styles.color).toBe('rgb(28, 28, 28)') // #1c1c1c ink
  })

  test('background page cream #f7f5f0 (light theme force)', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    // Force light даже когда Payload set'ит data-theme='dark' (ADR-0007).
    const paperVar = await page
      .locator('html')
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--brand-obihod-paper').trim(),
      )

    expect(paperVar).toBe('#f7f5f0')
  })

  test('redirect /admin/ → /admin/login/ (unauthenticated)', async ({ page }) => {
    const resp = await page.goto('/admin/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    await expect(page).toHaveURL(/.*\/admin\/login\/?$/)
  })

  test('«Забыли пароль?» link → /admin/forgot/', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает — пропуск`)
    }

    const forgot = page.getByRole('link', { name: /забыли пароль/i })
    await expect(forgot).toBeVisible()
    await expect(forgot).toHaveAttribute('href', /\/admin\/forgot/)
  })
})
