# Team bios spec — бригады, бригадиры, инженеры

**Статус:** US-4 W14 day 1 — sa-seo + cw initial draft. Real-names бригадиров pending operator. Sustained generic «Бригада вывоза Обихода» бesplaceно company-page.
**Owner:** sa-seo + cw → cms (при apruv operator → publish на `/komanda/` TeamMember секции).
**Cross-link:** `authors.md` (Author 3-N) · `case-evidence.md` (cases ↔ team member) · `credentials.md` (допуски на бригадира).

---

## 1 · Принцип «бригада, не лица»

Sustained art apruv (US-0 Run 3, 2026-04-29): на on-site **silhouettes без лиц**, не stock-фотографии «улыбающихся работников». Iron rule: «бригада, которая выехала на объект» — конкретные роли + допуски + опыт, без личной идентификации до operator передачи real-names.

Это работает на E-E-A-T axis: SGE/Я.Нейро ценят consistency роли + опыта, а не количество лиц на странице. Конкуренты cleaning-moscow и liwood используют stock-фото — это размытость авторитета. Наш паттерн — конкретика без лиц, которая мapped на real bio при apruv operator.

---

## 2 · Author 1 — «Бригада вывоза Обихода» (sustained company-page)

Sustained от Stage 1 etalon. Используем как public-facing default. Bio синхронизирован с `site/content/etalons-w3/author.json` + `site/scripts/seed-authors.ts`.

### 2.1 · Bio (~220 слов, sustained)

```
Бригада Обихода работает в Москве и Московской области с 2024 года. Закрываем
четыре направления одним договором: вывоз мусора, спил деревьев, чистку крыш
от снега и демонтаж построек. За первый сезон отработали 86 объектов в
Раменском, Одинцовском и Красногорском городских округах — в основном частный
сектор и небольшие УК.

По договору с УК и ТСЖ берём на себя штрафы ГЖИ и ОАТИ в пределах
ответственности подрядчика. Страховка ГО — 10 млн ₽, лицензия Росприроднадзора
на транспортирование отходов IV класса, СРО строителей. Допуски Минтруда
№782н, 3-я группа по высоте — для работ на кровлях и арбористики на высоте.

Смету присылаем за 10 минут после трёх фото в Telegram, MAX или WhatsApp.
Окна выезда — типовая заявка послезавтра до 12:00, аварийная (упало дерево,
затопило подвал) — за 1-2 часа 24/7.
```

### 2.2 · Структура бригад по округам (sustained Stage 1 `/komanda/`)

| Бригада | Округ | Состав | Pillar coverage |
|---|---|---|---|
| Бригада 1 | Одинцовский ГО | 1 бригадир + 2 рабочих + Газель 5м³ + альпинист (по запросу) | vyvoz + arboristika + chistka |
| Бригада 2 | Красногорский ГО | 1 бригадир + 2 рабочих + Газель 5м³ | vyvoz + demontazh |
| Бригада 3 | Мытищинский ГО | 1 бригадир + 2 рабочих + Газель 5м³ | vyvoz + arboristika |
| Бригада 4 | Раменское-Жуковский | 1 бригадир + 2 рабочих + Газель 5м³ + автовышка (по запросу) | vyvoz + arboristika + chistka |

По priority-B (Химки, Пушкино, Истра) — выезды по заявкам бригадой 1 или 2 ближайшего округа. Для удалённых СНТ — недельный график.

---

## 3 · Author 3-N — бригадиры (template, real-names pending)

3 шаблонных bio для бригадиров. Real-names передаёт operator W14 day 1-3. До передачи — hidden-from-public (live в этом файле, не на on-site).

### 3.1 · Бригадир 1 — старший vyvoz / demontazh

```
<Real-name TODO operator> — старший бригадир Обихода с <год> года, отвечает
за вывоз мусора и демонтажные работы по Одинцовскому и Красногорскому
округам. Опыт работы с гидравлическими ножницами, болгаркой по бетону,
демонтажом лёгких построек (хозблоки, заборы, веранды). Допуск №782н 2-й
группы (для работ на крышах при демонтаже кровель). Прошёл инструктаж по
обращению со строительными отходами по 89-ФЗ.
```

### 3.2 · Бригадир 2 — альпинист / арбористика

```
<Real-name TODO operator> — альпинист 3-й группы по высоте с <год> года.
Закрывает арбористику на высоте свыше 5м (спилы по частям, оттяжки,
порубочные остатки) и чистку крыш МКД зимой. Допуск №782н 3-й группы.
Работает с цепными пилами Husqvarna и Stihl, верёвочной связкой,
лестничными системами. Опыт работ в коттеджных посёлках и на придомовых
территориях МКД.
```

### 3.3 · Бригадир 3 — оператор автовышки + водитель Камаза

```
<Real-name TODO operator> — оператор автовышки и водитель Камаза-самосвала
8/20 м³ с <год> года. Удостоверение допуска к работам на высоте 2-я группа,
категория C водительского удостоверения, удостоверение на перевозку отходов
IV класса. Работает с автовышкой 22м (для арбористики на высоте до 4-этажного
дома, чистки крыш МКД, демонтажа кровель).
```

---

## 4 · Bio template — операторские поля (TODO operator)

Для каждого реального бригадира оператор передаёт:

| Поле | Тип | Пример | Status |
|---|---|---|---|
| Имя (без отчества) | string | «Александр» / «Игорь» / «Сергей» | pending |
| Слаг (slug) | string (lowercase, latin) | `alexander-brigadir` | pending |
| jobTitle | string | «Старший бригадир» / «Альпинист 3 группы» / «Оператор автовышки» | sustained template |
| Год начала работы | string | «2024» | pending |
| Округ | string | «Одинцово» / «Красногорск» / итд | pending |
| Pillar coverage | array | `["vyvoz", "demontazh"]` | sustained per template |
| Допуски | array | `["№782н 3-я группа", "категория C"]` | pending real-data |
| Опыт-факты | array (без выдумок) | `["опыт работы с Husqvarna", "опыт работ в МКД"]` | pending |

**Iron rule:** не выдумываем годы / число объектов / личные истории. До передачи operator — sustained generic шаблон; после — заполняем по operator данным.

---

## 5 · Что НЕ публикуем в bio

- Личные мобильные телефоны бригадиров (sustained `feedback_screen_folder` — privacy)
- Email бригадиров (sustained chrome canonical §33 — только `info@obikhod.ru`)
- Личные адреса (даже округа без point of contact)
- Личные фото лиц (sustained art apruv — silhouettes only до operator решения)
- Семейный статус, возраст, биография «за пределами компании»
- Истории «как пришёл в бизнес» (sustained `article-writing` banned patterns — fake vulnerability arcs)

---

## 6 · TeamMember секции на `/komanda/`

После передачи real-names — cms добавляет TeamMember секции на `/komanda/` страницу.

**JSON-LD pattern:**

```jsonld
{
  "@type": "OrganizationRole",
  "@id": "https://obikhod.ru/komanda/#brigadir-1",
  "roleName": "Старший бригадир",
  "member": {
    "@type": "Person",
    "@id": "https://obikhod.ru/avtory/<brigadir-slug>/#author",
    "name": "<Real-name>",
    "jobTitle": "Старший бригадир"
  },
  "memberOf": {
    "@id": "https://obikhod.ru/avtory/brigada-vyvoza-obihoda/#author"
  }
}
```

**Cms TODO для re-seed:**

- [ ] Добавить `blockType: "team-members"` block в `/komanda/` fixture (новый block в Payload schema, **TODO для popanel cross-team** — PAN ticket?).
- [ ] Шаблон card: avatar (silhouette если real-photo не передано) + name + jobTitle + bio (3-5 sentences) + cross-link на `/avtory/<slug>/` (если individual page published).
- [ ] Если real-photos не переданы — **silhouette pattern sustained** (cards могут быть без фото — текст-only), но JSON-LD `Person` всё равно с реальным `name`.

---

## 7 · Privacy / 152-ФЗ

**Iron rule:** даже при передаче real-names — NO PII (no phone, no email, no address). Sustained от Stage 1 `/komanda/` body «Контакт оператора» секция.

- Контакт публикуется через **роль**, не личность: «Telegram-бот @obikhod_bot» / «оператор Обихода — высылается реквизитами по запросу B2B».
- Это требование 152-ФЗ + iron rule «единый канал коммуникации» (sustained §33 brand-guide).

---

## 8 · Mapping на on-site

| URL | Display |
|---|---|
| `/komanda/` | sustained body (sustained Stage 1) + TeamMember секции (если real-names переданы) |
| `/avtory/brigada-vyvoza-obihoda/` | sustained company-page (Author 1) — single source of truth для bio |
| `/avtory/<operator>/` | conditional publish (см. `authors.md` §1.2) |
| `/avtory/<brigadir-slug>/` | optional publish (если operator решит — обычно не нужно, достаточно `/komanda/` секции) |
| cases | подпись «Бригада 1 / 2 / 3 / 4 — округ N» (без real-names в публичных cases) |
| pillar pages | sustained Author 1 в footer-line «Автор: Бригада вывоза Обихода» |

---

## 9 · TODO checklist

- [ ] Operator передаёт 2-3 real-names + slugs + jobTitle + допуски (см. §4).
- [ ] cw превращает 3 шаблонных bio (§3.1-3.3) в реальные через operator данные.
- [ ] popanel cross-team: добавить `blockType: "team-members"` в Payload schema (если decided).
- [ ] cms publish TeamMember секции на `/komanda/`.
- [ ] seo-tech: lint:schema audit на `/komanda/` — verify `OrganizationRole` + `Person` parsed.
- [ ] cms: cross-link cases → team-member (если real-names переданы) — opt-in, обычно `Бригада 1` достаточно.

---

## 10 · Escalation log

| Item | Owner | Status | Deadline | Hard/Soft |
|---|---|---|---|---|
| 2-3 бригадира real-names + допуски | poseo → operator | pending | W14 day 1-3 | Soft (sustained company-page OK на EPIC close) |
| Real-photos бригадиров | poseo → operator | pending | post-EPIC OK | Soft (silhouette sustained) |
| `team-members` block в Payload | popanel cross-team | pending | post-EPIC backlog | Soft |

**Default:** sustained company-page Author 1 + sustained `/komanda/` Stage 1 fixture. EPIC PASS на 4/5 axes без бригадирских real-names.

---

## 11 · Cross-references

- `seosite/06-eeat/authors.md` §1.3 — Author 3-N spec
- `seosite/06-eeat/credentials.md` §3.2 — допуски Минтруда №782н групп 2-3
- `seosite/06-eeat/case-evidence.md` — cases ↔ команда cross-link
- `site/content/stage1-w5/komanda.json` — on-site fixture sustained
- `site/content/etalons-w3/author.json` — Author 1 etalon
