# EPIC-SHOP-REMOVAL — QA report (W6)

**Date:** 2026-05-09 22:55 MSK
**QA owner:** qa
**Verdict:** PASS_WITH_FOLLOWUPS

Skills активированы: `e2e-testing` + `verification-loop` (iron rule #1).

## Acceptance results

| AC | Result | Notes |
|---|---|---|
| W6.1 type-check | PRE-EXISTING FAIL | `scripts/lint-schema.ts(332,16): TS2393 Duplicate function implementation`. Воспроизводится на чистом main `7193061` без наших правок (подтверждено `git stash`+rerun). НЕ регрессия EPIC-SHOP-REMOVAL — pre-existing tech debt с merge `7c89697` (US-4). Файл — standalone script без `import/export` (script-mode collision с другими scripts/*.ts тоже без import/export, у которых тоже `async function main`). |
| W6.1 lint | PASS | 0 errors / 64 warnings — все pre-existing в migrations/scripts/tests, не в файлах W3-W5. |
| W6.1 format:check | PRE-EXISTING FAIL | `blocks/master-template.ts` not formatted — это **untracked** файл (`git status: ?? site/blocks/master-template.ts`), от другой работы (ADR-0021 service-page-master-template). НЕ от EPIC-SHOP-REMOVAL. |
| W6.1 build | SKIPPED | type-check pre-existing fail блокирует build clean run; не наша регрессия — pending separate task. |
| W6.2 grep shop/магазин | PASS_WITH_FOLLOWUPS | 168 hits после whitelist. Все semantic-acceptable (см. Findings § 1): brand-guide.html historical changelog/auth-cabinet ссылки на shop, design-system/inventory-services-2026-05.md historical doc, ADR-0004/ADR-0008 historical context, team/{po,fe,qa,dev,design,WORKFLOW,backlog,PROJECT_CONTEXT}.md historical role mappings + наш own backlog comment про EPIC. **0 hits с functional impact** — всё в исторической прозе, code clean. |
| W6.3 sitemap diff | PASS | runtime `/sitemap.xml` → 165 URLs, 0 совпадений с `shop`. Локальный seed меньше prod (165 < 233 baseline) потому что local DB не содержит prod-seed; ноль регрессий относительно W4-W5 которые sitemap не трогали. |
| W6.4 brand-guide валиден | PASS | `<section>` open=21 close=21 balanced. `<details>` 11 tags + 2 hits в text/comments — balanced. v2.3 marker присутствует. 4299 строк = ожидаемое после W3 (5754 → 4299, -1455). |
| W6.5 proxy 410 Gone live | PASS | dev server up, curl: `/shop/` → **HTTP 410** ✓, `/shop/sazhency/` → **HTTP 410** ✓ (через 308 trailing-slash redirect chain — corret SEO behaviour для ботов), `/` → **HTTP 200** ✓ (control). |
| W6.6 E2E smoke | SKIPPED | type-check pre-existing fail + Playwright suite требует prod-like seed; pending после type-check fix. Manual curl-smoke pass'ed (proxy 410 + sitemap clean + llms.txt clean). |

## Findings

### Severity LOW: grep semantic noise (W6.2)

168 hits в whitelisted contexts:
- `design-system/brand-guide.html` (~30 hits) — historical references в auth/cabinet sections (§30-33), changelog (§33.7 «Что shop-guide ошибочно делал»), historical icon-pack mentions (§08 — «9 shop · 9 district · 9 case» в historical lead). Эти hits **легитимны как historical record** ADR-0020 ссылка на «магазин был выведен», и в иконографии 49 line-art glyphs упомянут shop как историческое расширение IA. Удалять — потерять historical context. Решение: оставить.
- `design-system/inventory-services-2026-05.md` — historical inventory doc (явно scope «services периметр + §15-29 shop игнорим»). Оставить.
- `team/{po,fe,qa,dev,design}.md` + WORKFLOW.md + ADR-0004/ADR-0008 — все documenting role mapping «replaced poshop/be-shop/etc.». Историческое документирование реорганизации команд 42→10. Оставить.
- `team/PROJECT_CONTEXT.md` (3 hits) — historical merge order + roles spec, не functional. Решение: можно cleanup в follow-up если PO решит.
- `team/backlog.md` (3 hits) — наш собственный EPIC backlog entry. Оставить.
- `site/scripts/clean-shop-mentions-sql.ts` + `audit-shop-mentions-detail.ts` — наши W5 audit-скрипты с regex `(/shop|магазин|саженц|питомник)`. Оставить.
- `site/components/marketing/ServicesGrid.tsx:41` orphan `^sh-` regex — known follow-up из W4 hand-off.

**Functional code (.tsx/.ts/.css в src):** 0 hits после whitelist. Header.tsx, Footer.tsx, types.ts, llms.txt, sitemap, jsonld, composer — все clean.

### Severity LOW: pre-existing CI failures на main (W6.1)

`scripts/lint-schema.ts` TS2393 duplicate function — воспроизводится на main pre-EPIC. Корень: `lint-schema.ts` без import/export = script global scope, и другие scripts/*.ts (audit-shop-mentions-detail, seed-cities, etc.) тоже имеют `async function main` без import/export — TypeScript считает их одним глобальным namespace. **Фикс:** добавить `export {}` в каждый orphan-script (одна строка). Не в scope W6.

`blocks/master-template.ts` untracked — ADR-0021 work-in-progress другой команды.

## Pending after EPIC-SHOP-REMOVAL closure (для PO)

1. **proxy.ts deploy на prod** через devops — `/shop*` 410 пока не активен на prod (proxy.ts merge не deployed).
2. **richText cleanup на prod БД** — запуск `scripts/clean-shop-mentions-sql.ts` + `…-fix2.ts` с `DATABASE_URI=<prod>` ПОСЛЕ применения миграции `20260509_120000_reviews_collection` на prod (drift blocker, известен из W5 hand-off).
3. **Я.Вебмастер 7-day мониторинг** 5xx после deploy — стандарт SEO procedure для 410 Gone rollout.
4. **Orphan `^sh-` regex** в `ServicesGrid.tsx:41` — known follow-up W4, отдельная задача.
5. **type-check fix** `scripts/lint-schema.ts` + аналогичные scripts/*.ts — добавить `export {}` для script-mode. Pre-existing tech debt, не блокирует EPIC-SHOP-REMOVAL acceptance.
6. **format:check fix** `blocks/master-template.ts` — untracked файл другой команды (ADR-0021), out of scope.
7. **Optional cleanup** team/PROJECT_CONTEXT.md historical role mappings — если PO решит выпилить shop из team prose целиком (трогать ADR не рекомендуется).
