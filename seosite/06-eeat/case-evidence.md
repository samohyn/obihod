# Case-evidence spec — связка cases ↔ realnost

**Статус:** US-4 W14 day 1 — sa-seo + cw initial draft. 14 cases publication sustained Stage 2 (8) + Stage 3 W13 (6); evidence-chain pending operator.
**Owner:** sa-seo + cw → cms (admin-only `case.evidenceNote` + `case.factCheckedBy` поля; pending popanel schema).
**Cross-link:** `authors.md` (cases.author) · `credentials.md` (СРО на cases B2B) · `methodology.md` (методики ↔ pillar в cases).

---

## 1 · Зачем нужна evidence-chain

Cases — основная демонстрация expertise + experience осей E-E-A-T. На on-site публикуем mini-card pattern (sustained Stage 2): задача, решение, результат, бригада, район, фото.

Что **не публикуется** (PII / privacy / договорные обязательства):
- ФИО клиента
- Точный адрес объекта
- Номер договора
- Сумма по договору
- Реквизиты УК / ТСЖ / застройщика

Что **должно жить в admin** (не на on-site, а в Payload field как evidence-chain для возможного fact-check от Я.ВебМастер «Достоверная информация» или Roskomnadzor если требуется):

```
Case
  ├── publishable: задача / решение / результат / фото / бригада / район / pillar (sustained on-site)
  └── admin-only evidence:
        ├── evidenceNote (textarea) — дата работ + клиент-сегмент + объём договора
        ├── factCheckedBy (relation Authors) — кто из бригадиров был на объекте
        ├── contractRef (string) — внутренний номер договора (НЕ публикуется)
        └── proofDocuments (uploads) — скан акта / фото-отчёт / договор (НЕ публикуется)
```

---

## 2 · Mapping 14 cases × evidence-fields

Pending operator передаёт reality-data для каждого case (privacy-redacted). До передачи — sustained generic case content (sustained Stage 2/3 pattern «бригадир Александр / Игорь / Сергей» как placeholder).

### 2.1 · Stage 2 cases (8 шт.)

| # | Case slug | Pillar | District | Evidence pending от operator |
|---|---|---|---|---|
| 1 | `vyvoz-stroymusora-uk-odincovo` | vyvoz | Одинцово | дата + ID УК + объём + класс отходов |
| 2 | `arboristika-spil-berezi-snt-ramenskoe` | arboristika | Раменское | дата + сегмент (СНТ-частник) + порода + диаметр |
| 3 | `chistka-krysh-mkd-mytishchi` | chistka | Мытищи | дата + ID УК + площадь крыши + объём снега |
| 4 | `demontazh-hozblok-krasnogorsk` | demontazh | Красногорск | дата + сегмент + объём (м³) + ФККО класс |
| 5 | `vyvoz-bytmusora-tsj-ramenskoe` | vyvoz | Раменское | дата + ID ТСЖ + объём контейнера |
| 6 | `arboristika-formovka-elei-istra` | arboristika | Истра | дата + сегмент + число деревьев |
| 7 | `chistka-snega-fasada-pushkino` | chistka | Пушкино | дата + сегмент + объём наледи |
| 8 | `demontazh-zabora-zhukovsky` | demontazh | Жуковский | дата + сегмент + длина забора |

### 2.2 · Stage 3 W13 cases (6 шт.)

| # | Case slug | Pillar | District | Evidence pending от operator |
|---|---|---|---|---|
| 9 | `vyvoz-bytovogo-musora-uk-himki` | vyvoz | Химки | дата + ID УК + объём + класс ФККО |
| 10 | `b2b-zaстройщик-musor-площадки` | vyvoz B2B | Раменское | дата + сегмент (застройщик) + площадь стройплощадки + объём |
| 11 | `chistka-krysh-tsj-pushkino` | chistka | Пушкино | дата + ID ТСЖ + площадь + аварийность |
| 12 | `arboristika-formovka-istra-fm` | arboristika B2B | Истра | дата + ID FM-оператора + число объектов |
| 13 | `demontazh-stroyplo schadki-mytishchi` | demontazh B2B | Мытищи | дата + сегмент + объём + class ФККО |
| 14 | `vyvoz-snt-zhukovsky-pomegalo-kompleks` | vyvoz | Жуковский | дата + сегмент + объём за месяц |

---

## 3 · Шаблон договора (без PII)

Этот раздел — для `/b2b/dogovor/` страницы, не для cases. Cross-link.

Стандартный B2B договор Обихода содержит:

- **Преамбула:** «Подрядчик» (Обиход юр.лицо ИНН) и «Заказчик» (УК / ТСЖ / FM / застройщик).
- **Предмет:** услуги по выбранному pillar в перечне (Приложение 1).
- **Сроки:** окно выезда / периодичность (для абонентского обслуживания УК).
- **Стоимость:** табличная по `Приложению 2` (расценки за объём / м² / штуку).
- **Порядок выплат:** аванс / по факту / по графику (по согласованию).
- **Ответственность:** **штрафы ГЖИ и ОАТИ в пределах ответственности подрядчика — на стороне Обихода** (USP, sustained Stage 1).
- **Документы подрядчика:** Приложение 3 — копии СРО / лицензии / страховки / допусков (sustained `credentials.md`).
- **Класс отходов (если pillar = vyvoz):** ФККО код в Приложении 4 (sustained `credentials.md` §5).
- **Конфиденциальность:** обработка персональных данных по 152-ФЗ (sustained `/sro-licenzii/`).
- **Реквизиты:** ИНН / ОГРН / КПП / банковские реквизиты Обихода + Заказчика.

**Где живёт:** Payload «B2BContract» template (post-EPIC backlog для popanel) или статический PDF на `/static/dogovor-template.pdf` (минимум на W14).

---

## 4 · Акт выполненных работ (без PII, референс)

Стандартный акт после завершения работ:

- Номер договора + дата
- Pillar + объём (м³ / м² / штуки / часы)
- Класс отходов (для vyvoz / demontazh) + ФККО
- Бригада (без real-names в публичных копиях; внутренняя версия — с real-names и допусками)
- Адрес объекта (privacy-redacted в публичных копиях)
- Подпись подрядчика + Заказчика

**Применимость в cases:** упоминаем «акт подписан» как factual proof, без публикации скана. Скан живёт в Payload `Case.proofDocuments` (admin-only).

---

## 5 · «Документы доступны по запросу через cms admin»

Sustained iron rule (от Stage 1 `/sro-licenzii/`): «Копии документов высылаем по запросу до подписания договора». Аналогично на cases:

> **Honest data placeholder:** «Акты и фото-отчёт по этому case доступны по запросу при подписании договора. Privacy-redacted версия может быть выслана для предварительного review».

Sustained на cards cases — **cross-link на `/foto-smeta/` или `/b2b/dogovor/`** для запроса. Не «связаться с менеджером», не «оставьте контакты для расчёта» — конкретный канал.

---

## 6 · Cms / Payload schema TODO (popanel cross-team)

При apruv operator — popanel расширяет `Case` collection:

```ts
// Новые поля в Case collection (sustained existing)
{
  // ... existing fields (slug, h1, summary, hero, body, author, etc.)
  evidenceNote: {
    type: 'textarea',
    admin: { position: 'sidebar' },
    label: 'Evidence note (admin-only, не публикуется)',
  },
  factCheckedBy: {
    type: 'relationship',
    relationTo: 'authors',
    admin: { position: 'sidebar' },
    label: 'Бригадир / автор fact-check',
  },
  contractRef: {
    type: 'text',
    admin: { position: 'sidebar' },
    label: 'Внутренний ID договора (НЕ публикуется)',
  },
  proofDocuments: {
    type: 'array',
    admin: { position: 'sidebar' },
    fields: [
      { name: 'doc', type: 'upload', relationTo: 'media' },
      { name: 'description', type: 'text' },
    ],
    label: 'Документы (admin-only)',
  },
  // ... existing fields
}
```

**Sa-seo recommendation:** popanel ticket post-EPIC (или US-4 W14 day 4-5 если popanel time available). Не блокер EPIC close.

---

## 7 · Mapping на on-site

| URL | Evidence display |
|---|---|
| `/kejsy/` hub | список 14 cards (sustained Stage 2/3) — без admin-only evidence |
| `/kejsy/<case-slug>/` | full case body (sustained Stage 2/3 pattern) — без admin-only evidence |
| Footer на cases | mini-line «Документы по запросу — `/foto-smeta/`» (sustained Stage 2 cases) |
| `/b2b/dogovor/` | шаблон договора (без PII, sustained §3) + Приложения references |

---

## 8 · TODO checklist

- [ ] Operator передаёт 14 cases evidence-data (privacy-redacted): дата + сегмент + объём + ID договора (внутренний).
- [ ] popanel cross-team: добавить evidence поля в Case collection (см. §6).
- [ ] cms re-seed cases: заполнить `evidenceNote` + `factCheckedBy` + `contractRef` (admin-only).
- [ ] cw: добавить footer-line «Документы по запросу» на cases cards (sustained Stage 2 — verify).
- [ ] seo-tech: lint:schema audit на cases — `Service` + `ImageObject` sustained, добавить `HowTo` на 2-3 cases (cross-link `07-neuro-seo/jsonld-completeness.md`).

---

## 9 · Escalation log

| Item | Owner | Status | Deadline | Hard/Soft |
|---|---|---|---|---|
| 14 cases evidence-data | poseo → operator | pending | post-EPIC OK | Soft (sustained generic content + factual placeholders OK) |
| `Case.evidenceNote` field в Payload | popanel cross-team | pending | post-EPIC | Soft |
| `Case.factCheckedBy` field | popanel cross-team | pending | post-EPIC | Soft |

---

## 10 · Cross-references

- `seosite/06-eeat/authors.md` §5 — cases × author mapping
- `seosite/06-eeat/credentials.md` §5 — ФККО на cases vyvoz/demontazh
- `seosite/06-eeat/methodology.md` §3 — pillar × ОКВЭД × ГОСТ × case applicability
- `seosite/07-neuro-seo/jsonld-completeness.md` — `HowTo` schema на 2-3 cases (sa-seo recommendation)
- `site/content/stage2-w11-cases/` + `stage3-w13-cases/` — fixtures
