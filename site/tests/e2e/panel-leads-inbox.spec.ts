import { expect, test, type Page } from '@playwright/test'

import { adminToken, getLead, uniqueIp, uniquePhone } from './_helpers/leads'

/**
 * Панель заявок (план 09, этап 5.2, вариант 1 «Очередь и карточка»).
 *
 *   (a) экран «Заявки»: четыре вкладки с числами, поиск и фильтры
 *   (b) заявка с сайта → срок «ответить до» ставит сервер → строка в очереди → карточка по ?lead=
 *   (c) «Связались» останавливает таймер, кнопка статуса меняет статус
 *   (d) телефон 360: карточка поверх очереди, «Позвонить» закреплена внизу, «← К очереди»
 *
 * Вход — ADMIN_EMAIL / ADMIN_PASSWORD (в CI админа создаёт scripts/seed-admin.ts); без них — skip.
 */

const LEADS = '/admin/collections/leads'

async function login(page: Page): Promise<boolean> {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return false
  await page.goto('/admin/login/', { waitUntil: 'domcontentloaded' })
  await page.locator('#field-email').waitFor({ state: 'visible', timeout: 30000 })
  await page.locator('#field-email').fill(email)
  await page.locator('#field-password').fill(password)
  await page.locator('button[type="submit"]').first().click()
  try {
    await page.waitForURL(/\/admin(?!\/(login|forgot|create-first-user))/, { timeout: 30000 })
    return true
  } catch {
    return false
  }
}

async function createLead(page: Page, name: string): Promise<{ id: number; phone: string }> {
  const phone = uniquePhone()
  const res = await page.request.post('/api/leads/', {
    headers: { 'x-real-ip': uniqueIp() },
    data: {
      phone,
      consent: true,
      name,
      message: 'Проверка панели заявок',
      sourcePage: '/kontakty/',
    },
  })
  expect(res.status()).toBe(201)
  return { id: ((await res.json()) as { id: number }).id, phone }
}

test.describe('Панель заявок — очередь и карточка', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!(await login(page)), 'нет входа админа — пропуск')
  })

  test('(a) вкладки, поиск и фильтры', async ({ page }) => {
    await page.goto(LEADS, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Заявки', level: 1 })).toBeVisible()
    const tabs = page.getByRole('navigation', { name: 'Вкладки очереди' }).getByRole('link')
    await expect(tabs).toHaveCount(4)
    for (const label of ['Срочно', 'Новые', 'В работе', 'Все']) {
      await expect(tabs.filter({ hasText: label })).toHaveCount(1)
    }
    await expect(page.getByRole('search').getByRole('searchbox')).toBeVisible()
    await expect(page.locator('.leads-inbox__select select')).toHaveCount(3)
  })

  test('(b) заявка с сайта получает срок и открывается по ссылке ?lead=', async ({ page }) => {
    const { id, phone } = await createLead(page, 'Тест очереди')
    const token = await adminToken(page.request)
    if (token) {
      const lead = await getLead(page.request, token, id)
      expect(typeof lead.replyDueAt).toBe('string')
    }

    await page.goto(`${LEADS}?tab=all&q=${encodeURIComponent(phone)}`, {
      waitUntil: 'domcontentloaded',
    })
    const row = page.locator('.lead-row', { hasText: phone })
    await expect(row).toBeVisible()
    await row.click()
    await expect(page).toHaveURL(new RegExp(`[?&]lead=${id}`))

    const card = page.locator('.lead-card')
    await expect(card.getByRole('heading', { name: 'Тест очереди' })).toBeVisible()
    await expect(card.locator('a.lead-card__call-btn').first()).toHaveAttribute(
      'href',
      /^tel:\+7900\d{7}$/,
    )
    await expect(card.locator('.lead-sla').first()).toContainText(/Ответить до|Скоро|Просрочено/)
  })

  test('(c) «Связались» останавливает таймер, статус меняется кнопкой', async ({ page }) => {
    const { id } = await createLead(page, 'Тест итога звонка')
    await page.goto(`${LEADS}?tab=all&lead=${id}`, { waitUntil: 'domcontentloaded' })
    const card = page.locator('.lead-card')
    await expect(card.locator('.lead-sla')).toHaveCount(1)

    await card.getByRole('button', { name: 'Связались' }).click()
    await expect(card.getByRole('button', { name: 'Связались' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(card.locator('.lead-sla')).toHaveCount(0)
    await expect(card.getByText(/Итог первого звонка отмечен/)).toBeVisible()

    await card.getByRole('button', { name: 'Смета', exact: true }).click()
    await expect(card.locator('.lead-card__head .lead-status-badge')).toHaveText('Смета')

    const token = await adminToken(page.request)
    if (token) {
      const lead = await getLead(page.request, token, id)
      expect(lead).toMatchObject({ contactResult: 'reached', status: 'smeta' })
      expect(typeof lead.firstContactAt).toBe('string')
    }
  })

  test('(d) телефон: карточка поверх очереди, «Позвонить» внизу', async ({ page }) => {
    const { id } = await createLead(page, 'Тест телефона')
    await page.setViewportSize({ width: 360, height: 780 })
    await page.goto(`${LEADS}?tab=all&lead=${id}`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.leads-inbox__queue')).toBeHidden()
    const sticky = page.locator('.lead-card__sticky .lead-card__call-btn')
    await expect(sticky).toBeVisible()
    const box = await sticky.boundingBox()
    expect(box && box.y + box.height).toBeGreaterThan(700)
    expect(box!.height).toBeGreaterThanOrEqual(44)
    await page.getByRole('link', { name: '← К очереди' }).click()
    await expect(page.locator('.leads-inbox__queue')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
})
