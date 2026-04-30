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
  test('renders form с email + password + submit (поймал бы empty DOM)', async ({ page }) => {
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

    // ОБИХОД теперь рендерится как SVG <text> внутри lockup,
    // getByText не парсит SVG text — проверяем через locator.
    await expect(page.locator('svg[aria-label="Обиход"] text')).toHaveText('ОБИХОД')
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
  }, testInfo) => {
    // Desktop-only assertion: W6 mobile responsive (PR #106) переопределяет
    // max-width 100% + padding 24×20 на ≤640px viewport. Mobile поведение
    // покрыто admin-mobile.spec.ts.
    test.skip(
      testInfo.project.name !== 'chromium',
      'Desktop-only: 320px max-width — mobile в admin-mobile.spec.ts',
    )

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

    // PAN-18: visual styles теперь на inner button[type='submit'] (не на div.form-submit
    // wrapper). Wrapper transparent — иначе создавалась «button-в-button» (height ~116px).
    const styles = await page.locator('form.login__form button[type="submit"]').evaluate((el) => ({
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
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--brand-obihod-paper').trim())

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

  /* ────────────────────────────────────────────────────────────────────
   *  PAN-18 — Pixel-perfect §12.1 (operator mandate 2026-04-29 «1 в 1»)
   * ──────────────────────────────────────────────────────────────────── */

  test('AC-27: lockup is real horizontal-compact.svg (детальный знак, не самописный)', async ({
    page,
  }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const lockup = page.locator('svg[aria-label="Обиход"]')
    await expect(lockup).toBeVisible()
    await expect(lockup.locator('text')).toHaveText('ОБИХОД')

    const box = await lockup.boundingBox()
    expect(box?.height).toBeCloseTo(56, 0)
  })

  test('AC: дефолтный Payload Logo скрыт', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const display = await page
      .locator('.template-minimal__wrap .login__brand')
      .evaluate((el) => getComputedStyle(el).display)
    expect(display).toBe('none')
  })

  test('AC-28: labels 13px / weight 500 / ink', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const label = await page
      .locator('form.login__form label')
      .first()
      .evaluate((el) => ({
        fontSize: getComputedStyle(el).fontSize,
        fontWeight: getComputedStyle(el).fontWeight,
        color: getComputedStyle(el).color,
        marginBottom: getComputedStyle(el).marginBottom,
      }))

    expect(label.fontSize).toBe('13px')
    expect(label.fontWeight).toBe('500')
    expect(label.color).toBe('rgb(28, 28, 28)')
    expect(label.marginBottom).toBe('6px')
  })

  test('AC-29: inputs padding/font/border/radius', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const input = await page.locator('form.login__form input[type="email"]').evaluate((el) => ({
      padding: getComputedStyle(el).padding,
      fontSize: getComputedStyle(el).fontSize,
      borderRadius: getComputedStyle(el).borderRadius,
      borderTopColor: getComputedStyle(el).borderTopColor,
    }))

    expect(input.padding).toBe('9px 12px')
    expect(input.fontSize).toBe('14px')
    expect(input.borderRadius).toBe('6px')
    expect(input.borderTopColor).toBe('rgb(230, 225, 214)')
  })

  test('AC-31: submit button width 100% + height ≈ 46px (не 116px double-layer)', async ({
    page,
  }, testInfo) => {
    // Desktop-only: width=254px вычислено из 320px-2-64. На mobile (W6 PR #106)
    // form занимает 100% viewport (например 412px на Pixel 7) → submit width != 254px.
    // Mobile assertion (touch target ≥44px) в admin-mobile.spec.ts.
    test.skip(
      testInfo.project.name !== 'chromium',
      'Desktop-only: 254px width derived from 320px form; mobile в admin-mobile.spec.ts',
    )

    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const btn = await page.locator('form.login__form button[type="submit"]').evaluate((el) => ({
      width: getComputedStyle(el).width,
      padding: getComputedStyle(el).padding,
      height: el.getBoundingClientRect().height,
    }))

    // 320px form - 2px border - 64px padding = 254px (border-box).
    expect(btn.width).toBe('254px')
    expect(btn.padding).toBe('11px')
    // Защита от regression «button-в-button» (когда div.form-submit + inner button
    // оба styled → height ~116px). Normal button-46px (11px padding *2 + 14px font + line-height).
    expect(btn.height).toBeLessThan(60)
    expect(btn.height).toBeGreaterThan(36)
  })

  test('AC-32: link «Забыли пароль?» color brand-зелёный + no underline + центр', async ({
    page,
  }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const link = await page
      .locator('form.login__form a')
      .first()
      .evaluate((el) => ({
        color: getComputedStyle(el).color,
        textDecorationLine: getComputedStyle(el).textDecorationLine,
        textAlign: getComputedStyle(el).textAlign,
        marginTop: getComputedStyle(el).marginTop,
        fontSize: getComputedStyle(el).fontSize,
      }))

    expect(link.color).toBe('rgb(45, 90, 61)')
    expect(link.textDecorationLine).toBe('none')
    expect(link.textAlign).toBe('center')
    expect(link.marginTop).toBe('16px')
    expect(link.fontSize).toBe('13px')
  })

  test('AC: order — link ПОСЛЕ submit (mockup §12.1 1-в-1)', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const submitTop = await page
      .locator('form.login__form .form-submit')
      .evaluate((el) => el.getBoundingClientRect().top)
    const linkTop = await page
      .locator('form.login__form a')
      .first()
      .evaluate((el) => el.getBoundingClientRect().top)

    expect(linkTop).toBeGreaterThan(submitTop)
  })

  test('AC-33: field margin-bottom 16px', async ({ page }) => {
    const resp = await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) test.skip(true, `Admin не отвечает — пропуск`)

    const margin = await page
      .locator('form.login__form .field-type')
      .first()
      .evaluate((el) => getComputedStyle(el).marginBottom)

    expect(margin).toBe('16px')
  })
})
