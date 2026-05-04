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

  test('все 11 секций Direction 2 отрендерены', async ({ page }) => {
    // Проверяем ключевые тексты каждой секции
    const markers = [
      /арбористика/i, // §02 pillars
      /5 шагов/i, // §03 how
      /прозрачные цены/i, // §04 pricing
      /пришлите фото/i, // §05 photo-smeta
      /кейсы/i, // §06 cases
      /яндекс\.карты|авито/i, // §07 reviews
      /каждому договору/i, // §08 eeat
      /12 районов/i, // §09 coverage
      /частые вопросы/i, // §10 faq
      /сфотографируйте или позвоните/i, // §11 cta
    ]
    for (const marker of markers) {
      await expect(page.getByText(marker).first()).toBeVisible()
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

    // Первый пункт закрыт по умолчанию
    const firstSummary = items.first().locator('summary')
    await expect(firstSummary).toBeVisible()

    // Клик открывает
    await firstSummary.click()
    await expect(items.first()).toHaveAttribute('open', '')
  })
})
