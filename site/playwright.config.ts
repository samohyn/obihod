import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config для сайта Обихода.
 *
 * E2E-проверки на каждом PR (план 09, этап 1): формы и /api/leads, axe,
 * здоровье страниц, главная, шапка/подвал, SEO, админка. Шаблоны с контентом —
 * на staging (workflow site-checks).
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      // На мобильном — то, что видит клиент, и мобильная админка. API, остальная
      // админка и pages-health (сама перебирает ширины 360…1440) — только в chromium.
      testMatch: /(^|[\\/])(forms|a11y|landing|site-chrome|admin-mobile)\.spec\.ts$/,
    },
  ],

  // В CI поднимаем `pnpm run start` в отдельном шаге workflow (после build),
  // передаём PLAYWRIGHT_EXTERNAL_SERVER=1 чтобы Playwright не запускал свой.
  // Локально — webServer с `pnpm dev` и reuse существующего, если уже запущен.
  webServer:
    process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1'
      ? undefined
      : {
          command: 'pnpm dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          stdout: 'ignore',
          stderr: 'pipe',
        },
})
