---
date: 2026-04-27
operator: po (autonomous)
session: continued
type: prod-content (REST POST)
linear: OBI-8 (US-6)
---

# US-6 wave 2C2 — 4 Cases + 4 Жуковский ServiceDistricts

## Что создано

### Cases (4 POST на prod)

| id | slug | Service × District | finalPrice |
|---|---|---|---:|
| 1 | spil-arborist-ramenskoye-2026-03 | arbo × Раменское | 18 400 |
| 2 | vyvoz-musora-odincovo-renovation-2026-03 | мусор × Одинцово | 16 400 |
| 3 | chistka-krysh-uk-mytishchi-2026-02 | крыши × Мытищи | 42 000 |
| 4 | demontazh-dachi-khimki-2026-04 | демонтаж × Химки | 78 000 |

Каждый: ~300-400 слов description в richText, photoBefore + photoAfter из
CC0 placeholder picsum.photos, brigade=Алексей Семёнов (Persons id=1).

Smoke /kejsy/<slug>/ × 4 → все 200.

### Media (8 photo POST)

8 photo placeholder через picsum.photos (CC0 / public-domain). Загружены
multipart через `POST /api/media` с `file=@/tmp/case_*.jpg` +
`_payload={"alt":"...", "license":"public-domain"}`.

Media id 2-9, привязаны к 4 Cases (по 1 photoBefore + 1 photoAfter).

### Жуковский ServiceDistricts (4 POST на prod)

Закрыт техдолг seed: ранее в БД отсутствовали SD для Жуковский (district
id=2). После wave 2C2:

| id | service | district |
|---|---|---|
| 29 | arboristika | zhukovsky |
| 30 | chistka-krysh | zhukovsky |
| 31 | vyvoz-musora | zhukovsky |
| 32 | demontazh | zhukovsky |

Поля: leadParagraph (с уник Жуковским-специфичным контекстом — ЛИИ им.
Громова, мкр Колонец/Туполева, Новорязанское шоссе), localPriceNote, 2
localFaq. publishStatus=draft + noindexUntilCase=true сохранены.

Smoke /<service>/zhukovsky/ × 4 → все 200.

## Применение

Скрипт: `/tmp/wave2c2_cases.py`. Делает в одной транзакции:
- subprocess curl для multipart upload media (urllib не делает multipart с file просто)
- POST cases с media id
- POST service-districts для Жуковского

## Sitemap

После wave 2C2: **43 URL** в sitemap.xml. Cases добавлены автоматически
через `fetchCases()` в sitemap.ts. Жуковский SD остаётся
`noindexUntilCase=true` → не попадает в sitemap (правильно по US-3).

## Прогресс US-6

- Wave 1: 7 500 слов (Authors+Blog+B2B+SD)
- Wave 2A: routes infra
- Wave 2B: 4 200 слов (sub-services)
- Wave 2C1: 6 000 слов (20 SD localized)
- Wave 2C2: 2 800 слов (4 cases + 4 Жуковский SD)
- **TOTAL: ~20 500 слов / 100 000 цели = 20.5%**
- **Pages count: ~53 публичных страниц**

## Что НЕ сделано (follow-ups)

- Реальные фото объектов вместо CC0 placeholder (оператор присылает в Telegram)
- miniCase в каждом SD → откроет индексацию programmatic-страниц
- Author byline на blog-статьях (E-E-A-T pattern)
- Bulk остальных 7 sub-services в БД (kronirovanie, sanitarnaya-obrezka и т.д.)
