---
domain: virubka-dereva.ru
pillar: арбо
audit_status: pending
last_audit_date: pending
audit_method: pending
source_keys_so: pending
source_topvisor: pending
ia_score: 0
benchmark_phase: W3-baseline
---

# virubka-dereva.ru

> **STUB-профиль.** Создан 2026-05-01 для W3 baseline. Live audit запланирован на W3.

## Зона силы (гипотеза)

pending live audit W3 — узкая ниша «вырубка деревьев», вероятный гео-coverage по МО. EMD-домен (exact match domain) — потенциально сильные позиции по ключу «вырубка дерева».

### Prima facie hypothesis (W2 ahead-of-audit)

- EMD `virubka-dereva.ru` — точное соответствие фразы «вырубка дерева» в URL.
  В Я.Москва+МО EMD исторически даёт +5–15% к ранжированию (хотя Google
  с 2012 EMD-update ослабил эффект, Яндекс держится за этот сигнал дольше).
- Гипотеза-сильная позиция: топ-1–3 по «вырубка дерева» / «вырубка деревьев»
  Москва+МО. Если так — конкурируем не за этот точный ключ, а за смежные
  («удаление дерева», «спил дерева», «снос дерева»), где у них EMD-преимущества нет.

### Топ-3 гипотез

1. `hypothesis` — EMD-эффект подтверждён → стратегия для нас: target shift
   с «вырубка» на «удаление/спил/снос дерева» (наш канон, ближе к TOV §13
   «Сделаем», не «Вырубим»). На уровне sub-кластера arboristika — закрепить.
2. `hypothesis` — content depth низкий (типичный EMD-домен — 1 pillar + 5–10
   sub) → обгоняем по контент-глубине через 12 sub × 8 districts SD.
3. `hypothesis` — slug `vyrubka-` в URL → не используем у себя как
   sub-slug; sub-кластер строится через `udalenie-derevev` /
   `spil-dereviev` (текущий канон в seed.ts).

## URL-объём

| Категория | URL у конкурента | Наш план к W14 |
|---|---:|---:|
| Всего в sitemap.xml | pending | ~250 |
| Pillar | pending (вероятно 1) | 4 |
| Sub-services (вырубка по типам) | pending | 33 |
| Programmatic SD | pending | ~150 |
| Blog | pending | 30 |

## Ключевые слова

pending live audit W3 — особое внимание ключу «вырубка дерева» / «вырубка деревьев» (EMD-эффект).

## Контент-следы

pending live audit W3.

## Что копируем (гипотеза)

- Если EMD-домен ранжируется в топ-3 — паттерн анкорной семантики и оптимизации под точную фразу
- Гео-coverage (если есть — масштаб)

## Что превосходим (гипотеза)

- 4-в-1
- Глубина sub (диагностика, корчёвка, измельчение) — если у virubka-dereva только вырубка
- Programmatic 4 × 8 районов

## Риски

- **R-mid:** если EMD-домен сидит в топ-1-3 по «вырубка дерева» — мы не обгоним по этому ключу без бэк-линков. Mitigation: фокус на «удаление дерева» / «спил дерева» / district-комбинации.

## TODO для live audit (W3)

- [ ] sitemap.xml fetch + count URL
- [ ] **EMD-эффект** — позиция по «вырубка дерева» в Я.Москва+МО
- [ ] Гео-coverage (districts / cities если есть)
- [ ] Keys.so export топ-100 ключей в Я.Москва+МО
- [ ] Manual IA-скан главной + 3 random URL → screenshots
- [ ] Заполнить все «pending» поля
