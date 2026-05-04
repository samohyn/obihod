# newui/ — макеты главной для review

Самодостаточные HTML-макеты для согласования с оператором перед передачей в `fe-site` на верстку. Открываются двойным кликом — никаких build-шагов.

## Структура файлов

```
newui/
├── README.md                  ← этот файл
├── _header.html               ← canonical Header partial (source-of-truth)
├── brand-guide-styles.css     ← extracted из design-system/brand-guide.html (все 6 <style> блоков)
├── homepage-shared.css        ← .hp-* + .hpc-* extensions (общий для всех макетов главной)
├── homepage.html              ← Макет v2 «Фотосмета» (Direction 1, USP-led, 16 секций)
└── homepage-classic.html      ← Макет v3 «Конверсионный» (Direction 2, по структуре конкурентов, 11 секций)
```

## Принципы

1. **brand-guide.html — single source of truth.** Стили извлекаются через `awk` (см. ниже).
2. **`globals.css` НЕ источник** — только зеркало brand-guide токенов в production. Для макетов используем brand-guide напрямую.
3. **Mobile-first проверка обязательна** на каждой итерации (375 / 414 / 768 / 1024) — см. [feedback_newui_mobile_first.md](file:///Users/a36/.claude/projects/-Users-a36-obikhod/memory/feedback_newui_mobile_first.md).
4. **Header — синхронизируется через `_header.html` partial** (см. ниже).

## Макеты

### homepage.html · Direction 1 «Фотосмета»

USP-first лендинг. Hero — demo-карточка «фото→смета», структура из 16 секций по [art-brief.md](../specs/US-13-homepage-redesign-art/art-brief.md):
Hero · CertificateBand · PhotoSmeta · Services · Calculator · Coverage · B2BBridge · How · Guarantees · Cases · Subscription · Reviews · B2B-full · Team · FAQ · CtaFooter.

**Архетип-mix:** Caregiver 50 / Ruler 30 / Operational 20.
**Когда показать:** оператору / `ui` / `ux` / `cw` для согласования USP-led концепции.

### homepage-classic.html · Direction 2 «Конверсионный»

Классический лендинг подрядчика по структуре конкурентов (musor.moscow, liwood). 11 main-секций:
Hero (с form-card справа) · Услуги pillars · Как мы работаем · Цены/тарифная таблица · Фото→смета (наш USP) · Кейсы 6 шт · Отзывы · E-E-A-T trust-cards (СРО / страховка / лицензии) · География 12 районов · FAQ · Footer-CTA.

**Архетип-mix:** Caregiver 40 / Ruler 50 / Operational 10. Сильнее упор на формальные обязательства (полисы, СРО, ЕГРЮЛ, 152-ФЗ) и понятную тарифную таблицу.
**Когда показать:** оператору как альтернативу для прямого сравнения с конкурентами; B2B-сегмент скорее заходит на этот вариант.

**Различия с homepage.html:**
- Hero: form-card вместо demo-карточки фото→смета
- Pricing-table — отдельная секция с открытым прайсом (нет в v2)
- E-E-A-T-блок с лицензиями/СРО/техникой/ЕГРЮЛ — отдельная секция (нет в v2)
- Нет CertificateBand / B2BBridge / Subscription / B2B-full / Team — упрощённая воронка
- Кейсы — 6 шт (vs 3 в v2)

## Header — синхронизация

**Source-of-truth:** [`_header.html`](_header.html) — содержит canonical `<header>` блок + инструкции.

**При изменении header:**
1. Внести правку в `_header.html`.
2. Скопировать блок `<header>...</header>` в каждый макет (homepage.html, homepage-classic.html и любые будущие).
3. Sanity-check всех макетов в браузере на 1024 / 768 / 375.

CSS — только в общих файлах (`brand-guide-styles.css` для `.mm-*` и `.auth-cta`/`.btn-login`/`.btn-register`; `homepage-shared.css` для `.site-mm` overrides). Никаких inline `<style>` для header в индивидуальных макетах.

## Регенерация brand-guide-styles.css

Если `design-system/brand-guide.html` обновился:

```bash
awk '/<style>/{flag=1;next} /<\/style>/{flag=0;next} flag' design-system/brand-guide.html > newui/brand-guide-styles.css
```

Это извлечёт ВСЕ 6 `<style>` блоков (base + §nav mega-menu + pagination + notifications + errors + payload).

## Mobile-first checklist (обязательный)

Перед публикацией любого макета — открыть в DevTools → Toggle device toolbar → проверить:

- [ ] **375 px (iPhone SE)** — header не ломается, hero headline помещается, drop-zone не больше viewport
- [ ] **414 px (iPhone 12 Pro Max)** — то же
- [ ] **768 px (iPad portrait)** — sections читаются, mega-menu mobile-accordion раскрывается
- [ ] **1024 px (iPad landscape)** — sections в desktop-режиме, mega-menu hover работает
- [ ] **Touch-target ≥44 px** на всех кнопках и chip-карточках
- [ ] **Phone hidden на ≤1100, btn-login hidden на ≤900** (по §30.4)
- [ ] **Demo-note (`.hp-note`) скрыт на ≤600** (не мешает на телефоне)

Полный чек-лист — в memory `feedback_newui_mobile_first.md`.

## Как открыть

```bash
open /Users/a36/obikhod/newui/homepage.html
# или
open /Users/a36/obikhod/newui/homepage-classic.html
```

Браузер: Safari, Chrome, Firefox. На file:// все макеты работают полностью (CSS-only mega-menu, native `<details>` accordion, нет fetch'ей).

## Iteration log

| Дата | Файл | Что |
|---|---|---|
| 2026-05-03 | homepage.html v1 | Первая итерация Direction 1, отвергнута оператором |
| 2026-05-03 | homepage.html v2 | Перепись с base из brand-guide.html (1-в-1 source) |
| 2026-05-03 | + mega-menu | Replaced `.gh-*` header на полноценный mega-menu из §nav demo |
| 2026-05-03 | + auth §30 | Auth-CTA «Войти + Регистрация» по §30 canonical |
| 2026-05-03 | + mobile-first | 4 breakpoint блока (900/600/414 + reduced-motion) |
| 2026-05-03 | refactor → shared CSS | Extracted inline-styles → homepage-shared.css |
| 2026-05-03 | + homepage-classic.html | Direction 2 «Конверсионный» по структуре конкурентов |
| 2026-05-03 | + _header.html | Canonical partial для синхронизации между макетами |
