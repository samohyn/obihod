import { expect, test } from '@playwright/test'

/**
 * Smoke-тесты главной страницы Direction 2 «Конверсионный».
 * Обновлены под feat/homepage-classic-launch (PR #164).
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
    await expect(h1).toContainText('Москве и Подмосковье')
  })

  test('Hero — форма заявки с обязательным полем телефон', async ({ page }) => {
    const form = page.locator('.hpc-form-card form')
    await expect(form).toBeVisible()
    await expect(form.locator('#hf-phone')).toBeVisible()
    await expect(form.getByRole('button', { name: /смету/i })).toBeVisible()
  })

  test('все 11 секций Direction 2 отрендерены — проверяем h2 заголовки', async ({ page }) => {
    // Проверяем h2 секций — они всегда видимы (не внутри accordion)
    const headings = [
      'Один подрядчик', // §02 pillars
      '5 шагов', // §03 how
      'без «по запросу»', // §04 pricing
      'Пришлите фото', // §05 photo-smeta
      'этом сезоне', // §06 cases
      'Что пишут', // §07 reviews
      'каждому договору', // §08 eeat
      'активной работе', // §09 coverage
      'чаще всего', // §10 faq
      'позвоните', // §11 cta
    ]
    for (const text of headings) {
      await expect(page.getByRole('heading').filter({ hasText: text }).first()).toBeVisible()
    }
  })

  test('шапка содержит навигацию и CTA', async ({ page }) => {
    const header = page.getByRole('banner')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: /Получить смету/ })).toBeVisible()
  })

  test('Pricing table — 7 строк с ценами', async ({ page }) => {
    const rows = page.locator('.hpc-price-row')
    await expect(rows).toHaveCount(7)
    await expect(rows.first()).toContainText('₽')
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

    // Компонент использует data-open (React state, не native <details>)
    await firstSummary.click()
    await expect(items.first()).toHaveAttribute('data-open', 'true')
  })
})
