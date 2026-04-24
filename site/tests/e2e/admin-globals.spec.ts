import { expect, test, type APIRequestContext, type BrowserContext } from '@playwright/test'

/**
 * Регрессия: admin-роуты Payload рендерят формы без client-side errors.
 *
 * Поводом написать тест стал инцидент 2026-04-23: после добавления глобала
 * SiteChrome и custom admin-компонентов (BrandLogo / BrandIcon /
 * BeforeDashboardStartHere) на проде admin-роут /admin/globals/site-chrome/
 * показывал «Nothing found», а dashboard белел из-за того, что
 * `app/(payload)/admin/importMap.js` не был перегенерирован перед билдом.
 * Middleware отвечал 200, ошибка была чисто client-side в React-SPA.
 *
 * Этот safety-net прогоняет admin-роуты КАЖДОГО global'а и create-формы
 * КАЖДОЙ collection через реальный браузер и проверяет, что:
 *   1. форма отрендерилась (есть `<form>` или поля input/textarea/select),
 *   2. на странице нет «Nothing found» / «404» / «500» / «Error»,
 *   3. в console.error / pageerror нет критических ошибок
 *      (importMap mis-resolve вылазит сюда: «Cannot read properties of
 *      undefined» / «not a function» внутри admin chunk'ов).
 *
 * Запуск:
 *   pnpm test:e2e --project=chromium --grep admin-globals
 *
 * Auth:
 *   - В CI Postgres ephemeral → first-register создаёт юзера за один
 *     POST `/api/users/first-register`, cookie выставляется в browser
 *     context'е и шарится между тестами.
 *   - Локально, если БД уже инициализирована, тест пробует login по
 *     E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD env. Если их нет — beforeAll
 *     зафейлится с понятным сообщением.
 *
 * Refs: OBI-1 / US-3, learnings.md 2026-04-23.
 */

const GLOBAL_SLUGS = ['seo-settings', 'site-chrome'] as const

// Все коллекции из payload.config.ts. Users отдельно — на нём сидим под auth.
const COLLECTION_SLUGS = [
  'media',
  'services',
  'districts',
  'service-districts',
  'cases',
  'persons',
  'blog',
  'b2b-pages',
  'leads',
  'redirects',
] as const

const E2E_EMAIL = process.env.E2E_ADMIN_EMAIL || 'qa-e2e@obikhod.local'
const E2E_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'qa-e2e-password-123!'

const FORBIDDEN_MARKERS = [
  'Nothing found',
  'Ничего не найдено',
  '404',
  '500',
  'Internal Server Error',
  'Application error',
] as const

type AuthOutcome =
  | { kind: 'ok' }
  | { kind: 'skip'; reason: string }
  | { kind: 'fail'; reason: string }

/**
 * Устанавливает cookie авторизации в browser context'е до открытия admin.
 * Стратегия:
 *   1. POST /api/users/first-register — если БД пустая, создаст юзера и
 *      вернёт Set-Cookie. CI этот путь использует на каждом запуске.
 *   2. Если first-register сказал «юзер уже есть» (403) — POST
 *      /api/users/login по env-кредам.
 *   3. На CI ни один из путей не сработать не может (БД ephemeral) →
 *      возвращаем 'fail'.
 *   4. Локально, если БД уже была инициализирована до запуска и кредов в
 *      env нет, возвращаем 'skip' — оператор видит причину и может либо
 *      задать E2E_ADMIN_EMAIL/PASSWORD, либо запустить против чистой БД.
 */
async function authenticate(
  request: APIRequestContext,
  context: BrowserContext,
  baseURL: string,
): Promise<AuthOutcome> {
  const tryFirstRegister = await request.post(`${baseURL}/api/users/first-register`, {
    data: { email: E2E_EMAIL, password: E2E_PASSWORD },
    failOnStatusCode: false,
  })

  if (tryFirstRegister.ok()) {
    const state = await request.storageState()
    await context.addCookies(state.cookies)
    return { kind: 'ok' }
  }

  const loginRes = await request.post(`${baseURL}/api/users/login`, {
    data: { email: E2E_EMAIL, password: E2E_PASSWORD },
    failOnStatusCode: false,
  })

  if (loginRes.ok()) {
    const state = await request.storageState()
    await context.addCookies(state.cookies)
    return { kind: 'ok' }
  }

  const firstRegisterBody = await tryFirstRegister.text().catch(() => '')
  const loginBody = await loginRes.text().catch(() => '')
  const reason =
    `first-register: ${tryFirstRegister.status()} ${firstRegisterBody.slice(0, 200)}; ` +
    `login: ${loginRes.status()} ${loginBody.slice(0, 200)}. ` +
    `Set E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD env when running against a populated DB.`

  // На CI fail обязателен — там Postgres ephemeral, first-register должен пройти.
  if (process.env.CI) {
    return { kind: 'fail', reason }
  }
  return { kind: 'skip', reason }
}

test.describe('Admin SPA — importMap regression safety-net', () => {
  // Авторизуемся в beforeEach — cookie сидит в browser context'е, который
  // создаётся per-test. Каждый тест собирает свой массив console-ошибок.
  // На CI auth обязателен (Postgres ephemeral). Локально на populated БД
  // без env-кредов — graceful skip, чтобы не ломать local pnpm test:e2e.
  test.beforeEach(async ({ request, context, baseURL }, testInfo) => {
    if (!baseURL) throw new Error('baseURL must be set in playwright.config.ts')
    const outcome = await authenticate(request, context, baseURL)
    if (outcome.kind === 'skip') {
      testInfo.skip(true, `Admin auth unavailable locally — ${outcome.reason}`)
    }
    if (outcome.kind === 'fail') {
      throw new Error(`E2E auth failed on CI: ${outcome.reason}`)
    }
  })

  test('dashboard /admin рендерится без client-side errors', async ({ page }) => {
    const errors = collectClientErrors(page)

    const response = await page.goto('/admin/', { waitUntil: 'domcontentloaded' })
    expect(response?.status(), '/admin/ должен ответить < 400').toBeLessThan(400)

    // Ждём что admin SPA hydrate-нулась — должна появиться основная нав-панель.
    await page.waitForSelector('a[href*="/admin/"]', { timeout: 15_000 })

    const html = await page.content()
    for (const marker of FORBIDDEN_MARKERS) {
      expect(html.includes(marker), `dashboard содержит запрещённый маркер "${marker}"`).toBe(false)
    }

    expectNoCriticalClientErrors(errors, '/admin/')
  })

  for (const slug of GLOBAL_SLUGS) {
    test(`global /admin/globals/${slug}/ рендерит форму`, async ({ page }) => {
      const errors = collectClientErrors(page)

      const response = await page.goto(`/admin/globals/${slug}/`, { waitUntil: 'domcontentloaded' })
      expect(
        response?.status(),
        `/admin/globals/${slug}/ должен ответить < 400 на server-level`,
      ).toBeLessThan(400)

      // SPA должна успеть hydrate-ить форму глобала. Если importMap сломан —
      // на этой странице будет «Nothing found» и не появится <form>.
      const formAppeared = await page
        .waitForSelector('form', { timeout: 20_000 })
        .then(() => true)
        .catch(() => false)

      const html = await page.content()
      for (const marker of FORBIDDEN_MARKERS) {
        expect(
          html.includes(marker),
          `/admin/globals/${slug}/ содержит запрещённый маркер "${marker}" — ` +
            `вероятно importMap.js не содержит entry для нового global'а / компонента`,
        ).toBe(false)
      }

      expect(
        formAppeared,
        `/admin/globals/${slug}/ — <form> не появился за 20s, admin-SPA не hydrate-нулась`,
      ).toBe(true)

      expectNoCriticalClientErrors(errors, `/admin/globals/${slug}/`)
    })
  }

  for (const slug of COLLECTION_SLUGS) {
    test(`collection /admin/collections/${slug}/create рендерит форму`, async ({ page }) => {
      const errors = collectClientErrors(page)

      const response = await page.goto(`/admin/collections/${slug}/create/`, {
        waitUntil: 'domcontentloaded',
      })
      expect(
        response?.status(),
        `/admin/collections/${slug}/create/ должен ответить < 400 на server-level`,
      ).toBeLessThan(400)

      const formAppeared = await page
        .waitForSelector('form', { timeout: 20_000 })
        .then(() => true)
        .catch(() => false)

      const html = await page.content()
      for (const marker of FORBIDDEN_MARKERS) {
        expect(
          html.includes(marker),
          `/admin/collections/${slug}/create/ содержит запрещённый маркер "${marker}"`,
        ).toBe(false)
      }

      expect(formAppeared, `/admin/collections/${slug}/create/ — <form> не появился за 20s`).toBe(
        true,
      )

      expectNoCriticalClientErrors(errors, `/admin/collections/${slug}/create/`)
    })
  }
})

// ---------------------- helpers ----------------------

type CollectedErrors = {
  pageErrors: Error[]
  consoleErrors: string[]
}

function collectClientErrors(page: import('@playwright/test').Page): CollectedErrors {
  const collected: CollectedErrors = { pageErrors: [], consoleErrors: [] }

  page.on('pageerror', (err) => {
    collected.pageErrors.push(err)
  })

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (isIgnorableConsoleError(text)) return
    collected.consoleErrors.push(text)
  })

  return collected
}

/**
 * Игнорим заведомо нерелевантный шум, чтобы тест не флейкал на ровном месте.
 * НЕ глушим ничего, что похоже на importMap mis-resolve / undefined component.
 */
function isIgnorableConsoleError(text: string): boolean {
  if (!text) return true
  // Next.js dev hydration warnings — не фейлим из-за них в этой регрессии.
  if (text.includes('Hydration')) return true
  // 404 на favicon / иконки в admin не должны валить тест.
  if (/Failed to load resource.*\b(404|favicon|apple-icon|icon\.png)\b/i.test(text)) return true
  // React DevTools recommendation — спам в dev.
  if (text.includes('Download the React DevTools')) return true
  return false
}

function expectNoCriticalClientErrors(errors: CollectedErrors, route: string): void {
  // pageerror = unhandled exception в JS. Это всегда blocker.
  expect(
    errors.pageErrors.map((e) => e.message),
    `${route}: page.pageerror`,
  ).toEqual([])

  // console.error — только критичные, остальные отфильтрованы выше.
  expect(errors.consoleErrors, `${route}: console.error (фильтрованный)`).toEqual([])
}
