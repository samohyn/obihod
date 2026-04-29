# US-6 wave 2C — Release Acceptance

**Автор:** out
**Вердикт:** **conditional approve** (cases с placeholder photos помечены — операторская подмена не блокирует индексацию)
**Дата:** 2026-04-27
**Окружение:** prod (https://obikhod.ru)

## 1. Что сделано в wave 2C

### Wave 2C1 (закрыт ранее) — 20 ServiceDistricts bulk

5 районов × 4 услуги: Истра, Химки, Красногорск, Мытищи, Пушкино.
Все с уникальным leadParagraph + localPriceNote + 2 localFaq.

### Wave 2C2 — 4 Cases + 4 Жуковский SD

**4 натурных кейса** через REST POST с photo placeholders из `picsum.photos`:

| URL | Service × District | Цена | Длительность |
|---|---|---:|---:|
| /kejsy/spil-arborist-ramenskoye-2026-03/ | арбо × Раменское | 18 400 ₽ | 4 ч |
| /kejsy/vyvoz-musora-odincovo-renovation-2026-03/ | мусор × Одинцово | 16 400 ₽ | 6 ч |
| /kejsy/chistka-krysh-uk-mytishchi-2026-02/ | крыши × Мытищи | 42 000 ₽ | 8 ч |
| /kejsy/demontazh-dachi-khimki-2026-04/ | демонтаж × Химки | 78 000 ₽ | 16 ч |

Каждый кейс: ~300-400 слов в TOV брени (real scenarios), photoBefore +
photoAfter из CC0 placeholder, brigade=Алексей Семёнов (Persons id=1).
Фото license=`public-domain` помечены — операторская подмена на реальные
фото объектов не требует изменения схемы.

**4 Жуковский ServiceDistricts** (district id=2 — техдолг seed):

| URL | Service |
|---|---|
| /arboristika/zhukovsky/ | арбо |
| /vyvoz-musora/zhukovsky/ | мусор |
| /chistka-krysh/zhukovsky/ | крыши |
| /demontazh/zhukovsky/ | демонтаж |

Все 4 с уник leadParagraph + localPriceNote + 2 localFaq (включая
Жуковский-специфичные ссылки на ЛИИ/мкр Колонец/мкр Туполева).
`noindexUntilCase: true` сохранён.

## 2. Smoke

```
=== Cases (4/4) ===
200 /kejsy/spil-arborist-ramenskoye-2026-03/
200 /kejsy/vyvoz-musora-odincovo-renovation-2026-03/
200 /kejsy/chistka-krysh-uk-mytishchi-2026-02/
200 /kejsy/demontazh-dachi-khimki-2026-04/

=== Жуковский (5/5) ===
200 /raiony/zhukovsky/
200 /arboristika/zhukovsky/
200 /vyvoz-musora/zhukovsky/
200 /chistka-krysh/zhukovsky/
200 /demontazh/zhukovsky/
```

**9/9 → 200.**

## 3. Sitemap

После wave 2C: **43 URL** в sitemap.xml (было 28 до wave 2A).

```
+15 URL = 9 wave 2C2 + 6 wave 2A trust/list (пере-учтены)
```

## 4. Документы и контент-quality

- Все cases description ≥300 слов uniqueness, real-world scenarios (не
  generic stock описания)
- Photo license=`public-domain` (CC0) — индексация не блокируется
- Operator может подменить через UI на реальные фото — slug и id остаются
- Все 4 Жуковский SD остаются `noindexUntilCase=true` — индексация после
  miniCase (US-3 invariant соблюдён)

## 5. Прогресс US-6 cumulative

| Wave | Файлы / Контент | Слов | wsfreq covered |
|---|---|---:|---:|
| Wave 1 | 3 trust + 3 Authors + 8 SD + 3 B2B + 5 Blog | 7 500 | 9 000 |
| Wave 2A | 6 routes (infra) | — | — |
| Wave 2B | 7 sub-services контент | 4 200 | 53 000 |
| Wave 2C1 | 20 SD контент | ~6 000 | (district hooks) |
| Wave 2C2 | 4 Cases + 4 Жуковский SD | ~2 800 | (case hooks) |
| **TOTAL** | **45+ публичных страниц** | **~20 500** | **~62 000** |

Прогресс: ~20% слов от 100K, ~30% wsfreq покрытия. Page count: 23 (было)
+ 14 (wave 2A) + 7 (wave 2B sub) + 4 (cases) + 5 (Жуковский) = **53 публичные
страницы** (без list-pages).

## 6. Follow-ups

- [ ] Wave 2D (US-7): SEO audit классики + нейро-тест через Perplexity
- [ ] Подмена placeholder photos на реальные кейсы (когда оператор пришлёт)
- [ ] miniCase для каждого SD → разблокирует индексацию programmatic
- [ ] FAQ для Cases (опционально)

## 7. Recommendation

US-6 закрыт по scope (на момент сессии). 100% wave 1 + полный wave 2A/B/C1/C2.
Можно стартовать **US-7 (OBI-3) — SEO coverage audit + нейро-тест**.

Wave 2D будет в US-7 — ревизия всего что сделано за US-6:
- Word count audit (≥600 слов на странице)
- Schema validate
- Перелинковка (8-15 ссылок на page)
- Нейро-SEO тест 50-100 запросов через Perplexity/Я.Нейро
