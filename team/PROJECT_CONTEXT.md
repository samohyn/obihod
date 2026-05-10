# PROJECT_CONTEXT.md — Обиход

> ⚠️ **Файл частично устарел (last full sync 2026-04-29).** После реструктуризации
> 42→10→9 ролей (2026-05-08 + 2026-05-09 shop sunset, ADR-0020) приоритет
> source-of-truth: **[CLAUDE.md](../CLAUDE.md) > [WORKFLOW.md](WORKFLOW.md) >
> этот файл**. Магазин (`apps/shop/`) выведен из проекта 2026-05-09. Landshaft —
> 5-й pillar услуг (не extension). Полный rewrite этого файла — backlog item.

Единый источник контекста для **9 ролей** Scrum-команды. Агенты ссылаются на
этот файл (с учётом deprecations выше). Структура команды и релиз-цикл — в
[WORKFLOW.md](WORKFLOW.md).

---

## 1. Что мы строим

**«Обиход»** — комплексный подрядчик 5-в-1 для Москвы и Московской области:

- арбористика (спил, обрезка, кронирование, валка, альпинизм, каблинг, корчёвка);
- чистка крыш от снега и наледи;
- вывоз мусора (в т.ч. порубочных остатков, строительного мусора);
- демонтаж построек, расчистка и выравнивание участков;
- дизайн ландшафта (проект участка, планировка, посадка с гарантией приживаемости).

**Аудитория:** B2C (частные дома, дачи) + B2B (УК, ТСЖ, FM-операторы, застройщики,
госзаказ).

**Сайт:** https://obikhod.ru (живой prod).

> Магазин саженцев и растений выведен из проекта 2026-05-09 (ADR-0020).
> Landshaft — 5-й pillar услуг.

**Главная цель сайта:** квалифицированные заявки → amoCRM → бригадир. Воронка: форма
+ 4 калькулятора + «фото → смета за 10 минут».

---

## 2. Immutable-рамки (не меняем без явного запроса оператора)

Источник — [CLAUDE.md](../CLAUDE.md) § Immutable и
[contex/03_brand_naming.md](../contex/03_brand_naming.md).

| Блок | Значение |
|---|---|
| Бренд | **ОБИХОД** (кириллица) |
| Позиционирование | «Порядок под ключ» |
| Архетип | Caregiver + Ruler |
| Оффер | Фикс-цена за объект + смета за 10 минут по фото |
| B2B-крючок | Штрафы ГЖИ/ОАТИ берём на себя по договору |
| TOV | Серьёзный без казёнщины, деловой с тёплыми вкраплениями, matter-of-fact |
| Do | «обиход», «хозяйство», «объект», «порядок», «сделаем», «приедем», «12 800 ₽ за объект» |
| Don't | «услуги населению», «имеем честь», «от 1 000 ₽», «в кратчайшие сроки», «индивидуальный подход» |
| Каналы | **Telegram + MAX + WhatsApp** (Wazzup24) + телефон |
| Хостинг | **Beget VPS** (45.153.190.107, 2×CPU/2GB), миграция на YC/Selectel при B2B-SLA |

Любой копирайт проходит через TOV-фильтр из `contex/03_brand_naming.md`. Анти-TOV
слова блокируются хуком `.claude/hooks/protect-immutable.sh`.

---

## 3. Стек (утверждён, ADR необязателен)

Источник — [CLAUDE.md](../CLAUDE.md) § Technology Stack,
[contex/04_competitor_tech_stacks.md](../contex/04_competitor_tech_stacks.md).

```
Frontend:    Next.js 16 (App Router, RSC, Turbopack)
             TypeScript strict, Tailwind, shadcn/ui
             react-hook-form + Zod, собственный photo-uploader

CMS:         Payload CMS 3 (self-hosted, embed в Next.js), admin на /admin
             Коллекции (факт в site/collections/):
               - Контент: Services, Districts, ServiceDistricts,
                          Cases, Blog, Persons (авторы-эксперты, E-E-A-T),
                          B2BPages
               - CRM:     Leads (access admin/manager)
               - Служебные: Redirects, Media, Users
             Globals:   SeoSettings
             Rich-text: Lexical (@payloadcms/richtext-lexical)
             Фичи:      drafts+autosave(2s) на Services;
                        versions drafts на ServiceDistricts;
                        гейт beforeValidate на ServiceDistricts —
                        publish только при наличии miniCase (Case из района)
                        и ≥ 2 localFaq (защита от Scaled Content Abuse)
             FAQ и Prices — встроены в Services (faqGlobal[], priceFrom/
                        priceTo/priceUnit/subServices[]) + localFaq[] в
                        ServiceDistricts; отдельных FAQ/Prices коллекций НЕТ
             Header/Footer: **не в админке**, захардкожены в компонентах
                        components/marketing/Header.tsx и Footer.tsx.
                        Требуется завести global Navigation или пары
                        globals Header+Footer — иначе оператор не
                        редактирует меню, телефон, слоган через CMS

БД:          PostgreSQL 16

Хостинг:     Beget (VPS) + Beget S3 (медиа) + Beget CDN + Let's Encrypt
             РФ-юрисдикция, 152-ФЗ compliant

Интеграции:  amoCRM (webhooks)
             Telegram Bot API — основной канал
             MAX Bot API (VK, экс-TamTam) — РФ-альтернатива
             Wazzup24 (WhatsApp Business API) — старшая B2C-аудитория
             Calltouch / CoMagic (колтрекинг, подмена номеров)
             Яндекс.Метрика + Вебмастер + Карты
             Sentry

AI-pipeline: Claude API (Sonnet 4.6) — черновик сметы по фото
             → amoCRM комментарий → бригадир подтверждает → клиенту
             Prompt caching обязательно (skill `claude-api`)

CI/CD:       GitHub Actions (ci.yml + deploy.yml), PM2 + nginx на VPS
             GitHub: samohyn/obihod (private)
             Автодеплой: push main → build → rsync → PM2 reload
```

**Резерв (не активировать без ADR от `tamd`):** отдельные Go-микросервисы на
случай выделения очередей (фото→смета), биллинга B2B, интеграции с 1С. Пока
весь backend живёт внутри Next.js API routes + Payload (`be-site` для сайта
услуг, `be-shop` для магазина, `be-panel` для admin/коллекций — все TypeScript).

**Ownership Payload-коллекций:** **team `panel/`** — единственный owner. Схему
коллекций (`site/payload.config.ts`) и миграции ведут `be-panel` + `dba` (из
`common/`). Команды `product/` (сайт услуг) и `shop/` (магазин) читают данные
через **Payload Local API** и НЕ правят схему. Любое изменение коллекций — через
`popanel` + ADR `tamd`.

**Запрещено предлагать:** Tilda, WordPress, Bitrix, MODX, Yii (см.
[contex/04_competitor_tech_stacks.md](../contex/04_competitor_tech_stacks.md) —
это шаг назад против конкурентов).

---

## 4. Каталог услуг (источник истины)

Основа контент-плана, programmatic-страниц, калькуляторов, семантического ядра.
Полный список — в [team/README — legend.md](README%20%E2%80%94%20legend.md).
Кластеры для SEO:

### Арбористика — спил и удаление
- Спил деревьев в Москве и МО
- Вырубка деревьев
- Удаление деревьев (с завешиванием частей, на кладбищах, под ЛЭП)
- Спил сухих / старых деревьев
- Спил деревьев с автовышки
- Валка деревьев частями и целиком
- Спил и обрезка деревьев альпинистами
- Безопасный спил на собственном участке
- Спиливание во дворах
- Профессиональная вырубка ёлок

### Арбористика — обрезка и кронирование
- Кронирование (берёза, клён, тополь, хвойные)
- Санитарная / декоративная / омолаживающая обрезка
- Обрезка высоких деревьев, веток
- Каблинг — укрепление деревьев растяжками

### Пни и остатки
- Удаление пней (дробление и выкорчёвывание)
- Измельчение веток и кустарников
- Вывоз порубочных остатков на полигоны МО

### Участок
- Расчистка от деревьев / кустарников / поросли
- Раскорчёвка
- Уборка дачного участка (мусор, поросль, бурьян)
- Покос / стрижка травы
- Выравнивание участка
- Вырубка леса под строительство
- Ландшафтный дизайн / индивидуальный заказ

### Крыши и снег
- Чистка крыш от снега и наледи
- Уборка территории от снега
- Зимняя уборка территории

### Мусор и демонтаж
- Вывоз мусора под ключ
- Снос дачных построек и строений

### Документы и техника
- Получение порубочного билета
- Аренда техники (измельчители порубочных остатков и пней, минитрактор, самосвал)
- Промышленный альпинизм

---

## 5. География

Источник — [team/README — legend.md](README%20%E2%80%94%20legend.md) §85,
[CLAUDE.md](../CLAUDE.md) § Immutable.

**Пилотная волна (приоритет posadочных и SEO):** Одинцово, Красногорск, Мытищи,
Химки, Истра, Пушкино, Раменское.

**Второй эшелон (первая программная волна, проверка шаблона service × district):**
Жуковский (пара с Раменским), Домодедово, Подольск, Королёв, Балашиха.

**Полное покрытие (programmatic SEO, ~74 локации):** Апрелевка, Балашиха,
Бронницы, Видное, Власиха, Волоколамск, Воскресенск, Голицыно, Дзержинский,
Дмитров, Долгопрудный, Домодедово, Дубна, Егорьевск, Железнодорожный, Жуковский,
Зарайск, Звёздный Городок, Звенигород, Зеленоград, Ивантеевка, Истра, Кашира,
Климовск, Клин, Коломна, Королёв, Краснознаменск, Красноармейск, Красногорск,
Ленинский, Лобня, Лосино-Петровский, Лотошино, Лыткарино, Луховицы, Люберцы,
Малаховка, Можайск, Молодёжный, Мытищи, Наро-Фоминск, Ногинск, Одинцово, Озёры,
Орехово-Зуево, Павловский Посад, Протвино, Подольск, Пушкино, Пущино,
Раменский район, Реутов, Рошаль, Руза, Сергиев Посад, Серебряные Пруды, Серпухов,
Солнечногорск, Софрино, Ступино, Талдом, Троицк, Фрязино, Химки, Хотьково, Чехов,
Шаховская, Шатура, Щёлково, Электросталь, Яхрома.

**Правило расширения:** пилот (7) → второй эшелон (5) → полное покрытие. Порядок
определяет `seo-content` по спросу и конкуренции. `poseo` согласовывает с
оператором (через `cpo`).

---

## 6. Конкуренты (где воюем за позиции)

Источник — [contex/01_competitor_research.md](../contex/01_competitor_research.md),
[contex/04_competitor_tech_stacks.md](../contex/04_competitor_tech_stacks.md).

**Приоритетные (не считая агрегаторов avito.ru / profi.ru):**
- https://spilservis.ru/
- https://www.arborist.su/
- https://arboristik.ru/
- https://bratiya-lesoruby.ru/
- https://www.liwood.ru/

**Ключевые наблюдения:**
- 54% топ-13 на WP/Bitrix, 23% MODX, 23% самописное PHP. 0 из 13 — современный JS-стек.
- У половины PHP 5.6–7.4, jQuery 1.10 — слабые Core Web Vitals.
- **Ни у одного конкурента нет интерактивных калькуляторов** — это окно
  возможностей для Обихода.

---

## 7. Инфраструктура (состояние на 2026-04-22)

Источник — [.claude/memory/handoff.md](../.claude/memory/handoff.md), [deploy/README.md](../deploy/README.md).

- **GitHub:** `samohyn/obihod` (private)
- **VPS:** 45.153.190.107 (2×CPU, 2GB, swap настроен, Node 22, pnpm 10.33, PM2,
  Postgres 16, nginx, Let's Encrypt)
- **Домен:** obikhod.ru (живой, сайт online через PM2 процесс `obikhod`)
- **CI:** `.github/workflows/ci.yml` — type-check + lint + format + build +
  Playwright (chromium + mobile-chrome), кеш `.next/cache` и Playwright browsers
- **Deploy:** `.github/workflows/deploy.yml` на `push: branches: [main]`,
  пакуем `node_modules` + runtime-файлы на runner (2GB на VPS мало для
  `pnpm install`), `pm2 delete + pm2 start --cwd current`, smoke на
  `/api/health?deep=1`
- **Health:** `/api/health` (базовый) + `/api/health?deep=1` (Payload DB ping)
- **Security audit:** `.github/workflows/security-audit.yml` (Mon 08:00 MSK,
  `pnpm audit` → issue на high/critical)
- **Backups:** `/usr/local/bin/obikhod-backup.sh` + cron 03:00 MSK
  (daily×7 + weekly×4, `/var/backups/obikhod/`)
- **Логи:** pm2-logrotate 10M×7 + compress, systemd autostart для pm2

**Известные блокеры:**
- БД на prod **пустая**, seed не прогонялся → `/arboristika/` и programmatic-роуты
  возвращают 404. Блокер публичного запуска.
- Схема на prod залита одноразово через `pg_dump --schema-only`. **TODO** —
  переход на Payload migrations перед вторым релизом схемы.
- Branch protection отложен: private repo на GitHub Free не поддерживает. Варианты:
  сделать repo публичным либо GitHub Pro $4/мес.

---

## 8. Управление проектом

- **Внешний task-tracker не используется** (Linear отключён 2026-04-29 — см.
  [adr/ADR-0008-drop-linear-task-tracker.md](adr/ADR-0008-drop-linear-task-tracker.md)).
  Единственный источник истины задачи — папка [`specs/`](../specs/) на корне
  репо (вынесена из `team/` 2026-04-29). Структура:
  - `specs/EPIC-<N>-<slug>/US-<N>-<slug>/` — для US внутри крупной программы
    (обязательно `EPIC-<N>-<slug>/README.md` с целью эпика и составом US).
  - `specs/TASK-<DOMAIN>-AD-HOC/US-<N>-<slug>/` — для одиночных задач
    (bugfix, разовый ops, content-правка). Допустимые `<DOMAIN>`: `INFRA`,
    `CONTENT`, `SEO`, `PANEL`, `SHOP`, `SITE`, `DESIGN`, `OPS`.
  - Артефакты внутри каждой US-папки: `intake.md`, `ba.md`, `sa-<team>.md`,
    `qa-<team>.md`, `cr-<team>.md`.
  - Исторические US (US-1..US-12, OBI-19, PAN-9, admin-visual) остаются
    плоским списком в `specs/` без EPIC-обёртки — archeological data.
- **Беклог + приоритизация:** `team/backlog.md` (cross-team таблица: id, title,
  команда, PO, priority, status, deps). Ведут `cpo` (cross-team) и PO команд
  (внутри своих секций).
- **Owner задачи:** всегда оператор (фаундер). Роль, ведущая текущую фазу,
  фиксируется в frontmatter артефакта (`role:` поле). Hand-off — строкой в
  секции `## Hand-off log` внутри артефакта.
- **Фазы:** `phase:` поле frontmatter — меняется при hand-off. Релиз-цикл:
  `intake → spec → design → dev → qa → review → gate (release) → verify
  (leadqa) → release`.
- **Gate перед оператором:** двухступенчатый — `release` (RC + checklist) →
  `leadqa` (verify локально). `do` НЕ деплоит без апрува оператора.
- **Входная точка:** `in` → всегда. Оператор не пишет напрямую исполнителям.
  Sticky agent sessions: `@<code>` / `/<code>` / «`<code>`, …» — деталь в
  [WORKFLOW.md](WORKFLOW.md) §5.4.
- **Модель:** все 42 роли работают на `opus-4-7` с `reasoning_effort: max`.
- **Параллельная работа:** в каждой команде разработки **по одному инженеру**
  на роль (`fe-site`, `be-site`, `qa-site`, `cr-site` и т. п.). PO команды
  координирует свою команду; `cpo` — кросс-команда. Если задача требует
  ускорения — `cpo` через PO команды подключает shared-инженера из `common/`
  или временно из соседней команды (фиксируется в frontmatter `role:` +
  комментарий «temporary cross-team»).

---

## 8.5. Ветки и merge train

```
main (prod)
 ├── design/integration   (lead: art)      design-system/, токены
 ├── shop/integration     (lead: poshop)   apps/shop/**
 ├── panel/integration    (lead: popanel)  site/payload.config.ts,
 │                                         app/(payload)/admin/**
 └── product/integration  (lead: podev)    фича-ветки сайта услуг
```

Команды `business/`, `common/`, `seo/` работают напрямую с `main` через короткие
фича-ветки + PR. **Owner merge train — `do`** (common/). Daily cron
`git fetch --all` + `git merge-tree` детектит конфликты на hot-paths
(`payload.config.ts`, `apps/shop/**`, `app/(payload)/admin/**`,
`design-system/**`, `package.json`, `pnpm-lock.yaml`) и заводит файл
`team/ops/merge-conflicts/<YYYY-MM-DD>-<branch>.md` с пингом двух
соответствующих PO команд напрямую через сообщение оператору.

**Merge order на main:** `design → panel → shop → product`. Дизайн-токены первыми
(база для всех), затем схема Payload (база для shop/product), затем магазин,
затем сайт услуг. Этот порядок обязан соблюдать `release` при подготовке RC из
нескольких integration-веток одновременно.

---

## 9. Roadmap сайта (высокоуровневый, 10 недель)

Источник — [CLAUDE.md](../CLAUDE.md) § Roadmap.

| Неделя | Фаза | Итог |
|---:|---|---|
| 1-2 | Дизайн-система + модель Payload + скелет | 1 посадочная, 1 калькулятор |
| 3-4 | 4 калькулятора + «фото → смета» + Telegram/MAX-боты | заявки идут |
| 5-6 | amoCRM webhook + колтрекинг + Я.Метрика цели | цикл заявки замкнут |
| 7 | Programmatic SEO: 4 × 15 районов = 60+ посадочных | URL-база готова |
| 8 | CWV + тех-SEO аудит + Я.Вебмастер | Lighthouse 90+ |
| 9 | Блог + 10 seed-статей + видео-кейсы | контент-SEO база |
| 10+ | Директ-посадочные + A/B-тесты + B2B-кабинет | рост |

---

## 10. Чего мы **не** делаем

- Не предлагаем Tilda / WordPress / Bitrix / MODX — шаг назад против конкурентов.
- Не меняем бренд / TOV / оффер / стек без ссылки на запрос оператора в текущей сессии.
- Не пишем финтех-контекст в агентах (банк / брокер / ЦБ РФ / KYC / AML) — это
  чужой домен, признак копирования из шаблона.
- Не коммитим `.env`, `*.key`, `credentials.json`, `secrets/` (блок хуком
  `protect-secrets.sh`).
- Не используем `rm -rf /`, force push на main, `git reset --hard`, `--no-verify`,
  `DROP TABLE` (блок хуком `block-dangerous-bash.sh`).
- Не пишем на английском в контенте сайта (русский; код и identifiers — английский).
- Не предлагаем Google как приоритет — Яндекс-first (поиск + нейро-выдачи),
  Google — вторичный рынок.
