/**
 * Сторожа живого сайта.
 *
 * 1. Индексация закрыта до запуска (правило 3 плана 09): X-Robots-Tag noindex и
 *    robots.txt «Disallow: /». Открывается только командой владельца — тогда в
 *    site-checks.yml ставится SITE_EXPECT_NOINDEX=0 и сторож проверяет обратное.
 * 2. Тестовая заявка (только staging, SITE_ALLOW_WRITES=1): форма контактов
 *    принимает заявку и показывает «принято». На staging писем нет, заявки обезличены.
 */
import { expect, test } from '@playwright/test'

import { uniquePhone } from '../e2e/_helpers/leads'

const EXPECT_NOINDEX = (process.env.SITE_EXPECT_NOINDEX ?? '1') === '1'

test.describe('Индексация', () => {
  test(
    EXPECT_NOINDEX ? 'закрыта: noindex и Disallow: /' : 'открыта: нет noindex',
    async ({ request }) => {
      const home = await request.get('/')
      const robotsHeader = home.headers()['x-robots-tag'] ?? ''
      const robotsTxt = await (await request.get('/robots.txt')).text()
      const disallowAll = /^\s*Disallow:\s*\/\s*$/im.test(robotsTxt)
      if (EXPECT_NOINDEX) {
        expect(robotsHeader, 'X-Robots-Tag на главной').toMatch(/noindex/i)
        expect(disallowAll, 'robots.txt: Disallow: /').toBe(true)
      } else {
        expect(robotsHeader).not.toMatch(/noindex/i)
        expect(disallowAll).toBe(false)
      }
    },
  )
})

test.describe('Тестовая заявка (staging)', () => {
  test.skip(process.env.SITE_ALLOW_WRITES !== '1', 'заявки отправляем только на staging')

  test('форма контактов принимает заявку', async ({ page }) => {
    await page.goto('/kontakty/')
    const form = page
      .locator('section')
      .filter({ has: page.locator('#lf-phone') })
      .last()
    await form.locator('#lf-name').fill('Проверка staging (CI)')
    await form.locator('#lf-phone').fill(uniquePhone())
    const [res] = await Promise.all([
      page.waitForResponse(
        (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/leads/',
      ),
      form.locator('button[type="submit"]').click(),
    ])
    expect(res.status()).toBe(201)
    await expect(form.getByRole('status')).toBeVisible()
  })
})
