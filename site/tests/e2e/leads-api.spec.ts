/**
 * Контракт POST /api/leads — что принимает, что отвечает, что сохраняет.
 *
 * Запросы идут к настоящему серверу (next start) без браузера; сохранение
 * проверяем чтением заявки под админом. Только в проекте chromium (playwright.config).
 *
 * test.fail() — известный дефект: тест ожидаемо падает и не краснит прогон,
 * а когда дефект починят, «неожиданно пройдёт» и потребует снять пометку.
 * У каждого — этап плана 09, где его чинят.
 */
import { expect, test } from '@playwright/test'
import sharp from 'sharp'

import { adminToken, getLead, uniqueIp, uniquePhone } from './_helpers/leads'

test.describe('POST /api/leads — контракт', () => {
  test('валидная заявка → 201 и сохраняется со всеми полями формы', async ({ request }) => {
    const phone = uniquePhone()
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      data: {
        phone,
        consent: true,
        name: 'Тест CI',
        message: 'Спил 3 берёз, аварийно',
        address: 'Жуковский, ул. Лесная',
        sourcePage: '/kontakty/',
        utmSource: 'yandex',
        utmMedium: 'cpc',
        utmCampaign: 'ci-check',
      },
    })
    expect(res.status()).toBe(201)
    const { id } = (await res.json()) as { id: number }
    expect(id).toBeTruthy()

    const token = await adminToken(request)
    test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD — сохранение не проверяем')
    const lead = await getLead(request, token!, id)
    expect(lead).toMatchObject({
      phone,
      name: 'Тест CI',
      message: 'Спил 3 берёз, аварийно',
      address: 'Жуковский, ул. Лесная',
      sourcePage: '/kontakty/',
      utmSource: 'yandex',
      utmMedium: 'cpc',
      utmCampaign: 'ci-check',
      status: 'new',
    })
    // согласие на ПДн: время, редакция документа и отпечаток текста
    expect(lead.consentAt).toBeTruthy()
    expect(String(lead.consentVersion)).toContain('Согласие на обработку персональных данных')
  })

  test('без согласия на ПДн → 400, заявка не создаётся', async ({ request }) => {
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      data: { phone: uniquePhone() },
    })
    expect(res.status()).toBe(400)
    expect(await res.json()).toMatchObject({
      error: 'validation_error',
      details: [{ field: 'consent' }],
    })
  })

  test('без телефона → 400 validation_error', async ({ request }) => {
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      data: { name: 'Без телефона', consent: true },
    })
    expect(res.status()).toBe(400)
    expect(await res.json()).toMatchObject({ error: 'validation_error' })
  })

  test('не JSON → 400 invalid_json', async ({ request }) => {
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp(), 'content-type': 'application/json' },
      data: Buffer.from('{не json'),
    })
    expect(res.status()).toBe(400)
    expect(await res.json()).toMatchObject({ error: 'invalid_json' })
  })

  test('honeypot заполнен → 200 без id, заявка не создаётся', async ({ request }) => {
    // Список заявок по REST недоступен (GET /api/leads/ занят этим маршрутом),
    // поэтому проверяем ответ: id есть только у созданной заявки.
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      data: { phone: uniquePhone(), email_url: 'http://spam.example' },
    })
    expect(res.status()).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })
})

test.describe('POST /api/leads — лимит 5 заявок в минуту с IP', () => {
  test('шестая заявка с одного IP → 429, соседний IP не задет', async ({ request }) => {
    const ip = uniqueIp()
    for (let i = 0; i < 5; i++) {
      const res = await request.post('/api/leads/', {
        headers: { 'x-real-ip': ip },
        data: { phone: uniquePhone(), consent: true },
      })
      expect(res.status(), `заявка ${i + 1}`).toBe(201)
    }
    const sixth = await request.post('/api/leads/', {
      headers: { 'x-real-ip': ip },
      data: { phone: uniquePhone(), consent: true },
    })
    expect(sixth.status()).toBe(429)

    const other = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      data: { phone: uniquePhone(), consent: true },
    })
    expect(other.status()).toBe(201)
  })

  test('подмена X-Forwarded-For не обходит лимит', async ({ request }) => {
    // nginx пишет настоящий адрес в X-Real-IP и дописывает его в конец X-Forwarded-For;
    // начало X-Forwarded-For присылает сам клиент.
    const realIp = uniqueIp()
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) {
      const res = await request.post('/api/leads/', {
        headers: { 'x-real-ip': realIp, 'x-forwarded-for': `${uniqueIp()}, ${realIp}` },
        data: { phone: uniquePhone(), consent: true },
      })
      statuses.push(res.status())
    }
    expect(statuses.slice(0, 5)).toEqual([201, 201, 201, 201, 201])
    expect(statuses[5]).toBe(429)
  })
})

test.describe('POST /api/leads — фото к заявке', () => {
  const photo = async (opts: { exif?: boolean } = {}) => {
    const img = sharp({ create: { width: 2400, height: 1200, channels: 3, background: '#4a7c59' } })
    return (opts.exif ? img.withExif({ IFD0: { Copyright: 'gps-test' } }) : img).jpeg().toBuffer()
  }

  test('фото принимаются вместе с заявкой, метаданные сняты', async ({ request }) => {
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      multipart: {
        phone: uniquePhone(),
        consent: 'true',
        message: 'Берёза над крышей',
        photos: { name: 'tree.jpg', mimeType: 'image/jpeg', buffer: await photo({ exif: true }) },
      },
    })
    expect(res.status()).toBe(201)
    const token = await adminToken(request)
    test.skip(!token, 'нет ADMIN_EMAIL / ADMIN_PASSWORD')
    const lead = await getLead(request, token!, ((await res.json()) as { id: number }).id, 1)
    expect(lead.message).toBe('Берёза над крышей')
    const files = (lead.photoFiles ?? []) as { url?: string; width?: number }[]
    expect(files).toHaveLength(1)
    expect(files[0].width).toBe(2000)
    // файл отдаётся только админу и без EXIF
    const anon = await request.get(files[0].url!)
    expect(anon.status()).toBeGreaterThanOrEqual(400)
    const own = await request.get(files[0].url!, { headers: { Authorization: `JWT ${token}` } })
    expect(own.status()).toBe(200)
    expect((await sharp(await own.body()).metadata()).exif).toBeUndefined()
  })

  test('не фото → 400 с ошибкой у файла, заявка не создаётся', async ({ request }) => {
    const res = await request.post('/api/leads/', {
      headers: { 'x-real-ip': uniqueIp() },
      multipart: {
        phone: uniquePhone(),
        consent: 'true',
        photos: {
          name: 'virus.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('MZ not an image'),
        },
      },
    })
    expect(res.status()).toBe(400)
    expect(await res.json()).toMatchObject({
      error: 'validation_error',
      details: [{ field: 'photos', index: 0 }],
    })
  })
})
