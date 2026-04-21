import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config для сайта Обихода.
 *
 * Используется qa-engineer-агентом для E2E-регрессии критических путей:
 * лендинг, 4 калькулятора, форма «фото → смета», deep-link в мессенджер.
 *
 * Запуск:
 *   pnpm test:e2e               # все тесты, все браузеры
 *   pnpm test:e2e --ui          # Playwright UI mode
 *   pnpm test:e2e --project=chromium  # один браузер
 *
 * webServer поднимает next dev автоматически, если сервер ещё не запущен
 * на указанном baseURL (reuseExistingServer: !CI).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    // Safari/Firefox добавим, когда понадобится — см. qa-engineer.md §7
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
