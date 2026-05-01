---
type: setup-plan
owner: seo-content
deliverable: Topvisor project «Обиход — services» (200 keywords)
status: ready-to-execute
created: 2026-05-01
us: US-0
ac: AC-9.1–AC-9.4
---

# Topvisor project setup — «Обиход — services»

> **Что это.** План создания Topvisor проекта на 200 ключей под US-0 AC-9.
> Документ-инструкция для `cms` / `seo-content` / оператора, кто фактически
> создаёт проект в SaaS. Сам проект создаётся через Topvisor Web UI или API
> (skill-mapping: оператор уже подтвердил подписку — см. memory
> `project_seo_stack.md`).

## 1 · Параметры проекта

| Параметр | Значение |
|---|---|
| Название | Обиход — services |
| Регион | **Я.Москва + МО** (единым проектом) |
| Поисковые системы | Яндекс (primary), Google (secondary) |
| Устройство | Mobile + Desktop отдельными проверками |
| Частота снятия | **Weekly** (понедельник 04:00 МСК) |
| Глубина выдачи | топ-100 |
| Baseline date | 2026-05-01 (или дата фактического старта проверок) |

## 2 · Источник 200 ключей — top-50 wsfreq из 4 pillar

Источник `seosite/03-clusters/_summary.json`:

| Pillar | Кол-во ключей в кластере | Берём top-50 wsfreq |
|---|---:|---:|
| **vyvoz-musora** | 384 | 50 |
| **arboristika** | 534 | 50 |
| **chistka-krysh** | 197 | 50 (берём top — не все 197) |
| **demontazh** | 141 | 50 |
| **Итого** | 1256 | **200** |

**Метод выборки top-50** (для каждого pillar):

1. Открыть `seosite/03-clusters/<pillar>.md`
2. Отсортировать ключи по `wsfreq_msk_mo` desc
3. Взять первые 50; в случае tie — алфавитно по ключу
4. Экспортировать в CSV: `keyword,wsfreq,cluster_id,target_url`
5. Импортировать в Topvisor через CSV upload (3 колонки минимум: keyword,
   region, target_url)

`target_url` на старте — pillar URL (`/vyvoz-musora/`, `/arboristika/`,
`/chistka-krysh/`, `/demontazh/`). После публикации sub/SD-страниц W3+ —
mapping расширяется в Topvisor как переназначение цели.

## 3 · 17 конкурентов для сравнения позиций

В Topvisor добавляем 17 доменов (skill `seo` + benchmark план §4.3):

```
musor.moscow                grunlit-eco.ru          liwood.ru
promtehalp.ru               lesoruby.ru             alpme.ru
arboristik.ru               arborist.su             forest-service.ru
tvoi-sad.com                spilservis.ru           lesovod.su
virubka-dereva.ru           chistka-ot-snega.ru     demontazhmsk.ru
cleaning-moscow.ru          fasadrf.ru
```

Topvisor → Группы → Конкуренты → массовый импорт.

## 4 · Baseline snapshot (2026-05-01)

После первого weekly-снятия (через 7 дней после старта):

1. Экспорт CSV: «Все ключи × все домены × позиция Я.Москва+МО».
2. Сохранить в `seosite/08-monitoring/topvisor-baseline-W2.csv` (TODO для
   `seo-content` после US-0 W2 deadline).
3. Сводный markdown-summary в `seosite/08-monitoring/topvisor-baseline-W2.md`:
   - Топ-10 ключей где Обиход уже в топ-50 (если есть) — start position
   - Топ-10 ключей с конкурентом топ-3 (наша цель догнать)
   - Δ-видимости относительно медианы топ-3 конкурентов

## 5 · Передача в follow-up'ах

- **W7 mid-benchmark** — `seo-content` снимает повтор, фиксирует движение.
- **W14 final** — финальная сверка для DoD-цели опережения по ≥3 из 5 осей.

## 6 · Открытые вопросы

- **API vs Web UI.** Если у Topvisor план оператора поддерживает API —
  `seo-content` пишет короткий скрипт на JS/Python в `seosite/tools/` для
  weekly-export автоматизации. Если нет — экспорт ручной из UI еженедельно.
  Решение оператору после проверки тарифа.
- **Mobile vs Desktop приоритет.** Я.Метрика покажет реальный mobile share
  трафика после публикации W3 эталонов — на baseline снимаем оба, в US-1
  фиксируем primary device.

## 7 · Hand-off

- `cms` (или `seo-content` если cms занят): создать Topvisor проект до 2026-05-15 (W2 deadline US-0).
- `seo-content`: контролировать первое снятие, экспортировать baseline CSV в `seosite/08-monitoring/`.
- `poseo`: gate-апрув baseline до Operator gate W3.
