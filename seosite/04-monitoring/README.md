# Monitoring — Обиход SEO

Два независимых monitoring цикла:

1. **OVT-MONITOR (this README §1-4)** — automated weekly watcher vs liwood baseline
   (EPIC-LIWOOD-OVERTAKE B5 OVT-MONITOR · RICE 6.75)
2. **US-10 weekly cycle (this README §5-)** — agregated dashboard SEO-COMPETE-3 (manual)

---

## §1. OVT-MONITOR — automated weekly watcher

**Зачем:** закрывает PARITY axis URL/IA + general drift detection vs liwood
(B2 benchmark 2026-05-09 показал PARITY по URL/IA, верифицировать weekly чтобы
не пропустить sustained move competitor'а либо нашу регрессию).

**Как работает:**

- `watcher.ts` через GH Actions cron (понедельник 09:00 UTC = 12:00 MSK)
- WebFetch на 13 ключевых URL liwood (sustained 200-list из B1 snapshot 2026-05-09)
- Fetch `https://obikhod.ru/sitemap.xml` → count URL по T2/T3/T4
- Diff vs предыдущий snapshot из `snapshots/`
- Если threshold breach → пишет `alerts/{YYYY-MM-DD}-{breach-type}.md`
  → workflow открывает GitHub issue с label `seo-monitor`

**Threshold rationale:**

| Threshold              | Значение                | Почему                                                                              |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| liwood URL count delta | >5% (любая сторона)     | 1-2 URL = noise; 10+ за неделю = реальный move                                      |
| obikhod sitemap delta  | >5% (особенно negative) | -5% = ~10 URL потеряли из публичного индекса = investigate routes/sitemap.ts        |
| liwood JSON-LD count   | >0 (любой prirost)      | ADR-0017 schema +50pp leverage критичен — потеря lead требует немедленного response |

**Source files:**

- Watcher: `seosite/04-monitoring/watcher.ts`
- Workflow: `.github/workflows/seo-monitor.yml`
- Snapshots: `seosite/04-monitoring/snapshots/{YYYY-MM-DD}.json`
- Alerts: `seosite/04-monitoring/alerts/{YYYY-MM-DD}-{breach-type}.md`
- Baseline: `seosite/01-competitors/liwood-snapshot-2026-05-09.json`
- Roadmap: `seosite/01-competitors/overtake-roadmap-2026-05.md`

## §2. Как читать snapshots/alerts

`snapshots/{YYYY-MM-DD}.json` — структура:

```jsonc
{
  "snapshot_date": "2026-05-12",
  "liwood": {
    "urls": [...],                   // 13 объектов с http_status, jsonld_count, word_count
    "total_jsonld_count": 4,         // baseline 2026-05-09: 4 (gallery+company+uborka×2)
    "total_200_count": 13,
    "total_404_count": 0
  },
  "obikhod": {
    "total_urls": 174,               // baseline 2026-05-03 W15 launch
    "by_type": { "T2_pillar": 5, "T3_subservice": 12, "T4_city_sd": 154, "other": 3 }
  }
}
```

`alerts/{YYYY-MM-DD}-{breach-type}.md` — markdown с severity, цифрами, escalation
flow. GH Actions использует body как issue description.

## §3. Escalation при breach

1. **po** читает alert (через GH issue с label `seo-monitor`) — решает one-of:
   - rerun B1 full snapshot (drift подтвердить in depth) → запрашивает у `seo`
   - escalate to `seo + arch` для action (например, schema-coverage уплотнить)
   - ack-and-monitor (если breach false-positive → закрыть issue with label `false-positive`)
2. Если breach подтверждён → **seo** добавляет US в `team/backlog.md` секцию
   «Liwood overtake roadmap (B5)»
3. **arch** консультируется при schema-related breach (`liwood_jsonld_added`):
   ADR update + recheck `composer.ts` coverage

## §4. Ручной запуск

```bash
# Локальная проверка без real HTTP
pnpm --filter site exec tsx ../seosite/04-monitoring/watcher.ts --dry-run

# Локально с real fetch (внимание: тратит ~12 HTTP requests)
pnpm --filter site exec tsx ../seosite/04-monitoring/watcher.ts

# В GH Actions через workflow_dispatch:
# Actions → SEO Monitor → Run workflow → force_alert=true (для test issue)
```

---

## §5. US-10 weekly cycle (manual)

Weekly cycle для отслеживания EPIC DoD metrics (W3-W14).

## Источники данных

| Источник                | Что                                                              | Кто owner             |
| ----------------------- | ---------------------------------------------------------------- | --------------------- |
| **Keys.so** (auto)      | pagesInIndex / keys top-10/50 / vis / DR / ai-answers per domain | `seo-tech` через cron |
| **Topvisor** (manual)   | Позиции 200+ commercial keywords weekly                          | `cms` через UI        |
| **Я.Метрика** (auto)    | Sessions / leads / 12 goals                                      | `aemd`                |
| **Я.Вебмастер** (auto)  | Pages crawled / errors / sitemap acceptance                      | `seo-tech`            |
| **Manual prompt tests** | AI-citation rate (10 prompts × 3 LLM)                            | `poseo`               |

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
