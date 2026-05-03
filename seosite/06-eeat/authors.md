# Authors hub spec — E-E-A-T US-4 Track A

**Статус:** US-4 W14 day 1 — sa-seo + cw initial draft. Operator real-name + VK/TG sameAs pending W14 day 1-3.
**Owner:** sa-seo + cw (этот файл) → cms (publish on-site `/avtory/`).
**Mapping на on-site:** `/avtory/` hub + `/avtory/<slug>/` individual pages + JSON-LD `Person`/`Organization` на 17 blog + 14 cases.
**Cross-link на:** `credentials.md` (СРО / ИНН) · `team-bios.md` (бригадиры) · `case-evidence.md` (cases ↔ author).

---

## 1 · Структура авторства Обихода

Три уровня авторства, отражающие реальную модель работы (компания + основатель + бригадир), а не размытое «коллективное мы».

```
Organization (Обиход юр.лицо)
   ├── founder → Person (оператор; pending real-name)
   ├── employee → Person (бригадир; pending real-name × 2-3)
   └── subOrganization → Organization (Бригада вывоза Обихода — public-facing «company-page»)
                             └── used as default author для info-cluster blog
```

### 1.1 · Author 1 — «Бригада вывоза Обихода» (sustained, default)

Используем как **default author** для всех публикаций без operator-real-name.
Не «индивидуальный исполнитель», не псевдоним — это публичное имя бригады. Sustained от Stage 1 W3 (`site/content/etalons-w3/author.json`).

- `slug`: `brigada-vyvoza-obihoda`
- `kind`: `organization`
- `schemaType`: `Organization`
- `subOrganizationOf`: `https://obikhod.ru/#organization` (legal entity)
- `jobTitle`: «Команда»
- `knowsAbout`: вывоз мусора · арбористика · чистка крыш · демонтаж · B2B-договоры с УК и ТСЖ · штрафы ГЖИ и ОАТИ
- `worksInDistricts`: 8 priority-A+B districts (sustained Stage 1+3)
- `sameAs`: TODO — VK / Telegram channel (после operator W14 day 3)
- `avatarUrl`: silhouette (без лиц, sustained art apruv US-0 Run 3)

**Используется как author для:** все info-cluster blog статьи (info, без commercial intent), все sub-pages services × districts pages где individual operator не нужен, footer copyright, default fallback.

### 1.2 · Author 2 — оператор (real-name, conditional publish)

Pending operator action W14 day 1-3. Если real-name + VK/TG sameAs передан до W14 day 3 EOD — публикуем `/avtory/<operator-slug>/` + переводим commercial-bridge blog + B2B cases на этого автора.

Если pending к W14 day 3 — keep deferred (sustained generic Author 1). Iron rule: **«не выдумываем имена»** (sustained `feedback_no_reask` + 30+ commits Stage 3 honest data).

- `slug`: `<operator-slug>` (TODO operator — например `aleksandr-obihod` или похожее; решает оператор)
- `kind`: `person`
- `schemaType`: `Person`
- `jobTitle`: «Основатель и директор» (TODO operator confirm)
- `worksFor`: → Author 1 Organization
- `sameAs`: VK personal · Telegram personal · опционально RuTube/Дзен (TODO operator передаёт URLs)
- `knowsAbout`: те же 6 + «B2C / B2B продажи» + «лицензирование подрядчиков»
- `avatarUrl`: TODO operator — реальное фото или silhouette (operator decision)

**Используется как author для:** commercial-bridge blog статьи (B2B-крючки, ФККО, СРО, лицензии), все B2B cases (УК / ТСЖ / застройщики), `/o-nas/` страница (если будет), `/sro-licenzii/` подпись.

### 1.3 · Author 3-N — бригадиры (real-names, conditional)

2-3 бригадира с real-names — pending operator W14 day 1-3. До передачи — hidden-from-public (живёт в `team-bios.md`, не публикуется на on-site).

- `slug`: `<brigadir-slug>` (TODO operator × 2-3)
- `kind`: `person`
- `schemaType`: `Person`
- `jobTitle`: «Старший бригадир» / «Альпинист 3 группы» / «Оператор автовышки»
- `worksFor`: → Author 1 Organization
- `sameAs`: опционально (большинство бригадиров не имеют публичных профилей; OK skip)
- `knowsAbout`: pillar-specific (vyvoz / arboristika / chistka / demontazh)

**Используется как author для:** cases где бригадир был на объекте (cross-link `case.team-member`), cards на `/komanda/` странице (TeamMember секции).

---

## 2 · JSON-LD spec — `Person` + `Organization`

### 2.1 · Author 1 — Organization (sustained Stage 1)

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://obikhod.ru/avtory/brigada-vyvoza-obihoda/#author",
  "name": "Бригада вывоза Обихода",
  "alternateName": "Команда Обихода",
  "url": "https://obikhod.ru/avtory/brigada-vyvoza-obihoda/",
  "logo": "https://obikhod.ru/og/author-brigada.png",
  "subOrganizationOf": {
    "@id": "https://obikhod.ru/#organization"
  },
  "knowsAbout": [
    "вывоз мусора", "арбористика", "чистка крыш", "демонтаж",
    "B2B-договоры с УК и ТСЖ", "штрафы ГЖИ и ОАТИ"
  ],
  "areaServed": [
    "Одинцово", "Красногорск", "Мытищи", "Раменское",
    "Химки", "Пушкино", "Истра", "Жуковский"
  ],
  "sameAs": []
}
```

Поле `sameAs` остаётся пустым массивом до operator передачи VK / Telegram channel URLs. Не заполняем выдуманными ссылками.

### 2.2 · Author 2 — Person (conditional)

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://obikhod.ru/avtory/<operator-slug>/#author",
  "name": "<TODO operator real-name>",
  "jobTitle": "Основатель и директор",
  "worksFor": {
    "@id": "https://obikhod.ru/avtory/brigada-vyvoza-obihoda/#author"
  },
  "url": "https://obikhod.ru/avtory/<operator-slug>/",
  "sameAs": [
    "<TODO VK personal URL>",
    "<TODO Telegram personal URL>"
  ],
  "knowsAbout": [
    "вывоз мусора", "арбористика", "чистка крыш", "демонтаж",
    "B2B-продажи", "лицензирование подрядчиков"
  ]
}
```

### 2.3 · Author 3-N — Person (conditional)

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://obikhod.ru/avtory/<brigadir-slug>/#author",
  "name": "<TODO brigadir real-name>",
  "jobTitle": "Старший бригадир",
  "worksFor": {
    "@id": "https://obikhod.ru/avtory/brigada-vyvoza-obihoda/#author"
  }
}
```

Бригадирская страница может не публиковаться на on-site — достаточно ссылки на `/komanda/` секцию.

---

## 3 · sameAs cross-domain pattern

Iron rule sustained Stage 2: cross-domain `sameAs` усиливает E-E-A-T axis (sustained `07-neuro-seo/sge-readiness.md` — SGE цитирует чаще авторов с consistent cross-domain authority).

Допустимые domains для `sameAs`:

| Domain | Применимость | Pending от operator |
|---|---|---|
| `vk.com/<handle>` | personal или company | ✅ обязательно для Author 2 |
| `t.me/<channel>` | personal или company | ✅ обязательно для Author 2 |
| `rutube.ru/u/<handle>` | если есть видео-контент | опционально |
| `dzen.ru/<handle>` | если есть статьи на Дзен | опционально |
| `linkedin.com/in/<handle>` | personal | опционально (но low-priority в РФ) |
| `youtube.com/@<handle>` | если есть видео | опционально |
| `instagram.com/<handle>` | заблокирован в РФ | **не используем** |

**Не используем:** Twitter/X (заблокирован в РФ), Facebook (заблокирован), любые placeholder-URLs которые не ведут на реальный аккаунт.

---

## 4 · Bio template — 3-5 sentences

Шаблон для Author 2 / Author 3 — без выдумок, без маркетингового тумана.

```
<Имя> — <jobTitle> Обихода с <год> года. Закрывает <ключевые задачи pillar или
operations>. <Опыт-факт: год / число объектов / типовая бригада или что-то из team-bios.md>.
<Документы и допуски: СРО / лицензия / №782н — кросс-ссылка на /sro-licenzii/>.
<Контакт-канал: TG-channel / VK / форма заявки — без личных мобильных.>
```

Пример (template для operator при апрувe):

```
Александр — основатель и директор Обихода с 2024 года. Закрывает B2B-договоры
с УК и ТСЖ, контракты с застройщиками, лицензирование подрядчиков. За 2024 год
бригада отработала 86 объектов в Раменском, Одинцовском и Красногорском
округах. Документы и СРО — на /sro-licenzii/. Контакт — Telegram-канал бригады
@obikhod_channel и форма заявки на /foto-smeta/.
```

Iron rule: **никаких личных мобильных в bio**, никаких email вне `info@obikhod.ru` (sustained §33 brand-guide site-chrome canonical).

---

## 5 · Mapping на on-site

| URL | Author |
|---|---|
| `/blog/<info-cluster-N>/` (12 шт. info без commercial intent) | Author 1 (default) |
| `/blog/<commercial-bridge-N>/` (5 шт. commercial-bridge) | Author 2 (если real-name); else Author 1 |
| `/kejsy/<case-N>/` (8 Stage 2 cases) | Author 1 sustained, fallback |
| `/kejsy/<case-N>/` (6 Stage 3 W13 B2B cases) | Author 2 (если real-name); else Author 1 |
| `/sro-licenzii/` | Author 2 (signature на странице); fallback Author 1 |
| `/komanda/` | Author 1 (общая команда), TeamMember секции — Author 3-N (если real-names) |
| `/avtory/` hub | список Author 1 + (Author 2 если published) |
| pillar pages (4 шт.) | Author 1 |
| sub-pages (~22 шт.) | Author 1 |
| sub-level SD (~84 шт.) | Author 1 |
| `/b2b/dogovor/` + B2B хаб | Author 2 (если real-name); else Author 1 |

---

## 6 · TODO checklist для cms

При публикации/replace:

- [ ] cms re-seed `/avtory/brigada-vyvoza-obihoda/` — sustained от etalon-w3, проверить что HTTP 200 + JSON-LD parse OK.
- [ ] cms publish `/avtory/<operator-slug>/` — **только если** operator real-name + VK/TG sameAs передан W14 day 3 EOD.
- [ ] cms re-author 17 blog → 12 на Author 1 + 5 на Author 2 (если published) или sustained Author 1 (если не).
- [ ] cms re-author 14 cases → 8 на Author 1 + 6 на Author 2 (если published) или sustained Author 1.
- [ ] cms publish 2-3 бригадира на `/komanda/` TeamMember секции — **только если** real-names переданы.
- [ ] seo-tech: lint:schema audit на 4 routes (`/avtory/`, `/avtory/brigada-vyvoza-obihoda/`, `/avtory/<operator>/` если published, footer JSON-LD) — exit 0.
- [ ] cms / cw: `sameAs` на Author 1 — добавить VK/TG channel URLs когда operator передаст (W14 day 3+).

---

## 7 · Escalation log (operator pending)

| Item | Owner | Status | Deadline |
|---|---|---|---|
| Operator real-name + slug | poseo → operator | pending | W14 day 1-3 |
| Operator VK/TG personal URLs | poseo → operator | pending | W14 day 3 |
| 2-3 бригадира real-names | poseo → operator | pending (Soft) | post-EPIC OK |
| Author 1 sameAs (VK/TG channel) | poseo → operator | pending | W14 day 3 |

**Conditional publish logic** (sustained sa-seo §3.2.1):
- Real-name + sameAs до W14 day 3 EOD → publish + close E-E-A-T axis опережение (AC-7 PASS).
- Pending к W14 day 7 → keep deferred; E-E-A-T axis sustained parity (AC-7 sustained, EPIC PASS на 4/5 axes).

---

## 8 · Cross-references

- `seosite/06-eeat/credentials.md` — СРО / ИНН / ОГРН для Author 1+2 `Organization.identifier`
- `seosite/06-eeat/team-bios.md` — bio шаблоны бригадиров (Author 3-N)
- `seosite/06-eeat/case-evidence.md` — связка cases ↔ author cross-link
- `seosite/06-eeat/methodology.md` — методики работы (cross-link с pillar SD pages где Author 1 указан)
- `site/content/stage1-w5/komanda.json` — on-site `/komanda/` finalize
- `site/content/stage1-w5/sro-licenzii.json` — on-site `/sro-licenzii/` finalize
- `site/content/stage3-w14-eeat/avtory-brigada-vyvoza-obihoda.json` — on-site company-author finalize
