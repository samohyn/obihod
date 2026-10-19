/**
 * Формы заявок в браузере — на страницах, которые рендерятся без контента в БД.
 * Формы блоков страниц услуг (полная, калькулятор по фото) проверяются на staging.
 *
 * Для каждой формы:
 *   1. без телефона — ошибка, запрос не уходит;
 *   2. отправка — клиент видит «принято», заявка в админке с телефоном и именем;
 *   3. ошибка сервера и обрыв сети — честное сообщение, без «принято»;
 *   4. известные дефекты (test.fail, этап плана 09 в пометке): потерянные поля,
 *      неверный адрес страницы, нет чекбокса согласия на ПДн.
 *
 * Успех у всех форм — role="status", ошибка — role="alert" внутри блока формы.
 */
import { expect, test, type Locator, type Page, type Response } from '@playwright/test'

import { adminToken, getLead, uniqueIp, uniquePhone, type LeadDoc } from './_helpers/leads'

type FormCase = {
  id: string
  path: string
  /** Блок формы: в нём появляются status/alert (у части форм форма заменяется на «принято»). */
  scope: (page: Page) => Locator
  name: (scope: Locator) => Locator
  phone: (scope: Locator) => Locator
  /** Поле, которое клиент заполняет, но заявка его теряет. */
  lost?: {
    label: string
    fill: (scope: Locator) => Promise<void>
    saved: (lead: LeadDoc) => boolean
    stage: string
  }
  /** Форма пишет в заявку не адрес страницы. */
  wrongSourcePage?: string
}

const leadFormBlock = (path: string): FormCase => ({
  id: `LeadForm ${path}`,
  path,
  scope: (page) =>
    page
      .locator('section')
      .filter({ has: page.locator('#lf-phone') })
      .last(),
  name: (s) => s.locator('#lf-name'),
  phone: (s) => s.locator('#lf-phone'),
  lost: {
    label: 'услуга (свободный текст)',
    fill: (s) => s.locator('#lf-service').fill('Спил берёзы'),
    saved: (lead) => Boolean(lead.service),
    stage: 'этап 2: в LeadForm услуга — свободный текст, а /api/leads ждёт slug и молча её теряет',
  },
  wrongSourcePage: 'этап 2: LeadForm шлёт source «block:lead-form» вместо адреса страницы',
})

const FORMS: FormCase[] = [
  {
    id: 'главная · первый экран',
    path: '/',
    scope: (page) => page.locator('.hpc-form-card').first(),
    name: (s) => s.locator('#hero-name'),
    phone: (s) => s.locator('#hero-phone'),
    lost: {
      label: 'адрес или район',
      fill: (s) => s.locator('#hero-address').fill('Раменское, СНТ Берёзка'),
      saved: (lead) => JSON.stringify(lead).includes('Раменское, СНТ Берёзка'),
      stage: 'этап 2 и 5: адрес не отправляется формой и в Leads нет для него поля',
    },
  },
  {
    id: 'главная · «Заполнить форму»',
    path: '/',
    scope: (page) => page.locator('#cta .hp-cta-block').filter({ hasText: 'Заполнить форму' }),
    name: (s) => s.getByPlaceholder('Имя'),
    phone: (s) => s.locator('input[type="tel"]'),
    lost: {
      label: 'описание задачи',
      fill: (s) => s.getByPlaceholder(/Например/).fill('Спил 3 берёз, аварийно'),
      saved: (lead) => JSON.stringify(lead).includes('Спил 3 берёз'),
      stage: 'этап 2 и 5: описание не отправляется формой и в Leads нет для него поля',
    },
  },
  leadFormBlock('/kontakty/'),
  leadFormBlock('/kalkulyator/foto-smeta/'),
  leadFormBlock('/otzyvy/'),
]

async function open(page: Page, f: FormCase): Promise<Locator> {
  await page.context().setExtraHTTPHeaders({ 'x-real-ip': uniqueIp() })
  await page.goto(f.path)
  const scope = f.scope(page)
  await expect(f.phone(scope)).toBeVisible()
  return scope
}

const submit = (scope: Locator) => scope.locator('button[type="submit"]').click()

/** Итоговый ответ /api/leads: формы шлют без слэша, первый ответ — 308 на /api/leads/. */
const isLeadResponse = (r: Response) =>
  r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/leads/'

for (const f of FORMS) {
  test.describe(`Форма: ${f.id}`, () => {
    test('без телефона — ошибка, заявка не уходит', async ({ page }) => {
      const scope = await open(page, f)
      let sent = false
      page.on('request', (r) => {
        if (r.url().includes('/api/leads') && r.method() === 'POST') sent = true
      })
      await f.name(scope).fill('Тест CI')
      await submit(scope)
      // Ошибку показывает либо форма (role="alert"), либо браузер — у поля с required.
      const browserMessage = await f
        .phone(scope)
        .evaluate((el) => (el as HTMLInputElement).validationMessage)
      if (!browserMessage) await expect(scope.getByRole('alert')).toBeVisible()
      expect(sent).toBe(false)
    })

    test('отправка — клиент видит «принято», заявка в админке', async ({ page, request }) => {
      const scope = await open(page, f)
      const phone = uniquePhone()
      await f.name(scope).fill('Тест CI')
      await f.phone(scope).fill(phone)
      const [res] = await Promise.all([page.waitForResponse(isLeadResponse), submit(scope)])
      expect(res.status()).toBe(201)
      await expect(scope.getByRole('status')).toBeVisible()
      await expect(scope.getByRole('alert')).toHaveCount(0)

      const token = await adminToken(request)
      test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD — сохранение не проверяем')
      const lead = await getLead(request, token!, ((await res.json()) as { id: number }).id)
      expect(lead).toMatchObject({ phone, name: 'Тест CI' })
    })

    test('ошибка сервера — честное сообщение, без «принято»', async ({ page }) => {
      const scope = await open(page, f)
      await page.route('**/api/leads**', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: '{"error":"server_error"}',
        }),
      )
      await f.phone(scope).fill(uniquePhone())
      await submit(scope)
      await expect(scope.getByRole('alert')).toBeVisible()
      await expect(scope.getByRole('status')).toHaveCount(0)
    })

    test('обрыв сети — честное сообщение, без «принято»', async ({ page }) => {
      const scope = await open(page, f)
      await page.route('**/api/leads**', (route) => route.abort('internetdisconnected'))
      await f.phone(scope).fill(uniquePhone())
      await submit(scope)
      await expect(scope.getByRole('alert')).toBeVisible()
      await expect(scope.getByRole('status')).toHaveCount(0)
    })

    test('в заявке сохраняется адрес страницы', async ({ page, request }) => {
      test.fail(Boolean(f.wrongSourcePage), f.wrongSourcePage)
      const scope = await open(page, f)
      await f.phone(scope).fill(uniquePhone())
      const [res] = await Promise.all([page.waitForResponse(isLeadResponse), submit(scope)])
      const token = await adminToken(request)
      test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD')
      const lead = await getLead(request, token!, ((await res.json()) as { id: number }).id)
      expect(lead.sourcePage).toBe(f.path)
    })

    if (f.lost) {
      const lost = f.lost
      test(`поле «${lost.label}» попадает в заявку`, async ({ page, request }) => {
        test.fail(true, lost.stage)
        const scope = await open(page, f)
        await f.phone(scope).fill(uniquePhone())
        await lost.fill(scope)
        const [res] = await Promise.all([page.waitForResponse(isLeadResponse), submit(scope)])
        const token = await adminToken(request)
        test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD')
        const lead = await getLead(request, token!, ((await res.json()) as { id: number }).id)
        expect(lost.saved(lead)).toBe(true)
      })
    }

    test('согласие на обработку ПДн — отдельный неотмеченный чекбокс', async ({ page }) => {
      test.fail(true, 'этап 2: у форм нет чекбокса согласия (152-ФЗ), только текст под кнопкой')
      const scope = await open(page, f)
      const consent = scope.getByRole('checkbox', { name: /персональн|согласи/i })
      await expect(consent).toBeVisible()
      await expect(consent).not.toBeChecked()
    })
  })
}
