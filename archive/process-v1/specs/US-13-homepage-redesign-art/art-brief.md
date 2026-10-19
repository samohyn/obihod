# art-brief — Homepage v2 (общий direction)

**EPIC:** [EPIC-HOMEPAGE-V2](../EPIC-HOMEPAGE-V2/README.md) · **US:** [US-13](intake.md) · **Owner:** art · **Дата:** 2026-05-03
**Source of truth:** [`design-system/brand-guide.html`](../../design-system/brand-guide.html) v2.2

---

## 1. Концепция · «Фотосмета» (Direction 1)

**Архетип-mix:** Caregiver 50 / Ruler 30 / Operational 20.

**Стержневая идея:** главная — это доказательство, что «фото→смета за 10 минут» реально работает. Путь объекта от телефонной фотографии до сертификата с фикс-ценой выкладывается на первом экране как 4-step demo. Дальше страница — галерея пар «фото→смета», калькулятор-fallback, услуги, гарантии, география, кейсы, абонементы, отзывы, B2B-хаб, команда, FAQ, финальный CTA.

**Гибрид с Direction 3 «Сертификат»:** под Hero вшивается формальная **CertificateBand** с 4 цифрами-обязательствами (5 млн страховка / 12 мес гарантия / 0 ₽ выезд / штрафы ГЖИ на нас) — Ruler-якорь, который снимает риск «кинут» для B2C-50+ и B2B-менеджера.

**Что НЕ делаем (anti-patterns §14):**
1. ❌ Эко-зелёный + листочек (у нас тёмный хвойный, не салат)
2. ❌ Дерево с топором / бензопила (Дровосек-архетип)
3. ❌ Рыцарь / щит / герб (Ruler без Caregiver = ЧОП)
4. ❌ Рукопожатия (B2B-штамп 2010-х)
5. ❌ Твёрдый знак ДВОРЪ-style (хипстерская «русскость»)
6. ❌ Стоковые фото с рукавицами (нужен документальный репортаж бригад)
7. ❌ Матрёшки и берёзки (лубочно)
8. ❌ Градиенты в primary-кнопке (плоский цвет = бренд)
9. ❌ Неоновые ховеры (hover → primary-ink −8%)
10. ❌ Тильда / WordPress / Bitrix-look

---

## 2. Структура · 16 секций

| № | Секция | Статус | Что в ней |
|---|---|---|---|
| 01 | **Hero** | redesign | Headline процессуальный «Фото → смета → 12 800 ₽ → бригада», sub с цифрой/сроком, primary CTA `[📷 Сфотографировать объект]` (btn-accent), secondary — телефон. Hero-visual: реальное фото бригады 4:5 + AmberSeal печать. Eyebrow `§ 01 · Хозяйственные работы · Москва и МО`. Метрики chip убираем из hero — переезжают в band ниже. |
| 02 | **CertificateBand** `[new]` | new | Формальная полоса под Hero: 4 ink-карточки на bg-alt с mono-цифрами и AmberSeal — `5 млн ₽ страховка / 12 мес гарантия / 0 ₽ выезд / штрафы ГЖИ на нас`. Замещает старый chip-row hero. |
| 03 | **PhotoSmeta** `[new]` | new | Главный новый блок, USP-якорь. 2-column: слева drop-zone «Загрузить фото» + 3-step explainer (Сфотографируй → AI распознает → менеджер подтвердит за 10 мин). Справа output-preview-карточка (фото берёзы 18м → mono-смета 12-16 тыс ₽ + штамп «фикс»). Eyebrow `§ 03 · Фото → смета · 10 минут`. AmberSeal в output-card. Cross-link микро-копия: «Знаешь параметры? → точный калькулятор слайдерами». |
| 04 | Services | reuse | 4 пилара + интерактивный круг сезонов (BigSeasonsCircle). Линка на pillar-страницы у каждого. |
| 05 | Calculator | reuse + relabel | Eyebrow меняется: `§ 05 · Точный калькулятор · слайдеры` (отстройка от §03). Cross-link обратно: «Не знаешь объём? → пришли фото». |
| 06 | **Coverage** `[new]` | new | Горизонтальный пояс из 12 chip-карточек (7 priority A: Одинцово / Красногорск / Мытищи / Химки / Истра / Пушкино / Раменское + 5 priority B: Жуковский / Домодедово / Подольск / Королёв / Балашиха). Каждая chip: название района + дистанция от МКАД (mono `18 КМ ОТ МКАД`) + минимум 1 цифра (N кейсов / SLA). Фон — TopoPattern. Под поясом — `+ ещё 62 района по запросу → /raiony/`. Eyebrow `§ 06 · География · Москва и МО`. |
| 07 | **B2BBridge** `[new]` | new | Тонкая полоса (баннер CtaBanner) под Coverage: «Управляющая компания, ТСЖ, посёлок, застройщик? Берём штрафы ГЖИ/ОАТИ на себя по договору → /b2b/». Mono-eyebrow `§ 07 · B2B`. |
| 08 | How | reuse | 5 шагов SLA (Звонок 15мин → Смета 24ч → Работа → Фото → Гарантия). Не трогать. |
| 09 | Guarantees | reuse | 6 гарантий-карточек с большой цифрой + AmberSeal. Не трогать. |
| 10 | **Cases** | redesign | Подвязка на Payload Cases (14 шт): top-3 динамически по `featured` флагу, fallback на текущие 3 hardcoded если Payload <3. Карточка: BeforeAfter слайдер с реальными фото + 3 факт-цифры + visible-метка `B2C` / `B2B` (4-6 кейсов, без вкладок). |
| 11 | Subscription | reuse | 3 абонемента (Эконом 49к / **Участок 89к** featured / Забота 149к). |
| 12 | **Reviews** | redesign | Источник: Payload Reviews collection (новая, popanel backlog) или fallback на hardcoded. Top-6 5★ + 4 source-cards (Я.Карты 4.9 / 2ГИС 4.8 / Авито / NPS). |
| 13 | **B2B (full)** | redesign | 2 текущих карточки (Коттедж + Строитель) + третья новая «УК / ТСЖ / FM / Госзакупки → /b2b/{uk,tszh,fm,gostorgi}/». Подзаголовок — фишка «штрафы ГЖИ берём на себя, SLA 2ч». TopoPattern фоном. |
| 14 | **Team** | conditional | Реальная фотосессия → 4 портрета 3:4. Если фото не готово → 2 карточки (Иван-бригадир + Анна-диспетчер). |
| 15 | FAQ | reuse | 8 QA accordion. Tertiary CTA: «Не нашли ответ → Telegram @obihod_bot». |
| 16 | **CtaFooter** | redesign | Dual-mode: primary — drop-zone «Загрузить фото → смета за 10 мин» (повтор §03), secondary — классическая мини-форма (телефон + комментарий). |

**Drop:** SeasonCalendar (12×4 матрица) — переусложнение, дублирует Services. Перенести на `/abonement/`.

---

## 3. Иерархия CTA

**Один primary везде:** **«[📷 Сфотографировать объект] → смета за 10 мин»**
- btn-accent #e6a23c, Icon.Camera.
- Якорь `#foto-smeta` (Hero, Header, CtaFooter) — все ведут на §03.
- Текст-вариации (cw): «Сфотографировать → ориентир за 10 мин» / «Загрузить фото · ответ за 10 мин».

**Secondary (контекстные):**
- Hero: телефон с фактическим номером + «<15 мин ответа».
- Services: ghost-link «Открыть пилар-страницу».
- Calculator: btn-primary «Заказать бесплатный замер».
- Subscription: btn-accent «Оформить абонемент» (другая воронка).
- B2B-bridge + B2B-full: btn-primary «Запросить КП для посёлка» / «Стать партнёром».

**Tertiary (текстовые):** в FAQ → Telegram, в Coverage → `/raiony/`, в Cases → Telegram-канал.

**Header CTA меняется:** с текущего «Получить смету → #calc» на **«Фото → смета за 10 мин → #foto-smeta»**.

**Anti-patterns CTA:** не ставить три параллельных CTA в одном блоке. Не дублировать Calculator-CTA в Hero. Никакого chat-widget на хедере.

---

## 4. Visual mood (Direction 1 «Фотосмета»)

| Token | Роль | Доминанта |
|---|---|---|
| `--c-bg #f7f5f0` (кремовый) | основной фон | 60% |
| `--c-bg-alt #efebe0` | чередование секций | CertificateBand, Coverage, Cases |
| `--c-primary #2d5a3d` (хвойный) | вторичный — лого, иконки, рамки | ~15% |
| `--c-accent #e6a23c` (янтарь) | рабочий акцент — primary CTA, AmberSeal | ~10% (точечно) |
| `--c-ink #1c1c1c` | заголовки, body | стандарт |
| Mono (JetBrains Mono, tabular-nums) | **идентичность направления** | цены, сроки, дистанции, номера |

**Типография:**
- Hero headline — Golos Text **700** (не 900). `h-display` clamp 48-96px.
- Section headers — Golos 700, `h-xl` clamp 36-64px.
- Eyebrow `§ NN · Название` — JetBrains Mono 11-12px UPPERCASE LS 0.14em muted.
- Lead — Golos 600.
- Body — Golos 400.

**Композиция:**
- Сетка 12 колонок, плотная (Stripe operational-style).
- Радиусы 6/10/16, status-pill 999.
- Container 1280px, pad 20-40-80px (768/1024/1200 breakpoints).
- Mobile breakpoint 860px → burger-drawer Header.

**Фотография** ([`design-system/foundations/photography.md`](../../design-system/foundations/photography.md)):
- Документальный репортаж — реальные бригады на реальных объектах.
- Природный свет, +100-200K тепла.
- 4:5 для Hero, 3:4 для Team, 4:3 для Cases (before/after пары).

**Графика (`_shared/graphics.tsx`):**
- AmberSeal — Hero + Guarantees + PhotoSmeta-output-card + CertificateBand.
- TopoPattern — Coverage + B2B.
- RingsPattern — слабый фон Hero + CtaFooter (opacity 0.08).
- BeforeAfter — Cases.
- BigSeasonsCircle — Services.

---

## 5. Передача дальше (что от какой роли)

| Роль | Что делает | Артефакт |
|---|---|---|
| `ui` | Макеты + token sync | [art-brief-ui.md](art-brief-ui.md) → US-14 ui-mockups.md |
| `ux` | CJM 3 персон + wireframes | [art-brief-ux.md](art-brief-ux.md) → US-15 ux-wireframes.md |
| `cw` | Копирайт под TOV §13 + Direction 1 | консультация, не задача (см. art-brief.md §5.3) |
| `poseo` | SEO-обвязка главной | консультация (см. art-brief.md §5.4) |
| `popanel` | Reviews collection + Cases.featured | backlog → US-18 |
| `sa-site` (через `podev`) | spec.md для US-16 fe-build | iron rule #2 spec-before-code |
| `fe-site` + `be-site` | Верстка + Server Action LeadForm | US-16 (после US-14/15 approve) |
| оператор | Photo production (внешний фотограф) | US-17, 11 финальных кадров |
| `art` (себе) | PR §35 Homepage в brand-guide | после launch новой главной (через `design/integration`) |

---

## 6. Critical Files

**Существующие, которые трогаем:**
- [site/app/(marketing)/page.tsx](../../site/app/(marketing)/page.tsx) — composition, drop SeasonCalendar
- [site/components/marketing/Header.tsx](../../site/components/marketing/Header.tsx) — поменять CTA-text
- [site/components/marketing/sections/Hero.tsx](../../site/components/marketing/sections/Hero.tsx) — redesign CTA-row, headline, hero-visual
- [site/components/marketing/sections/Cases.tsx](../../site/components/marketing/sections/Cases.tsx) — Payload подвязка
- [site/components/marketing/sections/Reviews.tsx](../../site/components/marketing/sections/Reviews.tsx) — Payload подвязка
- [site/components/marketing/sections/Team.tsx](../../site/components/marketing/sections/Team.tsx) — реальные фото 3:4
- [site/components/marketing/sections/B2B.tsx](../../site/components/marketing/sections/B2B.tsx) — третья карточка
- [site/components/marketing/sections/CtaFooter.tsx](../../site/components/marketing/sections/CtaFooter.tsx) — dual-mode
- [site/components/marketing/sections/LeadForm.tsx](../../site/components/marketing/sections/LeadForm.tsx) — Server Action

**Новые:**
- `site/components/marketing/sections/CertificateBand.tsx` — 4 ink-карточки + AmberSeal
- `site/components/marketing/sections/PhotoSmeta.tsx` — 2-column drop-zone + output-preview
- `site/components/marketing/sections/Coverage.tsx` — 12 chip + TopoPattern
- `site/components/marketing/sections/B2BBridge.tsx` — thin-band CtaBanner

---

## 7. Sequencing

1. **art** (этой сессией) — art-brief.md / art-brief-ui.md / art-brief-ux.md ✅
2. Параллельно после approve cpo:
   - **ui** → US-14 макеты
   - **ux** → US-15 CJM + wireframes
   - **popanel** → US-18 Payload prep (Reviews + Cases.featured)
   - **operator** → US-17 photo production
3. **art review** макетов ui + wireframes ux → approve.
4. **podev → sa-site** → spec.md для US-16 (iron rule #2 spec-before-code).
5. **fe-site + be-site** → US-16 верстка + Server Action.
6. **qa-site + cr-site** → проверки.
7. **leadqa** local-verify + browser smoke (iron rule #6).
8. **release** RC + **operator approve** + **do** deploy.

---

## 8. Verification (DoD для всей программы)

**Brand-guide compliance (`art` finalcheck):**
- [ ] Все токены `--c-*` из §4 brand-guide использованы (никаких arbitrary hex).
- [ ] Типография Golos Text + JetBrains Mono, шкала h-display/xl/l/m/s/lead/body.
- [ ] AmberSeal появляется ≥3 раза (Hero / Guarantees / PhotoSmeta-output).
- [ ] Eyebrow `§ NN · Название` mono uppercase у каждой секции.
- [ ] Iron rule §33 site-chrome: один Header / один Footer / Pre-footer CTA.
- [ ] Anti-patterns §14: нет эко-листочков / нет рукопожатий / нет градиентов в primary / нет сток-фото.

**TOV compliance (`cw`):**
- [ ] 0 анти-слов из §13 (хук `protect-immutable.sh` блокирует).
- [ ] Все CTA имеют конкретику (цифру или срок).
- [ ] B2B/B2C один TOV (как у бригадира — matter-of-fact).

**Functional (`qa-site` + `leadqa`):**
- [ ] LeadForm на главной → Payload Leads + Telegram async (fire-and-forget 5s).
- [ ] PhotoSmeta drop-zone принимает фото → ведёт на `/foto-smeta/` или triggers AI-flow.
- [ ] Cases динамически из Payload (top-3 featured), fallback при <3.
- [ ] Coverage 12 chip → каждая ведёт на `/raiony/<slug>/` 200 OK.
- [ ] B2BBridge → `/b2b/` 200 OK; B2B-full 3 карточки → `/b2b/{...}/` 200 OK.
- [ ] FAQ accordion + JSON-LD FAQPage schema.
- [ ] Mobile breakpoint 860px — burger-drawer работает.
- [ ] Real browser smoke (Chromium / Firefox / Safari mobile) end-to-end.
- [ ] Скриншоты в `screen/`, не в корне.

**SEO (`poseo` + `seo-tech`):**
- [ ] H1 главной с топ-ключом (мусор/спил/крыши).
- [ ] LocalBusiness + Organization + ServiceCollection + FAQPage + BreadcrumbList JSON-LD.
- [ ] Meta title <60 char, description 140-160.
- [ ] Lighthouse Performance ≥85 mobile + Accessibility ≥95.

**Photography (`art` + оператор):**
- [ ] 11 финальных кадров (Hero 1 + Team 4 + Cases 6).
- [ ] Документальный стиль, природный свет, +100-200K тепла.
- [ ] §14 Don't соблюдён (нет catalog-shot / нет постановочных).

---

## 9. Tradeoffs / открытые вопросы

1. **Photo production timeline (1-2 нед)** vs дата запуска. Если фото задержат — Hero/Team на launch остаются placeholder + Team сокращена до 2 карточек.
2. **PhotoSmeta-output preview** — UI-демо vs реальный AI-output (Server Action). На 211 URL `foto-smeta` уже live, можем переиспользовать compute.
3. **Reviews collection** не существует в Payload — popanel в backlog. На launch — fallback hardcoded.
4. **Coverage интерактивная карта vs grid** — выбран grid из 12 chip (карта МО SVG нет, accessibility-задача нетривиальна). Карта в backlog enhancement.
5. **B2B-bridge на 7-й vs B2B-full на 13-й** — компромисс: тонкий bridge на 7-й + B2B-full остаётся на 13-й. Если конверсия покажет недостаток — поднимем на 8-9 итерацией.
6. **brand-guide.html §35 Homepage** дополняется ПОСЛЕ запуска (US-13 art-brief = source для будущей §35).
