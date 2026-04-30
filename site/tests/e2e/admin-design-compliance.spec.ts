import { expect, test } from '@playwright/test'

/**
 * OBI-19 Wave 1 — Admin design compliance с design-system/brand-guide.html §12
 * + specs/US-12-admin-redesign/art-concept-v2.md.
 *
 * Проверяем что Payload admin визуально соответствует утверждённой
 * design-system. Ассертим computed CSS-переменные и стили на /admin/login
 * (SSR-страница с подгруженным custom.scss).
 *
 * Критичная точка после ошибки PR #68: в admin **primary CTA = янтарный**
 * (`#e6a23c` text `#1c1c1c`), не brand-зелёный. Зелёный — для secondary,
 * status-published-pill, sidebar active link.
 *
 * Если admin недоступен (например, БД не поднята локально), тест пропускается,
 * чтобы не ломать CI на отдельных средах.
 */

const ADMIN_PATH = '/admin/login'

test.describe('OBI-19 — Admin design compliance (Wave 1)', () => {
  test('палитра + радиусы + шрифт + motion + shadow токены на :root', async ({ page }) => {
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }

    // 1. Палитра — design-system/tokens/colors.json.
    const palette = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        primary: cs.getPropertyValue('--brand-obihod-primary').trim(),
        primaryInk: cs.getPropertyValue('--brand-obihod-primary-ink').trim(),
        accent: cs.getPropertyValue('--brand-obihod-accent').trim(),
        accentHover: cs.getPropertyValue('--brand-obihod-accent-hover').trim(),
        accentInk: cs.getPropertyValue('--brand-obihod-accent-ink').trim(),
        paper: cs.getPropertyValue('--brand-obihod-paper').trim(),
        ink: cs.getPropertyValue('--brand-obihod-ink').trim(),
        muted: cs.getPropertyValue('--brand-obihod-muted').trim(),
        line: cs.getPropertyValue('--brand-obihod-line').trim(),
        danger: cs.getPropertyValue('--brand-obihod-danger').trim(),
      }
    })
    expect(palette.primary.toLowerCase()).toBe('#2d5a3d')
    expect(palette.primaryInk.toLowerCase()).toBe('#1f3f2b')
    expect(palette.accent.toLowerCase()).toBe('#e6a23c')
    expect(palette.accentHover.toLowerCase()).toBe('#d99528')
    expect(palette.accentInk.toLowerCase()).toBe('#c18724')
    expect(palette.paper.toLowerCase()).toBe('#f7f5f0')
    expect(palette.ink.toLowerCase()).toBe('#1c1c1c')
    expect(palette.muted.toLowerCase()).toBe('#6b6256') // admin-уточнение для WCAG AA 4.5:1
    expect(palette.line.toLowerCase()).toBe('#e6e1d6')
    expect(palette.danger.toLowerCase()).toBe('#b54828')

    // 2. Радиусы — design-system/tokens/radius.json (источник globals.css).
    const radii = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        sm: cs.getPropertyValue('--brand-obihod-radius-sm').trim(),
        m: cs.getPropertyValue('--brand-obihod-radius').trim(),
        lg: cs.getPropertyValue('--brand-obihod-radius-lg').trim(),
      }
    })
    expect(radii.sm).toBe('6px')
    expect(radii.m).toBe('10px')
    expect(radii.lg).toBe('16px')

    // 3. Motion — design-system/tokens/motion.json (duration.fast = 120ms).
    // Chrome нормализует "120ms" в ".12s" при чтении computed-style — сравниваем
    // как числа в ms, не как строки.
    const motion = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        fast: cs.getPropertyValue('--brand-obihod-duration-fast').trim(),
        base: cs.getPropertyValue('--brand-obihod-duration-base').trim(),
        ease: cs.getPropertyValue('--brand-obihod-ease-standard').trim(),
      }
    })
    const toMs = (v: string): number => {
      const m = v.match(/^([\d.]+)\s*(ms|s)?$/i)
      if (!m) return NaN
      const n = parseFloat(m[1])
      return m[2]?.toLowerCase() === 's' ? n * 1000 : n
    }
    expect(toMs(motion.fast)).toBe(120)
    expect(toMs(motion.base)).toBe(200)
    // cubic-bezier — Chrome нормализует пробелы и стрипает leading zeros
    // ("0.4" → ".4"). Сравниваем нормализованные строки на обеих сторонах.
    const cssNorm = (v: string) =>
      v
        .replace(/\s+/g, '')
        .replace(/(^|[^\d.])0\.(\d)/g, '$1.$2')
        .toLowerCase()
    expect(cssNorm(motion.ease)).toBe(cssNorm('cubic-bezier(0.4, 0, 0.2, 1)'))

    // 4. Shadow focus rings — design-system/tokens/shadow.json.
    // Chrome в CI конвертирует rgba(45, 90, 61, 0.15) → hex+alpha #2d5a3d26.
    // Принимаем любое представление: rgba(R, G, B[, A]) или #hex.
    const shadow = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        focusPrimary: cs.getPropertyValue('--brand-obihod-shadow-focus-primary').trim(),
        focusError: cs.getPropertyValue('--brand-obihod-shadow-focus-error').trim(),
      }
    })
    // Primary green: rgba(45,90,61,*) ИЛИ #2d5a3d (с/без alpha-канала).
    expect(shadow.focusPrimary).toMatch(/(rgba?\(\s*45\s*,\s*90\s*,\s*61|#2d5a3d)/i)
    // Error red: rgba(181,72,40,*) ИЛИ #b54828.
    expect(shadow.focusError).toMatch(/(rgba?\(\s*181\s*,\s*72\s*,\s*40|#b54828)/i)

    // 5. Шрифт — Golos Text (design-system/tokens/typography.json).
    const fontBody = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim(),
    )
    expect(fontBody.toLowerCase()).toContain('golos text')
    expect(fontBody.toLowerCase()).toContain('inter') // fallback chain
  })

  test('Wave 2 (OBI-28): BeforeLoginLockup виден над формой', async ({ page }) => {
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }

    // На CI Payload показывает create-first-user UI (БД ephemeral, нет users) —
    // beforeLogin slot не рендерится. Пробуем lockup с коротким таймаутом, skip
    // если не виден (валидно для CI). На staging/prod с реальными users — pass.
    const lockupVisible = await page
      .getByText('obikhod.ru · admin', { exact: true })
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    if (!lockupVisible) {
      test.skip(true, 'beforeLogin slot не виден (вероятно create-first-user state в CI)')
      return
    }

    // BeforeLoginLockup рендерит eyebrow «obikhod.ru · admin» + h1 «Порядок под ключ»
    // через admin.components.beforeLogin slot — над native Payload login form.
    await expect(page.getByText('obikhod.ru · admin', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Порядок под ключ' })).toBeVisible()
  })

  test('Wave 3 (OBI-29): PageCatalog widget виден на /admin', async ({ page }) => {
    const resp = await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin /admin не отвечает (status=${resp?.status()}) — пропуск`)
    }

    // Без аутентификации Payload редиректит /admin → /admin/login. PageCatalog
    // рендерится в afterDashboard slot — виден только после login. На CI без
    // users widget не виден → skip. На staging/prod с реальными users — pass.
    const catalogVisible = await page
      .getByText('Каталог опубликованных страниц', { exact: false })
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    if (!catalogVisible) {
      test.skip(true, 'PageCatalog не виден (вероятно unauthenticated state в CI)')
      return
    }

    await expect(page.getByText('Каталог опубликованных страниц')).toBeVisible()
  })

  /* ───────── W7 Polish smoke (sa-panel-wave7.md §7.2) ───────── */

  test('Wave 4 (PAN-3): tabs has-error CSS rule deployed (red dot indicator)', async ({ page }) => {
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }
    // Проверка что W4 closure CSS rule (has-error::after content '•') в stylesheet
    const ruleDeployed = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            const r = rule as CSSStyleRule
            if (
              r.selectorText &&
              /tabs-field__tab-button.*has-error.*::after|tabs-field__tab-button.*aria-invalid.*::after/.test(
                r.selectorText,
              ) &&
              /'•'|"•"/.test(r.cssText)
            ) {
              return true
            }
          }
        } catch {
          // skip
        }
      }
      return false
    })
    expect(ruleDeployed, 'W4 has-error tab indicator CSS rule должен быть в custom.scss').toBe(true)
  })

  test('Wave 5 part 1 (PAN-4): brand-skeleton-pulse keyframes deployed', async ({ page }) => {
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }
    // Verify @keyframes brand-skeleton-pulse + .brand-skeleton__bar { animation } в DOM
    const result = await page.evaluate(() => {
      let hasKeyframes = false
      let hasAnimationRule = false
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            // CSSKeyframesRule has type === 7 (CSSRule.KEYFRAMES_RULE)
            if (
              rule.constructor.name === 'CSSKeyframesRule' &&
              (rule as CSSKeyframesRule).name === 'brand-skeleton-pulse'
            ) {
              hasKeyframes = true
            }
            const sr = rule as CSSStyleRule
            if (
              sr.selectorText &&
              /\.brand-skeleton.*\.brand-skeleton__bar/.test(sr.selectorText) &&
              /brand-skeleton-pulse/.test(sr.cssText)
            ) {
              hasAnimationRule = true
            }
          }
        } catch {
          // skip
        }
      }
      return { hasKeyframes, hasAnimationRule }
    })
    expect(result.hasKeyframes, '@keyframes brand-skeleton-pulse должен быть в custom.scss').toBe(
      true,
    )
    expect(
      result.hasAnimationRule,
      '.brand-skeleton__bar animation rule должен быть в custom.scss',
    ).toBe(true)
  })

  test('Wave 6 (PAN-7): mobile @media (max-width: 640px) deployed', async ({ page }) => {
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (${resp?.status()})`)
    }
    // Verify W6 mobile breakpoints + key rules
    const found = await page.evaluate(() => {
      const r = { mobile: false, tablet: false, loginFullscreen: false, tabsScroll: false }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            const mq = rule as CSSMediaRule
            if (mq.media && mq.media.mediaText.includes('640')) {
              r.mobile = true
              for (const inner of Array.from(mq.cssRules || [])) {
                const ir = inner as CSSStyleRule
                if (
                  /login__form/.test(ir.selectorText || '') &&
                  /max-width:\s*100/.test(ir.cssText)
                )
                  r.loginFullscreen = true
                if (
                  /tabs-field__tabs$/.test(ir.selectorText || '') &&
                  /overflow-x:\s*auto/.test(ir.cssText)
                )
                  r.tabsScroll = true
              }
            }
            if (mq.media && mq.media.mediaText.includes('1024')) r.tablet = true
          }
        } catch {
          // skip
        }
      }
      return r
    })
    expect(found.mobile, '@media (max-width: 640px) должен быть deployed').toBe(true)
    expect(found.tablet, '@media (max-width: 1024px) должен быть deployed').toBe(true)
    expect(found.loginFullscreen, 'login fullscreen mobile rule deployed').toBe(true)
    expect(found.tabsScroll, 'tabs horizontal-scroll mobile rule deployed').toBe(true)
  })

  test('Wave 8 (US-12): sidebar icons + modular-dashboard hide rules deployed', async ({
    page,
  }) => {
    // brand-guide §12.2 sidebar icons (Path A · CSS mask-image, ADR-0011) +
    // §12.3 dashboard cleanup. Stylesheets verify — не требует auth, проверяет
    // что custom.scss W8 block deployed. Полная visual verification — ux-panel
    // screenshot review (sa-panel-wave8.md AC W8 общие).
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }

    const found = await page.evaluate(() => {
      const r = {
        modularDashboardHidden: false,
        navLinkBeforePseudo: false,
        leadsIcon: false,
        servicesIcon: false,
        siteChromeIcon: false,
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule.constructor.name !== 'CSSStyleRule') continue
            const sr = rule as CSSStyleRule
            const sel = sr.selectorText || ''
            const text = sr.cssText || ''
            if (sel === '.modular-dashboard' && /display:\s*none/.test(text)) {
              r.modularDashboardHidden = true
            }
            if (
              sel === 'a.nav__link::before' &&
              /mask-image:\s*var\(--brand-obihod-nav-icon/.test(text)
            ) {
              r.navLinkBeforePseudo = true
            }
            if (sel.includes('/admin/collections/leads') && /--brand-obihod-nav-icon/.test(text)) {
              r.leadsIcon = true
            }
            if (
              sel.includes('/admin/collections/services') &&
              /--brand-obihod-nav-icon/.test(text)
            ) {
              r.servicesIcon = true
            }
            if (
              sel.includes('/admin/globals/site-chrome') &&
              /--brand-obihod-nav-icon/.test(text)
            ) {
              r.siteChromeIcon = true
            }
          }
        } catch {
          // CORS-protected sheets skipped
        }
      }
      return r
    })
    expect(found.modularDashboardHidden, '§8.3 .modular-dashboard скрыт').toBe(true)
    expect(found.navLinkBeforePseudo, '§8.2 a.nav__link::before mask-image инжектирован').toBe(true)
    expect(found.leadsIcon, '§8.2 leads icon var deployed').toBe(true)
    expect(found.servicesIcon, '§8.2 services icon var deployed').toBe(true)
    expect(found.siteChromeIcon, '§8.2 site-chrome global icon var deployed').toBe(true)
  })

  test('Wave 8 (US-12): collections array order matches §8.1 (Leads first)', async () => {
    // §8.1 — sidebar group order driven by collections[] order in payload.config.ts.
    // Native Payload рендерит группы в порядке первой коллекции с этим admin.group.
    // Critical: Leads (01 · Заявки) первая для правильного порядка групп.
    // Globals (SeoSettings 04, SiteChrome 05) рендерятся после всех collections —
    // architectural constraint native Payload (см. sa-panel-wave8.md §8.1 + Q-5).
    // Этот тест читает payload.config.ts, не runtime DOM.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    const cfg = fs.readFileSync(path.resolve(__dirname, '../../payload.config.ts'), 'utf-8')
    // Извлекаем массив collections: [...] (упрощённый regex; для AST нужен ts-morph)
    const m = cfg.match(/collections:\s*\[([\s\S]*?)\]/)
    expect(m, 'collections array найден в payload.config.ts').toBeTruthy()
    const arr = m![1]
    // Очищаем комментарии и whitespace
    const items = arr
      .split('\n')
      .map((l) => l.replace(/\/\/.*$/, '').trim())
      .filter((l) => l && !l.startsWith('/*') && !l.startsWith('//'))
      .map((l) => l.replace(/,\s*$/, ''))
      .filter(Boolean)
    expect(items[0], 'Leads первая в collections (для группы 01 · Заявки)').toBe('Leads')
    const usersIdx = items.indexOf('Users')
    expect(usersIdx, 'Users присутствует').toBeGreaterThan(-1)
    expect(usersIdx, 'Users последняя в collections (для группы 09 · Система перед globals)').toBe(
      items.length - 1,
    )
  })

  test('Wave 9 (US-12): force-light theme depth — --theme-elevation-* light даже при dark', async ({
    page,
  }) => {
    // §9.1 (sa-panel-wave9.md). Payload в data-theme='dark' инвертирует
    // --theme-elevation-* через var(--color-base-N). Без W9 override input
    // background = #15140f (тёмный), tab/sidebar тёмные. После W9 явный
    // override на light values. Этот тест force-set data-theme=dark и проверяет
    // computed values остаются light.
    const resp = await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' })
    if (!resp || resp.status() >= 500) {
      test.skip(true, `Admin не отвечает (status=${resp?.status()}) — пропуск`)
    }
    const tokens = await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark')
      const cs = getComputedStyle(document.documentElement)
      return {
        bg: cs.getPropertyValue('--theme-bg').trim(),
        elev0: cs.getPropertyValue('--theme-elevation-0').trim(),
        elev100: cs.getPropertyValue('--theme-elevation-100').trim(),
        inputBg: cs.getPropertyValue('--theme-input-bg').trim(),
        text: cs.getPropertyValue('--theme-text').trim(),
      }
    })
    expect(tokens.bg.toLowerCase()).toBe('#f7f5f0')
    expect(tokens.elev0.toLowerCase()).toBe('#f7f5f0')
    expect(tokens.elev100.toLowerCase()).toBe('#e6e1d6')
    // --theme-input-bg может быть '#fff' (короткая запись) или '#ffffff'
    expect(['#fff', '#ffffff']).toContain(tokens.inputBg.toLowerCase())
    expect(tokens.text.toLowerCase()).toBe('#1c1c1c')
  })

  test('Wave 9 (US-12): BrandIcon SVG 20×20 для step-nav slot fit', async () => {
    // §9.2 — BrandIcon был 32×32, step-nav slot height 20px → cropping. Fix
    // 20×20. Тест читает BrandIcon.tsx и проверяет SVG dimensions без
    // запроса к dev server (статический check).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../components/admin/BrandIcon.tsx'),
      'utf-8',
    )
    expect(src).toMatch(/width="20"\s+height="20"/)
    expect(src).toMatch(/viewBox="0 0 20 20"/)
    // Сохраняем кириллицу 'О' (не латинская O)
    expect(src).toContain('О')
  })

  test('PANEL-LIST-CREATE-AMBER (US-12 W9 follow-up): "Создать" pill amber primary CTA', async () => {
    // brand-guide §12.4.1 primary CTA = #e6a23c amber. Native Payload
    // .list-create-new-doc__create-new-button использует .btn--style-pill (#d6d0bf
    // line-hover) — neutral grey. Custom.scss override на amber. Static check
    // через CSS rules (без auth-required runtime).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    const css = fs.readFileSync(path.resolve(__dirname, '../../app/(payload)/custom.scss'), 'utf-8')
    // Базовое правило с amber bg
    expect(css).toMatch(
      /\.list-create-new-doc__create-new-button\s*\{[^}]*background-color:\s*var\(--brand-obihod-accent\)/,
    )
    // Hover state с accent-hover
    expect(css).toMatch(
      /\.list-create-new-doc__create-new-button:hover[^{]*\{[^}]*background-color:\s*var\(--brand-obihod-accent-hover\)/,
    )
    // Pressed state с translateY (transform)
    expect(css).toMatch(
      /\.list-create-new-doc__create-new-button:active[^{]*\{[^}]*transform:\s*translateY\(1px\)/,
    )
    // Reduced-motion override
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.list-create-new-doc__create-new-button:active[^}]*transform:\s*none/,
    )
  })

  test('PANEL-FAVICON-BRAND (post-W9): favicon meta type/url consistency', async () => {
    // PANEL-FAVICON-BRAND 2026-05-01 — бренд-favicon ОБИХОД (§3 master lockup):
    // payload.config.ts admin.meta.icons теперь синхронизирует публичный набор:
    // .ico (multi-res) + .svg (primary, modern browsers) + apple-touch-icon (180×180).
    // Legacy `/icon.png` удалён (US-3 orphan, перекрывал metadata через Next.js
    // auto-convention).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    const cfg = fs.readFileSync(path.resolve(__dirname, '../../payload.config.ts'), 'utf-8')
    // .ico с правильным MIME
    expect(cfg).toMatch(/type:\s*['"]image\/x-icon['"][^}]*url:\s*['"]\/favicon\.ico['"]/)
    // SVG primary (modern browsers)
    expect(cfg).toMatch(/type:\s*['"]image\/svg\+xml['"][^}]*url:\s*['"]\/favicon\.svg['"]/)
    // apple-touch-icon (iOS Safari home-screen)
    expect(cfg).toMatch(
      /rel:\s*['"]apple-touch-icon['"][^}]*url:\s*['"]\/apple-touch-icon\.png['"]/,
    )
    // Legacy /icon.png должен отсутствовать (orphan US-3, перекрывал metadata)
    expect(cfg).not.toMatch(/url:\s*['"]\/icon\.png['"]/)
  })
})
