---
domain: forest-service.ru
pillar: арбо
audit_status: pending
last_audit_date: pending
audit_method: pending
source_keys_so: pending
source_topvisor: pending
ia_score: 0
benchmark_phase: W3-baseline
---

# forest-service.ru

> **STUB-профиль.** Создан 2026-05-01 для W3 baseline. Live audit запланирован на W3.

## Зона силы (гипотеза)

pending live audit W3 — арбо + лесные услуги (расчистка делянок, лесная санитария), B2B-treeshold для садоводств / СНТ / застройщиков.

### Prima facie hypothesis (W2 ahead-of-audit)

- Имя `forest-service` — широкий охват: арбо + лес + санитария леса. Гипотеза:
  больше B2B/госзаказа, чем B2C (лесозаготовка / делянки / расчистка под ЛЭП —
  это типичные тендерные истории).
- В Я.Москва+МО сегмент «лесные услуги» имеет низкий wsfreq в B2C, но
  тендерный canal силён — Я.Метрика конкурента (если бы был доступ) показал бы
  refer от госзакупок и B2B-почты.

### Топ-3 гипотез

1. `hypothesis` — разделение sub по «лесной» специфике (расчистка ЛЭП,
   санитария леса, лесозаготовка) — копируем 1–2 пункта в sub-кластер
   `arboristika` если wsfreq нашего семядра подтвердит спрос.
2. `hypothesis` — посадочные под СНТ/садоводства как новый B2B-сегмент —
   расширение нашего B2B-хаба с УК/ТСЖ на СНТ. Решение оператору после live audit.
3. `hypothesis` — лесная регуляторика (порубочный, лесорубочный билет) — если
   они объясняют это понятно, мы переводим в `/b2b/dogovor/` секцию «Какие
   разрешения нужны на спил».

## URL-объём

| Категория | URL у конкурента | Наш план к W14 |
|---|---:|---:|
| Всего в sitemap.xml | pending | ~250 |
| Pillar | pending | 4 |
| Sub-services (включая лесные) | pending | 33 |
| Programmatic SD | pending | ~150 |
| Blog | pending | 30 |
| B2B-хаб | pending | 10 |

## Ключевые слова

pending live audit W3.

## Контент-следы

pending live audit W3.

## Что копируем (гипотеза)

- Лесные услуги как cluster (расчистка / санитария леса / лесозаготовка)
- B2B для СНТ / садоводств — потенциальный neue угол для нашего B2B-хаба

## Что превосходим (гипотеза)

- 4-в-1 (у них только лес/арбо)
- Programmatic SD по 4 услугам
- E-E-A-T авторы

## TODO для live audit (W3)

- [ ] sitemap.xml fetch + count URL
- [ ] Keys.so export топ-100 ключей в Я.Москва+МО
- [ ] **Sub-services breadth** — какие лесные услуги есть кроме арбо
- [ ] B2B для СНТ / садоводств / застройщиков — формат
- [ ] Лесная регуляторика (порубочный билет, лесорубочный, ОПФ) — где живёт
- [ ] Manual IA-скан главной + 3 random URL → screenshots
- [ ] Заполнить все «pending» поля
