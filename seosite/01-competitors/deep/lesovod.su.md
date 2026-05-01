---
domain: lesovod.su
pillar: арбо
audit_status: pending
last_audit_date: pending
audit_method: pending
source_keys_so: pending
source_topvisor: pending
ia_score: 0
benchmark_phase: W3-baseline
---

# lesovod.su

> **STUB-профиль.** Создан 2026-05-01 для W3 baseline. Live audit запланирован на W3.

## Зона силы (гипотеза)

pending live audit W3 — арбо + расчистка участков, B2C/B2B mix (садоводы / СНТ / застройщики). `.su` зона — старый бренд.

### Prima facie hypothesis (W2 ahead-of-audit)

- `.su` + «лесовод» → старая ниша, экспертная подача, фокус на расчистку
  заросших / запущенных участков. ADR-uМ-15 в наших decisions держит
  «выравнивание участка» (5523 wsfreq) в `arboristika/raschistka-uchastka/` —
  это пересечение зон. Конкурент потенциально лидер по этому ключу.
- Гипотеза TOV: Sage с патриотическим оттенком (`.su`).

### Топ-3 гипотез

1. `hypothesis` — детальная структура «расчистки» (от заросшего участка
   до подготовки к стройке) — копируем sub-кластер для нашего
   `/arboristika/raschistka-uchastka/`; добавляем фото до/после и cross-link
   на `demontazh` (если на участке есть постройки).
2. `hypothesis` — B2B для СНТ/садоводств — если есть, мы уже учли в
   `forest-service.ru` — оба конкурента подтверждают сегмент.
3. `hypothesis` — региональный охват по МО (всё, не Москва) — если они
   ранжируются по «расчистка участка <район МО>», это эталон для нашего
   programmatic SD `arboristika × district`.

## URL-объём

| Категория | URL у конкурента | Наш план к W14 |
|---|---:|---:|
| Всего в sitemap.xml | pending | ~250 |
| Pillar | pending | 4 |
| Sub-services | pending | 33 |
| Расчистка-кластер | pending | (часть арбо) |
| Programmatic SD | pending | ~150 |
| Blog | pending | 30 |

## Ключевые слова

pending live audit W3 — расчистка-кластер (расчистка участка, заросший, дикорастущие).

## Контент-следы

pending live audit W3.

## Что копируем (гипотеза)

- Расчистка-кластер как отдельный sub (наш план содержит, но углубить)
- B2C/B2B mix — как они переключают аудиторию

## Что превосходим (гипотеза)

- 4-в-1
- Programmatic 4 × 8 районов
- Реальный B2B-автор

## TODO для live audit (W3)

- [ ] sitemap.xml fetch + count URL
- [ ] **Расчистка-кластер** — детальная структура (от заросшего участка до подготовки к стройке)
- [ ] B2C/B2B сегментация — формат на сайте
- [ ] Keys.so export топ-100 ключей в Я.Москва+МО
- [ ] Manual IA-скан главной + 3 random URL → screenshots
- [ ] Заполнить все «pending» поля
