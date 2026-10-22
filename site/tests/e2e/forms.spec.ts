/**
 * Форма заявки (блок «Заявка», LeadFormV3) в браузере — на страницах из «Страниц», которые CI
 * наполняет seed-скриптами. Обязательны телефон и отдельный неотмеченный чекбокс согласия на ПДн;
 * фото и описание задачи — по кнопке «Фото и описание задачи».
 *
 * Для каждой страницы:
 *   1. без телефона или без согласия — ошибка, запрос не уходит;
 *   2. отправка — клиент видит «принято», заявка в админке с телефоном и адресом страницы;
 *   3. ошибка сервера и обрыв сети — честное сообщение, без «принято».
 *
 * Успех — role="status" (карточка вместо формы), ошибка — role="alert" внутри формы.
 */
import { expect, test, type Locator, type Page, type Response } from '@playwright/test'
import sharp from 'sharp'

import { adminToken, getLead, uniqueIp, uniquePhone } from './_helpers/leads'

const FORM_PAGES = ['/', '/kontakty/', '/kalkulyator/foto-smeta/', '/otzyvy/']

/** Блок «Заявка» — секция с якорем #zayavka: в ней форма, после отправки — «принято». */
async function open(page: Page, path: string): Promise<Locator> {
  await page.context().setExtraHTTPHeaders({ 'x-real-ip': uniqueIp() })
  await page.goto(path)
  const scope = page.locator('#zayavka')
  await expect(phone(scope)).toBeVisible()
  return scope
}

const phone = (scope: Locator) => scope.locator('input[type="tel"]')
const consent = (scope: Locator) => scope.getByRole('checkbox', { name: /персональных данных/i })
const submit = (scope: Locator) => scope.locator('button[type="submit"]').click()

/** Итоговый ответ /api/leads (без слеша первым приходит 308 на /api/leads/). */
const isLeadResponse = (r: Response) =>
  r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/leads/'

function trackLeadRequests(page: Page) {
  const state = { sent: false }
  page.on('request', (r) => {
    if (r.url().includes('/api/leads') && r.method() === 'POST') state.sent = true
  })
  return state
}

for (const path of FORM_PAGES) {
  test.describe(`Форма заявки: ${path}`, () => {
    test('без телефона — ошибка, заявка не уходит', async ({ page }) => {
      const scope = await open(page, path)
      const req = trackLeadRequests(page)
      await consent(scope).check()
      await submit(scope)
      await expect(scope.getByRole('alert')).toBeVisible()
      expect(req.sent).toBe(false)
    })

    test('согласие на ПДн — отдельный неотмеченный чекбокс, без него заявка не уходит', async ({
      page,
    }) => {
      const scope = await open(page, path)
      const req = trackLeadRequests(page)
      await expect(consent(scope)).toBeVisible()
      await expect(consent(scope)).not.toBeChecked()
      await phone(scope).fill(uniquePhone())
      await submit(scope)
      await expect(scope.getByRole('alert')).toBeVisible()
      expect(req.sent).toBe(false)
    })

    test('отправка — клиент видит «принято», заявка в админке', async ({ page, request }) => {
      const scope = await open(page, path)
      const number = uniquePhone()
      await phone(scope).fill(number)
      await consent(scope).check()
      const [res] = await Promise.all([page.waitForResponse(isLeadResponse), submit(scope)])
      expect(res.status()).toBe(201)
      await expect(scope.getByRole('status')).toBeVisible()
      await expect(scope.getByRole('alert')).toHaveCount(0)

      const token = await adminToken(request)
      test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD — сохранение не проверяем')
      const lead = await getLead(request, token!, ((await res.json()) as { id: number }).id)
      expect(lead).toMatchObject({ phone: number, sourcePage: path })
    })

    test('ошибка сервера — честное сообщение, без «принято»', async ({ page }) => {
      const scope = await open(page, path)
      await page.route('**/api/leads**', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: '{"error":"server_error"}',
        }),
      )
      await phone(scope).fill(uniquePhone())
      await consent(scope).check()
      await submit(scope)
      await expect(scope.getByRole('alert')).toBeVisible()
      await expect(scope.getByRole('status')).toHaveCount(0)
    })

    test('обрыв сети — честное сообщение, без «принято»', async ({ page }) => {
      const scope = await open(page, path)
      await page.route('**/api/leads**', (route) => route.abort('internetdisconnected'))
      await phone(scope).fill(uniquePhone())
      await consent(scope).check()
      await submit(scope)
      await expect(scope.getByRole('alert')).toBeVisible()
      await expect(scope.getByRole('status')).toHaveCount(0)
    })
  })
}

test.describe('Форма заявки: фото и описание задачи', () => {
  test('раскрыть «Фото и описание», прикрепить фото — заявка приходит с фото и текстом', async ({
    page,
    request,
  }) => {
    const scope = await open(page, '/kontakty/')
    const toggle = scope.getByRole('button', { name: /Фото и описание задачи/ })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const jpeg = await sharp({
      create: { width: 1200, height: 900, channels: 3, background: '#4a7c59' },
    })
      .jpeg()
      .toBuffer()
    await scope.locator('input[type="file"]').setInputFiles({
      name: 'uchastok.jpg',
      mimeType: 'image/jpeg',
      buffer: jpeg,
    })
    await expect(scope.getByRole('img', { name: 'Фото 1' })).toBeVisible()
    await scope.getByLabel('Что нужно сделать').fill('Спилить берёзу у забора')

    const number = uniquePhone()
    await phone(scope).fill(number)
    await consent(scope).check()
    const [res] = await Promise.all([page.waitForResponse(isLeadResponse), submit(scope)])
    expect(res.status()).toBe(201)
    await expect(scope.getByRole('status')).toContainText('Фото у менеджера')

    const token = await adminToken(request)
    test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD — сохранение не проверяем')
    const lead = await getLead(request, token!, ((await res.json()) as { id: number }).id)
    expect(lead).toMatchObject({ phone: number, message: 'Спилить берёзу у забора' })
    expect(lead.photoFiles).toHaveLength(1)
  })
})
