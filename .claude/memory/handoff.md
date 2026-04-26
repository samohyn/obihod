# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-04-26)

### Prod
- https://obikhod.ru, VPS 45.153.190.107, Node 22, PM2 `obikhod`, auto-deploy на push `main`
- main = `d6dfb01` (PR #38 merged: revalidate trailing slash + revalidatePath)
- Pillar страницы (`/vyvoz-musora/`, `/arboristika/`, `/demontazh/`) **всё ещё 404** — ждёт merge PR #39
- US-1 + US-2 + US-3 + US-4 + US-5 hand-off — закрыты в репо

### 🔴 Критичный блокер на старте — merge PR #39

**OBI-16 — 3 root cause выявлены последовательно, остался последний фикс:**

| # | Симптом | Root cause | PR |
|---|---|---|---|
| 1 | Pillar 404 после seed | `unstable_cache` тихо возвращал [] на build | ✅ #28 merged |
| 2 | Revalidate ISR упал HTTP 308 | `trailingSlash:true` + curl без `-L`<br/>`revalidateTag` не trigger ISR rebuild | ✅ #38 merged |
| 3 | Deploy + revalidate success, всё равно 404 (`x-nextjs-cache: HIT`) | `generateStaticParams` использовал `PILLAR_SLUGS` fallback → prerender 4 pillar как 404 (БД недоступна на runner) | 🟡 **#39 — ждёт merge оператора** |

**[PR #39](https://github.com/samohyn/obihod/pull/39)** — `fix(seo): pillar prerender 404 — убрать PILLAR_SLUGS fallback`. Меняет стратегию рендера pillar с pre-build на on-demand. Side effect: первый запрос на /vyvoz-musora/ после deploy медленнее (миллисекунды), дальше cache hit на 24ч.

**После merge PR #39 — последовательность (всё автоматом, без оператора):**
1. Auto-deploy на VPS (~5 мин)
2. Я через GH API запускаю Revalidate ISR (опционально, prerender теперь пустой)
3. Smoke 3 pillar → 200
4. OBI-16 → Done в Linear
5. Разблокируется US-5 для `seo2`

### Доступы (получены 2026-04-26)

- ✅ **GH PAT** в `~/.claude/secrets/obikhod-gh.env` (gitignored, chmod 600). Позволяет: list/run workflows, create PRs, get logs.
- ❌ Payload API key — будет после merge OBI-17 (cms-agent)
- ❌ SSH к VPS — не нужен (через GH workflows + REST API)

С GH PAT я могу автономно:
- Запускать workflows (`workflow_dispatch`)
- Скачивать логи упавших runs
- Создавать PRs (через REST `/repos/.../pulls`)
- Комментировать PR/issue в GH и Linear

Не могу без оператора:
- Мерджить PR в main (BLOCK rule + бизнес-апрув)
- Прямые правки прод-данных в админке (нужен Payload API key из OBI-17)

### Linear состояние

| Issue | Статус | Что дальше |
|---|---|---|
| **OBI-16** P0 Urgent | **In Progress** | После PR #39 merge → smoke → Done |
| **OBI-17** P1 — CMS Operator agent | Backlog | После OBI-16 → `be4` lead, фазы 1+2 (Users.useAPIKey + bot role + Audit + scripts/admin/) |
| OBI-7 (US-4) | Done | закрыт 2026-04-26 |
| OBI-2 (US-5) | Todo | старт после OBI-17 (для миграции slug нужен cms-agent) |
| OBI-1 (US-3) | Done | |
| OBI-12 (sitemap) | Backlog | проверить факт по 28 programmatic после fix |
| OBI-10/13/14/15/9 | Backlog | US-3 follow-ups |
| OBI-11 (CLI seed-prod) | Backlog | тех.долг (`@next/env` CJS/ESM баг) |

### Открытые PRs

| PR | Title | Status |
|---|---|---|
| **#39** | `fix(seo): pillar prerender 404 — убрать PILLAR_SLUGS fallback` | 🟡 ждёт merge |

### Активные роли в проекте

- `cms` — новая роль, [devteam/cms.md](../../devteam/cms.md), создана 2026-04-26. Активируется после merge OBI-17.
- Все остальные 28 ролей — без изменений с 2026-04-25.

## Следующий шаг (при старте следующей сессии)

1. **Проверить статус PR #39** — `source ~/.claude/secrets/obikhod-gh.env` + `curl -H "Authorization: Bearer $GH_PAT" https://api.github.com/repos/samohyn/obihod/pulls/39`. Если merged → auto-deploy, revalidate, smoke, закрыть OBI-16.
2. **Если PR #39 ещё открыт** — напомнить оператору в чате.
3. **После OBI-16 Done** — запустить OBI-17 (cms-agent):
   - `tamd` ADR-0004 на access control bot-user
   - `be4` PR `feat/cms-operator-agent` (Users.useAPIKey + bot role + Audit collection + scripts/admin/)
   - Оператор: апрув PR + создание bot-user + генерация API key
   - После → миграция slug `ochistka-krysh` → `chistka-krysh` через cms (REQ-5.3 US-5)
4. **Параллельно с OBI-17** — `seo2` стартует US-5 REQ-5.1/5.2/5.4/5.5 (sitemap.xml priority + robots.txt + canonical + Schema.org).
5. **Header navigation** в `site/components/layout/Header.tsx` — поменять порядок под Мусор → Арбо → Крыши → Демонтаж (передать `fe1` как часть REQ-5.6).

## Подсказки для следующей сессии

- `git push origin main` BLOCK rule — оператор пушит и мерджит сам через PR
- **GH PAT в `~/.claude/secrets/obikhod-gh.env`** — `source` его перед curl-запросами
- Для запуска workflow: `curl -X POST -H "Authorization: Bearer $GH_PAT" .../actions/workflows/<name>.yml/dispatches -d '{"ref":"main","inputs":{...}}'`
- `gh` CLI не установлен — всё через REST API + curl + jq/python
- Для sitemap.xml на проде: содержит draft-slugs (через `getAllServiceSlugs` без published-фильтра) — nice-to-fix в US-5
- `seosite/` живёт отдельно от `site/`, в публичный repo коммитится; секреты только в `.env.local`
- Wsfreq baseline для US-6/US-7: `seosite/03-clusters/_summary.json` (vyvoz-musora 161К #1 по wsfreq Wave 2)
- При работе с фоновыми задачами (Bash run_in_background): системные wakeup могут устаревать — всегда проверять реальный state перед действиями

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Домен backup: `obixod.ru`, `obihod-servis.ru`
- [ ] Юрлицо / СРО / лицензия Росприроднадзора (после регистрации — заполнить `/admin/site-chrome/requisites`)
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
