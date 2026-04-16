# CLAUDE.md — Обиход

## Что это

Проект запуска сайта **«Обиход»** — комплексный подрядчик 4-в-1 (арбористика + чистка
крыш от снега + вывоз мусора + демонтаж) для Москвы и МО. B2C (частные дома, дачи) +
B2B (УК, ТСЖ, FM-операторы, застройщики, госзаказ).

**Главная цель сайта:** приносить квалифицированные заявки — форма + калькуляторы +
«фото → смета за 10 минут» → amoCRM → бригадир. Метрики успеха — в
[contex/02_growth_gtm_plan.md](contex/02_growth_gtm_plan.md).

## Immutable: не обсуждается, пока не решено иначе

Зафиксировано стратегическими артефактами. **Не меняй без явного запроса оператора в
текущей сессии.**

| Что | Значение | Источник |
|---|---|---|
| Бренд | **ОБИХОД** (кириллица) | [03_brand_naming.md](contex/03_brand_naming.md) |
| Позиционирование | «Порядок под ключ» | там же |
| Архетип | Caregiver + Ruler | там же |
| Ключевой оффер | Фикс-цена за объект + смета за 10 мин по фото | там же |
| B2B-крючок | Штрафы ГЖИ/ОАТИ берём на себя по договору | там же |
| География 1-й волны | Одинцово, Красногорск, Мытищи, Химки, Истра, Пушкино, Раменское | там же |
| TOV | Серьёзный без казёнщины, деловой с тёплыми вкраплениями, matter-of-fact | там же |
| Vocabulary Do | «обиход», «хозяйство», «объект», «порядок», «сделаем», «приедем», «12 800 ₽ за объект» | там же |
| Vocabulary Don't | «услуги населению», «имеем честь», «от 1 000 ₽», «в кратчайшие сроки», «индивидуальный подход» | там же |
| Каналы коммуникации с клиентом | **Telegram + MAX + WhatsApp** (Wazzup24) + телефон | этот файл |
| Хостинг | **Beget (VPS/Cloud)** на старте; YC/Selectel при росте B2B-SLA | этот файл + [04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md) |

Любой копирайт и коммуникация — через фильтр TOV из
[03_brand_naming.md](contex/03_brand_naming.md).

## Структура проекта

```
obikhod/
├── agents/          # 25 ролевых AI-агентов-промптов (Opus, русский)
├── contex/          # Стратегические артефакты (нумерация 01_, 02_, …)
├── site/            # Код сайта (Next.js 16)        — TODO, пока нет
├── content/         # Копия/тексты для лендингов (MDX/JSON) — TODO
├── assets/          # Медиа: фото объектов, видео-кейсы, логотипы — TODO
└── CLAUDE.md        # Этот файл
```

**Правила файлов:**
- Новые стратегические артефакты → в `contex/` с номером `05_…`, `06_…` по порядку
- Не переименовываем `contex/` → `context/` пока оператор явно не попросит
- Не трогаем `agents/*.md` без явного запроса — это зафиксированные адаптированные роли
- Новых агентов добавляем в `agents/` по шаблону существующих
  (Role / Model Tier / Capabilities / Prompt Template / Integration)

## Агенты проекта

### Существующие (25 в `agents/`, адаптированы под домен Обихода)

| Категория | Агенты |
|---|---|
| Стратегия / продукт | [cpo.md](agents/cpo.md), [product-strategist.md](agents/product-strategist.md), [product-analyst.md](agents/product-analyst.md), [pricing-strategist.md](agents/pricing-strategist.md), [ba.md](agents/ba.md) |
| Рост / маркетинг / контент | [growth-marketing-strategist.md](agents/growth-marketing-strategist.md), [seo-expert.md](agents/seo-expert.md), [landing-page-specialist.md](agents/landing-page-specialist.md), [copywriter.md](agents/copywriter.md) |
| Дизайн / UX | [ux.md](agents/ux.md), [designer.md](agents/designer.md) |
| Аналитика / ресёрч / данные | [data-analyst.md](agents/data-analyst.md), [analytics-engineer.md](agents/analytics-engineer.md), [research-analyst.md](agents/research-analyst.md), [poisk dannih.md](agents/poisk%20dannih.md) |
| Tech / архитектура / разработка | [cto.md](agents/cto.md), [frontend-developer.md](agents/frontend-developer.md), [backend-developer.md](agents/backend-developer.md), [tech-seo.md](agents/tech-seo.md), [devops.md](agents/devops.md) |
| Качество / оппоненты / право | [qa-engineer.md](agents/qa-engineer.md), [quality-partner.md](agents/quality-partner.md), [devils-advocate.md](agents/devils-advocate.md), [legal-advisor.md](agents/legal-advisor.md) |
| Delivery | [project-manager.md](agents/project-manager.md) |

Все 25 — Model Tier **Opus**. В каждом в Prompt Template прописана обязательная сверка
с этим CLAUDE.md и актуальными `contex/*.md`.

### Возможны в будущем (за скоупом текущего CLAUDE.md)

При расширении проекта в операционку: `content-manager`, `smm-manager`,
`integration-specialist` (если backend-developer перегружен), `brand-designer`
(если `designer` не тянет CIP), `sales-sdr`, `operations-manager`, `hr-recruiter`,
`finance-manager` (пересоздать на сервисной модели, без финтех-наследия).

## Technology Stack (утверждено)

**Обоснование выбора** — разведка топ-13 конкурентов из
[04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md):

- 54% на WordPress/Bitrix, 23% MODX, 23% самописное PHP (Yii, legacy)
- **0 из 13** используют современный JS-стек
- У половины PHP 5.6–7.4, jQuery 1.10 — слабые Core Web Vitals
- Интерактивных калькуляторов нет ни у кого — подтверждает инсайт из
  [01_competitor_research.md](contex/01_competitor_research.md)

Для Обихода это **окно возможностей** через кастомный современный стек.

### Stack

```
Frontend:    Next.js 16 (App Router, RSC, Turbopack)
             TypeScript strict, Tailwind, shadcn/ui
             react-hook-form + Zod для форм
             собственный uploader для фото (S3-совместимый)

CMS:         Payload CMS 3 (self-hosted, embed в Next.js)
             Коллекции: Services, Districts, LandingPages,
                        Cases, Blog, Prices, FAQ, Leads

БД:          PostgreSQL 16

Хостинг:     Beget (VPS или Cloud) — MVP
             Beget S3 (медиа) + Beget CDN + Let's Encrypt
             Миграция на Yandex Cloud / Selectel — при росте B2B-SLA
             РФ-юрисдикция, 152-ФЗ compliant

Интеграции:  amoCRM (webhooks заявок)
             Telegram Bot API — основной канал (бесплатно, 95% аудитории)
             MAX Bot API (VK, экс-TamTam) — РФ-альтернатива, второй приоритет
             Wazzup24 (WhatsApp Business API) — для старшей B2C-аудитории
             Calltouch или CoMagic (колтрекинг, подмена номеров)
             Яндекс.Метрика + Вебмастер + Карты (виджет)
             Sentry (ошибки)

AI-pipeline: Claude API (Sonnet 4.6) — черновик сметы по фото
             → amoCRM комментарий → бригадир подтверждает → клиенту
             Prompt caching обязательно (skill `claude-api`)

CI/CD:       GitHub Actions → деплой на Beget
             Preview deploys для PR
```

**Почему Beget, а не Vercel/YC на старте:** цена ×5-10 ниже YC, РФ-юрисдикция без
вопросов, Node.js + Postgres + S3 + CDN в одной панели. Vercel — проблемы с оплатой
из РФ и юрисдикцией ПДн. YC/Selectel экономически оправданы только при B2B-контрактах
с SLA-требованиями.

**Почему не Astro:** калькуляторы state-heavy; в РФ найм на Next.js кратно проще.

**Почему Payload, а не Strapi/Directus:** единый TypeScript с Next, admin на React,
embed в Next-приложение.

Детальное обоснование и бюджет TCO — в `contex/04_competitor_tech_stacks.md` и будущем
`contex/05_tech_stack_decision.md` (создать при старте разработки).

## Правила работы Claude в проекте

### Язык

Русский — ответы, комментарии, сообщения коммитов по документации.
Код, identifiers, технические сообщения — английский.
Подтверждает глобальное правило в `~/.claude/CLAUDE.md`.

### Автовызов навыков

Перед началом задачи вызывать релевантные skills из `~/.claude/skills/`:

| Контекст задачи | Skills |
|---|---|
| Next.js / React / фронт | `frontend-patterns`, `frontend-design`, `nextjs-turbopack`, `ui-styling` |
| UI/UX решения | `ui-ux-pro-max`, `accessibility`, `design-system` |
| Бэкенд / API / БД | `backend-patterns`, `api-design`, `postgres-patterns`, `database-migrations` |
| Формы / калькуляторы / CRO | `frontend-patterns` + агент `landing-page-specialist` (планируется) |
| SEO | `seo` + агент [seo-expert](agents/seo-expert.md) |
| Claude API (фото → смета) | `claude-api` — **обязателен prompt caching** |
| Тексты под TOV | сначала [03_brand_naming.md](contex/03_brand_naming.md) → потом писать |
| Деплой / CI / Docker | `docker-patterns`, `deployment-patterns`, `github-ops` |
| Безопасность | `security-review`, `security-scan` |
| Тестирование | `tdd-workflow`, `e2e-testing`, `browser-qa` |

### Приоритет источников контекста

1. **Этот файл (CLAUDE.md)** — рамки, стек, TOV, правила
2. **`contex/*.md`** — зафиксированные стратегические решения
3. **`agents/*.md`** — роли для глубокой экспертизы при необходимости
4. Код и конвенции — по факту появления `site/`

### Поведение

- **Не предлагай Tilda/WordPress/Bitrix** — это шаг назад против конкурентов, см.
  [04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md)
- **Не меняй бренд/TOV/оффер/стек** без ссылки на явный запрос оператора в текущей
  сессии
- **Новые стратегические документы** — только в `contex/` с префиксом по порядку
- **Уточняй перед реализацией**, если задача затрагивает immutable-блок
- **Каждое не-очевидное решение** — с ссылкой на источник (артефакт, ресёрч, агент)
- **Финтех-контекст запрещён в агентах.** Агенты адаптированы под домен Обихода; если
  найдёшь финтех-след (банк/брокер/ЦБ РФ/KYC/AML и т.п. в содержательном контексте) —
  это баг, зафиксируй и поправь

## Roadmap сайта (высокоуровневый, 10 недель)

| Неделя | Фаза | Итог |
|---:|---|---|
| 1-2 | Дизайн-система + модель Payload + скелет | 1 посадочная, 1 калькулятор |
| 3-4 | 4 калькулятора + форма «фото → смета» + Telegram/MAX-боты | заявки идут |
| 5-6 | amoCRM webhook + колтрекинг + Я.Метрика цели | цикл заявки замкнут |
| 7 | Programmatic SEO: 4 × 15 районов = 60+ посадочных | URL-база готова |
| 8 | CWV + тех-SEO аудит + Я.Вебмастер | Lighthouse 90+ |
| 9 | Блог + 10 seed-статей + видео-кейсы | контент-SEO база |
| 10+ | Директ-посадочные + A/B-тесты + B2B-кабинет | рост |

## Открытые вопросы

- [ ] Сохранить решение по стеку как `contex/05_tech_stack_decision.md` (TCO, альтернативы)
- [ ] Переименовать `contex/` → `context/` (косметика, не срочно)
- [ ] Подтверждение ТМ «ОБИХОД» у патентного поверенного
      (из [03_brand_naming.md](contex/03_brand_naming.md))
- [ ] Домен: проверить и купить (`obihod.ru`, `obixod.ru`, `obihod-servis.ru` и т.д.)
- [ ] Юрлицо / СРО / лицензия Росприроднадзора — чеклист в
      [01_competitor_research.md](contex/01_competitor_research.md) раздел 5
- [ ] amoCRM / Wazzup24 / Calltouch — завести аккаунты при старте разработки
