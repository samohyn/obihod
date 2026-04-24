# Research: on-screen guidance в CMS-интерфейсах — аудит для US-3

- **Запрос от:** ba (US-3 admin-ux-redesign)
- **Автор:** re (Research Analyst)
- **Дата:** 2026-04-24
- **Связь:** US-3 (Payload admin redesign), intake 2026-04-24
- **Источники:** знания re о публичных CMS-продуктах + публичные docs (Payload 3, Notion, Sanity, Contentful). Payload docs проверить `be4` перед имплементацией (docs.payloadcms.com был недоступен 2026-04-24, 429).

---

## TL;DR

Ключевая боль оператора — «не понимаю что делать тупо», референс Notion. Основная находка: ни одна из 6 CMS не решает эту проблему одним паттерном — сильные продукты комбинируют **4 слоя guidance** (onboarding, inline field help, process walkthrough, docs hub). Для Payload 3 реалистично притянуть **3 паттерна «за день-два каждый»** (field description, afterDashboard-walkthrough, docs-view) и **2 паттерна «за неделю»** (inline contextual help с сохранением «прочитано», empty-states с CTA). Пропустить соблазнительный, но дорогой Product Tours в стиле Contentful/Webflow — окупится только при multi-user onboarding, а у Обихода один оператор.

---

## Вопросы, на которые отвечаем

1. Какие паттерны on-screen guidance существуют в зрелых CMS-админках?
2. Какие из них реалистичны в Payload 3 и во сколько обойдутся?
3. Какие 5 стоит встроить в US-3, какие отбросить?

---

## Словарь паттернов (для единообразия)

| Паттерн | Суть |
|---|---|
| **Onboarding/Welcome** | Первое касание: welcome-модалка, чеклист, welcome-tour |
| **Inline field help** | Подсказки рядом с полем формы: description, tooltip, helper |
| **Process walkthrough** | Шаговый гайд по сценарию: «Опубликовать кейс» → 5 шагов с чекбоксами |
| **Docs hub** | Встроенная страница-справочник внутри админки (не внешний сайт) |
| **Empty state guidance** | Пустой список → объяснение «что это, зачем, кнопка создать» |
| **Slash/Command palette** | Notion-style `/` или `Cmd+K` для быстрых действий |
| **Template gallery** | Готовые шаблоны документов, с которых стартует юзер |
| **Conditional hints** | Подсказка, которая показывается только пока не «прочитано» |
| **Product tour** | Полуавтоматический walkthrough поверх UI (spotlight + tooltip по элементам) |
| **Content tree / structure** | Дерево иерархии контента рядом с формой |

---

## Сравнительная матрица 6 CMS × 4 слоя guidance

Легенда: **A** — зрелая реализация, **B** — есть, но слабее, **C** — нет или минимум.

| CMS | Onboarding/Welcome | Inline field help | Process walkthrough | Docs hub |
|---|---|---|---|---|
| **Notion** | A — welcome-страница с 6 шагами + templates gallery | A — hover-hints + inline placeholder + `/` slash menu | B — templates = walkthrough; нет chekbox-чеклистов внутри страницы | B — Help & Support панель справа, FAQ; docs внешние |
| **Sanity Studio** | C — нет welcome (studio это код разработчика) | A — `description`, `validation`, `readOnly`, `hidden` — first-class в schema | C — нет готовых walkthrough, но Structure Builder позволяет собрать свой | A — **docs как первоклассный гражданин**: custom tools/views в navbar, можно смонтировать MDX/любой React-компонент как вкладку |
| **Contentful** | A — Onboarding tour + Space setup checklist | B — `help text` на поле, `validations` с объяснением | A — Content modelling guide внутри админки; Tasks на entries | B — Help center в отдельной вкладке, но внешний |
| **Strapi** | B — Welcome после install + quickstart tour | A — `description` на поле, conditional fields (v5), custom plugins | C — нет встроенных walkthrough; сообщество делает через custom plugins | B — docs внешние, но есть плагин Documentation (для API) |
| **Webflow CMS** | A — interactive onboarding + Webflow University inline | B — field help text в CMS collection editor | A — step-by-step guides в интерфейсе, контекстные видео | A — Webflow University встроена через overlay |
| **WordPress Gutenberg** | A — Welcome Guide modal (dismissible, persist в user meta) | B — help panel справа + tooltip на block | B — Tips через `wp.data`/Nux API; постепенно упразднены | C — внешние docs, но есть Help tab в classic screens |

**Вывод матрицы:** сильнее всех по inline field help — Sanity и Strapi. По docs-hub внутри админки — Sanity (custom tools) и Webflow. По onboarding — Contentful и WordPress Gutenberg. Notion — мастер «низкоплотного UI + hover-hints + templates». Для Обихода (single-user, Payload 3, фокус на docs+inline help) — комбинация Sanity-подхода (description как обязательное поле) + Gutenberg-подхода (dismissible Welcome Guide) + Sanity/Webflow (docs-view) + Notion (тёплая типографика и spacing).

---

## Детальный разбор по CMS (2-3 пункта)

### 1. Notion (референс оператора)

- **Welcome + Templates Gallery.** При первом входе — страница «Get started» с 6 кнопками-сценариями («Personal home», «Project tracker», ...). Каждая = готовый шаблон. **В Payload:** эмулируется через custom Dashboard view — 6 tile'ов «Добавить район / Обновить цену / Опубликовать кейс / Заменить баннер / Добавить услугу / Новый лендинг», клик → deep-link на collection edit с предзаполненными полями. **Усилия:** M (1-2 дня, нужен custom Dashboard).
- **Slash-команды + hover-hints.** `/` вызывает палитру блоков с описаниями; hover на любой элемент — tooltip. **В Payload:** частично — `Cmd+K` уже есть в Payload 3 (global search). Hover-hints на поля делаются через `admin.description` + CSS tooltip. **Усилия:** S.
- **Мягкая типографика + низкая визуальная плотность.** Не паттерн, а общий приём. Payload 3 кастомизируется через `admin.css` + CSS-переменные, часть уже сделано в US-2 (кремовый фон, BrandLogo). **Усилия:** S (допилить spacing/тайпографию).

### 2. Sanity Studio

- **Schema-driven descriptions.** `description` — обязательное поле best-practice; Sanity community конвенция — не коммитить схему без description. **В Payload:** 1-в-1 через `field.admin.description` (string или React-компонент). **Это первая и самая дешёвая мера US-3.** **Усилия:** S (тотальный pass по всем schema файлам — 1 день + ревью контент-менеджером).
- **Custom Tools / Views в navbar.** Sanity Studio позволяет зарегистрировать «tool» — произвольный React-компонент, который появляется в top-nav рядом с Studio-панелями. Используют для dashboards, docs, Vision (GROQ query playground). **В Payload 3:** эквивалент — custom view через `admin.components.views.* ` (нужна верификация `be4` — API в Payload 3 называется Custom Views / Custom Routes, можно смонтировать свой React-компонент как `/admin/docs`). **Усилия:** M.
- **Structure Builder.** Декларативный способ собрать своё дерево документов в left-nav (грouping, ordering). **В Payload:** аналог — `admin.group` + `admin.useAsTitle` + `admin.defaultColumns`, частично уже сделано в US-2. **Усилия:** S (допил группировки).

### 3. Contentful

- **Welcome Tour.** 5-7 шаговый продуктовый тур поверх UI через spotlight+tooltip на первом входе. Завязан на user meta (показывается 1 раз). **В Payload:** нет встроенного — либо библиотека `intro.js`/`shepherd.js`/`driver.js` в custom component, либо отказаться. **Усилия:** L (+ нужен механизм «показано / не показано» в user preferences — Payload user.customField).
- **Help text на поле.** `help text` с поддержкой Markdown. **В Payload:** `admin.description` поддерживает string + React-компонент → можно вставить ссылку «подробнее» внутрь. **Усилия:** S.
- **Content tree справа от формы.** Для больших иерархий. **В Payload:** у Обихода нет deep-иерархий (плоские коллекции Services/Districts), паттерн не нужен. **Не берём.**

### 4. Strapi

- **Field description + conditional fields.** Strapi 5 ввёл conditional fields (поле появляется, если другое =X). **В Payload:** `admin.condition` callback уже нативно поддерживается — поле скрывается/показывается от siblingData. **Усилия:** S (использовать в Services для различения service-subtypes).
- **Documentation plugin.** Strapi community-плагин авто-генерирует OpenAPI docs на отдельном экране. **В Payload:** OpenAPI есть плагином `@payloadcms/plugin-rest-api` (для публичного API), но для contenт-docs (инструкция для оператора) — не подходит. **Не берём напрямую, но подход «docs как отдельный экран админки» — берём (см. Sanity Custom Tools).**
- **Custom fields и empty states.** Strapi v5 rebuild дал красивые empty states. **В Payload:** List view custom component можно переопределить (через `admin.components.views.list`) → сделать дружественный empty state с CTA. **Усилия:** M.

### 5. Webflow CMS

- **Inline tutorial videos.** При клике на `?` рядом с блоком открывается overlay с 30-секундным видео. **В Payload:** можно повторить через `admin.description` как custom React-компонент + видео-модалка. **Осторожно:** записать/хранить 10+ видео — большой content-overhead. Предпочтительно — 3-5 ключевых сценариев, остальное — текст. **Усилия:** L (контент-продакшн, не код).
- **Контекстные hints в списке коллекций.** Над каждым списком — blurb «Что это и когда использовать». **В Payload:** кастом `admin.components.beforeList` — React-компонент перед списком в List view. **Усилия:** S (но нужен контент).
- **Webflow University overlay.** Docs в iframe поверх админки. **В Payload:** аналог — custom view `/admin/docs/*` с MDX. Избыточно делать overlay, простой route проще. **Не берём overlay, берём route.**

### 6. WordPress Gutenberg

- **Welcome Guide modal.** Появляется при первом заходе на editor, dismissible, сохраняется в user meta. 4-5 слайдов с картинками. **В Payload:** реалистично — custom Dashboard component, читает `user.hasSeenWelcome`, показывает модалку, пишет `true` через `users` update. **Усилия:** M (самая дешёвая из «product tour»-альтернатив).
- **Tooltips через `@wordpress/components`.** Унифицированный tooltip-компонент поверх всего UI. **В Payload:** аналог — `Popover` из Radix + обёртка, вызываемая из `admin.description` как React-компонент. **Усилия:** S (при условии что ui-библиотека выбрана в US-3).
- **Help panel справа (deprecated в пользу field-level).** WP сам отказывается от глобального help — явный сигнал что inline-подсказки выигрывают у «help-кнопки сверху». **Вывод:** в US-3 не делаем отдельную Help-панель, делаем inline field descriptions + Dashboard walkthrough + docs-route.

---

## Топ-5 паттернов к имплементации в Payload 3

Ранжировано по отношению «impact / усилия» для single-user Обихода. Feasibility в Payload 3 — предварительно, верифицирует `be4`.

### 1. Field `admin.description` — тотальный pass по всем schemas (Sanity-стиль)

- **Что:** на каждом поле в `site/collections/*.ts` и `site/globals/*.ts` обязательное человекочитаемое описание: что это, зачем, пример, где появится на сайте. Для критичных полей — React-компонент с форматированием (bold, ссылка на docs-view).
- **Почему первым:** это буквально то, о чём оператор попросил («отдельный файл с понятной инструкцией» — мы делаем лучше: инструкция in-place, рядом с полем). Дешевле всех остальных. Снимает 60%+ боли по моей оценке.
- **Feasibility в Payload 3:** нативно. `field.admin.description` принимает `string | Record<string,string> | React.FC`. Требует `'use client'` если React-компонент.
- **Усилия:** S (1-2 дня копирайта + ревью оператором). Контент пишет `ba` совместно с оператором, `be4` вшивает.
- **Риски:** multi-language description — у нас только ru, риск нулевой.

### 2. Custom Dashboard с walkthrough-tile'ами (afterDashboard / replace Dashboard)

- **Что:** главная страница `/admin` — не дефолтный список коллекций, а 6 больших tile'ов-сценариев: «Добавить район», «Обновить цену», «Опубликовать кейс», «Заменить баннер», «Добавить услугу», «Новый лендинг». Клик → deep-link на нужную форму. Под tile'ами — чеклист-статус («заведено районов: 3/15», «услуг с ценой: 4/4», «кейсов опубликовано: 0 — добавь первый»).
- **Почему:** закрывает «что делать тупо» на уровне entry-point. Превращает абстрактную админку в список операций.
- **Feasibility в Payload 3:** `admin.components.beforeDashboard` / `afterDashboard` — массивы custom React-компонентов вокруг дефолтного Dashboard. Для полной замены — `admin.components.views.dashboard`. Верификация `be4` — точное имя slot'а в 3.x.
- **Усилия:** M (1-2 дня: frontend + простые API-счётчики через `payload.count`).
- **Риски:** RSC vs 'use client' — Payload 3 admin требует клиентских компонентов для интерактива (importMap). Уже знакомая боль (learnings 2026-04-23).

### 3. Custom view `/admin/docs` — встроенный MDX-справочник (Sanity Custom Tool-стиль)

- **Что:** отдельный маршрут внутри админки со списком инструкций в MDX: «Как добавить район» (3 минуты чтения), «Как обновить цену» (2 мин), «Что такое SeoSettings», «Как работает preview», «Как drafts/versions», «Частые ошибки». Линк из sidebar + ссылки из `admin.description`.
- **Почему:** это и есть «отдельный файл с понятной инструкцией» из цитаты оператора, но **внутри админки**, версионируемый в Git, обновляемый вместе с схемой. Решает проблему рассинхрона docs и кода.
- **Feasibility в Payload 3:** кастомные views регистрируются через `admin.components.views` или через `routes` (Payload 3 App Router). `be4` проверяет — можно ли смонтировать Next.js route `/admin/docs/[slug]` как часть Payload admin бандла (с тем же layout/sidebar). Фоллбэк — отдельная Next-страница `/docs` (не под `/admin`) с basic-auth.
- **Усилия:** M (1 день инфраструктура + 2-3 дня MDX-контент от `ba`/`ux`).
- **Риски:** может потребовать отдельной страницы вне `/admin` если Payload 3 не даёт удобно вкрутить custom route внутрь. Фоллбэк — acceptable.

### 4. Empty states с CTA (Strapi 5-стиль) — `beforeList` + кастомный List view

- **Что:** на пустой коллекции (0 записей) — не «No results», а panel с: заголовком «У тебя пока нет районов», описанием «Районы нужны для programmatic SEO и форм», кнопкой «Создать первый район», ссылкой на docs.
- **Почему:** оператор будет первую неделю видеть 6 пустых коллекций — empty state превращает тупики в follow-up-CTA.
- **Feasibility в Payload 3:** `admin.components.beforeList` + condition «если count === 0» → custom React-компонент. Либо override всего List view.
- **Усилия:** S-M (1 день на 6 коллекций при переиспользовании одного компонента с пропсами).
- **Риски:** минимум.

### 5. Welcome Guide modal (Gutenberg-стиль, dismissible)

- **Что:** при первом входе — 4 слайда с картинками: (1) «Это админка Обихода», (2) «Навигация: где что лежит», (3) «Как опубликовать первую страницу», (4) «Где docs и preview». Dismiss → `user.hasSeenWelcome = true`.
- **Почему:** для single-user показывается ровно один раз, но закрывает «паника при первом входе». Дёшево относительно полноценного product tour.
- **Feasibility в Payload 3:** custom field `hasSeenWelcome: boolean` на `Users`, `afterDashboard` компонент читает и показывает модалку, при dismiss — patch через REST/Local API.
- **Усилия:** M (1-1.5 дня + картинки от `art`).
- **Риски:** картинки = extra dependency на `art`, можно стартовать без них (текст only).

---

## Соблазнительный, но пропускаем — Product Tour (Contentful/intro.js-стиль)

- **Что:** spotlight+tooltip walkthrough поверх UI, шаги привязаны к DOM-селекторам.
- **Почему соблазнительно:** визуально впечатляет, «как у больших».
- **Почему пропускаем:**
  - Окупается при multi-user onboarding (новые контент-менеджеры приходят в команду). У Обихода **один оператор** (явно зафиксировано в intake, вопрос 3 — ACL не усложняем).
  - Привязка к DOM-селекторам → **хрупко при любых изменениях админки** (а мы как раз будем её перестраивать 2-3 недели). Каждая правка UX ломает тур.
  - Библиотеки (`driver.js`, `shepherd.js`) — +40-60кб в admin bundle, RSC-несовместимы, нужно тащить как client-only.
  - Альтернативы выше (Welcome Guide + Dashboard walkthrough + docs-route) покрывают 90% пользы при 30% усилий.

**Рекомендация:** отложить до момента, когда админкой начнут пользоваться 2+ человек (US-N в будущем).

---

## Сводная таблица усилий топ-5

| # | Паттерн | Payload 3 feasibility | Усилия | Owner-код | Owner-контент |
|---|---|---|---|---|---|
| 1 | Field `admin.description` pass | нативно | S | be4 | ba + оператор |
| 2 | Custom Dashboard walkthrough | нативно (beforeDashboard / views.dashboard) | M | be4 + fe1 | ba + ux |
| 3 | `/admin/docs` MDX-view | вероятно нативно (custom view), проверить в Payload 3.x | M | be4 | ba + ux |
| 4 | Empty states с CTA | нативно (beforeList) | S-M | be4 | ba |
| 5 | Welcome Guide modal | нативно (afterDashboard + user custom field) | M | be4 + fe1 | ba + art (картинки) |

**Итого:** S + M + M + S-M + M = **~2 человеко-недели** на топ-5 при условии готового контента. Укладывается в оценку intake (2-3 недели полного цикла).

---

## Ограничения и открытые вопросы

- **Payload 3 docs были недоступны (429) на 2026-04-24.** Ключевые feasibility-утверждения по custom views и beforeDashboard API — из знаний re о Payload 3.x на момент cutoff + предыдущего опыта команды (US-2). **`be4` обязан верифицировать имена slot'ов и signatures** до подписания ba.md.
- **MDX внутри Payload admin bundle.** Next.js 16 + MDX совместим, но интеграция внутрь `/admin` route group требует проверки на конфликты с Payload 3 own routing. Фоллбэк — `/docs` отдельным route.
- **Контент (текст подсказок, MDX-статьи, картинки welcome)** — не покрыт этим отчётом, это следующий уровень: после того как `ba` зафиксирует структуру, нужен отдельный тикет на copy-writing (`cw`) + визуал (`art`).

---

## Рекомендации ba (что тянуть в ba.md)

1. **Обязательно включить как acceptance criteria:**
   - каждое поле во всех 7 коллекциях и 2 globals имеет `admin.description` (не пустое, не техническое)
   - Dashboard заменён на walkthrough-tiles с 6 сценариями
   - существует `/admin/docs` (или fallback `/docs` под basic-auth) с минимум 6 статьями-инструкциями
   - empty state у всех коллекций — с CTA и ссылкой на docs
   - Welcome Guide показывается при первом входе, dismissible, persist в User
2. **Явно отметить OUT of scope в ba.md:** Product Tour в стиле Contentful/intro.js (отложен до multi-user).
3. **Зависимость от `be4`:** до фиксации AC — 2-часовая верификация Payload 3 API (custom views, beforeDashboard, user custom fields, importMap implications).
4. **Зависимость от контента:** 1 контент-спринт после ba.md — `cw` + `ux` пишут MDX-статьи и тексты description; без контента все компоненты пустые.
