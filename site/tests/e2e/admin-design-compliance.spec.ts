import { expect, test } from '@playwright/test'

/**
 * OBI-19 Wave 1 — Admin design compliance с design-system/brand-guide.html §12
 * + devteam/specs/US-12-admin-redesign/art-concept-v2.md.
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

    // Payload без users (ephemeral CI postgres) → redirect на /admin/create-first-user.
    // beforeLogin рендерится только на /admin/login. Пропускаем тест если не на login.
    const url = page.url()
    if (!url.includes('/admin/login')) {
      test.skip(
        true,
        `Admin redirected to ${url} (likely create-first-user) — beforeLogin slot не виден`,
      )
    }

    // BeforeLoginLockup рендерит eyebrow «obikhod.ru · admin» + h1 «Порядок под ключ»
    // через admin.components.beforeLogin slot — над native Payload login form.
    await expect(page.getByText('obikhod.ru · admin', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Порядок под ключ' })).toBeVisible()
  })
})
