# US-8: Фичи (калькулятор, формы, фото→смета) + интеграции с amoCRM

**Автор intake:** in
**Дата:** 2026-04-24
**Linear Issue:** [OBI-4](https://linear.app/samohyn/issue/OBI-4) (state: Backlog, labels: `Feature`, `P1`, project: EPIC SITE-MANAGEABILITY)
**Тип:** feature
**Срочность:** high (P1)
**Сегмент:** cross
**Связано с:** EPIC SITE-MANAGEABILITY (эпик №6 из 8)

---

## Исходный запрос оператора (2026-04-24)

> 6 - допиливаем фичи (калькулятор, формы итд) + делаем интеграции с crm

---

## Резюме запроса

Реализовать функциональные блоки сайта, которые превращают его из «визитки» в «заявочную воронку»:

1. **Калькулятор(ы)** — конфигурируемые через Payload (коэффициенты высоты/диаметра/доступа/спецтехники в CMS, не в коде), финальное решение по количеству (1 универсальный vs 4 отдельных) приходит из US-5.
2. **Форма «Фото → смета за 10 минут»** — загрузка 1–6 фото, адрес/район, услуга (предзаполняется из URL programmatic), телефон, мессенджер → Claude API (Sonnet 4.6) генерирует черновик сметы → amoCRM комментарий → бригадир подтверждает → клиенту через Wazzup24/Telegram-bot.
3. **Универсальная форма лида** (короткая и длинная версия) с Zod-валидацией, honeypot/hCaptcha, отправкой в amoCRM webhook + Leads collection.
4. **amoCRM интеграция** — webhook с дедупликацией по телефону, mapping полей, UTM + yclid + gclid в сделку, колтрекинг (Calltouch/CoMagic — одна из).
5. **Messenger-боты** — Telegram Bot + MAX Bot + Wazzup24 для WhatsApp, приём фото, триггер в Claude API, ответ клиенту.
6. **Колтрекинг + подмена номеров** — по каналу трафика (Директ/SEO/прямой) в SiteChrome.
7. **Я.Метрика + Я.Вебмастер цели** — все CTA, submit формы, phone-click, messenger-click, просмотр pricing.
8. **Sentry** — ошибки фронта и API.

## Открытые вопросы к оператору

1. **amoCRM** — создан ли аккаунт? Нужен ли `tamd` ADR на mapping полей, этапы воронки, роли менеджеров?
2. **Wazzup24** — оплачен? Телефон подключён? Claude API proxy через бэкенд или прямой коннект?
3. **Колтрекинг** — Calltouch или CoMagic? У них разные цены и API. Минимум ~5 000 ₽/мес + за номера.
4. **Claude API (Anthropic) доступ из РФ** — VPN/прокси-slave на VPS Beget? Или через Cloudflare AI Gateway? Нужен `tamd` ADR.
5. **hCaptcha vs reCAPTCHA** — hCaptcha работает из РФ без VPN, reCAPTCHA Google — частично блочится. Предлагаю hCaptcha. Согласен?
6. **Личный кабинет клиента** — в scope или backlog? UX предлагает, но это большое расширение.

## Предварительный бриф для BA

1. **Цель:** заявки идут, amoCRM наполняется, фото → смета работает.
2. **Метрики:**
   - SLA «фото → черновик сметы» ≤ 10 минут.
   - Дедупликация amoCRM — 100% (нет дублей по телефону/email).
   - CR формы главной ≥ 3% (цель Я.Метрики).
   - Sentry: 0 unhandled errors на critical path (submit формы, upload фото).
3. **Границы:**
   - IN: все 8 пунктов резюме.
   - OUT: CRM-настройка внутри amoCRM (делает оператор/менеджер); внешние рекламные кабинеты (Я.Директ, VK); B2B-кабинет в полноценном формате (backlog).
4. **Состав команды:**
   - `ba` — scope + AC
   - `sa` — архитектура (где Claude API-слой, как кешируем prompt, как деплоим без прокси)
   - `tamd` — ADR на Claude API proxy, ADR на amoCRM mapping, ADR на колтрекинг
   - `fe1` + `fe2` — формы, калькулятор, загрузчик фото, Я.Метрика события
   - `be3` — Claude API wrapper (с prompt caching, skill `claude-api` обязателен), amoCRM webhook, Leads collection mutations
   - `be4` — Payload-поля для калькулятора (коэффициенты), Forms collection для A/B-вариантов
   - `seo2` — `sameAs` для мессенджеров, microdata для форм
   - `qa2` — E2E (Playwright): full flow заявки, дедуп, фейлы
   - `pa` — настройка Я.Метрики целей и сегментов
   - `out` — accept

## Связи

- **Blocks:** US-9 (регресс включает тесты на фичи).
- **Blocked by:** US-5 (IA определяет где рендерим фичи), US-3 (CMS для управляемости калькулятора). По правилу 1→8 — после US-7.

## Антидубль-проверка

- `site/app/api/fal/` + `site/lib/fal/` — работают локально (handoff.md) для генерации медиа. Не пересекается с Claude API для сметы.
- `Leads` collection уже есть.

## Готовность к передаче

- [ ] Оператор ответил на 6 вопросов.
- [ ] Передано ba после US-7.

---

## Service-meta

- **Файл:** `devteam/specs/US-8-features-and-crm/intake.md`
- **Linear labels:** `Feature`, `P1`, `cross`, `phase:intake`, `role:in`, `CRM`, `AI`, `Integrations`
- **Assignee:** оператор
