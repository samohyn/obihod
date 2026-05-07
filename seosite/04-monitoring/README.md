# Monitoring — EPIC-SEO-COMPETE-3 US-10

Weekly cycle для отслеживания EPIC DoD metrics (W3-W14).

## Источники данных

| Источник | Что | Кто owner |
|---|---|---|
| **Keys.so** (auto) | pagesInIndex / keys top-10/50 / vis / DR / ai-answers per domain | `seo-tech` через cron |
| **Topvisor** (manual) | Позиции 200+ commercial keywords weekly | `cms` через UI |
| **Я.Метрика** (auto) | Sessions / leads / 12 goals | `aemd` |
| **Я.Вебмастер** (auto) | Pages crawled / errors / sitemap acceptance | `seo-tech` |
| **Manual prompt tests** | AI-citation rate (10 prompts × 3 LLM) | `poseo` |

## Weekly cycle (понедельник 09:00 MSK)

1. **Auto:** snapshot Keys.so 4 доменов → `04-monitoring/<YYYY-MM-DD>/`
   ```bash
   python3 seosite/scripts/seo-weekly-snapshot.py
   ```
2. **Manual (cms):** Topvisor weekly export → CSV → импорт в `04-monitoring/<YYYY-MM-DD>/topvisor.csv`
3. **Manual (aemd):** Я.Метрика weekly report → `04-monitoring/<YYYY-MM-DD>/yandex-metrika.csv`
4. **Manual (poseo):** AI-citation prompt test (раз в 4 нед) → `04-monitoring/<YYYY-MM-DD>/ai-citations.md`
5. **Manual (poseo):** обновить `dashboard.md` с агрегатом + WoW Δ + alerts
6. **Manual (poseo):** weekly report для оператора через `team/cpo-syncs/<YYYY-MM-DD>.md`

## Файлы в этом каталоге

- `dashboard.md` — еженедельный snapshot + тренды (обновляется poseo)
- `yandex-metrika-goals.md` — список 12 целей для конфигурации aemd
- `topvisor-setup.md` — инструкция для cms по созданию проекта
- `<YYYY-MM-DD>/` — архивные snapshots (по дате)

## Triggers для алертов

- pagesInIndex obikhod.ru дроп > 10% WoW → `aemd` → Telegram
- Topvisor visibility дроп > 5 пунктов → `seo-tech` → Telegram
- AI-citation rate < target → ретро через `cpo`

## Sustained → US-10 follow-up

- GitHub Actions cron для weekly snapshot (`0 6 * * 1` UTC)
- Topvisor API automation (когда docs/SDK доступны)
- Mermaid charts auto-generation в dashboard.md
