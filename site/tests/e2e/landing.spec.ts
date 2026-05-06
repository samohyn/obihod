import { expect, test } from '@playwright/test'

/**
 * Smoke-тесты главной страницы — Phase 1 homepage-classic launch.
 * Selectors и заголовки синхронизированы с newui/homepage-classic.html (commit 4a0a3d4).
 */
test.describe('Главная страница', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('отвечает 200 и содержит заголовок «Обиход»', async ({ page }) => {
    await expect(page).toHaveTitle(/Обиход/)
  })

  test('Hero — H1 содержит ключевой оффер', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toContainText('Удаление деревьев')
    await expect(h1).toContainText('Москве и МО')
  })

  test('Hero — форма заявки с обязательным полем телефон', async ({ page }) => {
    const form = page.locator('.hpc-form-card form')
    await expect(form).toBeVisible()
    await expect(form.locator('#hero-phone')).toBeVisible()
    await expect(form.getByRole('button', { name: /смету/i })).toBeVisible()
  })

  test('все 13 секций homepage-classic отрендерены — проверяем h2 заголовки', async ({ page }) => {
    const headings = [
      'Один подрядчик', // §02 pillars
      '5 шагов', // §03 how
      'без «по запросу»', // §04 pricing
      'Знаете параметры', // §04.5 calculator
      'Пришлите фото', // §05 photo-smeta
      'этом сезоне', // §06 cases
      'Что пишут', // §07 reviews
      'каждому договору', // §08 documents
      'активной работе', // §09 coverage
      'на объекте', // §09.5 gallery
      'чаще всего', // §10 faq
      'позвоните', // §11 cta
    ]
    for (const text of headings) {
      await expect(page.getByRole('heading').filter({ hasText: text }).first()).toBeVisible()
    }
  })

  test('шапка содержит брендинг и контактный телефон', async ({ page }) => {
    const header = page.getByRole('banner')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: /Обиход/ }).first()).toBeVisible()
    // .mm-phone link на mobile может быть скрыт через CSS — проверяем DOM presence
    await expect(header.locator('a.mm-phone')).toHaveCount(1)
  })

  test('Pricing table — 7 строк с ценами', async ({ page }) => {
    const rows = page.locator('.hpc-price-row')
    await expect(rows).toHaveCount(7)
    // На mobile первый row может скрываться — собираем текст без visibility-check
    const allText = (await rows.allInnerTexts()).join(' ')
    expect(allText).toContain('₽')
  })

  test('Coverage — 12 районов', async ({ page }) => {
    const chips = page.locator('.hp-cov-chip')
    await expect(chips).toHaveCount(12)
  })
})

test.describe('FAQ', () => {
  test('пункты открываются по клику', async ({ page }) => {
    await page.goto('/#faq')
    const items = page.locator('.accordion .item')
    await expect(items).toHaveCount(8)

    const firstSummary = items.first().locator('summary')
    await expect(firstSummary).toBeVisible()

    // Phase 1: native <details>/<summary> — после click атрибут `open`
    await firstSummary.click()
    await expect(items.first()).toHaveAttribute('open', '')
  })
})
