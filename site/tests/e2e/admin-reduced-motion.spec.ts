import { expect, test } from '@playwright/test'

/**
 * US-12 W7 — Reduced motion smoke (sa-panel-wave7.md §7.3)
 *
 * Verify что `@media (prefers-reduced-motion: reduce)` блок в custom.scss
 * задеплоен. Iron rule a11y WCAG 2.2 AA — admin (оператор использует
 * ежедневно, длительные сессии, vestibular sensitivity не блокировать).
 *
 * Strategy: CSS-rule-in-stylesheet assertions (как в admin-mobile.spec.ts).
 * Real reduced-motion behavior проверяется leadqa real-browser smoke с
 * системным OS setting `prefers-reduced-motion: reduce`.
 *
 * Reduced-motion CSS rules в custom.scss:
 * - .btn--style-primary:active transform: none
 * - .login__form button[type='submit']:active transform: none
 * - .payload__app *, .login__form * transition-duration: 0.01ms !important
 * - .brand-skeleton .brand-skeleton__bar animation: none
 * - .tabs-field__tabs scroll-behavior: auto (W6)
 */

test.describe('US-12 W7 — Reduced motion smoke', () => {
  test('@media (prefers-reduced-motion: reduce) блок deployed', async ({ page }) => {
    const resp = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }

    const found = await page.evaluate(() => {
      const result = {
        hasReducedMotionRule: false,
        innerRulesCount: 0,
        skeletonOff: false,
        transitionFast: false,
        transformNone: false,
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            const r = rule as CSSMediaRule
            if (r.media && /prefers-reduced-motion/.test(r.media.mediaText)) {
              result.hasReducedMotionRule = true
              const inner = Array.from(r.cssRules || [])
              result.innerRulesCount = inner.length
              for (const ir of inner) {
                const sr = ir as CSSStyleRule
                const sel = sr.selectorText || ''
                const text = sr.cssText || ''
                // Browsers expand `animation: none` shorthand to полную форму
                // `auto ease 0s 1 normal none running none`. Match any rule на
                // .brand-skeleton__bar где animation property выставлено и
                // включает `none` в name slot (last token).
                if (/brand-skeleton__bar/.test(sel) && /animation:.*\bnone\b/.test(text)) {
                  result.skeletonOff = true
                }
                if (/transition-duration:\s*0?\.?\d+ms/.test(text)) {
                  result.transitionFast = true
                }
                if (/transform:\s*none/.test(text)) {
                  result.transformNone = true
                }
              }
            }
          }
        } catch {
          // CORS — skip
        }
      }
      return result
    })

    expect(
      found.hasReducedMotionRule,
      'prefers-reduced-motion блок должен быть в custom.scss',
    ).toBe(true)
    expect(found.innerRulesCount, 'должны быть rules внутри @media').toBeGreaterThan(0)
    expect(found.skeletonOff, 'skeleton pulse должен быть отключен').toBe(true)
    expect(found.transitionFast, 'transition-duration должен быть ≤0.01ms').toBe(true)
    expect(found.transformNone, 'submit/button :active transform должен быть none').toBe(true)
  })

  test('reduced-motion emulation: страница загружается без ошибок', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const resp = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }
    // Login screen рендерится корректно с reduced-motion (regression guard)
    await expect(page.locator('.login__form')).toBeVisible()
    await expect(page.locator('.login__form button[type="submit"]')).toBeVisible()
  })

  test('matchMedia(prefers-reduced-motion: reduce) корректно triggers под emulation', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    const matches = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    expect(matches, 'emulation должен включить reduced-motion').toBe(true)
  })
})
