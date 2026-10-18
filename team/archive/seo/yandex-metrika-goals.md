---
type: setup-plan
owner: seo-tech
deliverable: Я.Метрика 8 целей + JS-events на staging
status: ready-to-execute
created: 2026-05-01
us: US-0
ac: AC-9.5–AC-9.7
---

# Я.Метрика — 8 целей конверсий

> **Что это.** План конфигурации 8 целей в Я.Метрике под US-0 AC-9.
> Документ-инструкция для `seo-tech` (front-end events) + `do` (counter
> setup на staging.obikhod.ru). Технически реализует фронт `fe-site` через
> `podev` после W3 staging-deploy.

## 1 · Counter ID (TBD)

- **staging:** счётчик создаётся под subdomain `staging.obikhod.ru` отдельно
  (чтобы не загрязнять prod-метрики). ID просим у оператора.
- **prod:** существующий счётчик — обновить goals одинаково.

`NEXT_PUBLIC_YANDEX_METRIKA_ID` → env var, читается из layout.tsx.

## 2 · 8 целей (events)

Все цели — типа **«JavaScript-событие»** с `goal=<id>` и доп. параметрами
visitParams (utm_source / utm_medium / utm_campaign / device).

| # | Goal ID | Триггер | Где живёт | Пример вызова |
|---|---|---|---|---|
| 1 | `lead_form_submit` | Успешная отправка лид-формы | `LeadForm.tsx` после `/api/leads` POST 200 | `ym(ID, 'reachGoal', 'lead_form_submit', { source, page })` |
| 2 | `photo_estimate_upload` | Отправка формы «Фото→смета» | `/foto-smeta/` route | `ym(ID, 'reachGoal', 'photo_estimate_upload', { count_photos })` |
| 3 | `tg_cta_click` | Клик по Telegram-CTA | header/footer/CTA-banner | `ym(ID, 'reachGoal', 'tg_cta_click', { placement })` |
| 4 | `wa_cta_click` | Клик по WhatsApp-CTA | то же | `ym(ID, 'reachGoal', 'wa_cta_click', { placement })` |
| 5 | `max_cta_click` | Клик по MAX-CTA | то же | `ym(ID, 'reachGoal', 'max_cta_click', { placement })` |
| 6 | `phone_click` | Клик по `tel:` ссылке | header/footer/contact section | `ym(ID, 'reachGoal', 'phone_click', { placement })` |
| 7 | `calculator_complete` | Закрытие шага калькулятора (placeholder в US-0) | `Calculator.tsx` блок | `ym(ID, 'reachGoal', 'calculator_complete', { steps })` |
| 8 | `blog_faq_expand` | Раскрытие FAQ-аккордеона на blog-странице | `Faq.tsx` блок | `ym(ID, 'reachGoal', 'blog_faq_expand', { question_id })` |

## 3 · Реализация на фронте — TODO для `do`/`fe-site`

### 3.1 · Глобальный helper

В `site/lib/analytics/ym.ts` (новый файл, US-1 deliverable; на baseline US-0
помечаем как TODO):

```ts
declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

export function trackGoal(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const id = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID)
  if (!id || !window.ym) return
  window.ym(id, 'reachGoal', name, params)
}
```

### 3.2 · Подключение counter в layout

`site/app/layout.tsx` или `(marketing)/layout.tsx` — стандартный yandex-metrika
snippet с `NEXT_PUBLIC_YANDEX_METRIKA_ID`. Включается только если ID задан
(на dev — без события).

### 3.3 · Триггеры

1. `LeadForm.tsx` (existing) — после `await fetch('/api/leads', ...)` успех:
   `trackGoal('lead_form_submit', { source: 'lead-form', page: window.location.pathname })`
2. `/foto-smeta/` форма — после успешной обработки upload.
3. CTA-кнопки в `Header.tsx`/`Footer.tsx`/`CtaBanner.tsx` — onClick handler с
   `data-placement` атрибутом.
4. `Faq.tsx` (existing) — onToggle handler с question id.
5. `Calculator.tsx` (placeholder в US-0) — TODO до запуска полноценной логики.

## 4 · Цели в Web UI Я.Метрики

`cms` или `do` создают через https://metrika.yandex.ru → Настройки → Цели:

- Тип каждой: **«JavaScript-событие»**
- Identifier — точное имя из таблицы выше (snake_case)
- Тип конверсии — single (не составная)

## 5 · Acceptance / smoke

После публикации W3 staging:
1. Открыть staging.obikhod.ru с включённым Я.Метрика debug (URL hash
   `#yatag-debug=1`).
2. Кликнуть каждый из 8 триггеров.
3. В Я.Метрике → Real-time → события — увидеть все 8 за 5 минут.
4. Зафиксировать результат в `seosite/08-monitoring/ya-metrika-baseline.md` (TODO).

## 6 · Hand-off

- `do` создаёт staging-счётчик до 2026-05-08, передаёт ID в `seo-tech`.
- `seo-tech` пишет helper + интегрирует в layout (US-1 deliverable; в US-0 —
  spec-only).
- `fe-site` (через `podev`) подключает trackGoal в 8 точках по таблице §2.
- `qa-site` smoke-тест Я.Метрика debug на W3 эталонах.
