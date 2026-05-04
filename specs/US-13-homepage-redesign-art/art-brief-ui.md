# art-brief-ui — Homepage v2 (детальный brief для роли `ui`)

**EPIC:** [EPIC-HOMEPAGE-V2](../EPIC-HOMEPAGE-V2/README.md) · **US:** [US-13](intake.md) → US-14 ui-mockups · **From:** art → **To:** ui · **Дата:** 2026-05-03

> Контекст и общий direction — см. [art-brief.md](art-brief.md). Здесь — конкретные deliverables и спеки для `ui`.

---

## 1. Что я (`art`) ожидаю от тебя (`ui`)

Концепт **Direction 1 «Фотосмета»** утверждён оператором. Твоя задача — перевести его в макеты под brand-guide v2.2 и зафиксировать новые компоненты в дизайн-системе.

### Deliverables (артефакт `ui-mockups.md` в US-14)

1. **6 макетов** (3 desktop + 3 mobile):
   - Hero + CertificateBand (фолд 1)
   - PhotoSmeta-блок (§03)
   - Coverage-блок (§06)
   - + mobile-версии каждого
2. **4 component spec** для новых компонентов (см. §3 ниже).
3. **Token sync** — если потребуются новые токены, PR в `design/integration` с обновлением `brand-guide.html` + `design-system/tokens/*.json` (через art).
4. **Anti-pattern checklist** — заполненный для каждого макета (см. §6).

### Skill-check (iron rule #1)

`ui` frontmatter skills включают `[design, design-system, ui-ux-pro-max, ui-styling]`. Активируй: **design-system** (сверка с brand-guide), **ui-ux-pro-max** (палитра / типография / композиция), **ui-styling** (Tailwind v4 + CSS variables).

---

## 2. Критичные iron rules

1. **§3 design-system awareness** — каждое решение сверяется с [brand-guide.html](../../design-system/brand-guide.html) v2.2 (§4 Color, §6 Type, §7 Shape, §8 Components, §10 Nav, §13 TOV, §14 Don't, §33 site-chrome). Никаких произвольных hex/font-size.
2. **§14 Don't** — 10 анти-паттернов запрещены (см. art-brief.md §1). Особое внимание: НЕ сваливаться в SaaS-стерильность (риск Direction 1).
3. **§33 site-chrome** — один Header / один Footer / Pre-footer CTA. Не ломаем.
4. **Иконография** — line-art из 49-glyph набора (§9), stroke-only viewBox 24, stroke-width 1.5, color: currentColor. Никаких filled-icon на главной. Camera уже есть в `Icon` library (используется в How).

---

## 3. Component specs (новые компоненты)

### 3.1 CertificateBand (§02 главной)

**Назначение:** формальная trust-band под Hero, замещает старый chip-row hero. Ruler-якорь.

**Anatomy:**
- Контейнер: full-width, bg `--c-bg-alt #efebe0`, padding 32-48px.
- Сетка: 4 колонки (desktop ≥768) / 2×2 (tablet) / 1 столбец (mobile <768).
- Карточка (4 шт):
  - Bg: `--c-card #ffffff`, radius 10, padding 20-24px, border 1px `--c-line`.
  - Большая mono-цифра — JetBrains Mono 700, clamp(28-44px), `--c-ink`, tabular-nums.
  - Мини-eyebrow под цифрой — Mono 11px UPPERCASE muted.
  - AmberSeal микро-печать (24-32px) в правом верхнем углу.
- Содержимое: `5 млн ₽ страховка` / `12 мес гарантия` / `0 ₽ выезд` / `штрафы ГЖИ на нас`.

**Иконография:** AmberSeal на каждой карточке. Иконку из 49-glyph набора (`legal-shield` для страховки, `fast-response` для выезда) — опционально, если визуально не перегружают.

**Состояния:** статичная (нет hover), не интерактивна.

**Mobile (<768):** карточки стакаются вертикально, mono-цифра уменьшается до 24-28px.

### 3.2 PhotoSmeta (§03 главной)

**Назначение:** USP-якорь — главный новый блок. Demo «фото→смета за 10 минут».

**Anatomy:**
- Контейнер: `.wrap` 1280px, bg `--c-bg`, padding 80-120px вертикально.
- Eyebrow: `§ 03 · Фото → смета · 10 минут` (Mono 12px UPPERCASE).
- Header: h-xl `Сфотографируй объект — посчитаем за 10 минут`.
- Сетка 2-column desktop (1.2fr / 1fr), single column mobile.

**Левая колонка (drop-zone + explainer):**
- **Drop-zone** — крупный контейнер (min-height 280px), border 2px dashed `--c-primary`, radius 16, bg `--c-card`.
  - States: idle / dragover (border solid, bg `--c-bg-alt`) / uploading (progress bar янтарный) / success (галочка `--c-success` + "загружено") / error (`--c-error` + ретрай).
  - Иконка Camera 48px по центру + текст «Перетащите фото или нажмите».
  - Mobile: вместо drag-and-drop — крупная btn-accent «Сфотографировать» с input[type=file capture=camera].
- **3-step explainer** под drop-zone:
  - Большая ghost-цифра 1/2/3 (как `case-ghost` в Cases).
  - Заголовок шага + описание (1 строка).
  - Шаги: «Сфотографируй» → «AI распознает» → «Менеджер подтвердит за 10 мин».

**Правая колонка (output-preview-card):**
- **AI-output card** — composed UI-объект (демо-карточка):
  - Header card: `ОБИХОД · ОРИЕНТИР № 0042` (mono 12px) + дата справа.
  - Фото объекта (например, аварийная берёза) — 4:3, radius 10.
  - Под фото: распознанные параметры — «Берёза, ~18 м, аварийная» (mono 14px, tabular-nums).
  - Mono-смета крупно: `12 800 — 16 400 ₽` (clamp 28-44px, `--c-ink`, tabular-nums).
  - Footer: AmberSeal печать справа + текст «фикс на 14 дней» / «менеджер свяжется в 10 минут».
- Опционально: микро-loop / автокликер раз в 10 секунд проигрывает «загружено → AI считает → готово» (mobile-friendly).

**Cross-link:** под левой колонкой текст-link «Знаешь параметры? → Точный калькулятор слайдерами →» (стрелка ведёт на §05 Calculator якорь #calc).

**Mobile:** сначала drop-zone + explainer, потом output-preview-card ниже. Скроллабильная вертикаль.

### 3.3 Coverage (§06 главной)

**Назначение:** показать географию — 12 опубликованных Districts + намёк на roadmap 74.

**Anatomy:**
- Контейнер: `.wrap`, bg `--c-bg-alt`, padding 64-80px.
- Eyebrow: `§ 06 · География · Москва и МО` (Mono 12px UPPERCASE).
- Header: h-xl `Работаем в Москве и Подмосковье`.
- Sub: «12 районов в активной работе. Едем в любую точку МО до 120 км от МКАД.» (lead 17-22px).
- TopoPattern фоном (opacity 0.12-0.15) — линии-горизонтали как карта МО.

**Chip-карточка (12 шт):**
- Размер: ~280px width × 160px height (desktop), responsive.
- Bg `--c-card`, radius 10, border 1px `--c-line`, padding 16-20px.
- Header: название района Golos 700 20px (h-s).
- Mono-метка: `18 КМ ОТ МКАД` (Mono 11-12px UPPERCASE muted, tabular-nums).
- Цифра-факт: `4 кейса` или `SLA 4ч` или количество услуг — Mono 14-16px tabular-nums.
- Микро-иконка района (если есть в `district-9` icon set: `odintsovo`, `krasnogorsk` и т.д.) — 24px, currentColor primary.
- Hover: border `--c-primary`, лёгкий shadow, transition 200ms.

**Layout:** горизонтальный scroll на desktop (snap-mandatory) + сетка 2 columns mobile.

**Под поясом:** текст-link `+ ещё 62 района по запросу → /raiony/` (ghost-link, primary-color, иконка ArrowRight).

**Tradeoff:** интерактивная SVG-карта МО — soft-no для W15 (нет компонента, accessibility сложна). Grid из chip + TopoPattern даёт «картовое» ощущение без SVG-карты.

### 3.4 B2BBridge (§07 главной)

**Назначение:** ранняя развилка для B2B-менеджеров без занятия большого экрана.

**Anatomy (на базе Payload `CtaBanner` блока):**
- Контейнер: `.wrap`, bg `--c-primary`, padding 32-40px, color `--c-on-primary`.
- Сетка: 3-column desktop (icon / text / cta) → stack mobile.
- Слева: иконка `legal-shield` или `fixed-price` (32-40px, currentColor on-primary).
- Центр:
  - Mono-eyebrow: `§ 07 · B2B` (UPPERCASE, муваеtd с opacity).
  - Заголовок h-m: «УК, ТСЖ, посёлок, застройщик?»
  - Sub Mono: «Берём штрафы ГЖИ/ОАТИ на себя по договору. SLA 2 часа.»
- Справа: btn-accent «Условия для B2B → /b2b/» + Icon.ArrowRight.

**Тон:** Direction 1 операционный + Direction 3 формальный (под бренд-mix Caregiver+Ruler).

**Mobile:** иконка → заголовок → sub → CTA full-width.

---

## 4. Изменения существующих компонентов

### 4.1 Hero ([Hero.tsx:7](../../site/components/marketing/sections/Hero.tsx))

- **Headline:** заменить на процессуальный «Фото → смета → 12 800 ₽ → бригада» (3-4 строки или одна строка с разделителями `→`). Golos 700 (не 900), h-display clamp 48-96px.
- **Sub/lead:** конкретика «10 минут, фикс-цена, страховка 5 млн ₽» (lead 17-22).
- **CTA-row:** primary `[📷 Сфотографировать объект]` (btn-accent, Icon.Camera) + secondary phone-link с временем ответа.
- **Hero-visual (правая часть):** заменить Placeholder + AmberSeal на **демо-карточку фото→смета** (см. §3.2 PhotoSmeta-output, можно общий компонент).
- **Метрики chip:** убрать из hero, переезжают в CertificateBand (§02).
- **Микро-trust-line под CTA-row:** «184 отзыва · 4.9 на Я.Картах · 5 М₽ страховка» (Mono 12px muted) — снимает потребность в отдельном Trust-bar блоке.
- **Eyebrow:** `§ 01 · Хозяйственные работы · Москва и МО` (Mono UPPERCASE).

### 4.2 Header ([Header.tsx](../../site/components/marketing/Header.tsx))

- **CTA-text меняется:** с «Получить смету → #calc» на **«Фото → смета за 10 мин → #foto-smeta»**.
- Phone-link рядом с CTA — оставить как secondary.
- Mega-menu, sticky, mobile breakpoint 860px — не трогать (iron rule §33).

### 4.3 Calculator ([Calculator.tsx](../../site/components/marketing/sections/Calculator.tsx))

- **Eyebrow меняется:** на `§ 05 · Точный калькулятор · слайдеры` (отстройка от §03 PhotoSmeta).
- **Cross-link добавить:** «Не знаешь объём? → пришли фото» (ghost-link на #foto-smeta).
- Остальное — не трогать.

### 4.4 Cases ([Cases.tsx](../../site/components/marketing/sections/Cases.tsx))

- **Источник данных:** Payload Cases collection (top-3 featured + fallback на текущие hardcoded если Payload <3).
- **Карточка:** добавить visible-метку `B2C` / `B2B` (badge `--c-accent` для B2B, `--c-success` для B2C).
- **Вкладок не делать** (избегаем client-state).
- BeforeAfter слайдер — остаётся, но с **реальными фото** после фотосессии US-17.

### 4.5 Reviews ([Reviews.tsx](../../site/components/marketing/sections/Reviews.tsx))

- **Источник:** Payload Reviews collection (US-18 popanel backlog) или fallback hardcoded.
- **Top-6 5★ + 4 source-cards** (Я.Карты 4.9 / 2ГИС 4.8 / Авито / NPS).
- Карточка отзыва — без изменений визуально, только данные.

### 4.6 B2B ([B2B.tsx](../../site/components/marketing/sections/B2B.tsx))

- **Добавить третью карточку** — «УК / ТСЖ / FM / Госзакупки → /b2b/{uk,tszh,fm,gostorgi}/».
- **Подзаголовок секции:** добавить mono-line «штрафы ГЖИ/ОАТИ берём на себя по договору, SLA 2ч».
- TopoPattern фоном — оставить.

### 4.7 Team ([Team.tsx](../../site/components/marketing/sections/Team.tsx))

- **Реальные фото 3:4** после US-17 фотосессии.
- Если фото не готовы на launch — **сократить до 2 карточек** (Иван-бригадир + Анна-диспетчер) вместо 4 placeholder.
- Карточка — без изменений.

### 4.8 CtaFooter ([CtaFooter.tsx](../../site/components/marketing/sections/CtaFooter.tsx))

- **Dual-mode:**
  - Primary — drop-zone «Загрузить фото → смета за 10 мин» (повтор §03 PhotoSmeta или общий компонент).
  - Secondary — классическая мини-форма (телефон + комментарий) для тех у кого фото нет.
- **Iron rule §33 Pre-footer CTA** — обязательный блок на главной, не убираем.

---

## 5. Token usage (Direction 1)

| Token | Где доминирует |
|---|---|
| `--c-bg #f7f5f0` | Hero, PhotoSmeta, How, Guarantees, Subscription, Reviews, FAQ, Team, CtaFooter (~60% поверхностей) |
| `--c-bg-alt #efebe0` | CertificateBand, Coverage, Cases, B2B (чередование секций) |
| `--c-primary #2d5a3d` | Лого, иконки, рамки, типо-акценты, B2BBridge bg, mega-menu (~15%) |
| `--c-accent #e6a23c` | primary CTA (btn-accent), AmberSeal, output-смета highlight (~10% точечно) |
| `--c-ink #1c1c1c` | Заголовки, body |
| `--c-card #ffffff` | Карточки на bg-alt поверхностях |
| `--c-line #e6e1d6` | Border'ы карточек, разделители |

**Mono-нумерация (JetBrains Mono, tabular-nums)** — идентичность направления. Применять везде где есть число (цены, сроки, дистанции, номера сертификатов, AI-timer, статистика).

**Радиусы:** 6/10/16, status-pill 999.

**Spacing:** 4px base, container 1280px, pad 20-40-80px.

---

## 6. Anti-pattern checklist (для каждого макета)

Заполни для каждого из 6 макетов:

- [ ] Нет эко-зелёного + листочка (primary тёмный хвойный).
- [ ] Нет дерева с топором / бензопилы.
- [ ] Нет рыцаря / щита / герба.
- [ ] Нет рукопожатий.
- [ ] Нет твёрдого знака ДВОРЪ-style.
- [ ] Нет стоковых фото с рукавицами / catalog-shot.
- [ ] Нет матрёшек / берёзок (лубочно).
- [ ] Нет градиентов в primary-кнопке.
- [ ] Нет неоновых ховеров (hover → primary-ink −8% яркости).
- [ ] Нет Тильда / WordPress / Bitrix-look.
- [ ] **Direction 1 risk-check:** не свалился в SaaS-стерильность — есть документальные фото бригад на 3+ экранах главной.

---

## 7. Деливериз → передача `art`

После твоих макетов:
1. `art` review каждого макета по anti-pattern checklist + brand-guide compliance.
2. Если новые токены — PR в `design/integration` ветку с обновлением `brand-guide.html` + `design-system/tokens/*.json`.
3. После approve `art` → передача в US-16 (sa-site → fe-site верстка).

## 8. Открытые вопросы (если есть — пинг art через cpo)

1. Если найдёшь визуально-сильное решение для Coverage с интерактивной картой (без SVG-карты МО) — покажи альтернативу к grid из 12 chip.
2. Если PhotoSmeta-output card визуально перегружена (mono-смета + AmberSeal + распознанные параметры + штамп «фикс») — предложи 1-2 элемента в drop.
3. Если 16 секций для главной читаются как «слишком длинная» — предложи какие 1-2 reuse-секции можно опционально drop (Subscription / Team / FAQ — наименее критичны).
