# ADR-0007 — Payload 3.84 admin Login UI customization mechanism

**Дата:** 2026-04-29
**Статус:** Accepted
**Автор:** tamd
**Контекст US:** [PAN-12](https://linear.app/samohyn/issue/PAN-12) → [PAN-13](https://linear.app/samohyn/issue/PAN-13)
**Skill:** `architecture-decision-records` (skill-check iron rule, см. [tamd.md](../common/tamd.md))
**Supersedes part of:** ADR-0005 §Уровень 2 «AdminLogin custom view через `admin.components.views.Login`» — этот ассумпшен был **incorrect** для Payload 3.84.

---

## Контекст

PAN-5 Wave 2.A (commit `ced6bed`) подключил `views.login: { Component: '@/components/admin/AdminLogin' }` в `payload.config.ts`. На проде (Payload 3.84.1, bumped from 3.83.0 в same RC) это привело к **пустой странице** `/admin/login` — leadqa-RC-1 BLOCK incident 2026-04-28.

**Доказательство** (`node_modules/payload/dist/config/types.d.ts:746-756`):
```typescript
views?: {
  [key: string]: AdminViewConfig;
  account?: AdminViewConfig;        // /admin/account
  dashboard?: AdminViewConfig;      // /admin
};
```

`login` **не в списке** официально-поддерживаемых ключей `views`. Ставя `views.login`, мы создавали custom admin view с path `/admin/login` который конфликтовал с native login route.

После revert (PR #83, commit `bc72397`) native login возвращён, но visual gaps:
- ❌ `htmlTheme: "dark"` (Payload detect prefers-color-scheme)
- ❌ Submit button `bg: rgba(0,0,0,0)` (transparent), не янтарный `#e6a23c`
- ✅ Form `max-width: 320px` (native default — уже OK)
- ✅ Lockup + footer через `beforeLogin`/`afterLogin` slots работают

## Native Login flow (исследование source)

**`@payloadcms/next/dist/views/Login/index.js`** рендерит:
```jsx
<Fragment>
  <div className="login__brand">
    <Logo />  {/* через admin.components.graphics.Logo */}
  </div>
  {RenderServerComponent({ Component: beforeLogin, ... })}  {/* slot */}
  {!disableLocalStrategy && <LoginForm />}                  {/* client */}
  {RenderServerComponent({ Component: afterLogin, ... })}   {/* slot */}
</Fragment>
```

**`LoginForm`** (client) — `form.login__form` с `<LoginField>` + `<PasswordField>` + `<FormSubmit>` (`<button class="form-submit">`).

**Template wrapper** — `<section class="login template-minimal template-minimal--width-normal">` от `@payloadcms/next/dist/templates/Minimal/`.

## Альтернативы (research)

| # | Подход | Risk | Maintenance | Что override |
|---|---|---|---|---|
| **A** | Next.js intercepted route `app/(payload)/admin/login/page.tsx` | средний-высокий | требует re-implement auth check + RenderServerComponent slots logic | полный layout |
| **B** | `admin.components.providers` wrapper + conditional CSS | средний | hacky, fragility под Payload bumps | через provider |
| **C** | `beforeLogin` slot + CSS hide native form | высокий | визуальные хаки, race с client hydration | partially |
| **D** | Fork `template-minimal` view | высокий | maintenance burden, обновления Payload | всё |
| **E** ✅ | **CSS-only через `custom.scss` + native slots** (`graphics.Logo`, `beforeLogin`, `afterLogin`) | **низкий** | минимальный, native API | визуал |

## Решение

**Принимаем Подход E** — CSS-only customization через `custom.scss` + использование public Payload API slots. **НЕ override** view-level через `admin.components.views.*`.

### Что реализуем

1. **Force light theme через CSS override** (Payload `admin.theme` config option **не существует** в 3.84 admin types — verified). В `site/app/(payload)/custom.scss` обновить `html[data-theme='dark']` блок:
   ```scss
   /* override dark to always render light brand vars on /admin/login* (operator preference) */
   html[data-theme='dark'] {
     --brand-obihod-paper: #f7f5f0;
     --brand-obihod-paper-warm: #efebe0;
     /* ...все light values */
   }
   ```
   Альтернатива: **scoped только на login screen** — `html[data-theme='dark'] body:has(.template-minimal--width-normal) { ... }`.

2. **Янтарная submit button** через native classes:
   ```scss
   .payload__app .login__form button[type="submit"],
   .payload__app .login__form .form-submit {
     background-color: var(--brand-obihod-accent);    /* #e6a23c */
     border-color: var(--brand-obihod-accent);
     color: var(--brand-obihod-ink);                  /* #1c1c1c */
   }
   .payload__app .login__form button[type="submit"]:hover {
     background-color: var(--brand-obihod-accent-hover);  /* #d99528 */
   }
   ```
   **Wave 1 SCSS целился `.btn--style-primary`** — это для другого button типа (icon buttons in dashboard). Native login submit имеет class **только `form-submit`**, не `.btn--style-primary`. Это и было причиной transparent submit на проде.

3. **Login carд background + padding + radius** через target на native form:
   ```scss
   .payload__app .login__form {
     background-color: var(--brand-obihod-card);
     padding: 32px;
     border-radius: var(--brand-obihod-radius);
     border: 1px solid var(--brand-obihod-line);
   }
   ```

4. **Form max-width** — native уже 320px ✓ (no action).

5. **Brand lockup + admin tagline** — `BeforeLoginLockup.tsx` через `beforeLogin` slot ✓ (уже работает).

6. **«Забыли пароль?» link** — native через `<LoginForm>` рендерит `<Link to="/admin/forgot">` ✓ (уже работает).

7. **`AfterLoginFooter`** через `afterLogin` slot ✓ (уже работает).

### Что НЕ делаем (отвергнуто)

- ❌ Custom `<AdminLogin>` view через `views.login` — несуществующий API
- ❌ Replace `<LoginForm>` через intercepted route — high risk, low value
- ❌ Hide native form через CSS + draw custom — fragile, race с hydration
- ❌ Magic link login UI override (Wave 2.B PAN-11) — это будет через **`admin.components.providers`** wrapper или backend-only flow с redirect, не через UI override. Отдельная research US.

### Component `AdminLogin.tsx`

Удалить или оставить как dead-code? **Оставить** в `site/components/admin/AdminLogin.tsx` для возможного использования в Wave 2.B (custom magic-link UI через intercepted route после Telegram bot setup). Не подключать в `payload.config.ts`.

## Альтернативы — почему отвергнуты

### A. Next.js intercepted route
Plus: полный контроль над DOM. Minus: re-implement auth check + redirect logic + RenderServerComponent для slots = ~200+ строк boilerplate. Payload может break flow. Не оправдывает выгоду visual styling.

### B. Providers wrapper
`admin.components.providers` для context, не для UI override. Visual injection через DOM в provider — anti-pattern. **Не recommended Payload.**

### C. CSS hide + custom через beforeLogin
Race condition: client hydration может flicker native form до того как наш custom рендерится. Visual jank. CSS `:has(:empty)` не reliable.

### D. Fork template-minimal
Maximum control, но и maximum maintenance. На каждый minor Payload bump — diff template + merge. Не оправдано scope (login screen визуал, не функциональность).

## Последствия

### Плюсы

1. **Минимальные изменения** — только `custom.scss` + добавить `html[data-theme='dark']` override + selector fixes для submit button + form carд background.
2. **No new components** — компоненты `BeforeLoginLockup` / `AfterLoginFooter` / `BrandLogo` уже работают через native API slots.
3. **Stable across Payload bumps** — `login__form`, `form-submit` — селекторы native Payload, стабильны (3.83 → 3.84.1 не сломали).
4. **Easy rollback** — revert `custom.scss` block через `git revert` (≤5 мин).
5. **No JS hydration risk** — pure CSS override.

### Минусы

1. **Limited to visual changes.** Не можем менять form FSM (loading state text, error messages variants). Native Payload state используется.
2. **Magic link UI (Wave 2.B PAN-11)** требует другого механизма — этот ADR не покрывает.
3. **Dark theme detection** — мы переопределяем dark на light. Если оператор хочет dark — придётся отдельный toggle. Но по brand-guide §12.1 admin = cream/light, dark не в scope.
4. **`!important` may be needed** — Payload's own CSS specificity иногда побеждает. Add reason-comments при использовании.

### Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Payload patch меняет `.login__form` или `.form-submit` class names | низкая (3.83→3.84 не сломали) | средний (визуал съезжает) | `:where()` обёртка для нестабильных классов + CI Playwright admin smoke (PAN-16) |
| User wants dark mode admin | низкая (один оператор, brand-guide §12 = light) | низкий | Add `<button>` toggle если запросит — отдельная US |
| Mobile responsive | средняя (Wave 6 Mobile открыт) | средний | Form carд max-width 320px на small screens — Payload native handles |

### Follow-ups

- [ ] **PAN-14 sa-panel-wave2a-v2.md** должен ссылаться на этот ADR
- [ ] **PAN-15 fe-panel** реализует `custom.scss` updates с **local Docker verification** (Iron rule PO 2026-04-29)
- [ ] **PAN-16 qa-panel** Playwright admin login spec проверяет computed styles на правильных классах (`form-submit` bg = `#e6a23c`)
- [ ] **ADR-0005 update** — отметить что §Уровень 2 ассумпшен `views.login` был incorrect, deprecated
- [ ] При запуске Wave 2.B (magic link UI) — отдельный ADR для intercepted route mechanism (если потребуется UI changes за пределами CSS)

---

## Открытые вопросы

- [ ] **Force light для всего admin или только login screen?** Recommendation: **только login** (через `body:has(.login)` или `:has(.template-minimal)`). Dashboard и list views могут оставаться с user OS preference. Final decision — для popanel.
- [ ] **`!important` policy в `custom.scss`** — текущий код уже использует на autofill / submit. Recommendation: разрешить в `login__form` блоке с `// reason: Payload's specificity` комментарием. Cr-panel review iron rule.
- [ ] **i18n для error messages** — Payload native использует `@payloadcms/translations` ru locale. Заменить «Войти» / «Email» / «Пароль» через CSS `content` attribute? **Anti-pattern.** Использовать native ru.

## Verification (local)

После реализации (PAN-15):

```bash
# Local
pnpm db:up && pnpm dev
open http://localhost:3000/admin/login

# Browser DevTools verify:
getComputedStyle(document.querySelector('.login__form button[type="submit"]')).backgroundColor
# expected: rgb(230, 162, 60)  // #e6a23c

getComputedStyle(document.querySelector('.login__form')).backgroundColor
# expected: rgb(255, 255, 255)  // #ffffff (--brand-obihod-card)

getComputedStyle(document.documentElement).getPropertyValue('--brand-obihod-paper').trim()
# expected: #f7f5f0  (light, не dark #15140f)
```

Playwright spec в PAN-16 это автоматизирует.

---

**Передаю → `sa-panel` (PAN-14)** — переписать `sa-panel-wave2a.md` → `sa-panel-wave2a-v2.md` под Подход E.
