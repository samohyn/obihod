import { defineConfig, devices } from '@playwright/test'

/**
 * Проверки живого сайта — после выкатки на staging и ночью на проде
 * (.github/workflows/site-checks.yml). В PR-проверки (playwright.config.ts) не входит.
 *
 * Env:
 *   SITE_CHECK_URL      — адрес сайта (https://staging.obikhod.ru или https://obikhod.ru);
 *   SITE_AUTH           — «логин:пароль» basic auth staging;
 *   SITE_ALLOW_WRITES=1 — можно отправить тестовую заявку (только staging);
 *   SITE_EXPECT_NOINDEX — «1» (по умолчанию) до запуска: сайт обязан быть закрыт от индексации;
 *   SITE_SUMMARY_FILE   — куда дописывать таблицу по шаблонам (в CI — сводка запуска).
 *
 * Локально: SITE_CHECK_URL=https://obikhod.ru pnpm exec playwright test -c playwright.site.config.ts
 */
const [username, ...rest] = (process.env.SITE_AUTH ?? '').split(':')

export default defineConfig({
  testDir: './tests/site',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  // Шаблон = 4 ширины × полностраничный скриншот + axe; на живом сайте не ждём networkidle (счётчики).
  timeout: 120_000,
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report-site' }], ['list']],
  use: {
    baseURL: process.env.SITE_CHECK_URL || 'http://localhost:3000',
    httpCredentials: username ? { username, password: rest.join(':') } : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
