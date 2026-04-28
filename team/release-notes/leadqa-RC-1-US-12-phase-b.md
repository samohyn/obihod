# RC-1 — Lead QA Report — US-12 Phase B

**Команда:** panel
**Дата:** 2026-04-28
**Время verify:** 15:35 UTC (после deploy retry success в 14:54)
**Вердикт:** ❌ **BLOCK**
**RC artifact:** [team/release-notes/US-12-admin-redesign-phase-b.md](US-12-admin-redesign-phase-b.md)
**Окружение:** браузер Playwright Chromium (1280×900 desktop) на проде https://obikhod.ru
**Skill активирован:** `browser-qa` + `verification-loop` (по iron rule в `team/common/leadqa.md` §⚙️)

---

## TL;DR

**`/admin/login` и `/admin` отдают пустую страницу** на проде. Кастомный `AdminLogin` view (Wave 2.A, PAN-5) не рендерится. Payload отдаёт `<section class="login template-minimal"><div class="template-minimal__wrap"></div></section>` — **wrapper без content**. 0 forms, 0 inputs, 0 buttons, 0 headings.

Pre-deploy `do` smoke (`curl /api/health 200`) был ложно-зелёным — health endpoint жив, но UI admin отдаёт пустоту. Я (`leadqa`) не делал реальный smoke до push — это мой пробел в pipeline, который теперь закрываю отчётом.

**Recommendation operator:** **Rollback** `views.login` config в `payload.config.ts` (revert PR #80 commit `ced6bed` или selective revert только секции `views`). Time-to-fix forward unknown (нужен Payload 3.84 docs check на правильный config format). Production critical path `/admin/login` сейчас broken для оператора.

---

## 1. Соответствие `ba.md` / Решения оператора

| GOAL | Статус | Комментарий |
|---|---|---|
| Login по brand-guide §12.1 (lockup + carд + янтарная кнопка) | ❌ BLOCK | Custom view не рендерится. Native Payload login тоже не показывается (template-minimal wrapper пустой). |
| Dashboard widget «Свежие изменения» top-6 (PAN-6 part 1) | ❌ Untestable | Без login невозможно дойти до dashboard. |
| Tabs в Leads / Media (Wave 4) | ❌ Untestable | Нужен auth. |
| Boundary error/forbidden/not-found (Wave 5) | ❌ Untestable | |

## 2. Соответствие `sa-panel-wave2a.md` AC

| AC | Статус | Доказательство |
|---|---|---|
| `site/components/admin/AdminLogin.tsx` создан | ✅ | Commit `ced6bed`, push'ed |
| Подключен в `payload.config.ts` `admin.components.views.login.Component` | ⚠️ Конфигом подключен, но **runtime не рендерит** | Format `views.login: { Component: '...' }` может быть incorrect для Payload 3.84 |
| Email + Password + «Войти» работают через native Payload | ❌ **БЛОК** | Form вообще не отрисована |
| «Забыли пароль?» link → `/admin/forgot` | ❌ | Link отсутствует |
| Error states FSM | ❌ Untestable | |
| WCAG 2.2 AA aria-* | ❌ Untestable (DOM пустой) | |

## 3. Соответствие дизайну

**Mockup (mock-up из brand-guide §12.1):** `screen/admin-login-mockup.png` (был сделан 2026-04-28 14:30 на основании brand-guide.html §12.1)

**Prod (15:35 UTC):** `screen/leadqa-RC-1-admin-prod.png` — **полностью пустая страница** (cream `#f7f5f0` paper background, ничего поверх).

**Diff:**
- ✅ Brand `--brand-obihod-paper` цвет фона рендерится (cream)
- ✅ Body font `Golos Text` загрузился
- ✅ `<title>` корректный «Войти — Обиход admin»
- ❌ Lockup: отсутствует (BeforeLoginLockup.tsx не подключился)
- ❌ Login carд (320px form): отсутствует
- ❌ AfterLoginFooter: отсутствует
- ❌ Янтарная кнопка: отсутствует
- ❌ «Забыли пароль?»: отсутствует

## 4. NFR

| Категория | Result |
|---|---|
| **Performance** | Не измерял (нет UI для Lighthouse) |
| **A11y** | Не применимо — на странице нет interactive elements для axe-core |
| **SEO** | meta `<title>` ✓, остальное noindex (admin) — OK |
| **Security** | Cookie/session — N/A без login. CSP не проверял. |
| **Observability** | Console errors: **0**. Warnings: **0**. (Это удивительно для broken page — обычно есть hydration error.) |

## 5. Скриншоты в `screen/`

- `screen/leadqa-RC-1-admin-prod.png` — пустая страница (1280×900 cream paper, full body)
- `screen/admin-login-mockup.png` — что должно было быть (brand-guide §12.1 mock из earlier session)
- `screen/admin-dashboard-mockup.png` — целевой dashboard (для сравнения когда починим)

## 6. Регрессии

**`/admin/login`** — критичная регрессия. Native Payload login template отрендерил wrapper, но **content slot пустой**.

DOM evidence:
```html
<section class="login template-minimal template-minimal--width-normal">
  <div class="template-minimal__wrap"></div>  <!-- ← childCount: 0, text: "" -->
</section>
```

**`/admin/`** — same. Payload redirects unauthorized → `/admin/login/`, который пустой.

## 7. Root cause hypothesis

Скорее всего **формат config некорректен для Payload 3.84.1** (был bumped с 3.83.0 в этом RC):

```typescript
// site/payload.config.ts:52-56
views: {
  login: {
    Component: '@/components/admin/AdminLogin',
  },
},
```

Возможные правильные форматы (нужно verify в Payload 3.84 docs):

```typescript
// Вариант A — straight string path:
views: {
  login: '@/components/admin/AdminLogin',
}

// Вариант B — Default key (как для list views):
views: {
  login: { Default: '@/components/admin/AdminLogin' },
}

// Вариант C — без vars:
views: {
  login: {
    Component: { path: '@/components/admin/AdminLogin' },
  },
}
```

**В Payload 3.83 форматы могли отличаться от 3.84.1.** Нужно проверить через `pnpm payload generate:types` или Payload docs/types.

`AdminLogin.tsx` сам по себе валиден (type-check + lint passed pre-deploy + cr-panel approved 3-agent review). Проблема **в config wiring**, не в компоненте.

## 8. Что НЕ затронуто

`/api/health?deep=1` — 200 ✓ (DB ping ok, миграция `users.telegram_chat_id` применена). Backend integrity не нарушена. Это **только UI** проблема.

Public marketing site (`obikhod.ru/`, `/services/*`, `/blog/*`) — **не проверял**, но т.к. изменения в этом RC только в `app/(payload)/` route group + components/admin/ — public site должен быть нетронут. Quick smoke: `curl https://obikhod.ru/` → ожидается 200.

## 9. Follow-ups

### Critical (block-fix)

- [ ] **Rollback или fix-forward `views.login`** — popanel + tamd decision:
  - Revert: удалить `views: { login: ... }` из `payload.config.ts` → native Payload login возвращается
  - Fix-forward: попробовать вариант B (`Default` key) или A (straight string), test локально с Docker Postgres, deploy
- [ ] Проверить Payload 3.84.1 changelog — могло сломаться в bump'e
- [ ] Создать `team/specs/US-12-admin-redesign/sa-panel-wave2a-fix.md` с diagnosed root cause

### Process (preventive)

- [ ] **Iron rule update**: leadqa **обязан** делать реальный browser smoke ДО push, не после. Этот цикл нарушил — отдал conditional approve по docs (тип `feedback_no_reask` ≠ technical evidence).
- [ ] CI Playwright admin smoke (Wave 7 backlog) должен ловить empty `/admin/login` до merge. Сейчас тесты skipped без Postgres locally + не покрывают prod URL.
- [ ] `do` smoke `/api/health 200` **не достаточен** для admin/UI changes. Нужно добавить `curl /admin/login | grep "login__form"` в deploy.yml после PM2 reload.
- [ ] Staging environment (см. `do.md` §8 roadmap) — incident бы пойман.

## 10. Рекомендация оператору

**Verdict: BLOCK.** `/admin/login` нерабочий. Оператор не может войти в админку через прод-форму прямо сейчас.

**Action:** дать `do` или `popanel` зелёный свет на:

1. **Quick rollback (рекомендую):** удалить `views: { login: ... }` блок из `payload.config.ts` (commit `ced6bed`). Time-to-fix: ~10 мин (commit + push + CI + auto-deploy). Native Payload login возвращается. Brand-lockup + footer (через `beforeLogin` / `afterLogin`) останутся (они работают через slot, не через views override).
2. **Fix-forward:** разобраться с правильным config форматом для Payload 3.84.1. Time-to-fix: ~1-2 часа (нужен Docker Postgres локально для verify, либо ещё один deploy cycle).

**Я выбираю rollback** как leadqa — minimize blast radius, login critical path. Refactor + правильный config format → отдельный PR в спокойном режиме.

---

## Appendix: команды воспроизведения

```bash
# Reproduce empty /admin/login DOM:
playwright codegen https://obikhod.ru/admin/login
# или curl + parse:
curl -sL https://obikhod.ru/admin/login | grep -c "login__form"  # → 0 (regression)
curl -sL https://obikhod.ru/admin/login | grep -c "template-minimal__wrap"  # → 1 (wrapper present)
```

## Skill activation log

- `browser-qa` activated 2026-04-28 15:24 UTC — used Playwright MCP for navigate/evaluate/screenshot
- `verification-loop` implicit — 6-частный чеклист leadqa.md §1
- `accessibility` skip — нечего auditировать (empty page)
- `click-path-audit` skip — нет clickable elements
- `e2e-testing` not run — нет Postgres локально (Docker daemon off на машине)

## Sign-off

❌ **leadqa BLOCK** — передаю operator + popanel + do для decision на rollback / fix-forward.
