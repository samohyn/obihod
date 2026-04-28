# Incident · 2026-04-28 · Deploy fail — `.env` shell quoting

**Severity:** P3 (deploy fail без user-facing impact)
**Date:** 2026-04-28 14:42 UTC
**Detection time:** 14:43 UTC (через GitHub Actions Monitor)
**Resolution time:** 14:59 UTC (deploy retry success)
**Total impact window:** 17 минут
**User-facing impact:** **None** — prod продолжал работать на старой версии
**On-call:** `do` (autonomous via Claude session)

## Summary

Deploy на main commit `5e179d7` (PR #80 merge — US-12 Phase B partial release) упал на этапе «Apply Payload migrations to prod DB» с `exit 127` из-за неэкранированного значения с пробелом и кириллицей в `shared/.env` на VPS. Prod symlink не переключился, PM2 не reloaded — старая версия продолжала обслуживать.

## Timeline (UTC)

| Time | Event |
|---|---|
| 14:39 | PR #80 merged in main (commit `5e179d7`) |
| 14:39 | deploy.yml run #25059440872 auto-trigger on push main |
| 14:42:48 | Job «Apply Payload migrations» step fail с `shared/.env: line 21: admin: command not found` exit 127 |
| 14:42:50 | Subsequent steps (rsync, PM2 reload, smoke) skipped |
| 14:43 | `do` обнаружил fail через Monitor notification |
| 14:43 | `curl /api/health` 200, uptime 34746s — prod alive на старой версии |
| 14:44 | Root cause найден через `gh run view --log-failed` |
| 14:45 | `.env.example` patched (preventive) + PR #81 created |
| 14:46 | Operator уведомлён о VPS fix |
| 14:5x | Operator поправил VPS `shared/.env` line 21 (обернул в double quotes) |
| 14:51 | `do` re-triggered deploy.yml workflow_dispatch run #25060120158 |
| 14:54 | Build + Deploy успешно прошли |
| 14:59 | Smoke `/api/health?deep=1 → db:ok`, `/admin/login → 200`, `/admin → 200`, uptime 35s (свежий PM2) |
| 15:00 | PR #81 merged + Linear closed PAN-2/3/4/5/9/10 |

## Root Cause (5 Whys)

1. **Why** deploy упал? → `bash: admin: command not found` при `set -a; . shared/.env; set +a` в job «Apply Payload migrations».
2. **Why** bash попытался выполнить `admin`? → Строка в `.env` `SMTP_FROM_NAME=Обиход admin` без кавычек распарсилась как assignment `SMTP_FROM_NAME=Обиход` + execute `admin`.
3. **Why** значение оказалось без кавычек? → Operator скопировал блок из `site/.env.example` где было `# SMTP_FROM_NAME=Обиход admin` (commented, без кавычек) и uncomment'нул при copy на VPS.
4. **Why** `.env.example` не имел кавычек? → При написании scaffolding (commit `2f10c5d`) автор (`do` в роли) написал bash-style `KEY=value` шаблон без учёта что в VPS `.env` есть values с пробелами + кириллицей.
5. **Why** не было предупреждения / валидации? → deploy.yml использует `set -a; .` для sourcing — это самый универсальный, но **не фейлит на синтаксисе раньше**, чем выполнятся команды. `bash -n` синтаксический lint показал бы.

## Contributing Factors

- **No `.env` linter в CI** — нет шага «check shared/.env syntax» в deploy.yml
- **No staging environment** — fix-forward на проде, не словили на staging
- **Comments в `.env.example` не объясняли quoting requirement** — copy-paste user-friendly было важнее, чем безопасность
- **Auto-mode session** — operator выполнял manual VPS edit без code review от do, copy-paste error не был замечен

## Impact

| Aspect | Impact |
|---|---|
| User-facing | **None** — prod alive на старой версии (uptime 9.6h на момент incident, 34746s) |
| Data integrity | None — миграция `users.telegram_chat_id` не применилась, БД unchanged |
| Symlink state | Не переключился — `current` указывал на pre-deploy release |
| PM2 process | Не restarted — продолжал обслуживать старый bundle |
| Deploy time wasted | ~3 минуты build CPU + ~17 минут recovery window |
| User trust | Negligible — incident внутренний, prod не упал |

## Resolution

1. **Quick fix preventive** — `.env.example` обновлён: `SMTP_FROM_NAME="Обиход admin"` (PR #81 merged).
2. **VPS fix** — operator вручную обернул `SMTP_FROM_NAME` в double quotes в `~/<base>/shared/.env`.
3. **Re-trigger deploy** — `gh workflow run deploy.yml --ref main`. Deploy run #25060120158 success.
4. **Smoke verified** — health 200, db ping 200, admin/login 200, dashboard 200.

## Follow-ups (action items)

- [ ] **`do`**: добавить step `bash -n shared/.env` (синтаксический lint) в deploy.yml перед `set -a; .` — early failure если quoting issue. Issue в Linear: TBD.
- [ ] **`do`**: рассмотреть `dotenv-linter` или `bash -n` workflow check в `.github/workflows/ci.yml` для PR с changes в `.env.example`.
- [ ] **`tamd`**: ADR на staging environment vs canary (упоминается в do.md §8 как roadmap, но не имплементирован). Текущий incident мог бы быть пойман на staging.
- [ ] **`do`**: скопировать Beget DKIM записи + DMARC ticket status в `team/ops/email-setup-status.md` (continuous tracking).
- [ ] **`popanel`**: при следующем merge PR с changes в `lib/messengers/email.ts` — verify `.env.example` quoting в review.

## Lessons Learned

1. **Bash sourcing требует осторожности с values containing spaces / non-ASCII.** Любая variable с пробелом обязана быть в double quotes (или single, но без variable expansion). Это инвариант infrastructure code.
2. **`.env.example` — это **template**, а не **just docs**.** Operators copy-paste его в реальный `.env` без code review. Quoting должен быть в template.
3. **Pre-deploy CI должен проверять `.env` syntax.** Сейчас CI проверяет `package.json`, TypeScript, lint, Playwright, но не `.env.example` syntactic validity.
4. **deploy.yml fail-safe сработал.** Symlink-based deployment предотвратил user-facing impact. Это hyper-important — без этого механизма prod упал бы на partial migration. **Architecture: 1, Operator/code: 0.**

## Memory updates

- `feedback_env_example_quoting.md` (создаётся): values с пробелами / кириллицей в `.env.example` ОБЯЗАНЫ быть в double quotes. Иначе copy-paste на VPS ведёт к sourcing failure.

## Verification

```bash
# Final smoke 14:59 UTC
$ curl -sLw '\n[%{http_code}]\n' https://obikhod.ru/api/health
{"status":"ok","uptimeSec":35,"ts":"2026-04-28T14:59:12.579Z"}
[200]

$ curl -sLw '\n[%{http_code}]\n' 'https://obikhod.ru/api/health?deep=1'
{"status":"ok","uptimeSec":36,"ts":"2026-04-28T14:59:13.625Z","db":"ok"}
[200]

$ curl -sLw '[%{http_code}]\n' -o /dev/null https://obikhod.ru/admin/login
[200]

$ curl -sLw '[%{http_code}]\n' -o /dev/null https://obikhod.ru/admin/
[200]
```

Все critical paths зелёные. 2-hour observation window: 14:59 — 16:59 UTC. Рассказал — пинг при ошибках.
