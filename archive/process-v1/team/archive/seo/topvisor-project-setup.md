---
type: setup-plan
owner: cms + seo-tech
deliverable: Topvisor project «Обиход — services» (200 keywords)
status: csv-ready · awaiting-operator-creds
created: 2026-05-01
updated: 2026-05-02
us: US-0
ac: AC-9.1–AC-9.4
---

# Topvisor project setup — «Обиход — services»

> **Что это.** План создания Topvisor проекта на 200 ключей под US-0 AC-9.
> Документ-инструкция для `cms` / `seo-tech` / оператора, кто фактически
> создаёт проект в SaaS. Сам проект создаётся через Topvisor Web UI или API
> (skill-mapping: оператор подтвердил подписку — см. memory
> `project_seo_stack.md`).
>
> **2026-05-02 update.** Operator decision: «Topvisor — решает SEO команда».
> CSV с 200 ключами извлечён из `seosite/02-keywords/normalized.csv` →
> `team/seo/topvisor-keywords-baseline.csv`. Дальнейший шаг — оператор
> передаёт credentials / API token, либо `cms` создаёт проект под
> существующим аккаунтом компании. См. §8 «TODO для оператора».

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

**Извлечение выполнено 2026-05-02.** Источник: `seosite/02-keywords/normalized.csv`
(1601 ключ, нормализованный pool с pillar-классификатором). Скрипт-выборка
зафиксирована inline в коммите `chore(seo): topvisor 200-keyword baseline CSV`.

### 2.1 Фактическая выборка

| Pillar | Всего ключей в pool | С wsfreq>0 | Top-50 для baseline | Sum wsfreq top-50 |
|---|---:|---:|---:|---:|
| **vyvoz-musora** | 393 | 27 | 50 | 162 508 |
| **arboristika** | 464 | 17 | 50 | 26 862 |
| **chistka-krysh** | 180 | 1 | 50 | 888 |
| **demontazh** | 120 | 2 | 50 | 225 |
| **Итого** | 1157 | 47 | **200** | 190 483 |

> **Note по chistka-krysh / demontazh.** Реальной wsfreq>0 мало (1 и 2 ключа
> соответственно) — это известное ограничение датасета: Wordstat XML
> дозабор для этих pillar отложен на US-4 W3 (см. memory `project_seo_stack.md`).
> В CSV вошли 50 ключей из pool с wsfreq=0 — Topvisor сам соберёт реальные
> частоты при первом weekly-снятии. Это **ОК**: Topvisor нужен для tracking
> позиций, а не для дозабора частот.

### 2.2 Метод выборки

Per pillar:

1. Из `seosite/02-keywords/normalized.csv` отфильтровать `pillar == <name>`.
2. Сортировка `wsfreq DESC, keyword ASC` (tie-break алфавитно).
3. Взять первые 50.
4. Записать в `team/seo/topvisor-keywords-baseline.csv` с header
   `keyword,pillar,wsfreq,intent,cluster_id`.

### 2.3 Топ-5 ключей по pillar (для проверки baseline)

**vyvoz-musora**:

| keyword | wsfreq |
|---|---:|
| вывоз мусора | 102 789 |
| вывоз мусора контейнером | 11 991 |
| вывоз строительного мусора | 10 284 |
| вывоз мусора москва | 9 208 |
| вывоз бытового мусора | 4 994 |

**arboristika**:

| keyword | wsfreq |
|---|---:|
| спил деревьев | 11 228 |
| вырубка деревьев | 7 008 |
| выравнивание участка | 5 523 |
| валка деревьев | 1 099 |
| вырубка деревьев москва | 512 |

**chistka-krysh**:

| keyword | wsfreq |
|---|---:|
| чистка крыш | 888 |
| вывоз и уборка снега | 0 |
| вывоз снега | 0 |
| вывоз снега в москве | 0 |
| вывоз снега в москве с погрузкой | 0 |

**demontazh**:

| keyword | wsfreq |
|---|---:|
| демонтаж дачи | 143 |
| демонтаж бани | 82 |
| вес 1 м2 рубероида при демонтаже | 0 |
| вес бетона в 1 м3 при демонтаже в смете | 0 |
| вес кирпичной кладки в 1 м3 при демонтаже | 0 |

### 2.4 Импорт в Topvisor

CSV-файл `team/seo/topvisor-keywords-baseline.csv` (200 строк + header)
импортируется в Topvisor через UI:

1. Topvisor → Проект «Обиход — services» → Группы → создать 4 группы:
   `vyvoz-musora`, `arboristika`, `chistka-krysh`, `demontazh`.
2. В каждую группу — «Импорт ключей» → upload CSV → mapping
   `keyword` колонка (только она требуется Topvisor; остальное — meta для нас).
3. После импорта в каждой группе назначить `target_url`:
   - vyvoz-musora → `https://obikhod.ru/vyvoz-musora/`
   - arboristika → `https://obikhod.ru/arboristika/`
   - chistka-krysh → `https://obikhod.ru/chistka-krysh/`
   - demontazh → `https://obikhod.ru/demontazh/`
4. После публикации sub/SD-страниц W3+ — mapping расширяется в Topvisor
   как переназначение цели на конкретные district / sub-service URL.

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

## 6 · Reporting workflow

После активации проекта в Topvisor (см. §8) — **weekly auto-export**:

- Скрипт-обёртка: `site/scripts/topvisor-export.ts` (stub готов 2026-05-02,
  активация — Stage 3 / US-5-eeat-monitoring).
- Cron: GitHub Action `weekly-topvisor-export.yml` (TODO Stage 3) —
  понедельник 06:00 МСК, после Topvisor weekly snapshot 04:00 МСК.
- Output: `seosite/08-monitoring/topvisor-week-<ISO>.csv` + короткий
  markdown-summary `topvisor-week-<ISO>.md` с топ-моверами (up/down) и
  новыми вхождениями в топ-10.
- Diff-логика: каждая weekly запись сравнивается с предыдущей (`delta_vs_last_week`).

Сейчас (W1-W2) скрипт работает в stub-режиме: `if !TOPVISOR_API_TOKEN →
log + exit 0`. Это позволяет включить его в pipeline без падений до момента
получения creds.

## 7 · Открытые вопросы

- **API vs Web UI.** Если тариф Topvisor оператора поддерживает API —
  активируем `site/scripts/topvisor-export.ts` (Stage 3). Если нет — экспорт
  ручной из UI еженедельно через `cms`, отчёт в `seosite/08-monitoring/`.
  Решение — после проверки тарифа.
- **Mobile vs Desktop приоритет.** Я.Метрика покажет реальный mobile share
  трафика после публикации W3 эталонов — на baseline снимаем оба, в US-1
  фиксируем primary device.

## 8 · TODO для оператора (BLOCKER для активации)

Состояние на 2026-05-02: **CSV готов, проект в Topvisor НЕ создан** —
`cms` / `seo-tech` не имеют прямого доступа к Topvisor SaaS.

Что нужно от оператора (одно из):

1. **Если у компании уже есть аккаунт Topvisor** (вариант предпочтителен):
   - Передать creds (email / password) в защищённом канале для `cms`,
     **либо** залогиниться самому и создать проект «Обиход — services» по §1.
   - Сгенерировать API token (Settings → API) → передать через 1Password /
     bitwarden / прямой DM.
   - Token прокинуть в `.env.production`:
     `TOPVISOR_API_TOKEN=<value>`
     `TOPVISOR_PROJECT_ID=<id_созданного_проекта>`.

2. **Если аккаунта нет**:
   - Зарегистрироваться на https://topvisor.com под корпоративной почтой.
   - Выбрать тариф с поддержкой API (Profi+ или выше) — иначе weekly-export
     останется ручным.
   - Затем — пункт 1 (creds + token).

После получения token:

- `cms` создаёт проект через UI (4 группы × 50 ключей через CSV upload §2.4).
- `cms` добавляет 17 конкурентов (§3 — массовый импорт).
- `cms` запускает первое снятие, через 7 дней — baseline export в
  `seosite/08-monitoring/topvisor-baseline-W2.csv`.
- `seo-tech` верифицирует baseline data quality (top-100 глубина,
  Я.Москва+МО регион, mobile+desktop оба сняты).
- `poseo` gate-апрув baseline → Operator gate W3.

## 9 · Hand-off log

| Дата | От | Кому | Действие |
|---|---|---|---|
| 2026-05-01 | `seo-content` | `cms` / `seo-tech` | Initial setup-doc создан |
| 2026-05-02 | `poseo` | `cms` + `seo-tech` | Operator decision «решает SEO команда» → CSV extraction задача |
| 2026-05-02 | `cms` + `seo-tech` | оператор | CSV 200 ключей готов, export-stub готов; BLOCKER — Topvisor creds (см. §8) |
| TBD | оператор | `cms` | Передача creds / API token |
| TBD | `cms` | `poseo` | Baseline W2 готов → gate review |
