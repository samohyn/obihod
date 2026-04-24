# ADR-0003: Блочная модель публичных страниц в Payload 3 — предварительный выбор паттерна

- **Статус:** **Preliminary / draft** (предварительная рекомендация, финал — после PoC; см. §5)
- **Дата:** 2026-04-24
- **Автор:** tamd
- **Связь:** US-3 (REQ-6.1–6.5, блокер BLOCK-2), US-5 (архитектура библиотеки блоков — главный потребитель), далее US-4, US-6, US-7, US-8
- **Адресовано:** po, sa, be4, fe1 (consulting), cw (для `admin.description` уровня блока)
- **Супернаследует:** — (первое ADR по блочной модели)

---

## 1. Контекст

Оператор 2026-04-24 ввёл архитектурную вводную: **каждая публичная страница = `header + blocks[] + footer`**, где `blocks[]` — массив из библиотеки типов (SEO-текст, hero, lead-form, photo-estimate-form, calculator, cases, faq, services-grid, districts-grid, trust-badges, testimonials, cta-banner, promotion-banner, map-region, video и т.п., минимум ~10 типов на старте, список стабилизируется в US-5).

Затрагиваемые коллекции (факт в `site/collections/`): `Services`, `ServiceDistricts`, `Cases`, `Blog`, `B2BPages`, плюс планируемый `StaticPages`/`LandingPages` и `Promotions`. Все — публичные, все уходят под блочную модель.

**Что на кону:**
- REQ-6.1 (drag-drop reorder), REQ-6.2 (библиотека с превью), REQ-6.3 (add/duplicate/hide/delete), REQ-6.4 (inline-help на блок), REQ-6.5 (publish-gate с читаемой ошибкой в админке) из [ba.md US-3](../specs/US-3-admin-ux-redesign/ba.md) работают **поверх** выбранного паттерна. Фактические capabilities drag-drop, duplicate, hide и UX-ошибки валидации прямо зависят от того, что выбранный паттерн их поддерживает без ручной доделки.
- Решение затрагивает **все публичные коллекции** и определяет миграцию данных при вводе блочной модели.
- US-5 (архитектура блоков, schema, матрица «коллекция × допустимые типы», миграция) стартует сразу после этого выбора. Без предварительной рекомендации `sa` и `be4` заблокированы по TAMD-Q3.
- Команда маленькая (1 оператор + 1 `be4` + 1 `fe1` consulting); любой high-maintenance компонент прожигает bus factor.

**Инфраструктурные ограничения, релевантные выбору:**
- Next.js 16 + Payload 3.83 + PostgreSQL 16 + Beget VPS 2×CPU/2GB (RAM — дефицит, PM2 + build на GitHub runner).
- `site/payload.config.ts` уже использует `lexicalEditor()` из `@payloadcms/richtext-lexical` (единый rich-text по всему проекту).
- `site/app/(payload)/admin/importMap.js` коммитится в репо и устаревает при добавлении custom-компонента (learnings 2026-04-23). Каждый новый custom-component требует `pnpm generate:importmap` перед build, иначе admin проваливается в 404 на новых роутах.
- Drafts+autosave(2s) уже включены на `Services`, versions drafts — на `ServiceDistricts`. Любой выбранный паттерн должен сохранять совместимость.
- В проекте **уже 2 ADR** (`ADR-0001-seed-prod-runner`, `ADR-0002-site-chrome-dedup-seosettings`), этот — третий.

---

## 2. Варианты

### Вариант A — Payload 3 `blocks` field (native)

**Суть.** Поле `blocks: [{ slug, fields[] }, ...]` в коллекции. Каждый тип блока — отдельный `Block` с собственным набором полей. Payload admin UI рендерит нативный drag-drop редактор массива, кнопку «Add Block» с palette выбора типа, collapsibles на каждом элементе, actions (duplicate/delete) «из коробки». Сохранение — в стандартную Payload-колонку `jsonb` (`pages_blocks`-таблицу Payload создаёт сам как одна-к-многим к родительской коллекции).

**Плюсы:**
- Нативная поддержка всех жестов REQ-6.1–6.3 (drag-drop, add, duplicate, delete) без ручной доделки.
- Встроенная интеграция с drafts/versions/autosave — критично для `Services` (уже 2s autosave).
- `admin.description` на уровне блока и на каждом поле — закрывает REQ-6.4 без custom React.
- TypeScript-типы на блоки генерируются Payload автоматически (`payload-types.ts`) — fe1 получает типы для рендера на фронте без ручного синхронизирования.
- Валидация на уровне schema (required/minLength), `beforeValidate` хук коллекции для publish-gate — закрывает REQ-6.5 через стандартный Payload error-banner (без custom React-компонента валидации — решение для SA-Q9).
- **Нулевая нагрузка на `importMap.js`** для самого редактора — это стандартный Payload UI, уже в importMap. Custom-компоненты нужны только для REQ-1.1/1.3/1.4 (Dashboard tile, inline-help, docs view) — они есть и без блочной модели.
- REST API (`api/pages/:id`) и Local API отдают `blocks[]` как массив объектов с discriminator `blockType` — прямой маппинг на фронт-компоненты.
- Проверено сообществом — эталонный паттерн блочных CMS на Payload (документация Payload ссылается на него как на основной способ построения «page builder»).

**Минусы:**
- Ограничения схемы Payload: вложенные blocks-in-blocks работают, но в глубокой вложенности UX admin деградирует (collapsibles внутри collapsibles, drag-drop в drag-drop). Для Обихода не проблема — на 2026-04-24 библиотека плоская, вложенности не планируется.
- Frontend-рендер требует discriminated union по `blockType` — это стандарт, не минус, но всё же boilerplate.
- Hide-toggle (REQ-6.3) не поддерживается из коробки — реализуется добавлением поля `enabled: boolean` в каждый блок (стандартное поле Payload, не custom React).

**Effort:** **S** для самой инфраструктуры (конфиг поля, список блоков = работа US-5 `sa`+`be4`). Для US-3 оператор получает UX REQ-6.* практически «бесплатно» с точки зрения фронтовой имплементации — доработки только на `hide-toggle` и текст ошибки publish-gate.

**Специфические риски для Обихода:**
- **Bundle size admin:** none. Payload blocks-editor — часть штатного admin-бандла, не добавляет веса.
- **PM2/Beget:** none, SSR-нагрузка идентична обычному массиву полей.
- **importMap.js:** none — `blocks` field не требует custom React компонента.
- **Производительность формы при 10+ блоках** (R10 из ba.md): Payload рендерит все блоки в одной форме; митигация — `admin.initCollapsed: true` на уровне блока (нативно в Payload), lazy-load миниатюр превью в «Add Block» palette — стандартный паттерн.

**Reversibility:** высокая — данные хранятся в структурированной форме, всегда можно мигрировать в Lexical nodes или custom editor через скрипт.

---

### Вариант B — Lexical richText с custom nodes (inline)

**Суть.** Один `richText` Lexical-редактор на всю страницу, блоки — custom Lexical Nodes, вставляемые в поток. `@payloadcms/richtext-lexical` поддерживает `BlocksFeature` — позволяет объявить Payload-blocks как узлы Lexical-редактора. Результат — WYSIWYG-like редактор, где текст, блоки и заголовки перемежаются в одном потоке.

**Плюсы:**
- WYSIWYG-ощущение ближе к Notion (эталон оператора, подтверждён в intake).
- Текст + блоки в одном потоке — удобно для блог-постов, длинных статей (US-9 блог).
- Лексикал уже стоит в проекте — новых зависимостей не добавляется.

**Минусы:**
- **Publish-gate (REQ-6.5) усложняется радикально.** Валидация структуры «ровно один hero», «минимум один контактный блок», «минимум 300 слов text-content» поверх Lexical-JSON — это парсинг дерева нод, а не декларативная schema-валидация. `beforeValidate` hook придётся писать вручную с обходом Lexical AST. Делает SA-Q7/SA-Q9 значимо сложнее.
- **Drag-drop reorder (REQ-6.1)** в Lexical работает на уровне блоков, но не так очевидно для оператора, как в Payload `blocks` — нет drag-handle по умолчанию, UX поиска места для вставки страдает.
- **Library с превью и описаниями (REQ-6.2)** — Lexical floating toolbar / slash-command palette ≠ карточная сетка 2–3 кол из UI-Q3. Нужно кастомить.
- **TypeScript-типы блоков** — генерируются Payload, но рендер на фронте идёт через JSON-сериализатор Lexical (`@payloadcms/richtext-lexical/react`). Разделение «что рендерит Lexical-renderer» vs «что рендерим мы сами» — лишний когнитивный груз на fe1.
- **Hide-toggle, duplicate** — кастомные команды Lexical-редактора, больше кода, чем в варианте A.
- **Publish-gate UX-ошибка** — Payload error-banner работает, но указатель «где именно в дереве Lexical ошибка» визуально сложнее (координата не «блок №3», а «позиция в документе»).

**Effort:** **M** — ничего критичного, но каждая из 5 REQ-6.* требует больше работы, чем в A.

**Специфические риски для Обихода:**
- **Bundle size admin:** Lexical уже загружается, дополнительного веса нет.
- **importMap.js:** custom Lexical nodes регистрируются через admin import paths — попадают в importMap, но это штатный путь `@payloadcms/richtext-lexical`.
- **Миграция существующих richText в `Services.longDescription`** (если такой есть) — совместима, Lexical уже формат хранения.
- **Автосохранение drafts/autosave 2s на Services** — работает, но большой Lexical-документ при каждом autosave сериализуется целиком (R10 усиливается).

**Reversibility:** средняя — Lexical-JSON экспортируем, но переложить в плоский `blocks[]` требует скрипта-парсера дерева.

---

### Вариант C — Custom React-editor в admin

**Суть.** Полностью кастомный React-компонент внутри Payload admin (`admin.components.views.Edit` override или custom field-component), пишет произвольный JSON в обычное поле. Максимум контроля над UX: своя библиотека-панель, своя реализация drag-drop (`dnd-kit`), свой preview, свой publish-gate.

**Плюсы:**
- Полный контроль UX — можно буквально воспроизвести Notion-like experience из ответа оператора №2.
- Не ограничен схемой Payload (nested blocks, conditional fields — что угодно).

**Минусы:**
- **Огромный Effort.** Нужно реализовать drag-drop (`dnd-kit`), collapsibles, library palette, field-level validation UX, undo/redo, focus management, a11y — то, что Payload `blocks` даёт бесплатно.
- **Не интегрируется с Payload drafts/versions/autosave из коробки** — нужно писать собственную дифф-логику, иначе при autosave 2s на `Services` будет гоняться весь JSON.
- **TypeScript-типы блоков придётся поддерживать вручную** (или генератором) — Payload не знает о внутренней структуре field.
- **Bundle size admin раздувается:** `dnd-kit` (~30KB), любые свои компоненты + иконки — всё идёт в admin-бандл. На Beget VPS 2×CPU/2GB первый холодный запуск admin будет заметно медленнее.
- **importMap.js** — каждый subcomponent этого редактора (library-panel, drag-handle, block-editor-wrapper, validation-error-popover и т.д.) — новая запись в importMap. Каждое добавление типа блока = регенерация importMap + ребилд. Это именно та боль из learnings 2026-04-23, только умноженная на 10.
- **Maintenance cost** катастрофический для команды из 1 `be4`. Когда `be4` уходит в отпуск или переключается на US-8 (калькуляторы), редактор становится не-поддерживаемым.
- **Bus factor 1** — если кастом сломается на Payload 4, миграция может потребовать полного переписывания.

**Effort:** **L** (большой L — 4–6 недель только самого редактора до фичепаритета с Payload `blocks`).

**Специфические риски для Обихода:**
- **Bundle size admin:** high — +30–60 KB gzip минимум.
- **importMap.js:** high — каждый subcomponent.
- **Maintenance:** high — bus factor 1.
- **RAM prod:** Beget VPS 2GB и PM2 — доп. SSR-нагрузки на admin не критичны (admin редко используется), но сборочная цепочка распухает.

**Reversibility:** низкая — уйти с custom editor на native blocks значит написать миграцию JSON → Payload blocks и параллельно прожить переходный период.

---

## 3. Рекомендация

**Выбираем вариант A — Payload 3 `blocks` field (native).**

### Обоснование

1. **Прямое совпадение с REQ-6.1–6.5 без compromise.** Drag-drop, add, duplicate, delete, collapsibles, admin.description, schema-валидация — всё нативно. Payload blocks — это буквально тот паттерн, который блочный редактор US-3 описывает в требованиях.
2. **Нулевой прирост `importMap.js`-боли для самого редактора.** Критично, учитывая learnings 2026-04-23 и то, что US-3 уже имеет 3 новых custom-компонента (Dashboard-tile, inline-help, docs-view) вне блочной модели. Вариант C добавил бы к этому ещё 10+ subcomponents, и каждый deploy стал бы минным полем.
3. **Размер команды не позволяет роскошь custom editor.** Один `be4` + один `fe1` consulting. Maintenance custom React-editor'а на долгий срок при такой команде — серьёзный бизнес-риск. Payload blocks поддерживается Payload-командой, а не нами.
4. **Bundle size admin на Beget 2×CPU/2GB.** Vairant A — 0 прироста, C — +30–60KB + сложность. Даже без критичного performance-бюджета admin (admin не user-facing), сборка на GitHub runner уже работает близко к лимитам RAM — лишний вес увеличивает риск OOM.
5. **Совместимость с drafts+autosave(2s)/versions на `Services` и `ServiceDistricts` — из коробки.** Вариант B — ок, но с нагрузкой сериализации Lexical-дерева; вариант C — нужно писать руками.
6. **Publish-gate (REQ-6.5) — простейший в варианте A:** `beforeValidate` hook + стандартный Payload error-banner. BA-рекомендация в SA-Q9 прямо указывает на этот путь.
7. **Reversibility высокая.** Если через 6 месяцев оператор попросит Notion-like WYSIWYG — из структурированных `blocks[]` мигрируем скриптом в Lexical nodes (вариант B) или в custom editor (C). Обратное (из B или C в A) — дороже.

### Один аргумент, который мог бы сдвинуть решение

Если оператор **явно потребует** Notion-like inline-поток (текст + блоки + текст в одном WYSIWYG), вариант B становится предпочтительнее, потому что A даёт только «один блок — один slot», без inline-mix. На 2026-04-24 из ответов оператора в intake (референс Notion — «берём сайдбар, типографику, подсказки, блочную модель; не берём модель данных») и формулировки «header + 10 блоков + footer» такое требование **не звучит**. Проверяется на усабилити-сессии (PoC-1 ниже).

---

## 4. Последствия

**Положительные:**
- US-3 REQ-6.1–6.4 — закрываются нативными средствами Payload, Effort в US-3 сводится к минимуму.
- US-5 (архитектура блоков) движется быстрее — `sa` описывает библиотеку типов как обычные Payload `Block`-определения, `be4` реализует декларативно в `site/blocks/*.ts`.
- `fe1` получает TypeScript-типы блоков из `payload-types.ts` — рендер на фронте через discriminated union, без ручного синхронизирования.
- `cw` пишет `admin.description` на уровне блока и полей — закрывает REQ-6.2 («библиотека с описаниями») и REQ-6.4 (inline-help) единообразно с REQ-1.2 (описания на обычных полях).

**Отрицательные:**
- UX «библиотека блоков с карточным превью 2–3 кол» (UI-Q3) — Payload «Add Block» palette из коробки даёт список, не карточную сетку. Если `ui` настоит на карточной сетке, потребуется **один custom React-компонент** (override `admin.components.BlocksField` или аналогичный slot). Это компромисс — и он контролируемый, единичный, не 10+ subcomponents как в варианте C.
- Глубокая вложенность blocks-in-blocks ограничена (не критично для планируемых типов блоков 2026-04-24).

**Reversible / Irreversible:** **Reversible.** Данные хранятся в структурированной форме; миграция в Lexical nodes или custom editor возможна скриптом без потерь.

---

## 5. Условия финального ADR (что проверяет PoC до перевода статуса в Accepted)

Чтобы эта предварительная рекомендация стала финальной, `be4` + `sa` выполняют **минимальный PoC (1–2 рабочих дня)** и подтверждают:

- **PoC-1. UX одной коллекции с 3 типами блоков.** Новая временная коллекция `_PocPages` в `site/collections/` с `blocks: [HeroBlock, TextBlock, FaqBlock]`. `be4` заводит 3 минимальных Block-определения с `admin.description` на блоке и на полях. Проверки:
  - [ ] Drag-drop reorder работает, блоки меняются местами, save сохраняет порядок (REQ-6.1).
  - [ ] «Add Block» открывает палитру с тремя типами, названия и описания читаемы (REQ-6.2).
  - [ ] Duplicate / Delete работают нативно (REQ-6.3).
  - [ ] `admin.description` на полях рендерится inline (REQ-6.4).
  - [ ] `admin.initCollapsed: true` не ломает D&D (R10).
- **PoC-2. Publish-gate через `beforeValidate` hook.** Hook на `_PocPages` запрещает publish если нет ни одного `HeroBlock`. Проверка:
  - [ ] Publish запрещён, ошибка отображается в Payload error-banner, текст читаем (REQ-6.5, SA-Q9).
- **PoC-3. Совместимость с drafts+autosave(2s) на Services-style коллекции.** Включить autosave: `{ interval: 2000 }` и drafts на `_PocPages`. Проверка:
  - [ ] autosave корректно пишет drafts с blocks[], versions сохраняются.
  - [ ] Форма с 10+ блоками (collapsed) остаётся responsive на Beget-like нагрузке (≥ 60 fps при drag, latency autosave ≤ 1 сек на локали).
- **PoC-4. Local API отдаёт blocks с TypeScript-типами.** `payload.findByID({ collection: '_PocPages', ... })` возвращает массив с discriminator `blockType`. Проверка:
  - [ ] `payload-types.ts` содержит union-тип для `blocks[]`.
  - [ ] `fe1` может отрендерить 3 блока через `switch(block.blockType)` без `any`.
- **PoC-5. importMap.js стабилен.** Build admin после добавления 3 Block-определений **без** регенерации `importMap.js`. Проверка:
  - [ ] Если admin SPA работает без `pnpm generate:importmap` — Block-определения не требуют importMap-регистрации, и TAMD-Q3 закрывается полностью по этому риску.
  - [ ] Если требуется регенерация — задокументировать (это ок, стандартный путь; но мы должны знать для deploy-pipeline, см. BA открытый вопрос про prebuild — в ведении `do`).

**PoC не проходит → эскалация (§6).**

---

## 6. План эскалации

Если PoC показывает блокирующие проблемы:

- **PoC-1 падает** (drag-drop или add/duplicate/delete не работают как ожидается) → практически невозможно, это базовая функциональность Payload blocks. Если случится — `be4` открывает issue в payloadcms/payload, `tamd` пересматривает на вариант B.
- **PoC-2 падает** (publish-gate через `beforeValidate` не даёт UX, приемлемый для оператора) → эскалация к `sa` (SA-Q9 становится custom React validation component, Effort US-3 вырастает, но выбор паттерна остаётся).
- **PoC-3 падает** (autosave с blocks[] не справляется на Services 2s) → рассматриваем снижение autosave interval на Services до 5–10 сек. Не меняет выбор паттерна.
- **PoC-4 падает** (TS-типы неудобны) → не блокер, но требует от `fe1` написать свой helper-тип. Выбор паттерна не меняется.
- **PoC-5 падает существенно** (каждый новый Block требует regeneration importMap и ручной правки) → рассматриваем автоматизацию в `predeploy` hook (открытый вопрос BA, в ведении `do`). Выбор паттерна не меняется, но ops-сложность осознаётся.

**Крайний случай:** если 3 из 5 PoC падают (маловероятно — это зрелый паттерн) → `tamd` пишет **ADR-0004** с выбором варианта B, US-5 получает задержку ~1 неделя.

---

## 7. Что можно начать делать уже сейчас (параллельно с PoC)

Эта работа **не зависит** от финального ADR и не переделывается, если рекомендация подтвердится:

1. **`sa` — описание каждого типа блока как data contract (независимо от имплементации).** Для 10+ планируемых типов (hero, text-content, lead-form, photo-estimate-form, calculator-arborist, calculator-roof, calculator-trash, calculator-demolition, cases, faq, services-grid, districts-grid, trust-badges, testimonials, cta-banner, promotion-banner, map-region, video) — список полей, типы, required/optional, описание назначения. Этот контракт нужен для US-5 в любом из трёх вариантов паттерна. Формат: `devteam/specs/US-5-blocks-library/sa.md` секция «Block contracts».
2. **`sa` — матрица «коллекция × допустимые типы блоков».** Services, ServiceDistricts, Cases, Blog, B2BPages, StaticPages — для каждой определить, какие типы блоков разрешены (например, Blog не имеет lead-form, Cases не имеет calculator). Это в любом варианте — атрибут конфигурации. Готовится в `sa.md` US-5.
3. **`sa` / `cw` совместно — набор правил publish-gate (SA-Q7).** Конкретный список правил, которые блокируют publish: «ровно один hero», «≥ 1 text-content блок с ≥ 300 слов», «≥ 1 контактный блок (lead-form | photo-estimate-form | cta-banner)», «не более одного promotion-banner одновременно активного по датам». В любом варианте паттерна эти правила — одинаковые. Формат: `sa.md` US-5 секция «Publish-gate rules».
4. **`sa` + `be4` — mock-тексты ошибок publish-gate (REQ-6.5).** На базе правил из п. 3, `cw` пишет формулировки через TOV-фильтр. Это разблокирует REQ-6.5 на уровне текста, `cw` начинает независимо от имплементации.
5. **`seo2` — матрица «тип блока → schema.org» (SEO2-Q1).** Независима от паттерна: faq → FAQPage, cases → ItemList(Article), services-grid → ItemList(Service), promotion-banner → Offer с validFrom/validThrough, video → VideoObject, testimonials → ItemList(Review). Результат — вход для `cw` в описания REQ-6.2/6.4 и для US-8 implementation.
6. **`cw` — `admin.description` тексты для 300+ полей существующих коллекций.** Параллельный трек BA §8.2, полностью независим от блочной модели. Продолжается по плану.
7. **`ux` — wireframes guidance-слоя (Dashboard-tile, docs-view, inline-help).** Продолжается по US-3 волне 1, не зависит от TAMD-Q3.
8. **`ui` / `art` — визуальные макеты карточной сетки «Add Block» палитры (UI-Q3).** Можно рисовать уже сейчас; реализация зависит от паттерна (в варианте A — либо дефолтная палитра, либо 1 override-компонент; в B — кастом Lexical floating toolbar; в C — из коробки). Макет одинаковый.

**Что НЕ делать до финального ADR:**
- Не заводить `blocks` field в существующих коллекциях (Services, ServiceDistricts и т.д.) — миграция данных должна быть одномоментной и по финальному ADR.
- Не писать frontend-рендер блоков. Это зависит от формы хранения (массив с discriminator vs Lexical JSON).
- Не создавать `site/blocks/` структуру в коде до того, как PoC подтвердит вариант A.

---

## 8. Открытые вопросы (до перевода в Accepted)

- [ ] PoC-1..PoC-5 выполнен `be4`+`sa`, результаты задокументированы в `devteam/specs/US-5-blocks-library/tamd-poc.md`.
- [ ] `ui` подтверждает, что карточная сетка палитры реализуема через один override Payload slot (UI-Q3).
- [ ] `do` подтверждает, что автоматизация `pnpm generate:importmap` в `predeploy` workflow покрывает сценарий «добавили новый Block → deploy без ручного шага» (открытый вопрос BA из REQ-4.1 зоны).
- [ ] Оператор не требует Notion-like inline-поток (подтверждается `ux` на usability-сессии по макету `ui`).

---

## 9. Связь с другими ADR

- **Предыдущие:** `ADR-0001-seed-prod-runner.md`, `ADR-0002-site-chrome-dedup-seosettings.md` — не пересекаются.
- **Следующие (ожидаемые):**
  - ADR-0004 — механизм preview публичных коллекций (REQ-3.1, TAMD-Q1) — отдельный ADR, параллельный трек.
  - ADR-0005 — финальная версия этого ADR (статус Accepted) после PoC.
  - Если PoC провалит вариант A — ADR-0005 может переключиться на вариант B с Superseded-связью к этому черновику.
