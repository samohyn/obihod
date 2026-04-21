import { expect, test } from '@playwright/test'

/**
 * Smoke-тесты главной страницы после переноса прототипа в Next.js.
 * Покрывают что сайт вообще запускается и ключевые секции видимы.
 * Детальные сценарии калькулятора / формы / deep-link в мессенджер —
 * отдельные спеки, когда подключим backend-интеграции.
 */
test.describe('Главная страница', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('отвечает 200 и содержит заголовок «Обиход»', async ({ page }) => {
    await expect(page).toHaveTitle(/Обиход/)
  })

  test('Hero с брендовым слоганом виден', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Участок')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('в порядке')
  })

  test('все 12 ключевых секций лендинга отрендерены', async ({ page }) => {
    const ids = [
      'services',
      'calendar',
      'calc',
      'how',
      'guarantees',
      'cases',
      'subscription',
      'reviews',
      'team',
      'b2b',
      'faq',
      'contact',
    ] as const

    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toBeVisible()
    }
  })

  test('шапка содержит навигационные ссылки и CTA', async ({ page }) => {
    const nav = page.locator('nav.nav')
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: /Замер бесплатно/ })).toBeVisible()
  })

  test('форма заявки в контакт-секции содержит обязательные поля', async ({ page }) => {
    const form = page.locator('form[aria-label="Заявка на замер"]')
    await expect(form.getByPlaceholder('Ваше имя')).toBeVisible()
    await expect(form.getByPlaceholder(/\+7/)).toBeVisible()
    await expect(form.getByRole('button', { name: /Отправить заявку/ })).toBeVisible()
  })
})

test.describe('Калькулятор', () => {
  test('переключение услуги меняет активный таб', async ({ page }) => {
    await page.goto('/#calc')
    const tablist = page.getByRole('tablist', { name: 'Выбор услуги' })
    await expect(tablist).toBeVisible()

    const snowTab = tablist.getByRole('tab', { name: 'Уборка снега' })
    await snowTab.click()
    await expect(snowTab).toHaveAttribute('aria-selected', 'true')
  })

  test('итоговая цена > 0 и показывается вилка', async ({ page }) => {
    await page.goto('/#calc')
    const price = page.locator('.calc-price')
    await expect(price).toBeVisible()
    const text = (await price.textContent()) ?? ''
    // "X.X тыс ₽" — проверяем что число > 0
    const num = parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'))
    expect(num).toBeGreaterThan(0)

    await expect(page.locator('.calc-range')).toContainText('вилка:')
  })
})

test.describe('FAQ', () => {
  test('первый вопрос открыт по умолчанию, клик переключает', async ({ page }) => {
    await page.goto('/#faq')
    const items = page.locator('.faq-item')
    await expect(items.first()).toHaveClass(/is-open/)

    // Клик по второму — первый закрывается, второй открывается
    const secondBtn = items.nth(1).getByRole('button')
    await secondBtn.click()
    await expect(items.nth(1)).toHaveClass(/is-open/)
    await expect(items.first()).not.toHaveClass(/is-open/)
  })
})
