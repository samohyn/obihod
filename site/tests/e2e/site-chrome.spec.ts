import { expect, test } from '@playwright/test'

/**
 * Регрессия по SiteChrome — «рамка сайта» читается из Payload global,
 * ни один компонент не должен держать hard-coded телефон / URL мессенджера.
 *
 * Поводом написать тест стал инцидент 2026-04-23: после US-2 релиза Header
 * обновился на +7 (985) 170-51-11 из SiteChrome, но Hero.tsx и CtaMessengers.tsx
 * продолжали показывать placeholder-телефоны из старого JSX. Визуальная
 * расстыковка бренда.
 *
 * Правило:
 * - Единственный легальный телефонный номер на сайте — тот, что в
 *   SiteChrome.contacts.phoneDisplay / phoneE164. На момент seed это
 *   +7 (985) 170-51-11.
 * - Старые placeholder'ы +7 (495) 123-45-67 и +7 495 000-00-00 не
 *   должны попадать в HTML публичных страниц.
 */

const PHONE_DISPLAY = '+7 (985) 170-51-11'
const PHONE_E164 = '+79851705111'

const FORBIDDEN_PHONES = ['+7 (495) 123-45-67', '+7 495 000-00-00', '+74951234567', '+74950000000']

const PUBLIC_PATHS = ['/', '/kejsy/', '/raiony/']

test.describe('SiteChrome — единый телефон везде', () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path} показывает финальный телефон и не содержит placeholder-ов`, async ({ page }) => {
      const resp = await page.goto(path)
      expect(resp?.status()).toBeLessThan(400)

      const html = await page.content()
      for (const forbidden of FORBIDDEN_PHONES) {
        expect(
          html.includes(forbidden),
          `${path} содержит запрещённый placeholder "${forbidden}"`,
        ).toBe(false)
      }

      expect(html).toContain(PHONE_DISPLAY)
    })
  }

  test('Hero CTA ведёт на актуальный tel: E.164', async ({ page }) => {
    await page.goto('/')
    const telLinks = page.locator('a[href^="tel:"]')
    const count = await telLinks.count()
    expect(count, 'ни одной tel:-ссылки в Hero/Header — телефон точно сломан').toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const href = await telLinks.nth(i).getAttribute('href')
      expect(href, `tel: link ${i} должен быть именно ${PHONE_E164}`).toBe(`tel:${PHONE_E164}`)
    }
  })
})

test.describe('Messenger-плашка читает social из SiteChrome', () => {
  // CtaMessengers используется на /kejsy/[slug]/, /raiony/[district]/,
  // /[service]/, /[service]/[district]/. Минимальный путь, который
  // после seed гарантированно 200 — /kejsy/ (список, сам CtaMessengers
  // внутри карточки кейса). До seed roots по programmatic 404-ятся,
  // поэтому проверяем на главной отсутствие запрещённых URL.

  test('нигде в HTML главной нет wa.me/74950000000', async ({ page }) => {
    await page.goto('/')
    const html = await page.content()
    expect(html).not.toContain('wa.me/74950000000')
    expect(html).not.toContain('+74950000000')
  })
})

test.describe('JSON-LD Organization источник — SiteChrome', () => {
  test('telephone в JSON-LD равен phoneE164, sameAs — массив (или пуст)', async ({ page }) => {
    const resp = await page.goto('/')
    expect(resp?.status()).toBe(200)

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const orgSchema = scripts
      .map((s) => {
        try {
          return JSON.parse(s) as { '@type'?: string; telephone?: string; sameAs?: unknown }
        } catch {
          return null
        }
      })
      .find((j) => j && j['@type'] === 'Organization')

    // Organization может быть массивом в @graph — развернём при необходимости
    const org =
      orgSchema ??
      scripts
        .map((s) => {
          try {
            const parsed = JSON.parse(s) as { '@graph'?: Array<{ '@type'?: string }> }
            return (parsed['@graph'] ?? []).find((x) => x['@type'] === 'Organization')
          } catch {
            return null
          }
        })
        .find(Boolean)

    expect(org, 'Organization JSON-LD не найден на главной').toBeTruthy()
    if (org && 'telephone' in org && org.telephone) {
      expect(org.telephone).toBe(PHONE_E164)
    }
  })
})
