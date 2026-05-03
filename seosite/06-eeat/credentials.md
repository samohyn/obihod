# Credentials hub spec — СРО / лицензии / ИНН/ОГРН / ФККО / ОКВЭД

**Статус:** US-4 W14 day 1 — sa-seo + cw initial draft. Operator real-data (СРО номер, лицензии, ИНН/ОГРН) pending.
**Owner:** sa-seo + cw → cms (sustained `/sro-licenzii/` Stage 1 fixture).
**Cross-link:** `authors.md` (`Organization.identifier` + `hasCredential`) · `methodology.md` (ОКВЭД ↔ pillar) · `case-evidence.md`.

---

## 1 · Иерархия credentials

Что должно жить в `Organization` JSON-LD на каждой странице (footer global + `/sro-licenzii/` body + `/o-nas/`):

```
Organization (Обиход юр.лицо)
   ├── identifier (ИНН) — pending replace
   ├── identifier (ОГРН) — pending replace
   ├── identifier (КПП) — sustained Stage 1
   ├── hasCredential — СРО членство (EducationalOccupationalCredential)
   ├── hasCredential — лицензия Росприроднадзора на отходы IV класса
   ├── hasCredential — допуски Минтруда №782н (3-я группа по высоте)
   ├── hasCredential — страховой полис ГО 10 млн ₽
   └── vatID, taxID — иногда дублируются с identifier (Yandex предпочитает identifier)
```

---

## 2 · СРО — спец-таблица

| Поле | Значение | Status |
|---|---|---|
| Название СРО | TODO operator (например «Ассоциация СРО строителей Подмосковья») | pending |
| Реестровый номер | TODO operator (например «СРО-С-XXX-DD.MM.YYYY») | pending |
| Дата вступления | TODO operator | pending |
| Реестр | НОСТРОЙ (для строителей) или НОПРИЗ (для проектировщиков) — operator confirm | pending |
| Ссылка на запись в реестре | `https://reestr.nostroy.ru/...` (после получения номера) | pending |
| Применимость к pillar | demontazh (обязательно), chistka-krysh (если МКД), arboristika (если высота >5м с СРО), vyvoz (нет — отдельная лицензия Росприроднадзора) | sustained |

**On-site placement:**
- `/sro-licenzii/` body — раздел «СРО строителей» (sustained Stage 1 fixture; replace placeholder при apruv operator)
- footer mini-line «СРО №XXX» (если operator одобрит видимость в footer; default — без, оставляем только в `/sro-licenzii/`)
- B2B `/b2b/dogovor/` body — упоминание СРО как обязательное условие для УК

**JSON-LD pattern:**

```jsonld
{
  "@type": "EducationalOccupationalCredential",
  "name": "СРО строителей",
  "credentialCategory": "membership",
  "recognizedBy": {
    "@type": "Organization",
    "name": "<TODO название СРО>",
    "url": "https://reestr.nostroy.ru/"
  },
  "identifier": "<TODO реестровый номер>",
  "validFrom": "<TODO дата вступления>"
}
```

---

## 3 · Лицензии

Каждая лицензия — отдельный `hasCredential` элемент. Не делаем «общий список лицензий» — это слабее для E-E-A-T.

### 3.1 · Лицензия Росприроднадзора (отходы)

| Поле | Значение | Status |
|---|---|---|
| Тип | Лицензия на транспортирование отходов I-IV класса опасности | sustained |
| Издатель | Федеральная служба по надзору в сфере природопользования (Росприроднадзор) | sustained |
| Номер | TODO operator | pending |
| Дата выдачи | TODO operator | pending |
| Срок действия | Бессрочно (новая редакция 99-ФЗ) | sustained |
| Применимость | vyvoz-musora (обязательно), demontazh (обязательно для строй-отходов), arboristika (для крупных объёмов щепы и порубочных остатков) | sustained |

**Регуляторика:** 89-ФЗ «Об отходах производства и потребления» + 99-ФЗ «О лицензировании». Без лицензии — статья 8.2 КоАП (штраф юрлица 100-250 тыс. ₽).

### 3.2 · Допуски Минтруда №782н (работы на высоте)

| Поле | Значение | Status |
|---|---|---|
| Тип | Удостоверение о допуске к работам на высоте | sustained |
| Издатель | Аккредитованный учебный центр Минтруда | sustained |
| Группа | 3-я (для арбористов на высоте свыше 5м без естественной защиты), 2-я (для операторов автовышки) | sustained |
| Регуляторика | Приказ Минтруда РФ №782н от 16.11.2020 «Об утверждении Правил по охране труда при работе на высоте» | sustained (real public record) |
| Применимость | arboristika (высотные спилы), chistka-krysh (МКД и высокие частники), demontazh (кровельные демонтажи) | sustained |

### 3.3 · Страховой полис ГО

| Поле | Значение | Status |
|---|---|---|
| Тип | Страхование гражданской ответственности | sustained |
| Покрытие | 10 млн ₽ | sustained Stage 1 (operator may scale up later) |
| Издатель | TODO operator (российская страховая с лицензией ЦБ РФ) | pending |
| Номер полиса | TODO operator | pending |
| Срок действия | Ежегодно (продлеваемый) | sustained |
| Применимость | Все 4 pillar — покрытие ущерба объекту, соседним участкам, технике |

---

## 4 · ИНН / ОГРН / КПП

**Текущий статус (sustained `project_inn_temp.md`):**
- ИНН **7847729123** — СПб юрлицо, временный. Заменим после operator переезда юр.лица в МО.
- ОГРН — pending operator (получаем вместе с переездом).
- КПП — pending.

**Sa-seo decision:** до replace оставляем placeholder в JSON-LD с явным комментарием:

```jsonld
{
  "@type": "Organization",
  "name": "Обиход",
  "identifier": [
    {
      "@type": "PropertyValue",
      "propertyID": "ИНН",
      "value": "7847729123"
    }
  ]
}
```

**TODO для cms:** при apruv operator — replace ИНН + добавить ОГРН + КПП в `Organization.identifier` (footer + `/sro-licenzii/` + `/b2b/dogovor/`).

---

## 5 · ФККО — классы отходов (real public record)

ФККО (Федеральный классификационный каталог отходов) — реестр Росприроднадзора. Эти коды реальные, не выдумываем — это public record.

| Код ФККО | Название | Pillar |
|---|---|---|
| 7 31 110 01 22 5 | Отходы из жилищ несортированные (исключая крупногабаритные) | vyvoz |
| 7 31 110 02 21 5 | Отходы из жилищ крупногабаритные (КГМ) | vyvoz (КГМ) |
| 7 12 200 01 22 4 | Отходы строительные (грунт, бетон, кирпич) | demontazh + vyvoz |
| 7 31 200 01 72 4 | Отходы при уборке территорий садово-парковых (листва, ветви) | arboristika + vyvoz садового |
| 8 19 100 01 51 5 | Снег, загрязнённый песком и солью | chistka-krysh (если вывозим) |

**Применимость:** pillar pages «Что входит» секция (sustained Stage 2) + B2B `/b2b/dogovor/` Приложение (классы отходов в проекте договора) + cases B2B где УК просит указание класса отходов в акте.

**Iron rule:** ФККО коды — единственное place где «honest data ОК прямо сейчас» (это public record, не operator pending).

---

## 6 · ОКВЭД (real public record)

ОКВЭД-2 (Общероссийский классификатор видов экономической деятельности).

| Код | Название | Pillar |
|---|---|---|
| 38.11 | Сбор неопасных отходов | vyvoz |
| 38.12 | Сбор опасных отходов | vyvoz (ФККО I-III) |
| 38.21 | Обработка и утилизация неопасных отходов | vyvoz (если operator расширяется на полигон) |
| 81.30 | Деятельность по благоустройству ландшафта | arboristika + сад |
| 02.40 | Предоставление услуг в области лесоводства | arboristika (спилы / щепа) |
| 81.21 | Общая уборка зданий | chistka-krysh |
| 43.11 | Разборка и снос зданий | demontazh |
| 43.11.1 | Разборка и снос зданий, расчистка территорий | demontazh |

**Применимость:** `/sro-licenzii/` body (footer-line «ОКВЭД 38.11 / 81.30 / 43.11 — основные») + B2B `/b2b/dogovor/` Реквизиты + cms re-author cases с правильным ОКВЭД class.

**Sustained:** ОКВЭД whitelist в TOV-checker (sustained Stage 2 — 49 abbrev лексикон).

---

## 7 · Mapping на on-site

| URL | Credentials display |
|---|---|
| footer (chrome canonical §33) | mini-line «ИНН XXXXX · ОГРН XXXX · СРО №XXX» (compact) |
| `/sro-licenzii/` | full body — все 4 pakeт (Росприроднадзор / СРО / страховка / Минтруда) + ИНН/ОГРН + ФККО list + ОКВЭД list |
| `/avtory/<operator>/` | summary в bio (cross-link на `/sro-licenzii/`) |
| `/b2b/dogovor/` | Приложение «Документы подрядчика» (полный список + ФККО) |
| pillar pages | mini-strip в hero «trustRow» (sustained Stage 1) |
| cases B2B | подпись «работа выполнена под СРО + лицензией Росприроднадзора» (sustained Stage 2 cases pattern) |

---

## 8 · TODO checklist для cms / operator

При apruv operator:

- [ ] Operator передаёт **СРО номер + название СРО + дата вступления** → cms replace в `/sro-licenzii/` body (sustained fixture с placeholder).
- [ ] Operator передаёт **лицензия Росприроднадзора номер + дата** → cms replace.
- [ ] Operator передаёт **новый ИНН (МО)** + ОГРН + КПП → cms replace в footer + `Organization.identifier` JSON-LD.
- [ ] Operator передаёт **страховой полис номер** → cms replace в `/sro-licenzii/` body.
- [ ] cms re-seed JSON-LD on `/sro-licenzii/` — добавить `hasCredential` × 4 (СРО / Росприроднадзор / Минтруда / страховка).
- [ ] seo-tech: lint:schema audit на `/sro-licenzii/` — exit 0; verify `Organization.identifier` parsed correctly.
- [ ] cms re-author all 17 blog + 14 cases — `Organization.identifier` через footer (sustained), не на каждой странице.

---

## 9 · Escalation log

| Item | Owner | Status | Deadline | Hard/Soft |
|---|---|---|---|---|
| СРО номер + название | poseo → operator | pending | W14 day 1 | Hard для axis E-E-A-T опережение |
| Лицензия Росприроднадзора | poseo → operator | pending | W14 day 1 | Hard |
| ИНН (МО) replace | poseo → operator | pending | W14 day 3 | Soft (sustained СПб OK на EPIC close) |
| ОГРН + КПП | poseo → operator | pending | W14 day 3 | Soft |
| Страховой полис номер | poseo → operator | pending | W14 day 3 | Soft (sumustained) |

**Conditional logic:** до apruv operator — sustained placeholder с TODO comment в JSON-LD. EPIC PASS на 4/5 axes без операторских данных (sustained recommendation §3.2.1 sa-seo).

---

## 10 · Cross-references

- `seosite/06-eeat/authors.md` §2 — `Organization.identifier` cross-link
- `seosite/06-eeat/methodology.md` — ОКВЭД × ГОСТ × pillar matrix
- `site/content/stage1-w5/sro-licenzii.json` — on-site fixture finalize
- `site/content/stage1-w5/o-kompanii.json` — `/o-kompanii/` Reckвизиты mini-block
- chrome canonical: `design-system/brand-guide.html` §33 footer ИНН/ОГРН line
