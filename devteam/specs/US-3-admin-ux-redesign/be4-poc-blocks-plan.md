# US-3 — План PoC Payload `blocks` field (подтверждение ADR-0003)

**Автор:** `be4`
**Спек:** US-3 — Понятная админка, волна 1
**Дата:** 2026-04-24
**Входы:** [ADR-0003 preliminary](../../adr/ADR-0003-blocks-pattern-preliminary.md) §5/§6/§7, [sa.md](./sa.md) §3, §5, §8, §9, [ba.md](./ba.md) §REQ-6.*, learnings 2026-04-23 (`importMap.js` боль)
**Цель:** за 1-2 рабочих дня проверить 5 PoC-критериев из ADR-0003 §5 и перевести ADR в статус **Accepted** (или зафиксировать эскалацию). Deliverable после PoC — `be4-poc-blocks-report.md` (создаётся после, не сейчас).
**Что НЕ делаем в PoC:** не меняем существующие коллекции, не пишем рендер блоков на фронте, не миграем данные, не настраиваем ACL по блокам.

---

## 0. Ограничения и инварианты PoC

1. **Все изменения — в временной коллекции `_PocPages`** (`site/collections/_PocPages.ts`, префикс `_` — чтобы visually подчеркнуть «не для prod»). После PoC коллекция удаляется отдельным commit'ом.
2. **Ветка:** `poc/us3-payload-blocks`. Merge в main **запрещён** до `report` + approval `po`.
3. **База:** локальный Docker Postgres (docker-compose.yml в `site/`), не prod.
4. **Команды:**
   - `pnpm --filter site run dev` — Payload dev-server на `:3000`.
   - `pnpm --filter site run generate:importmap` — регенерация importMap.
   - `pnpm --filter site run generate:types` — регенерация `payload-types.ts`.
   - `pnpm --filter site run type-check` — `tsc --noEmit`.
   - `pnpm --filter site run test:e2e` — Playwright (не используем в PoC, но запуск должен не ломаться).
5. **Логирование:** весь ход PoC — в `devteam/specs/US-3-admin-ux-redesign/be4-poc-blocks-report.md` (создаётся в день 2). Для каждого PoC: пройден / не пройден / комментарий.
6. **Временные Block-определения** — минимум 3 для PoC-1/2/4, расширение до 4 для PoC-5. `admin.description` на каждом поле — по cw-dict §2, но в PoC это throwaway-текст: `«PoC: название услуги. Пример: Арбористика»`.
7. **Не запускаем** `payload build` / `next build` (ограничение оператора). Проверяем только dev-cycle.

---

## 1. PoC-1 — UX одной коллекции с 3 типами блоков (REQ-6.1, 6.2, 6.3, 6.4)

**Цель проверки.** Убедиться, что Payload 3 native `blocks` field закрывает drag-drop reorder, add, duplicate, delete, collapsed state, `admin.description` на блоке и на полях — «из коробки», без custom React.

**Код-скелет** (30 строк).

```ts
// site/blocks/_poc/hero.ts
import type { Block } from 'payload'
export const PocHeroBlock: Block = {
  slug: 'poc-hero',
  labels: { singular: 'PoC Hero', plural: 'PoC Hero' },
  admin: { description: 'PoC: первый экран. Один на страницу.', initCollapsed: true },
  fields: [
    { name: 'heading', type: 'text', required: true, maxLength: 120,
      admin: { description: 'PoC: заголовок страницы, до 120.' } },
    { name: 'enabled', type: 'checkbox', defaultValue: true,
      admin: { description: 'PoC: скрыть без удаления.' } },
  ],
}
// site/blocks/_poc/text.ts — аналогично с body: richText
// site/blocks/_poc/faq.ts — аналогично с items: array

// site/collections/_PocPages.ts
import type { CollectionConfig } from 'payload'
import { PocHeroBlock } from '../blocks/_poc/hero'
import { PocTextBlock } from '../blocks/_poc/text'
import { PocFaqBlock } from '../blocks/_poc/faq'
export const PocPages: CollectionConfig = {
  slug: '_poc-pages',
  labels: { singular: 'PoC Page', plural: 'PoC Pages' },
  admin: { useAsTitle: 'title', group: '99 · PoC', description: 'Временная для PoC ADR-0003' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'blocks', type: 'blocks', blocks: [PocHeroBlock, PocTextBlock, PocFaqBlock] },
  ],
}
// payload.config.ts — добавить PocPages в массив collections.
```

**Критерий прохождения.**
- [ ] Создаю документ, добавляю 3 блока (hero, text, faq) через «Add Block» палитру — карточки с labels и descriptions отображаются.
- [ ] Drag-drop меняет порядок; Save сохраняет новый порядок (reload страницы — порядок тот же).
- [ ] Row-action Duplicate копирует блок со всеми значениями; порядок: копия встаёт прямо под исходным.
- [ ] Row-action Delete удаляет без confirm-modal (Payload-native) — блок исчезает.
- [ ] `admin.initCollapsed: true` работает, блоки по умолчанию свёрнуты, drag-handle на закрытых карточках доступен и работает.
- [ ] `admin.description` на уровне блока виден в палитре «Add Block».
- [ ] `admin.description` на поле `heading` виден при раскрытии блока.

**Оценка времени:** **2 часа** (10 мин скелет + 1 ч прогон UI + 30 мин на повторы и edge-cases + 20 мин запись результата).

**Что если не проходит.**
- Если Duplicate отсутствует в row-actions Payload 3.83 — искать feature flag в `admin.components.rowActions` или признать отсутствие и митигировать в волне 2 (вариант A по ADR-0003, просто Effort растёт).
- Если drag-drop ломается на collapsed — эскалация к `tamd`; вариант A остаётся (это bug, не архитектурный блокер).
- **Если базовый UX не работает вовсе** — активируется вариант B (Lexical с BlocksFeature) из ADR-0003 §2, ADR-0005 переписывается. Маловероятно.

---

## 2. PoC-2 — Publish-gate через `beforeValidate` hook (REQ-6.5, AC-3.7.*)

**Цель проверки.** Убедиться, что `beforeValidate` hook на коллекции с `blocks[]` блокирует публикацию при нарушении правил sa.md §5.2, а текст ошибки рендерится в стандартный Payload error-banner читаемо и на русском.

**Код-скелет** (30 строк).

```ts
// site/lib/admin/_poc/publish-gate.ts
import type { CollectionBeforeValidateHook } from 'payload'
export const pocPublishGate: CollectionBeforeValidateHook = async ({ data, operation }) => {
  if (!data || operation === 'create') return data
  if (data._status !== 'published') return data
  const blocks = (data.blocks ?? []) as Array<{ blockType: string; enabled?: boolean }>
  const heros = blocks.filter((b) => b.blockType === 'poc-hero' && b.enabled !== false)
  if (heros.length !== 1) {
    throw new Error(
      `Нужен ровно один блок Hero. Сейчас: ${heros.length}. Добавьте или удалите лишний.`,
    )
  }
  const texts = blocks.filter((b) => b.blockType === 'poc-text' && b.enabled !== false)
  if (texts.length === 0) {
    throw new Error(
      'Для публикации нужен хотя бы один блок «Текст».',
    )
  }
  return data
}
// site/collections/_PocPages.ts — hooks: { beforeValidate: [pocPublishGate] }
```

**Критерий прохождения.**
- [ ] Попытка Publish без Hero → модалка / banner с текстом «Нужен ровно один блок Hero. Сейчас: 0…» — **русский**, **читаемый**, без `Error: ...` prefix от JS.
- [ ] Попытка Publish с 2 Hero → тот же banner с «Сейчас: 2».
- [ ] Попытка Save Draft (не Publish) — проходит **без** валидации (hook не срабатывает при `_status !== 'published'`).
- [ ] Исправил ошибку → Publish проходит, `_status = 'published'`.
- [ ] Banner показывается **сверху формы** (не рядом с каким-то случайным полем).
- [ ] Ссылка «Как собрать страницу из блоков» в сообщении — опциональная проверка: если Payload не кликабелит ссылки в error-banner, документируем (частый случай в CMS).

**Оценка времени:** **1.5 часа**.

**Что если не проходит.**
- Если `throw new Error(...)` рендерится как «500 Internal Server Error» в UI — проверить Payload 3 conventions (возможно нужен `ValidationError` из `payload` package). В ADR-0003 §6 — это ожидаемая доработка, не блокер.
- Если banner не появляется **над** формой, а внутри поля `blocks[]` как field-error — переходим к custom `admin.components.BeforeDocumentControls` с отдельным error-viewer (SA-Q9 усложняется, но паттерн не меняется).
- **Если `beforeValidate` не вызывается при publish** — эскалация к `tamd` (возможно, нужен `beforeChange` вместо или дополнительно); вариант A остаётся.

---

## 3. PoC-3 — Совместимость с drafts + autosave (2s) + versions (R10)

**Цель проверки.** Убедиться, что форма с ~10 блоками не теряет данные при autosave раз в 2 секунды, что versions пишутся корректно, что performance не деградирует до невыносимого.

**Код-скелет** (6 строк — изменение `_PocPages`).

```ts
// site/collections/_PocPages.ts
versions: {
  drafts: { autosave: { interval: 2000 } },
  maxPerDoc: 20,
},
```

**Критерий прохождения.**
- [ ] Создаю pages-документ, добавляю 10 блоков (3 hero + 4 text + 3 faq для стресса, `enabled: true`), редактирую поля в каждом.
- [ ] Вижу индикатор autosave (Payload-native) в UI; каждые 2s — save.
- [ ] Reload страницы через 5-10 сек после редактирования — данные на месте, все 10 блоков сохранены, порядок корректный.
- [ ] В Versions-табе — записи создаются (не один раз на каждую правку, а debounced Payload-ом).
- [ ] **Latency autosave** (из DevTools Network) ≤ 1 сек p95 на локали (10 блоков).
- [ ] **Drag-drop FPS** на 10 collapsed-блоках ≥ 60 fps (Chrome DevTools → Performance → 3 сек записи drag).
- [ ] Переключение на другую вкладку браузера и обратно — autosave не зависает, форма отзывчивая.

**Оценка времени:** **2 часа** (замер + повтор + запись).

**Что если не проходит.**
- Latency > 1 сек p95 на 10 блоках → **не блокер**, в ADR-0003 §6 записано: снижаем autosave до 5 сек на Services. Документируем decision.
- Версии не пишутся или падают — эскалация к `tamd` + issue в payloadcms/payload. Блокер **только** если autosave вообще ломает форму.
- FPS < 60 при 10 блоках — митигация: `admin.initCollapsed: true` всегда, палитра предупреждает «на странице много блоков — производительность редактора снижена»; запись в acceptance sa.md §2.1.

---

## 4. PoC-4 — `payload-types.ts` discriminated union (AC-3.5.3 fe1-readiness)

**Цель проверки.** Убедиться, что после `pnpm generate:types` в `payload-types.ts` появляется корректный TypeScript union для `blocks[]` с discriminator `blockType`, и что render-код в RSC-компоненте можно написать через `switch(block.blockType)` без `any` и без type-assertion.

**Код-скелет** (регенерация + тестовый рендер-скетч ~25 строк).

```ts
// site/app/(public)/_poc/render-poc-page.tsx  (только type-check, не обязан работать в runtime)
import type { PocPage } from '@/payload-types'
type Block = NonNullable<PocPage['blocks']>[number]
function renderBlock(block: Block): string {
  switch (block.blockType) {
    case 'poc-hero':   return `hero: ${block.heading}`
    case 'poc-text':   return `text: ${JSON.stringify(block.body).slice(0, 40)}`
    case 'poc-faq':    return `faq: ${block.items?.length ?? 0}`
    default: {
      // TS exhaustiveness check
      const _exhaustive: never = block
      return _exhaustive
    }
  }
}
```

**Критерий прохождения.**
- [ ] `pnpm --filter site run generate:types` проходит без ошибок.
- [ ] В `payload-types.ts` есть export `PocPage`, в нём поле `blocks?: Array<PocHeroBlock | PocTextBlock | PocFaqBlock>` (или аналогичный union с discriminator).
- [ ] У каждого блока есть литеральный `blockType: 'poc-hero'` / `'poc-text'` / `'poc-faq'` (строковый литерал, не `string`).
- [ ] Скетч `render-poc-page.tsx` проходит `pnpm run type-check` без `any` и без type-assertion.
- [ ] Exhaustiveness check (`const _exhaustive: never = block`) не падает с TS-ошибкой — значит union полный.
- [ ] Payload Local API `payload.findByID({ collection: '_poc-pages', id })` возвращает тот же тип (вызов из Node REPL или из временного API-route).

**Оценка времени:** **1 час** (быстрый, type-system-only).

**Что если не проходит.**
- Union без `blockType`-discriminator — **маловероятно**, Payload 3 это делает всегда. Если случилось — регенерировать, проверить версию `payload` в `package.json`, обновить до 3.83.x. Не блокер.
- Union с `any` в полях richText (Lexical) — **ожидаемо**, Lexical JSON в types — это `Record<string, unknown>`. Не блокер, `fe1` пишет helper на стороне рендера (ADR-0003 §6).
- **Types не генерируются вовсе** — эскалация к `tamd`; вариант A под угрозой (это серьёзный блокер для fe1).

---

## 5. PoC-5 — `importMap.js` стабилен при добавлении новых Block-определений (learnings 2026-04-23)

**Цель проверки.** Подтвердить или опровергнуть, что `Block`-определения **не требуют** правки `site/app/(payload)/admin/importMap.js`. Это прямой ответ на боль 2026-04-23 (deploy упал, потому что importMap устарел). Критерий — админка **не ломается** после добавления 4-го Block'а без регенерации importMap.

**Код-скелет** (5 строк + 1 коммит).

```ts
// site/blocks/_poc/cta.ts — 4-й блок, добавляется ПОСЛЕ PoC-1/2/3/4 успехов
import type { Block } from 'payload'
export const PocCtaBlock: Block = {
  slug: 'poc-cta',
  labels: { singular: 'PoC CTA', plural: 'PoC CTA' },
  fields: [{ name: 'label', type: 'text', required: true }],
}
// site/collections/_PocPages.ts — добавить PocCtaBlock в массив blocks[]
// ВАЖНО: НЕ запускать generate:importmap.
```

**Критерий прохождения.**
- [ ] Перезагружаю dev-server (`pnpm run dev`), **без** `generate:importmap`.
- [ ] Открываю `/admin/collections/_poc-pages/create` — страница не падает в 404, не кидает client-error.
- [ ] «Add Block» palette показывает **4** блока (новый PocCtaBlock виден в списке).
- [ ] Добавляю PocCtaBlock в документ — поле `label` редактируется, сохранение работает.
- [ ] Payload-types после `generate:types` — добавился `PocCtaBlock` в union (этот шаг допустим).
- [ ] Ищу в `site/app/(payload)/admin/importMap.js` упоминание `poc-cta` / `PocCtaBlock` — **отсутствует**, и это ОК.

**Оценка времени:** **1 час** (быстрый A/B эксперимент).

**Что если не проходит.**
- Если **admin 404 или client-error** при добавлении Block без regen importMap — **подтверждается боль learnings 2026-04-23**. Вариант A остаётся, но **обязательно** в US-3 волна 3 / US-5: автоматизация `predeploy: pnpm generate:importmap` в `deploy.yml` (уже частично сделано 2026-04-23) + дополнительно в dev-hook, чтобы локальный цикл разработки не ловил регрессию.
- Если admin работает **без** regen — TAMD-Q3 закрывается полностью по этому риску: Block-определения действительно не требуют importMap-регистрации. Документируем в report как win.
- **Примечание:** `admin.components.*` (Dashboard-tile, InlineHelp, AddBlockPalette override) — отдельная история, они **всегда** требуют importMap (это стандартный Payload). Проверяем только Block-определения.

---

## 6. План по дням

### День 1 — Setup + 3 быстрых PoC

| Слот | Активность | Длительность |
|---|---|---:|
| 09:00-09:30 | Ветка `poc/us3-payload-blocks`, скелет `_PocPages` + 3 Block-файла, `generate:types` первый раз | 30 мин |
| 09:30-11:30 | **PoC-1** — drag-drop, add, duplicate, delete, collapse, admin.description | 2 ч |
| 11:30-12:30 | **PoC-4** — types generation, render skeleton, type-check | 1 ч |
| 12:30-13:30 | Обед | — |
| 13:30-14:30 | **PoC-5** — добавить 4-й блок без regen importMap | 1 ч |
| 14:30-16:30 | Буфер: если PoC-1/4/5 что-то сломалось — чинить / документировать | 2 ч |
| 16:30-17:00 | Запись промежуточных результатов в черновой `be4-poc-blocks-report.md` | 30 мин |

**Итого день 1:** ~7 часов чистой работы, 3 PoC закрыты, промежуточный отчёт.

### День 2 — 2 сложных PoC + финальный отчёт

| Слот | Активность | Длительность |
|---|---|---:|
| 09:00-10:30 | **PoC-2** — publish-gate через `beforeValidate`, error-banner, draft-bypass | 1.5 ч |
| 10:30-12:30 | **PoC-3** — autosave 2s, versions, 10 блоков, latency, FPS, reload-integrity | 2 ч |
| 12:30-13:30 | Обед | — |
| 13:30-14:30 | Буфер: митигации для PoC-2/3, документирование edge-cases | 1 ч |
| 14:30-16:00 | **Написание `be4-poc-blocks-report.md`** — PASS/FAIL/comment по 5 PoC, рекомендация для `tamd` (перевод ADR-0003 в Accepted или эскалация) | 1.5 ч |
| 16:00-16:30 | Handoff в Linear: `be4 → tamd` комментарий со ссылкой на report, `be4 → po` готовность к US-5 discovery | 30 мин |
| 16:30-17:00 | Коммит `_PocPages` на `poc/us3-payload-blocks`, PR draft для обсуждения (НЕ merge) | 30 мин |

**Итого день 2:** ~6.5 часов, все 5 PoC закрыты, отчёт готов, handoff сделан.

**Общий бюджет:** **1.5-2 рабочих дня** (13-14 часов чистой работы + буфер). Укладывается в ADR-0003 §5 «минимальный PoC (1-2 рабочих дня)».

---

## 7. Риски и эскалации

- **R-PoC-1: Dev Postgres не поднят / broken schema** — митигация: перед стартом `docker compose up postgres`, `pnpm run seed:admin` (скрипт `site/scripts/seed.ts` есть, создаёт пользователя). Если схема не мигрирует — использовать `push: true` в payload.config.ts (уже есть).
- **R-PoC-2: `admin.description` не рендерится в dev** — вероятно, нужна регенерация importMap или reload. Если после обоих ничего — обновить Payload до актуального 3.83.x.
- **R-PoC-3: Playwright запускается в CI** — не должен мешать PoC, `test:e2e` руками не запускаем.
- **R-PoC-4: Lexical richText в types — `unknown`** — ожидаемо, не блокер. Заметка для `fe1`.
- **R-PoC-5: `next build` запрещён** — не запускаем, ограничиваемся dev-server и `type-check`. Если `tamd` попросит проверить prod-build — это уже вне 1-2 дневного бюджета.
- **R-PoC-6 (критический): 3+ PoC из 5 падают** — ADR-0003 §6 «крайний случай»: `tamd` пишет ADR-0005 с вариантом B, US-5 задержка ~1 неделя. Вероятность низкая (паттерн зрелый).

---

## 8. Связь с другими ролями

- **`tamd`** получает `be4-poc-blocks-report.md` → решает: ADR-0003 переводит в Accepted как ADR-0005 (вариант A) или пишет переход на B.
- **`sa`** обновляет sa.md §8.1 / §9.4 — подтверждает либо меняет способ override AddBlockPalette и способ regen importMap.
- **`ui`** может ничего не ждать — макет AddBlockPalette готовится параллельно по sa.md §8.
- **`fe1`** получает из PoC-4 подтверждение, что discriminated union работает — готов рендерить блоки на фронте.
- **`po`** получает signal о готовности US-5 discovery (архитектура блоков) к старту, как только ADR-0003 → Accepted.
- **`do`** получает из PoC-5 подтверждение или опровержение необходимости importMap-regen в dev-цикле (prod-цикл уже закрыт 2026-04-23).

---

## 9. Deliverable после PoC

Файл `devteam/specs/US-3-admin-ux-redesign/be4-poc-blocks-report.md` с секциями:
- PoC-1 …PoC-5: PASS / FAIL / comment + скриншоты из `/admin` (опц.).
- Recommendation: «ADR-0003 → Accepted (ADR-0005)» / «Escalation».
- Open questions → `tamd`, `sa`, `fe1`.

**Этот файл `be4-poc-blocks-plan.md` — только план. Report создаётся после прохождения PoC, не сейчас.**
