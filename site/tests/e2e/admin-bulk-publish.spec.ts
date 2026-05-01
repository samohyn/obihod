import { expect, test, type Page } from '@playwright/test'

/**
 * PANEL-BULK-PUBLISH — Payload native bulk publish/unpublish для коллекций
 * с `versions: { drafts: true }` (Cases / Blog / Services / ServiceDistricts).
 *
 * Реализация: Payload 3.84 поставляется с `<ListSelection_v4>` который
 * рендерит кнопки PublishMany / UnpublishMany / EditMany / DeleteMany
 * автоматически. Регистрация `admin.components.list` НЕ требуется.
 * Лейблы — из @payloadcms/translations ru (i18n.fallbackLanguage='ru').
 *
 * Стилизация — `.list-selection` в site/app/(payload)/custom.scss под
 * brand-guide §12.5 chip-bar.
 *
 * Graceful skip: если auth/seed недоступен (CI ephemeral postgres) или
 * коллекция пуста — тест skip-ается (как admin-empty-list-wiring.spec.ts).
 */

const ADMIN_LOGIN = '/admin/login/'
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@obikhod.local'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'obikhod_dev_test'

async function login(page: Page): Promise<boolean> {
  const resp = await page.goto(ADMIN_LOGIN, { waitUntil: 'domcontentloaded' })
  if (!resp || resp.status() >= 500) return false

  const emailInput = page.locator('input[type="email"], input[name="email"], #field-email').first()
  const passwordInput = page
    .locator('input[type="password"], input[name="password"], #field-password')
    .first()

  // Custom AdminLogin рендерится client-side — ждём до 5s появления form.
  try {
    await emailInput.waitFor({ state: 'visible', timeout: 5000 })
  } catch {
    return false
  }

  await emailInput.fill(TEST_EMAIL)
  await passwordInput.fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').first().click()

  try {
    // После logon URL = /admin/ (либо /admin/login/2fa/ если 2FA — exclude его).
    await page.waitForURL(/\/admin(?!\/(login|forgot|create-first-user))/, { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

const COLLECTIONS = [
  { slug: 'cases', title: 'Кейсы' },
  { slug: 'blog', title: 'Блог' },
  { slug: 'services', title: 'Услуги' },
  { slug: 'service-districts', title: 'Услуги × районы' },
] as const

test.describe('PANEL-BULK-PUBLISH — native Payload bulk action bar', () => {
  for (const { slug, title } of COLLECTIONS) {
    test(`${title}: bulk-bar появляется при selection ≥1 с RU labels`, async ({ page }) => {
      const ok = await login(page)
      if (!ok) test.skip(true, 'Admin auth недоступен (БД/seed) — пропуск')

      const resp = await page.goto(`/admin/collections/${slug}?limit=20`, {
        waitUntil: 'domcontentloaded',
      })
      if (!resp || resp.status() >= 400) {
        test.skip(true, `${slug} list status=${resp?.status()} — пропуск`)
      }

      const firstRowCheckbox = page.locator('table tbody tr td input[type=checkbox]').first()
      if (!(await firstRowCheckbox.isVisible().catch(() => false))) {
        test.skip(true, `${slug} пусто — bulk-bar не воспроизводится`)
      }

      // Click first 3 row checkboxes (или меньше если docs мало).
      const allRowCheckboxes = page.locator('table tbody tr td input[type=checkbox]')
      const count = Math.min(3, await allRowCheckboxes.count())
      for (let i = 0; i < count; i++) {
        await allRowCheckboxes.nth(i).check()
      }

      // Bulk-bar содержит RU label «Публиковать».
      const publishBtn = page.locator('.list-selection__button', { hasText: 'Публиковать' }).first()
      await expect(publishBtn).toBeVisible({ timeout: 5000 })

      // Counter «N выбрано».
      const counter = page.locator('.list-selection').first()
      await expect(counter).toContainText(/выбран/, { timeout: 3000 })

      // «Отменить публикацию» и «Редактировать» тоже видны.
      await expect(
        page.locator('.list-selection__button', { hasText: 'Отменить публикацию' }).first(),
      ).toBeVisible()
      await expect(
        page.locator('.list-selection__button', { hasText: 'Редактировать' }).first(),
      ).toBeVisible()
    })
  }

  test('Cases: confirm modal открывается на «Публиковать», содержит «Подтвердить»', async ({
    page,
  }) => {
    const ok = await login(page)
    if (!ok) test.skip(true, 'Admin auth недоступен — пропуск')

    const resp = await page.goto('/admin/collections/cases?limit=20', {
      waitUntil: 'domcontentloaded',
    })
    if (!resp || resp.status() >= 400) test.skip(true, `cases status=${resp?.status()} — пропуск`)

    const firstRowCheckbox = page.locator('table tbody tr td input[type=checkbox]').first()
    if (!(await firstRowCheckbox.isVisible().catch(() => false))) {
      test.skip(true, 'Cases пусто — пропуск')
    }
    await firstRowCheckbox.check()

    await page.locator('.list-selection__button', { hasText: 'Публиковать' }).first().click()

    // Confirmation modal от Payload native PublishManyDrawerContent.
    const confirmBtn = page.getByRole('button', { name: 'Подтвердить' }).first()
    await expect(confirmBtn).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'Отмена' }).first()).toBeVisible()

    // Cancel — modal закрывается, status не меняется.
    await page.getByRole('button', { name: 'Отмена' }).first().click()
    await expect(confirmBtn).not.toBeVisible({ timeout: 3000 })
  })
})
