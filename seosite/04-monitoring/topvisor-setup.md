# Topvisor manual setup runbook

**Owner:** `cms` (manual UI setup, без API automation в US-10)
**Sustained creds в `site/.env.local`:** `TOPVISOR_API_KEY=f183b7d…` + `TOPVISOR_USER_ID=496026`
**Goal:** Topvisor проект `obikhod-services` с 200+ commercial keywords + weekly position check
**Документ для:** US-10 EPIC-SEO-COMPETE-3 + W14 DoD AC-2 (Topvisor visibility ≥15) + AC-3 (keys top-10 ≥80)

## 5 шагов setup

### Шаг 1: создать проект

1. Открыть https://topvisor.com/ru/projects/
2. **+ Новый проект** → ввести:
   - Название: `obikhod-services`
   - Тип: **Поисковые системы** (default)
3. **Сохранить**

### Шаг 2: добавить домен + регион

1. В проекте → **Сайты** → **+ Добавить сайт**
2. URL: `https://obikhod.ru`
3. Поисковые системы (по чек-боксу):
   - **Yandex.ru** (Москва)
   - **Yandex.ru** (Московская область) — опционально
   - **Google.ru** (Москва) — опционально, для cross-validation
4. **Сохранить**

### Шаг 3: импорт keywords

**Источник:** `seosite/02-keywords/derived/clusters-tfidf.csv` (438 commercial keys из US-1).

1. Проект → **Запросы** → **+ Импорт**
2. Способ: **Загрузить CSV**
3. Подготовить CSV (столбцы: `word`, `group`):
   ```
   word,group
   "сколько стоит спил дерева",arboristika
   "покос травы цена за сотку",uborka-territorii
   ...
   ```
   - Скрипт-конвертер: `python3 -c "import csv; r=csv.DictReader(open('seosite/02-keywords/derived/clusters-tfidf.csv')); w=csv.writer(open('topvisor-import.csv','w')); w.writerow(['word','group']); [w.writerow([row['word'], row['pillar']]) for row in r]"`
4. Загрузить `topvisor-import.csv`
5. Проверить → **Импортировать**

**Ожидаемое:** ~438 keywords в проекте, разбитые на 5 групп (по pillar).

### Шаг 4: setup weekly check schedule

1. **Настройки проекта** → **Снятие позиций**
2. **Расписание:** **раз в неделю**, день — **понедельник 09:00 MSK**
3. Глубина: **топ-100** (для Topvisor visibility metrics)
4. **Сохранить**

### Шаг 5: API token verify

1. **Профиль** → **API**
2. Проверить что `TOPVISOR_API_KEY` совпадает с `site/.env.local` (`f183b7d…`)
3. Если рассинхронизация — обновить `.env.local` через `do` или регенерировать токен в UI

## Verify (после setup)

1. Подождать 24 часа (первый автоматический pull позиций)
2. Открыть проект → **Позиции** → должны появиться позиции по 438 ключам в Yandex.ru Москва
3. Снимок видимости (visibility) — записать в `seosite/04-monitoring/<date>/topvisor.csv`

## Sustained → US-10 follow-up

- **API automation:** при наличии полной API-доку (см. https://topvisor.com/api/v2-services/) — написать `seosite/scripts/topvisor_pull_positions.py` для weekly auto-snapshot
- **Telegram alert:** при дроп позиции > 5 пунктов через GitHub Actions cron + Telegram Bot
- **Сравнение** с конкурентами через Topvisor Competitor Analysis (premium feature) — опционально

## Hand-off

После setup `cms` пишет в [dashboard.md](dashboard.md) Topvisor section + добавляет CSV в текущую weekly snapshot папку.
