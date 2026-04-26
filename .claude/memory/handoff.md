# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-04-26)

### Prod
- https://obikhod.ru, VPS 45.153.190.107 (deploy@), Node 22, PM2 `obikhod`, auto-deploy на push `main`
- main = `442b129` — feat(seo): US-4 semantic-core + US-5 hand-off (PR #33 merged 2026-04-25 вечер)
- US-1 + US-2 + US-3 (волна 1) + OBI-12 sitemap fix + OBI-16 unstable_cache hot-fix + US-4 semantic-core + US-5 hand-off — закрыты

### US-4 + US-5 — закрытые большие задачи (в репо)

**US-4 (OBI-7) Done:**
- 1601 ключ, 252 кластера, 209 484 wsfreq Москва+МО
- vyvoz-musora 161К (74%), arboristika 27К (13%), tools-and-docs 10К, neuro-info 7.9К, chistka-krysh 888, b2b 235, demontazh 225
- 14 deep-конкурентов
- Артефакты: `seosite/` + `devteam/specs/US-4-semantic-core/out.md`

**US-5 (OBI-2) разблокирован:**
- sitemap-tree v0.4 APPROVED (~330 URL вол.1, ~2350 полное покрытие)
- 18 ADR закрыты
- [sa.md](../../devteam/specs/US-5-full-sitemap-ia/sa.md) написан: 12 REQ + 9 AC + 6 рисков

### Q-14 порядок pillar — синхронизирован во всём репо

`CLAUDE.md` immutable + `seosite/04-url-map/decisions.md` (ADR-uМ-14) + `seosite/04-url-map/sitemap-tree.md` v0.4 — все три источника говорят одно: **Вывоз мусора → Арбо → Крыши → Демонтаж**. APPROVED оператором 2026-04-25 (вечер).

### Linear состояние

| Issue | Статус | Что дальше |
|---|---|---|
| OBI-7 (US-4) | **Done** | закрыт 2026-04-25 |
| OBI-2 (US-5) | **Todo** | старт после merge claude-md-fix — `seo2` ведущий |
| OBI-1 (US-3) | Done | закрыт 2026-04-25 |
| OBI-16 P0 Urgent | Backlog (но фактически closed PR #28) | перевести в Done |
| OBI-12 (sitemap) | Backlog | мерджи #26/#27/#29/#31 на main — проверить факт |
| OBI-10/13/14/15/9 | Backlog (US-3 follow-ups) | берём после US-10 или параллельно |
| OBI-11 (CLI seed-prod) | Backlog P2 | тех.долг, отложен |

## Следующий шаг (при старте следующей сессии)

1. **Запустить US-5** (`seo2` ведущий по [sa.md](../../devteam/specs/US-5-full-sitemap-ia/sa.md)):
   - REQ-5.8 ADR-0003 на блочную модель (tamd, критичный блокер для US-6)
   - REQ-5.3 миграция slug `ochistka-krysh` → `chistka-krysh` (be3 + dba)
   - REQ-5.1 sitemap.xml priority по wsfreq
2. **Header navigation** в `site/components/layout/Header.tsx` — поменять порядок под новый immutable (передать в US-5 / fe1 как часть REQ-5.6)
3. **Закрыть OBI-16** в Linear (PR #28 уже merged + deployed, статус не соответствует)

## Wave 2.5 / M3 backlog (не блокирует)

- Дозабор wsfreq для ~1400 ключей с freq=0 — `seosite/scripts/jm_wsfreq_micro.py` готов, ждёт восстановления Just-Magic API
- Полная JM-кластеризация через `jm_cluster_batched.py` (заменит локальный fallback)
- Topvisor подключение для US-7/US-10 мониторинга (operator-action: регистрация + API-ключ)
- Решение оператора по Q-4 калькуляторов (универсальный vs 4 отдельных)
- Решение оператора по Q-5 trust-страниц (`/o-kompanii/` агрегирующая или 4 отдельных)
- Решение оператора по Q-6 личного кабинета B2C

## Подсказки для следующей сессии

- `git push origin main` BLOCK rule — оператор пушит и мерджит сам через PR
- `gh` CLI не установлен — PR через UI по URL из push output
- Перед `git reset --hard` проверять `.claude/memory/handoff.md` и `learnings.md` — они tracked, потеряются. Закоммитить ИЛИ включать в feature-PR
- `seosite/` живёт отдельно от `site/`, в публичный repo коммитится; секреты только в `.env.local`
- Для повторного запуска SEO-скриптов нужны env-переменные `KEYSO_API_KEY` и `JUSTMAGIC_API_KEY` в `.env.local`
- Wsfreq baseline: `seosite/03-clusters/_summary.json`
- Sitemap-tree v0.4 — единый source-of-truth по URL до окончания M3
