---
type: author
us: US-0
created: 2026-05-01
updated: 2026-05-01
sa: ux
status: draft
phase: spec
priority: P0
moscow: Must
art_apruv: approved-with-changes
art_apruv_date: 2026-05-01
poseo_apruv: pending
---

# Wireframe: Author

## URL pattern
`/avtory/[slug]/` — 2 страницы (Stage 0 seed):
- `/avtory/brigada-vyvoza-obihoda/` (company-page, kind: organization, silhouette)
- `/avtory/<operator-slug>/` (real B2B-author с VK/TG sameAs, kind: person, silhouette/back-shot)

Эталон W3 — `/avtory/brigada-vyvoza-obihoda/` (company-page).

## Цель
**E-E-A-T-якорь** через JSON-LD `Person → Organization` + cross-link на статьи блога/B2B-страницы (где автор написал/высказался). Уникальный winning angle — реальный B2B-автор (оператор) с VK/TG `sameAs` (cleaning-moscow.ru имеет авторов, но без cross-domain якорей).

## Источники в плане
- План §«Page Templates → 8. Author».
- Sa-spec AC-10 (Authors seed детальная спецификация).
- Brand-guide §13 TOV + §14 Don't (silhouette, без лиц).

## Hierarchy (desktop ASCII wireframe, 800-960 article + sidebar)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Авторы › Бригада вывоза Обихода             |
+----------------------------------------------------------------------+
| [HERO — author variant]                                              |
|                          col1 30%        col2 70%                    |
|  ┌──────────────────────┐  eyebrow: «Авторы Обихода»                 |
|  │                      │  H1 (40/48):                                |
|  │   AVATAR             │  «Бригада вывоза                            |
|  │   silhouette         │   Обихода»                                  |
|  │   ~280×280 px        │  jobTitle (16/24 muted):                    |
|  │   border-radius lg   │  «Подрядчик 4-в-1 ·                         |
|  │   bg cream           │   Москва и МО · ~6 лет»                     |
|  │   companyAuthor-     │                                             |
|  │   AvatarPrompt       │  meta-strip:                                |
|  │   fal.ai             │  ● 4 услуги · 8 районов МО · СРО            |
|  │                      │                                             |
|  └──────────────────────┘  [CTA primary] Получить смету →             |
|                            (фоновая кнопка, не главная цель страницы)|
+----------------------------------------------------------------------+
| [TEXT-CONTENT — bio]                                                 |
|  H2 «Кто мы»                                                         |
|  ~200 слов: история бригады, 4-в-1 опыт, годы в нише                 |
|  H2 «Что мы знаем (knowsAbout)»                                      |
|  ┌──────────────────┐                                                |
|  │ ▸ Вывоз мусора   │ tags-list: 4 направления                       |
|  │ ▸ Арбористика    │                                                |
|  │ ▸ Чистка крыш    │                                                |
|  │ ▸ Демонтаж       │                                                |
|  └──────────────────┘                                                |
|  H2 «Где работаем»                                                   |
|  worksInDistricts (district-icons §9):                               |
|  Одинцово · Красногорск · Мытищи · Раменское ·                       |
|  Химки · Пушкино · Истра · Жуковский                                 |
|  H2 «Документы и СРО»                                                |
|  ссылки на /sro-licenzii/, /komanda/                                 |
+----------------------------------------------------------------------+
| [RELATED-POSTS — статьи автора]                                      |
|  H2: «Статьи бригады»                                                |
|  +----+ +----+ +----+   3 cards (cover · H3 · date · reading-time)   |
|  |IMG | |IMG | |IMG |   ссылка → /blog/<slug>/                       |
|  +----+ +----+ +----+                                                |
|  (для company-page: статьи где author = company)                     |
+----------------------------------------------------------------------+
| [CTA-BANNER]                                                         |
|  variant: dark                                                       |
|  H2: «Закажите услугу у нашей бригады»                               |
|  «Мусор, деревья, крыши, демонтаж — за один выезд»                   |
|  [CTA primary] /foto-smeta/ →                                        |
+----------------------------------------------------------------------+
| Footer (общий)                                                       |
+----------------------------------------------------------------------+
```

**Variant для оператора (real-person author):** в hero — добавляется `sameAs strip` (VK · TG · MAX иконки 24px line-style §9) под jobTitle; bio 250 слов с акцентом на 4-в-1 опыт; статей-cross-link 3-5 на B2B-страницы (`/b2b/uk-tszh/`, `/b2b/dogovor/`, `/b2b/shtrafy-gzhi-oati/`) — оператор как реальный B2B-автор.

## Hierarchy (mobile ASCII wireframe)

```
+----------------------+
| Header sticky        |
+----------------------+
| Breadcrumbs          |
+----------------------+
| HERO stacked         |
|  AVATAR center       |
|  (~160px width)      |
|  H1 28/36 center     |
|  jobTitle muted      |
|  meta-strip wrap     |
|  sameAs (если       |
|   person-variant)    |
|  CTA fader 100%      |
+----------------------+
| TEXT-CONTENT 1col    |
|  H2 «Кто мы»         |
|  H2 «Что знаем»      |
|  tags wrap           |
|  H2 «Где работаем»   |
|  district-icons grid |
|  H2 «Документы»      |
+----------------------+
| RELATED-POSTS swipe  |
| 1.2                  |
+----------------------+
| CTA-BANNER stacked   |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → Авторы → <Автор> | BreadcrumbList JSON-LD |
| 2 | hero (author variant) | ✓ | Avatar + H1 + jobTitle + meta-strip + (sameAs если person) + secondary CTA | один `<h1>`, avatar alt описывающий silhouette+role; sameAs links — `<a>` с `aria-label="VK профиль ..."`, `rel="me"` (E-E-A-T) |
| 3 | text-content | ✓ | Bio + knowsAbout + worksInDistricts + СРО | heading hierarchy, lang ru |
| 4 | related-posts | ✓ | 3-5 cards к /blog/<slug>/ или /b2b/<slug>/ (для оператора-B2B) | section aria-labelledby, cards as `<a>` |
| 5 | cta-banner | ✓ | «Закажите услугу» → /foto-smeta/ | dark variant, контраст |

**Отличие от Pillar:** нет lead-form (это E-E-A-T-страница, не sales), нет mini-case, нет faq. Hero — author-led (avatar + bio meta), text-content — bio + structured tags (knowsAbout / worksInDistricts).

## Winning angle vs топ-3 конкурентов

- **vs cleaning-moscow.ru** (E-E-A-T чемпион, отдельные авторы как посадочные):
  - Наш оператор-автор имеет **VK/TG `sameAs`** (cross-domain identity якорь) — у cleaning-moscow авторы без cross-domain якорей. Это **unique winning angle #5** (differentiation matrix).
  - У нас 2 типа автора (company-page + person), у них только person.
  - Cross-link company-page → 4 pillar и 8 districts через knowsAbout/worksInDistricts — у них автор только blog-cross-link.

- **vs musor.moscow / liwood.ru / fasadrf.ru:** не имеют авторов вообще — **0/16 (без cleaning-moscow) делает E-E-A-T через авторов**.

- **vs forest-service.ru / arborist.su / arboristik.ru** (потенциально expert-positioning):
  - Pending live audit, но даже если есть авторы — без VK/TG sameAs cross-domain якоря.

## Mobile considerations

- **Avatar centered** в hero (~160px width), H1 центрирован, jobTitle под H1.
- **Tags-list для knowsAbout:** wrap-flex, каждый tag chip ≥32px height (touch не критично — статика, но WCAG-friendly).
- **District-icons grid:** 4×2 на mobile (8 districts) с icon (line §9 district line) + name под icon.
- **sameAs strip** (для person): icons 32×32px с tap-area 44×44px (padding), gap 12px.

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Avatar `<img alt="...">` описательный: «Силуэт бригады Обихода — фигуры в рабочей одежде, без лиц» (для company); «Силуэт оператора Обихода со спины» (для person). НЕ «Image of...».
- [ ] sameAs: `<a href="..." rel="me" aria-label="VK профиль оператора Обихода"><svg aria-hidden="true">VK</svg></a>` — иконка decorative, текст в aria-label
- [ ] Tags-list — `<ul role="list">` с `<li><span class="tag">Вывоз мусора</span></li>` (не link если только indicator) ИЛИ `<a href="/<service>/">Вывоз мусора</a>` если link на pillar
- [ ] district-icons — link к /raiony/<district>/ с `aria-label`
- [ ] Touch ≥44px на sameAs и district-icons
- [ ] Cards related-posts — link-card pattern
- [ ] Reduced-motion (avatar не анимируется)
- [ ] Reflow 400%

## SEO annotations

- **H1:** имя автора (для company «Бригада вывоза Обихода», для person — реальное ФИО).
- **JSON-LD:**
  - **Company-page:** `Organization` (`@type: Organization`, `name`, `description`, `url`, `logo`, `sameAs: []`, `subOrganization: { @type: Organization, name: «Обиход» }`, `knowsAbout: [«вывоз мусора», ...]`, `areaServed: [Districts]`). Опционально `Person` wrapper если company-page трактуется как «коллективный автор» (sa-spec AC-10.2: «schema Person → Organization»). seo-tech финализирует pattern.
  - **Person-page (оператор):** `Person` (`name`, `jobTitle: «Оператор подряда / Co-founder»`, `worksFor: { @type: Organization, name: «Обиход» }`, `sameAs: [VK, TG]`, `knowsAbout: [...]`, `image: silhouette-url`).
- **Canonical:** self.
- **Internal links:**
  - related-posts → /blog/<slug>/ (3-5)
  - Для оператора — link на `/b2b/uk-tszh/`, `/b2b/dogovor/`, `/b2b/shtrafy-gzhi-oati/` (как реальный B2B-автор).
  - district-icons → /raiony/<district>/
  - knowsAbout tags → /<service>/

## TOV constraints

- Bio — Caregiver+Ruler. «Бригада», «делаем», «приходим», «закрываем». НЕ «мы — профессионалы своего дела». <!-- obihod:ok -->
- Конкретика: «~6 лет», «8 районов», «4 услуги», «250 объектов в год» (если данные есть; если нет — без выдуманных).
- Privacy + бренд: **никаких лиц** в avatar (silhouette/back-shot обязательно — see brand-guide §14 Don't + memory `companyAuthorAvatarPrompt`).
- Author-bio для company: «Бригада вывоза Обихода» — TOV-черновик от cw → apruv art (TOV §13/§14) → apruv poseo (SEO).
- НЕ: «дружный коллектив», «команда настоящих профи», «индивидуальный подход». <!-- obihod:ok -->

## Эталонный URL для W3
`/avtory/brigada-vyvoza-obihoda/` (company-page seed Stage 0).

## Открытые вопросы для poseo / art

1. **Schema Person → Organization для company-page:** sa-spec AC-10.2 говорит — для company «Organization с subOrganization ссылкой на основной Organization Обихода». Это корректнее чем `Person` wrapper. Рекомендация ux: использовать `Organization` + `subOrganization` (apruv `seo-tech`).
2. **Avatar silhouette dimensions:** 280×280 desktop, 160×160 mobile? Или 320×320 / 200×200? Рекомендация ux: 280×280 desktop (читаемо как portrait, не лицо), 160×160 mobile (туманно как person-icon).
3. **Bio 200 слов для company / 250 для person — сколько ровно?** Sa-spec AC-10.1 говорит «~200 слов». Рекомендация ux: 200-250 диапазон, не строго 200; мерим по смыслу, не по cnt.
4. **CTA-banner в author-эталоне обязательно или опционально?** Author — E-E-A-T-страница, primary CTA в hero (secondary), banner ниже — потенциально излишне. Рекомендация ux: для эталона W3 — оставляем (cta-banner standardised pattern на каждой странице, без него page чувствуется «неоконченной»). Для backlog после A/B — можно убрать если signal слабый.
5. **«4 услуги»  в meta-strip vs в knowsAbout** — дублирование? Рекомендация ux: meta-strip в hero — короткое eye-catch («4 услуги · 8 районов · СРО»); knowsAbout в text-content — расширенная list с link. Дублирование оправдано: hero — first-paint, knowsAbout — schema-якорь.

## Art review · 2026-05-01

**Status:** approved-with-changes.

**Что apruv'нуто:**
- Author hero без lead-form (E-E-A-T-страница, не sales) — корректно.
- Bio + knowsAbout + worksInDistricts + СРО структура — соответствует §13 TOV (Caregiver «бригада», конкретика 4 услуги/8 районов/~6 лет).
- **Silhouette/back-shot обязательно** (§14 «без stock с рукавицами» + анти catalog-shot) — apruv `companyAuthorAvatarPrompt` direction.
- Cross-domain VK/TG sameAs strip для person-variant — winning angle #5, apruv.

## Art changes

### 1. Avatar dimensions — 200×200 desktop / 140×140 mobile (R3 решение: вариант B)

ux предложил 280×280 desktop / 160×160 mobile.

**Проблема:**
- 280px на desktop визуально подавляет H1 + jobTitle + meta-strip в hero (col1 30% / col2 70% pivot нарушается). Author-page — это E-E-A-T-страница, акцент на bio и knowsAbout, не на avatar.
- 160px mobile — для silhouette с min-recognition достаточно 140px (туманно как person-icon, не «фото профиля»).

**Финальное решение:**
- **Desktop avatar 200×200px** (компромисс между recognition и hierarchy).
- **Mobile avatar 140×140px**, centered.
- Border-radius `--radius-lg` 16px (как ux указал — apruv), фон `--c-card`.

### 2. CTA-banner в author-эталоне — keep

ux колебался («page чувствуется неоконченной без banner»). **Apruv: оставляем cta-banner** в author-эталоне (стандартный pattern, единообразие с другими типами). Backlog после A/B baseline можно убрать если signal слабый.

**Visual guidance:**
- Avatar — `--c-card` background, `--radius-lg` 16px (НЕ circle — circle ассоциируется с «фото профиля social», silhouette в квадрате/rounded-square — анонимнее, ближе к Caregiver-сдержанности).
- jobTitle Golos 400 16/24 `--c-muted` (§13 TOV: «Подрядчик 4-в-1 · Москва и МО · ~6 лет»).
- meta-strip dots `--c-accent` 6px (§4 accent для разделителей в meta).
- sameAs icons 24×24 line-style §9 shop-line (если есть VK/TG glyph) — touch-area 44×44 padding.
- Tags-list (knowsAbout): `<a>` chips с border 1px `--c-line`, padding 6px 12px, `--radius-sm` 6px, font 13/20.
- District-icons grid 4×2 mobile: line §9 districts 24×24 + name под icon 12px, gap 16px.

**fal-prompt direction:**
- `companyAuthorAvatarPrompt`: бригада в рабочей одежде (jacket, защитный жилет), **без лиц**, силуэты со спины или с обрезкой по плечам. Минимум 2 фигуры (для company «Бригада...»). Документальный стиль.
- `operatorAuthorAvatarPrompt` (для person-variant): один силуэт со спины в рабочей одежде; possibly с инструментом в руках (clipboard/радио/планшет — Ruler-конкретика). Без лица.
- **Никаких «дружеских поз», рукопожатий, улыбок** (§14 anti).
- Палитра: землистая, без эко-зелени.

**Backlog для design/integration:**
- Добавить в brand-guide §9 (Icons) явный glyph-id для VK/TG/MAX в shop-line или новой «social-line» (сейчас §9 — services + shop + districts + cases, нет social-icons).
- Spec для `companyAuthorAvatarPrompt` + `operatorAuthorAvatarPrompt` — добавить в brand-guide §14 Don't раздел «Photography → авторы» с прямым запретом на лица + позитивными примерами silhouette/back-shot.

**Эскалация:** Schema Person → Organization (вопрос #1 от ux) — **delegate to `seo-tech`**, не зона art.
