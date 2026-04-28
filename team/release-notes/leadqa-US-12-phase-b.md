# leadqa verify — US-12 Admin Redesign Phase B

**Связанный RC:** [US-12-admin-redesign-phase-b.md](US-12-admin-redesign-phase-b.md)
**Дата verify:** 2026-04-28
**Verifier:** leadqa
**Branch:** `fix/admin-stat-cards-12-3` (HEAD `4eae8b6`)

## Verdict

**Conditional approve** — pre-deploy CI verification ✅, post-deploy practical smoke **pending operator**.

Решение **conditional**: локально не могу прогнать full e2e (Postgres недоступен — Docker daemon off на машине разработки). Все доступные статичные verifications passed. Production smoke передаётся оператору как checklist post-deploy.

## Pre-deploy verification (всё, что могу проверить локально)

| Check | Method | Result |
|---|---|---|
| TypeScript compilation | `pnpm run type-check` (`tsc --noEmit`) | ✅ зелёный |
| ESLint static analysis | `pnpm run lint` | ✅ 0 errors (82 baseline warnings, не из этого RC) |
| Prettier code style | `pnpm run format:check` | ✅ all files clean |
| Production build | `pnpm run build` | ✅ компилируется (только prerender SSG падает на Postgres unavailable — не code issue) |
| Migration syntax | Manual review `20260428_140000_users_telegram_chat_id.up.sql` | ✅ `IF NOT EXISTS` idempotent, no `DEFAULT` clause → no table rewrite, safe для live data |
| Migration rollback safety | Manual review `.down.sql` | ✅ `DROP COLUMN IF EXISTS` — operator потеряет chat_id values, но schema reversible |
| ADR-0005 compliance | Code review (3-agent cr-panel) | ✅ critical findings fixed (S1 timing-safe, S3 CSV-injection, S4 role-bypass, S2 PII-leak, E1/E2 Promise.all, E4 payloadClient) |
| Inline-style consistency vs Wave 1 SCSS | Manual diff review | ⚠️ AdminLogin / PageCatalogWidget / error.tsx используют inline `CSSProperties` literals с `var(--brand-obihod-*)`. SCSS classes (Wave 1) частично перекрываются — но не блокирует, **отложено в refactor commit**. |
| WCAG 2.2 AA structure | Static review (aria-* attrs, role, semantic HTML) | ✅ aria-label, aria-invalid, aria-describedby, role="alert", aria-live="polite", aria-busy, semantic `<form>`/`<section>`/`<ul>` |
| Security: token entropy | N/A для этого RC (Wave 2.B PAN-11 с magic-link токенами — отдельный RC) | n/a |
| Security: webhook secret | timing-safe via `crypto.timingSafeEqual` | ✅ verified в коде |
| Security: CSV formula injection | OWASP guard `^[=+\-@\t\r]/` prefix `'` | ✅ verified |
| Security: role-based access | `!role || !includes(['admin', 'manager'])` | ✅ verified |
| Performance: Promise.all parallelization | PageCatalogWidget + CSV endpoint | ✅ verified |

## Post-deploy verification (оператор делает после deploy)

Этот checklist выполняет **оператор** через браузер/curl после `do` deploy на staging или prod.

### Critical paths (блокеры для approve)

- [ ] `/admin/login` рендерится без 500 error
- [ ] Brand lockup виден над формой (BeforeLoginLockup из Wave 1)
- [ ] Email + Password fields с правильными labels на русском
- [ ] Кнопка «Войти» янтарная (`#e6a23c`)
- [ ] Link «Забыли пароль? →» работает (переход на native `/admin/forgot`)
- [ ] **Login flow:** ввод существующих creds → redirect на `/admin`, session active (можно открыть `/admin/collections/services` без 401)
- [ ] **Login error:** неправильный пароль → inline error «Неверный email или пароль.», `aria-live` polite, поля enabled после error

### Dashboard widget (Wave 3 part 1)

- [ ] `/admin` dashboard рендерится (после login)
- [ ] Виджет «Свежие изменения» виден (после `BeforeDashboardStartHere`)
- [ ] Виджет содержит **top-6 last updated** документов из 7 коллекций (Services / SubServices / SD / Cases / Blog / B2B / Authors / Districts)
- [ ] Counter «N из M стр.» показывает корректные числа
- [ ] Click на title документа → открывает edit view
- [ ] Footer link «Открыть полный каталог →» виден (404 expected — Wave 3 part 2 ещё не реализован, link для будущего)

### CSV export (Wave 3 part 1)

- [ ] **Authenticated:** `curl -b cookies.txt 'https://obikhod.ru/api/admin/page-catalog/csv' -o catalog.csv` → 200 + Excel-открываемый CSV
- [ ] CSV: UTF-8 BOM присутствует (открывается в Excel без mojibake)
- [ ] CSV: header `"Раздел","Title","URL","Обновлено","Статус","Edit"`
- [ ] **Unauthenticated:** `curl 'https://obikhod.ru/api/admin/page-catalog/csv'` → 401 JSON
- [ ] Filename `page-catalog-2026-MM-DD.csv` корректный
- [ ] CSV-injection test: создать Service с title `=HYPERLINK("evil.com","x")` → в CSV он **префиксован** `'=HYPERLINK(...)` (не интерпретируется как формула)

### Tabs в коллекциях (Wave 4)

- [ ] `/admin/collections/leads/<id>` edit view → tabs Контакт / Запрос / Источник / Статус
- [ ] Existing leads открываются без data loss (поля сохраняются на правильных tabs)
- [ ] `/admin/collections/media/<id>` → tabs Основные / Метаданные
- [ ] Click на tab → content swap, focus-visible работает (Tab → Arrow keys)
- [ ] Save в edit view сохраняет все fields со всех tabs
- [ ] Existing 8 collections (Services, Cases, Blog, B2B, Authors, Districts, ServiceDistricts, SiteChrome) — **не сломались** (regression)

### Error boundaries (Wave 5 partial)

- [ ] **404:** `/admin/non-existent-page` → custom not-found.tsx с brand lockup, CTA «Назад в админку»
- [ ] **403:** trigger через user без admin role (если есть) → forbidden.tsx
- [ ] **500:** trigger через mock middleware error (если возможно) → error.tsx с retry button + dev-only error.message (если NODE_ENV=development)
- [ ] retry button работает (вызывает `reset()` → перезагрузка страницы)
- [ ] Sentry capture: если `window.Sentry` подключён — exception captured (если нет — no-op)

### Telegram bot (PAN-9)

- [ ] **`curl setWebhook`** выполнен оператором (см. инструкцию `team/specs/US-12-admin-redesign/pre-tasks/podev-telegram-bot-setup.md` step 3)
- [ ] **`/start` боту в Telegram** → получаешь greeting «Готов получать magic-link...»
- [ ] **`Users.telegramChatId`** в `/admin/collections/users/<your-id>` заполнен chat_id
- [ ] Webhook secret верифицируется (timing-safe): попробовать `curl -X POST https://obikhod.ru/api/telegram/webhook -H "X-Telegram-Bot-Api-Secret-Token: wrong"` → 401

### Email SMTP (PAN-10)

- [ ] **Test send:** `node -e "import('./dist/lib/messengers/email.js').then(m => m.sendEmail({to: 'samohingeorgy@gmail.com', subject: 'Test', text: 'Test send post-deploy'}))"` → письмо в Inbox
- [ ] Verify в Gmail → Show Original: SPF=PASS, DKIM=PASS (selector `beget`), DMARC=neutral (Beget support ticket)
- [ ] Не попало в Spam

### A11y / Performance (Lighthouse)

- [ ] `/admin/login`: Lighthouse Performance ≥85, Accessibility ≥95
- [ ] `/admin`: Lighthouse Performance ≥85, Accessibility ≥95
- [ ] keyboard-only flow: Tab navigation работает на всех страницах admin без mouse
- [ ] reduced-motion: macOS «Reduce Motion» включён → нет animations / transitions на кнопках, transforms

### Regression checks (что не сломали)

- [ ] Marketing site `/`, `/services/*`, `/blog/*` — рендерятся как раньше (никаких изменений в этом RC, но проверить smoke на всякий случай)
- [ ] `/api/health` → 200
- [ ] `/api/users/login` (Payload native) → 200 при правильных creds (мы только UI override-нули, auth core не трогали)
- [ ] Existing Playwright e2e (`pnpm exec playwright test --project=chromium`) — green после Postgres up

## Risks identified в verify

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| `/admin/forgot` link не работает | Low | Low | Native Payload route, должен работать. Verify в smoke. |
| Tabs в Leads — existing data loss | Low | High | Manual edit existing lead post-deploy. Если data loss → revert `43b92c0`. |
| Webhook secret rotation needed | Low | Low | Operator знает как ротировать через `setWebhook` |
| Email DMARC missing → Spam | Medium | Medium | Beget support ticket. Email — fallback, Telegram primary. |
| Wave 3 part 2 link 404 → operator confusion | Low | Nuisance | Note в RC: ожидаемое поведение, link для будущего |
| TypeScript types для new collection MagicLinkTokens (Wave 2.B) — ещё не сгенерены | n/a | n/a | Wave 2.B отдельный RC, не в этом scope |

## Conditional approve criteria

leadqa **рекомендует approve** для deploy при следующих условиях:

1. ✅ All pre-deploy CI checks passed (type-check, lint, format, build) — **done**
2. ✅ cr-panel critical findings fixed — **done**
3. ✅ Migration safety confirmed (idempotent, rollback-safe) — **done**
4. ⚠️ Operator готов выполнить post-deploy smoke checklist (выше) — **operator action required**
5. ⚠️ Operator готов к ≤15 мин rollback window если что-то ломается — **operator action required**

## leadqa подпись

✅ **Conditional approve** для передачи **оператору** на бизнес-approve + `do` deploy.

Не блокирующее, но настоятельно рекомендую:
- Запустить **Docker Postgres локально** (`docker compose up -d` если есть docker-compose.yml) перед push, чтобы прогнать `pnpm exec playwright test --project=chromium` — это закроет 5 e2e tests сейчас skipped.
- Альтернативно: deploy на staging-like сетап (если есть отдельная VPS), там прогнать full smoke, потом → prod.

---

**Передаю → operator approve gate.**
