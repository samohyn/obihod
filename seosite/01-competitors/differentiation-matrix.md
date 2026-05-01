# Differentiation Matrix — 17 × 5 осей

**Статус:** W3 baseline draft (создан 2026-05-01 в W2 ahead of schedule).
**Источники:** Keys.so + Topvisor + ручной IA-скан + `seosite/01-competitors/deep/<domain>.md` + `seosite/01-competitors/shortlist.md` + `seosite/01-competitors/ia-patterns.md`.
**Обновляется:** W3 baseline (текущая версия, гипотезы) → W3 live audit (реальные цифры) → W7 mid → W14 final.
**Owner:** seo-content + re (cross-team) под poseo orchestration.
**DoD-цель к W14:** опережение топ-3 конкурентов по ≥3 из 5 осей (URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage).

> **ВАЖНО:** Текущая версия — гипотезы до live audit на основе деad-профилей 2026-04-25/26 + shortlist. **Цифры там где их не было — не инвентируются**, помечены `pending`. Реальные данные подставит `re` + `seo-content` после Keys.so/Topvisor запуска в W3.

---

## Легенда статусов

- 🟢 huge / strong (топ-1 в выборке по этой оси)
- 🟡 medium (средний по выборке)
- 🔴 low (ниже медианы)
- ⚪ pending (нужен live audit W3)
- ✓ — кандидат в топ-3 для DoD-опережения
- ◯ — есть профиль, но устарел / неполный
- ✗ — нет deep-профиля, stub создан

---

## Сводная матрица 17 × 5 + meta-колонки

| # | Конкурент | Pillar | Deep-профиль | URL-объём (1) | Контент-глубина (2) | E-E-A-T (3) | UX (4) | Schema (5) | Топ-3 кандидат? |
|--:|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | **musor.moscow** | мусор | ✓ | 🟢 huge (~1387 URL, 137 гео) | 🟡 medium (103 blog + 1051 новость, но автоген) | 🔴 low (нет авторов / СРО на видном месте) | 🟡 medium (калькулятор на главной) | 🟡 medium (Service?+FAQ?) ⚪ | **✓** (URL-объём axis) |
| 2 | grunlit-eco.ru | мусор | ✗ stub | ⚪ pending | ⚪ pending | ⚪ pending (B2B-фокус — гипотеза сильный) | ⚪ pending | ⚪ pending | pending live audit W3 |
| 3 | **liwood.ru** | арбо | ✓ | 🟡 medium (247 URL, 40 districts × 1 service) | 🟢 huge (85 blog + 29 sub-обрезка по породам, 3 уровня) | 🟡 medium (gallery 13 + калькулятор, но без авторов) | 🟢 strong (калькулятор + онлайн-консультация) | 🟡 medium ⚪ | **✓** (контент-глубина axis) |
| 4 | promtehalp.ru | арбо | ✓ | 🔴 low (5 sub flat, 0 districts) | 🔴 low (5 статей блога) | 🟡 medium (СРО-упоминание + /work + /video) | 🔴 low (sitemap старый 2021) | 🔴 low ⚪ | — |
| 5 | lesoruby.ru | арбо | ✗ stub | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | pending (+ проверить связь с lesoruby.com) |
| 6 | alpme.ru | арбо/промальп | ◯ | 🟡 medium (2 уровня + /msk/) | 🔴 low (нет блога) | 🔴 low | 🟡 medium (калькулятор) | 🔴 low ⚪ | — |
| 7 | arboristik.ru | арбо | ◯ | 🟡 medium (~60 районов в навигации) | 🟡 medium (~50 blog) | 🔴 low (sitemap 2017, HTTP) | 🔴 low (legacy) | 🔴 low ⚪ | — |
| 8 | arborist.su | арбо | ✗ stub | ⚪ pending | ⚪ pending | ⚪ pending (если есть expert-positioning — гипотеза средне) | ⚪ pending | ⚪ pending | pending |
| 9 | forest-service.ru | арбо/лес | ✗ stub | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | pending |
| 10 | tvoi-sad.com | арбо/сад | ✗ stub | ⚪ pending | ⚪ pending (сезонные кластеры?) | ⚪ pending | ⚪ pending | ⚪ pending | pending (+ проверить пересечение с apps/shop/) |
| 11 | spilservis.ru | арбо узкий | ✗ stub | ⚪ pending (вероятно низкий) | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | pending |
| 12 | lesovod.su | арбо/расчистка | ✗ stub | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | pending |
| 13 | virubka-dereva.ru | арбо узкий (EMD) | ✗ stub | ⚪ pending (EMD-эффект) | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | pending |
| 14 | chistka-ot-snega.ru | крыши (EMD) | ✗ stub | ⚪ pending (EMD-эффект) | ⚪ pending | ⚪ pending | ⚪ pending | ⚪ pending | pending (потенциально топ-3 по pillar крыш) |
| 15 | demontazhmsk.ru | демонтаж | ✓ | 🟡 medium (programmatic material × object) | 🔴 low (нет блога) | 🔴 low | 🟡 medium | 🟡 medium ⚪ | — |
| 16 | **cleaning-moscow.ru** | E-E-A-T (клининг) | ✓ | 🟡 medium (11 pillar, 2 уровня) | 🟡 medium (статьи на корне — антипаттерн) | 🟢 strong (отдельные авторы как посадочные + /proverka-informacii/) | 🟡 medium (B2B/B2C сегментация) | 🟡 medium ⚪ | **✓ (альт)** (E-E-A-T axis) |
| 17 | **fasadrf.ru** | контент (фасады) | ✓ | 🟢 huge (4 уровня иерархии, 148 blog) | 🟢 huge (148 статей, 4 уровня по производителям) | 🔴 low (HTTP, без авторов) | 🟡 medium | 🟡 medium ⚪ | **✓ (альт)** (блог axis) |

> «pending» в столбце «Топ-3 кандидат» означает: после W3 live audit (Keys.so показатели видимости) можем добавить новых кандидатов или отказаться от текущих.

---

## Топ-3 для DoD-цели опережения (W3 baseline — гипотеза до live audit)

### Финалисты (3): musor.moscow + liwood.ru + cleaning-moscow.ru

**Обоснование:** на pre-live-audit стадии выбираем по принципу «по 1 чемпион в каждой ключевой оси, чтобы тренироваться обгонять разнопрофильных»:

1. **musor.moscow — чемпион URL-объёма (~1387 URL, 137 гео-страниц).**
   Обгоняем по: **URL-объёму** (наши 4 услуги × 8 districts = 32+ SD на одну только Wave 1, до ~150 SD к W14 vs у них 1 услуга × 137 = 137; разный паттерн — у нас глубина, у них ширина), **E-E-A-T** (у них нет авторов; мы делаем 2 авторов + цитата оператора в B2B), **schema-coverage** (живёт hypothesis pending, но 100% coverage = unique у нас), **UX** (фото→смета как USP-pillar — 0/17 не делает).

2. **liwood.ru — чемпион контент-глубины (3 уровня + 85 blog + 29 sub-обрезка).**
   Обгоняем по: **контент-глубине** (наш SD = mini-case + ≥2 localFaq + neighbor-districts vs у них SD = только текст; +20% средний объём слов на pillar/sub), **URL по 4 услугам** (они только арбо, мы 4-в-1), **E-E-A-T** (они без авторов), **UX** (фото→смета).

3. **cleaning-moscow.ru — чемпион E-E-A-T (отдельные авторы-посадочные + /proverka-informacii/).**
   Обгоняем по: **E-E-A-T** (наш реальный B2B-автор оператор с VK/TG sameAs — у cleaning-moscow авторы без cross-domain якорей), **URL** (у них статьи на корне антипаттерн, мы делаем /blog/ строго), **schema-coverage** (Person→Organization связка), **UX** (фото→смета).

### Альтернативные кандидаты (могут заменить топ-3 после W3 live audit)

- **fasadrf.ru** — если решим биться по объёму блога (148 vs наших 30 → 85 к M9). Сейчас не в топ-3 потому что не наша вертикаль (фасады), а контент-эталон извне ниши.
- **chistka-ot-snega.ru** — если live audit покажет EMD-домен в топ-1 по «чистка крыш от снега», может занять место в топ-3 как pillar-чемпион крыш.
- **demontazhmsk.ru** — если они расширятся в гео (по плану — risk R), смогут стать топ-3 по демонтажу.

### Что произойдёт на W3 live audit

После Keys.so export (видимость доменов в Я.Москва+МО за последние 30 дней) пере-сбор топ-3 по реальным цифрам:
- если **grunlit-eco.ru** покажет видимость > musor.moscow в B2B-сегменте — может вытеснить её
- если **arboristik.ru** в выдаче по арбо обгоняет liwood.ru (sitemap 2017 не помешал?) — может подняться
- если **chistka-ot-snega.ru** в топ-1 по pillar крыш — обязан войти в топ-3

**Решение оператору на W3 baseline:** утвердить или скорректировать топ-3 после первого Keys.so отчёта.

---

## Уникальные «winning angles» Обихода (0/17 конкурентов)

Из плана §«Competitive Differentiation Strategy»:

| # | Angle | Где живёт у нас | Конкурент-эталон ближайший |
|---|---|---|---|
| 1 | **Фото→смета за 10 минут** (USP) | `/foto-smeta/` (отдельный pillar) + lead-form на каждой странице | **0/17** — никто не делает |
| 2 | **4-в-1 (мусор+арбо+крыши+демонтаж)** под одним подрядчиком | главная + cross-link `services-grid` блок на каждой странице | **0/17** — все 17 узко-нишевые |
| 3 | **«Штрафы ГЖИ/ОАТИ берём на себя по договору»** | `/b2b/shtrafy-gzhi-oati/`, `/b2b/dogovor/` | **0/17** — уникальный B2B-крючок |
| 4 | **Programmatic 4 услуги × 8 районов** | ~150 SD URL Wave 1 | musor.moscow делает 1 × 109; никто 4 × N |
| 5 | **Реальный B2B-автор (оператор) с VK/TG `sameAs`** | `/avtory/<operator>/` + цитата на B2B-страницах | cleaning-moscow.ru имеет авторов, но без cross-domain якорей |
| 6 | **Caregiver+Ruler TOV** (конкретные цифры, без «услуги населению») | весь сайт | большинство 17 в анти-TOV |
| 7 | **Block-based архитектура (8 типов через blocks[])** | вся CMS Payload | большинство на legacy WP / Bitrix / Тильда |
| 8 | **Я.Нейро / Алиса / Perplexity цитируемость** через TLDR + FAQ + таблицы | блог, pillar, SD (нейро-формат `tldr` блок везде) | fasadrf.ru близко но не системно |

---

## Что копируем у каждого (что у них лучше — улучшаем)

> Каждая запись в формате **«элемент → как мы улучшаем»**.

### 1. musor.moscow (deep ✓ 2026-04-25)
- **Гео-структура (district pages)** → у них 109 районов × 1 услуга, у нас 8 × 4 = 32+ → ~150 SD к W14, **но** глубже на 4× (mini-case + ≥2 localFaq на каждой; у musor только текст и форма)
- **Калькулятор на главной** → у нас фото→смета (мощнее, чем выпадайки)
- **/park-spectehniki/** → у нас `/park-tehniki/` + cross-link с districts
- **/licenzii/, /normativnye-dokumenty/** → у нас аналогично + СРО + цитата оператора

### 2. grunlit-eco.ru (stub ✗ — pending live audit)
- pending live audit W3
- Гипотеза: **B2B-договор паттерн** → если есть отдельная страница договора, копируем формат и добавляем «штрафы ГЖИ берём на себя»

### 3. liwood.ru (deep ✓ 2026-04-25)
- **3 уровня иерархии** `/services/[pillar]/[sub]/[district]/` → у нас идентично
- **40 districts × udalenie-derevev** → строим 8 districts × 4 услуги = 32 SD по арбо одной (vs 40 у liwood) **но** глубже на 4×
- **29 sub-обрезка по породам** → копируем подход sub-detail; для нас на arboristika sub-cluster
- **/info/calculator/, /info/onlayn-konsultatsiya/** → у нас фото→смета (мощнее) + calc placeholder Stage 0
- **85 статей блог** → стартуем 30, к M9 целимся 85, **но** на каждой статье — связка с pillar/SD (у liwood blog cross-link слабее)
- **gallery × 12 типов услуг** → у нас Cases collection с привязкой к sub + district

### 4. promtehalp.ru (deep ✓ 2026-04-25, sitemap старый)
- **/work + /video** галерея → у нас Cases + (опционально) Before-After block
- **СРО-упоминание** → у нас явно на каждой B2B + footer
- **Слабые стороны** (sitemap 2021, 5 sub flat): легко обгоняем по URL-объёму и контент-глубине

### 5. lesoruby.ru (stub ✗ — pending)
- pending — после live audit заполнить + сверить с lesoruby.com

### 6. alpme.ru (deep ◯ 2026-04-25)
- **/msk/ root-сегмент** → у нас districts через `/raiony/[slug]/`, паттерн понятен — отложен (не делаем СПб-филиал в Stage 0-3)
- **Калькулятор** → фото→смета мощнее
- **Слабая сторона** (нет блога): легко обгоняем по контент-глубине

### 7. arboristik.ru (deep ◯ 2026-04-25, sitemap 2017)
- **~50 статей блог** → стартуем 30, copying тематику (по породам, сезонные)
- **Подвиды по породам** → у нас arboristika sub-cluster (12 sub)
- **Слабые стороны** (sitemap 2017, HTTP): обгоняем по UX + E-E-A-T + schema

### 8. arborist.su (stub ✗ — pending)
- pending — после live audit заполнить
- Гипотеза: **expert-positioning TOV** → если есть авторы-эксперты, копируем формат + усиливаем реальным B2B-автором (оператор)

### 9. forest-service.ru (stub ✗ — pending)
- pending — после live audit заполнить
- Гипотеза: **лесные услуги** + **B2B для СНТ/садоводств** → новый угол для нашего B2B-хаба (УК/ТСЖ + застройщики + СНТ?)

### 10. tvoi-sad.com (stub ✗ — pending)
- pending — после live audit заполнить
- Гипотеза: **сезонные кластеры** (весна/осень) + **связка арбо+уход** → паттерн для арбо-блога; **проверить пересечение с apps/shop/** (если магазин — не наша услуговая зона, передать в `EPIC-SEO-LANDSHAFT`)

### 11. spilservis.ru (stub ✗ — pending)
- pending
- Гипотеза: **узкая ниша спил, конверсия одной услуги** → если у них прозрачные цены и кейсы — копируем формат прайса для arboristika sub

### 12. lesovod.su (stub ✗ — pending)
- pending
- Гипотеза: **расчистка-кластер** + **B2C/B2B mix** → если есть детальная структура расчистки (от заросшего до подготовки к стройке) — углубляем наш arboristika sub `raschistka`

### 13. virubka-dereva.ru (stub ✗ — pending, EMD)
- pending
- Гипотеза: **EMD-эффект** → проверяем позицию по «вырубка дерева»; если в топ-1-3, мы не обгоним по этому ключу без backlinks → фокус на `udaleniye dereva` / `spil dereva` + district

### 14. chistka-ot-snega.ru (stub ✗ — pending, EMD)
- pending
- Гипотеза: **зимняя сезонность + B2B УК/ТСЖ** + EMD-эффект → копируем sub-services крыш (механизированная / ручная / альпинистами / абонентское) + усиливаем «штрафы ГЖИ» B2B-крючком

### 15. demontazhmsk.ru (deep ✓ 2026-04-25)
- **Programmatic material × object** (стены × 5 материалов и т.д.) → у нас отложено до Wave 2.5 (наш демонтаж 225 wsfreq не оправдывает 4 уровня сейчас)
- **Слабые стороны** (нет блога): обгоняем по контент-глубине
- **Угроза для нас:** если расширятся на гео — risk R-mid

### 16. cleaning-moscow.ru (deep ✓ 2026-04-25)
- **/avtor-pavlina-pimenova/** и др. — отдельные посадочные авторов → у нас 2 авторов (компания + оператор), оператор с VK/TG sameAs (у cleaning-moscow без)
- **/proverka-informacii/** fact-check → копируем подход (не отдельная страница, а блок «Источник / fact-checker» в авторских blog)
- **B2B/B2C сегментация в URL** → у нас отдельный /b2b/ хаб, B2C — root по умолчанию
- **Слабые стороны** (статьи на корне антипаттерн): мы делаем /blog/ строго

### 17. fasadrf.ru (deep ✓ 2026-04-25)
- **148 статей блог + нейро-формат** → стартуем 30 → 85 к M9 + 100% TLDR + FAQ + таблицы → 100% нейро-формат (системнее)
- **4-уровневая иерархия по производителям подсистем** → не наша вертикаль (фасады), не копируем структурно
- **Слабые стороны** (HTTP): обгоняем по UX + schema

---

## TODO для W3 live audit (заполнить после Keys.so/Topvisor запуска)

### Phase 1: Подготовка (W2-W3 setup)
- [ ] Keys.so проект «Обиход competitors» с 17 доменами (re + seo-tech)
- [ ] Topvisor проект на 200 ключей baseline (4 pillar × top-50 по wsfreq)
- [ ] Я.Метрика 8 целей запущены (для нашей baseline)
- [ ] Я.Вебмастер «Структурированные данные» подключён

### Phase 2: Live audit 9 stub-конкурентов (re + seo-content)
- [ ] **grunlit-eco.ru** — B2B-структура (главный фокус)
- [ ] **lesoruby.ru** — связь с lesoruby.com (merge / keep separate)
- [ ] **arborist.su** — expert-positioning + TOV
- [ ] **forest-service.ru** — sub-services breadth + B2B для СНТ
- [ ] **tvoi-sad.com** — сезонные кластеры + пересечение с apps/shop/
- [ ] **spilservis.ru** — CR-pathways на узкой услуге + прайс
- [ ] **lesovod.su** — расчистка-кластер + B2C/B2B mix
- [ ] **virubka-dereva.ru** — EMD-эффект
- [ ] **chistka-ot-snega.ru** — EMD-эффект + B2B + сезонность

### Phase 3: Update existing 8 deep profiles (опционально)
- [ ] musor.moscow — досканировать /chastnym-klientam/ + /korporativnym-klientam/ (Wave 1 не подтвердил)
- [ ] liwood.ru — schema-coverage детально (3 random pages)
- [ ] остальные 6 — проверить актуальность IA-данных (1 неделя возраст — OK; обновлять только если sitemap изменился)

### Phase 4: Сводный benchmark-W3-baseline.md
- [ ] Сводная таблица 17 × 5 осей с **реальными цифрами** Keys.so/Topvisor
- [ ] Топ-3 для DoD утвердить или пере-собрать
- [ ] Топ-10 «утерянных» ключей (конкуренты топ-10, мы 50+ или нет URL)
- [ ] Топ-10 «выигранных» ключей если есть (мы где-то уже впереди)
- [ ] Δ % vs медианы топ-3 по каждой из 5 осей
- [ ] Раздел «# Где мы УЖЕ обогнали» (даже если 0 пунктов на baseline — пишем «0/N»)
- [ ] Передача в `cw` для написания эталонов W3 с явным winning angle vs топ-3

### Phase 5: Hand-off
- [ ] Артефакт `seosite/01-competitors/benchmark-W3-baseline.md` финальный
- [ ] Обновление этой матрицы (`differentiation-matrix.md`) с реальными цифрами
- [ ] Передача в `seo-content` → `cw` для wireframe-указаний (winning angle на каждом типе страницы)
- [ ] Hand-off в `specs/EPIC-SEO-CONTENT-FILL/US-6-competitor-benchmark/`
- [ ] poseo gate: апрув W3 baseline отчёта оператору

---

## История версий

| Дата | Версия | Кто | Что |
|---|---|---|---|
| 2026-05-01 | W3-draft (pre-audit) | re + poseo | Создан W2 ahead of schedule. 9 stub-профилей, гипотезы топ-3, TODO для W3. |
| pending | W3-baseline (final) | re + seo-content | Заполнить после Keys.so/Topvisor запуска |
| pending | W7-mid | seo-content | После Stage 1 + начала Stage 2 |
| pending | W14-final | seo-content | DoD финальная сверка |
