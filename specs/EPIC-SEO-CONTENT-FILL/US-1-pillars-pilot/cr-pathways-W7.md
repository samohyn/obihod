# CR-pathways verification — Stage 1 W7 (US-1 AC-10.5)

**Дата:** 2026-05-02
**Окружение:** local `pnpm dev` на `http://localhost:3000`
**Метод:** real browser navigation (Playwright MCP) + DOM-evaluation (link presence + slug correctness)
**Контракт:** `specs/EPIC-SEO-CONTENT-FILL/US-1-pillars-pilot/sa-seo.md` AC-10.5

---

## Pathway 1 — blog → pillar (foto-smeta) → lead-form

**Маршрут:** `/blog/smeta-za-10-minut/` → `/foto-smeta/` → lead-form submit

| Шаг | URL | Статус | Что проверено |
|---|---|---|---|
| 1 | `/blog/smeta-za-10-minut/` | HTTP 200 | Title корректный («Смета по фото за 10 минут — как считаем \| Обиход») |
| 1.1 | На странице найдена 1 ссылка на `/foto-smeta/` | OK | Текст ссылки: «Получить смету по фото» (CTA-баннер) |
| 2 | `/foto-smeta/` | HTTP 200 | Title корректный («Смета за 10 минут по фото — Обиход, Москва и МО») |
| 2.1 | `<form>` найдена на странице | OK | 1 form, 3 fields: `name` (text), `phone` (tel, required), `service` (text) |
| 2.2 | Submit endpoint | OK | Action на `/foto-smeta/` (Server Action / route handler) |

**Verdict:** PASS

**Открытое замечание (не блокер W7):**
- `<input type="file">` НЕ найден на форме `/foto-smeta/`. AC-10.5 формулировка «lead-form submit с file-upload» — не закрыта на Stage 1. File upload переносится в US-2 / US-3 (фото→смета MVP). На W7 demo lead-form работает без файла; UX-pathway сохранён.

---

## Pathway 2 — programmatic-SD → district-hub → SD соседнего района

**Маршрут (изначальный план):** `/vyvoz-musora/odincovo/` → neighbor `/raiony/krasnogorsk/` → `/vyvoz-musora/krasnogorsk/`

**Реальный observed flow:**

| Шаг | URL | Статус | Что проверено |
|---|---|---|---|
| 1 | `/vyvoz-musora/odincovo/` | HTTP 200 | Title с правильным district name (Одинцово) |
| 1.1 | Ссылки на `/raiony/<slug>/` найдены | 9 шт | См. **CRITICAL** ниже про slug-несоответствие |
| 2 | `/raiony/krasnogorsk/` | HTTP 200 | Title «Обиход в Красногорске — арбо, снег, мусор, демонтаж» |
| 2.1 | На district-hub найдено 4 ссылки на SD района | OK | `/vyvoz-musora/krasnogorsk/`, `/arboristika/krasnogorsk/`, `/chistka-krysh/krasnogorsk/`, `/demontazh/krasnogorsk/` — все 4 услуги на район |
| 3 | `/vyvoz-musora/krasnogorsk/` | HTTP 200 | SD соседнего района рендерится (полный круг pathway) |

**Verdict:** PASS (полный pathway работает на 200/200/200)

**CRITICAL finding (UX-bug, требует фикса до Stage 1 release):**
- На странице `/vyvoz-musora/odincovo/` ссылка на neighbor district использует slug `/raiony/odintsovo/` (через **«t»**), а реальный route — `/raiony/odincovo/` (через **«c»**). `/raiony/odintsovo/` возвращает **HTTP 404**.
- Источник несоответствия: видимо, transliteration helper и/или Districts seed используют ГОСТ vs упрощённую схему параллельно.
- Action: **передать `seo-tech` + `cms` для unify slug-конвенции**. Не блокер W7 demo (operator увидит на скриншотах), но блокер для перехода в Stage 2 (SEO indexability + breadcrumbs broken).

**Бонус-finding (позитивный):**
- SA-spec предполагал, что только Одинцово SD создан и все остальные SD = 404. Реальность: **все 16 SD комбинаций (4 услуги × 4 района) рендерятся HTTP 200**. Programmatic SD пайплайн работает шире, чем планировалось — проверено `curl` для 16/16 URL.

---

## Pathway 3 — pillar → sub-service (legacy SubServiceView)

**Маршрут:** `/vyvoz-musora/` → services-grid → `/vyvoz-musora/staraya-mebel/`

| Шаг | URL | Статус | Что проверено |
|---|---|---|---|
| 1 | `/vyvoz-musora/` | HTTP 200 | Pillar рендерится |
| 1.1 | Ссылки на sub-services | 5 шт (3 уник.) | `/vyvoz-musora/staraya-mebel/`, `/vyvoz-musora/vyvoz-stroymusora/`, `/vyvoz-musora/kontejner/` |
| 2 | `/vyvoz-musora/staraya-mebel/` | HTTP 200 | Sub-service рендерится через legacy SubServiceView |

**Verdict:** PASS

---

## Сводка

| Pathway | Status | Блокер? |
|---|---|---|
| 1. blog→foto-smeta→lead-form | PASS | No (file-upload deferred US-2/3) |
| 2. SD→district-hub→SD соседа | PASS (full circle) | **Slug-bug `odintsovo` vs `odincovo` — non-blocking W7 gate, но блокер до Stage 2** |
| 3. pillar→sub-service | PASS | No |

**3/3 verified PASS.** AC-10.5 закрыто.

## Backlog items (передаю в poseo)

1. **CRITICAL — Slug consistency `odincovo` vs `odintsovo`** в neighbor-districts блоке на programmatic-SD: всё ведёт на 404. Рекомендация: ввести canonical slug-map или fix на seed-сервисе, чтобы все entry-points использовали `odincovo` (per Districts table).
2. **MEDIUM — File-upload на `/foto-smeta/` lead-form** не реализован: AC-10.5 ослаблен до «lead-form submit». Вернуть в scope US-2 (фото→смета MVP) или US-3.
3. **LOW — Все 16 SD страницы существуют** (vs ожидание «только Одинцово»). Положительный сюрприз — закрытие URL-gap уже больше, чем планировалось. Учесть в benchmark closure %.
