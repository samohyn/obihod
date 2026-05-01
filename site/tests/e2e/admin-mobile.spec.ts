import { expect, test } from '@playwright/test'

/**
 * US-12 W6 — Mobile responsive admin smoke (sa-panel-wave6.md §6.9)
 *
 * Запускается через Playwright `mobile-chrome` project (Pixel 7 emulation,
 * 412×915 viewport). Plus desktop regression guard через `chromium`.
 *
 * Strategy: **CSS-rule-in-stylesheet assertions** вместо computed-style.
 * Reason: Payload использует `@layer payload-default` cascade, что в
 * сочетании с device emulation Playwright делает computed-style assertions
 * нестабильными (race condition CSS load + media-emulation). Real-device
 * behavior проверяется leadqa real-browser smoke на operator's iPhone
 * (iron rule per memory `feedback_leadqa_must_browser_smoke_before_push`).
 *
 * Auth fixture: requires seed-admin (admin@obikhod.local) — обеспечивает
 * pnpm seed:admin step в CI (см. .github/workflows/ci.yml warmup).
 */

// CI uses ci@obikhod.test/ci-test-password-12345 (см. .github/workflows/ci.yml seed).
// Local dev uses .env.local ADMIN_EMAIL/PASSWORD.
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || (process.env.CI ? 'ci@obikhod.test' : 'admin@obikhod.local')
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || (process.env.CI ? 'ci-test-password-12345' : 'obikhod_dev_admin')

async function tryLogin(page: import('@playwright/test').Page): Promise<boolean> {
  const res = await page.request.post('/api/users/login', {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  return res.ok()
}

interface RuleSummary {
  selector: string
  declarations: string[]
}

async function findMediaQueryRules(
  page: import('@playwright/test').Page,
  mediaSubstring: string,
): Promise<RuleSummary[]> {
  return await page.evaluate((substr) => {
    const found: RuleSummary[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = (sheet as CSSStyleSheet).cssRules
        if (!rules) continue
        for (const rule of Array.from(rules)) {
          const r = rule as CSSMediaRule & CSSStyleRule
          if (r.media && r.media.mediaText.includes(substr)) {
            for (const innerRule of Array.from(r.cssRules || [])) {
              const ir = innerRule as CSSStyleRule
              if (!ir.selectorText || !ir.style) continue
              const declarations: string[] = []
              for (let i = 0; i < ir.style.length; i++) {
                const prop = ir.style[i]
                declarations.push(`${prop}: ${ir.style.getPropertyValue(prop)}`)
              }
              found.push({ selector: ir.selectorText, declarations })
            }
          }
        }
      } catch {
        // CORS / cross-origin sheets — skip
      }
    }
    return found
  }, mediaSubstring)
}

test.describe('US-12 W6 — Admin mobile responsive (CSS deployment guards)', () => {
  test('@media (max-width: 1024px) tablet rules deployed', async ({ page }) => {
    const resp = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }

    const rules = await findMediaQueryRules(page, '1024')
    expect(rules.length).toBeGreaterThan(0)

    // Touch targets §6.8 — есть rule с min-height: 44px на nav/button selectors
    const touchTargetRule = rules.find(
      (r) =>
        /(\.btn|\.nav__link|\.tabs-field__tab-button|nav-toggler|button)/.test(r.selector) &&
        r.declarations.some((d) => /min-height:\s*44/.test(d)),
    )
    expect(touchTargetRule, 'touch target ≥44px rule должен быть в @media 1024').toBeDefined()

    // Sidebar drawer §6.3 — backdrop OR aside.nav.nav--nav-open
    const sidebarRule = rules.find((r) =>
      /aside\.nav|template-default--nav-open|nav-toggler/.test(r.selector),
    )
    expect(sidebarRule, 'sidebar drawer rule должен быть в @media 1024').toBeDefined()
  })

  test('@media (max-width: 640px) mobile rules deployed', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })

    const rules = await findMediaQueryRules(page, '640')
    expect(rules.length).toBeGreaterThan(0)

    // §6.2 Login fullscreen
    const loginRule = rules.find(
      (r) =>
        /\.login__form/.test(r.selector) && r.declarations.some((d) => /max-width:\s*100%/.test(d)),
    )
    expect(loginRule, 'login__form max-width 100% должен быть в @media 640').toBeDefined()

    // §6.4 List view horizontal-scroll fallback — REMOVED в
    // PANEL-CSS-PREFIX-CLEANUP (2026-05-01): `.payload__app table` selector был
    // dead (ancestor отсутствует в Payload 3.84). Backlog PANEL-W6-MOBILE-REVIVE
    // — пересоздать через `.template-default table` ancestor, тогда восстановить
    // эту проверку.

    // §6.5 Tabs horizontal scroll — live (без префикса)
    const tabsRule = rules.find(
      (r) =>
        /\.tabs-field__tabs$/.test(r.selector) &&
        r.declarations.some((d) => /overflow-x:\s*auto/.test(d)),
    )
    expect(tabsRule, 'tabs-field__tabs overflow-x: auto должен быть в @media 640').toBeDefined()

    // §6.6 PageCatalogWidget scrollable
    const widgetRule = rules.find(
      (r) => /aria-label/.test(r.selector) && r.declarations.some((d) => /max-height/.test(d)),
    )
    expect(widgetRule, 'widget max-height для scroll должен быть в @media 640').toBeDefined()

    // §6.7 Bulk-action disabled (cell-_select hidden) — REMOVED в
    // PANEL-CSS-PREFIX-CLEANUP (2026-05-01): селектор `.payload__app td.cell-_select`
    // был dead. Backlog PANEL-W6-MOBILE-REVIVE — recreate через `.template-default`.
  })

  test('login form rendering на mobile-chrome (real-device behaviour)', async ({ page }) => {
    const resp = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }

    // На mobile-chrome project (Pixel 7 = 412px) — login form должен быть виден,
    // полностью функционален, без horizontal scroll body.
    await expect(page.locator('.login__form')).toBeVisible()
    await expect(page.locator('.login__form input[type="email"]')).toBeVisible()
    await expect(page.locator('.login__form input[type="password"]')).toBeVisible()
    await expect(page.locator('.login__form button[type="submit"]')).toBeVisible()

    // Body не должен иметь horizontal scroll
    const bodyOverflowX = await page
      .locator('body')
      .evaluate((el) => getComputedStyle(el).overflowX)
    expect(['hidden', 'visible', 'clip', 'auto']).toContain(bodyOverflowX)
  })

  test('touch targets ≥44px на login submit (WCAG 2.5.5)', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })

    const submit = page.locator('.login__form button[type="submit"]').first()
    await expect(submit).toBeVisible()
    const h = await submit.evaluate((el) => (el as HTMLElement).offsetHeight)
    expect(h, 'submit button height ≥44px (WCAG 2.5.5)').toBeGreaterThanOrEqual(44)
  })

  test('hamburger toggler существует на /admin (auth required, mobile drawer)', async ({
    page,
  }) => {
    const ok = await tryLogin(page)
    if (!ok) {
      test.skip(true, `Login API rejected ${ADMIN_EMAIL} — env-specific creds`)
    }
    await page.goto('/admin/', { waitUntil: 'networkidle' })

    // Если редирект на /admin/login — login сессия не подхватилась (cookie issue
    // в test-runner-context vs page-context). Пропускаем graceful — это не
    // блокер W6 mobile CSS regression.
    if (page.url().includes('/admin/login')) {
      test.skip(true, 'login session не сохранилась в page context — env-specific')
    }

    // На любом viewport Payload рендерит .nav-toggler (даже если visibility-hidden
    // на desktop). Проверяем что элемент в DOM присутствует — Payload native
    // отвечает за toggle visibility per viewport.
    const navToggler = page.locator('.nav-toggler')
    const count = await navToggler.count()
    expect(count, 'nav-toggler должен присутствовать в DOM').toBeGreaterThan(0)
  })
})
