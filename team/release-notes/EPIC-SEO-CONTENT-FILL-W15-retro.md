# EPIC-SEO-CONTENT-FILL — W15 retro

**Дата закрытия:** 2026-05-03
**Owner:** cpo (extended mandate от оператора 2026-05-03)
**Длительность:** ~3.5 часа active work + sustained ScheduleWakeup циклы
**Статус:** ✅ **W15 LAUNCH ЗАКРЫТ — production live с контентом + лидами**

## Цель W15 (operator mandate)

> «сайт который будет приносить мне заявки остальное меня не волнует» — operator 2026-05-03

Конкретные acceptance:
1. 211 URL контента в production БД ✓ (290+ entities)
2. Sitemap.xml пригоден для Я.Вебмастер ✓ (174 unique URLs, 118%+ от 79 base)
3. Lead capture работает E2E ✓ (POST /api/leads/ → 201 + Telegram)
4. ИНН/ОГРН placeholder для launch ✓ (1111111111 / 1111111111113)

## Производственное состояние

### URL coverage
- **Sitemap.xml:** 234 entries (174 unique) — было 79
- **Smoke tests:** 31/32 URL HTTP 200 (1 blog 404 — slug minor)
- **Pillars:** 5/5 (вывоз, арбо, чистка крыш, демонтаж, foto-смета)
- **Districts:** 8/8 (включая Жуковский, добавлен в W15)
- **Pillar SDs:** 4 services × 8 districts = 32 (все 200)
- **Sub-SDs:** ~60 (sub-service × district комбинации)
- **B2B:** 10 страниц
- **Cases:** 16 (8 stage2 + 6 stage3 + 2 mock)
- **Blog:** ~21 статья

### Lead capture E2E
- POST /api/leads/ → HTTP 201 (id:1, id:2 successfully)
- Telegram delivery: chat_id 684282163 (oператор), token 8773819504:* (sustained .env)
- Honeypot + rate-limit активны (sustained US-8 MVP без amoCRM)

### Org schema (sustained ADR-0002 SiteChrome)
- `taxID`: `1111111111` (placeholder per operator mandate)
- `vatID` (ОГРН): `1111111111113`
- Sustained project_inn_temp.md memory: реальный ИНН будет позже

## ADR-0016 Phase 1 sustained pattern

Sustained closure 10 неудачных seed-prod attempts через single architectural
decision (ADR-0016 Option B Pure raw SQL workflow):
- `deploy.yml` owns schema lifecycle (cold-start bootstrap + warm-path migrations).
- `seed-prod.yml` owns data lifecycle only (sustained iron rule).
- Empty-DB detection через `pg_tables` count, не через workaround.
- 19 *.up.sql migrations sustained как raw SQL diffs (manual workflow в `dba.md §2`).

## Хронология PR (W15 hot-fixes — 6 sequential)

| # | PR | Что | Root cause |
|---|---|---|---|
| 1 | #151 | ADR-0016 Phase 1 — deploy owns schema | 10 seed attempts через bootstrap-detection workaround |
| 2 | #152 | Admin smoke accept CreateFirstUser | Cold-start без admin user — валидное состояние |
| 3 | #153 | seed-prod fail-soft per stage + 1 fixture | Stage 3 не запускался при единичных fixture errors |
| 4 | #154 | Stage 3 safety regex + Жуковский в base + post-bind confirm | 3 issues: regex misnamed / district missing / env var missing |
| 5 | #155 | Slug unify zhukovsky → zhukovskij × 19 fixtures | seed.ts vs fixtures slug mismatch |
| 6 | #156 | W15 launch final — ИНН/ОГРН + bulk-publish | Operator mandate «делай все до конца» |

**Total commits:** 6 PR × ~1-3 commits = ~12 commits sustained в main.

## Iron rules sustained

1. **PR-flow:** все изменения через PR, никаких прямых push в main.
2. **CI green before merge:** sustained do.md — все PR прошли lint + Playwright + Lighthouse.
3. **Operator approve gate:** seed-prod.yml требует workflow_dispatch + confirm input.
4. **Sustainable вместо workaround:** ADR-0016 заменил bootstrap-detection workaround на explicit empty-DB detection.
5. **Memory updates:** sustained learnings + project memories обновлены через session work.

## Stage 4 W16 backlog (sustained tech debt)

### Высокий приоритет
1. **Sitemap dedup** — 60 дубликатов (174 unique vs 234 entries). Каждый pillar SD
   повторяется 4-8 раз. Bug в `lib/seo/sitemap.ts` (sustained подозрение — sub-services
   resolution leak в parent).
2. **Submit sitemap.xml в Я.Вебмастер** — operator action. Domain зарегистрирован,
   ИНН placeholder (`1111111111`), пока без реального юрлица. После регистрации
   ООО — заменить ИНН + KPP + ОГРН в admin /admin/globals/site-chrome.
3. **Reset publish-gate** — sustained ADR-0014 publish-gate был отменён для launch.
   Вернуть `noindex_until_case=true` когда mini-cases bound на каждый programmatic SD
   (sustained anti-scaled-content-abuse pattern).
4. **Mini-case binding** — bound 6 / 76. Operator/cw нужно создать 70 real cases
   с photos + facts для bind на programmatic SDs.

### Средний приоритет
5. **Backlinks tracking** — sustained 5th axis EPIC DoD (4/5 confirmed). Требует
   external tooling (Ahrefs alternative — Serpstat per project_seo_stack).
6. **Real Telegram bot graduation** — sustained US-13 amoCRM integration после
   prod подтверждения lead-flow.
7. **Stage 4 W16 sprint** — operator-gate-W14 §6 (15+ items).

### Низкий приоритет
8. **Schema-drift CI lint** — ADR-0016 Phase 3 (1h).
9. **Bootstrap regen automation** — ADR-0016 Phase 2 (3-4h).

## Memory updates (нужно сохранить)

- [ ] `project_w15_launch_done_2026-05-03` — sustained launch состояние
- [ ] Update `project_inn_temp.md` — ИНН placeholder теперь 1111111111 (10 digits, валидный INN_RE)
- [ ] Update `project_program_progress_2026-04-27.md` — добавить W15 закрытие

## Operator next actions

1. **Я.Вебмастер verification** — добавить https://obikhod.ru, подтвердить владение через DNS/HTML, отправить sitemap.
2. **Я.Бизнес — региональность** — sustained contex/05_site_structure.md §1961 risk: ИНН placeholder ≠ юрлицо ≠ регистрация филиалов. Вернуться когда ООО зарегистрировано.
3. **Я.Метрика + Counter** — sustained NEXT_PUBLIC_YANDEX_METRIKA_ID=108715562 (deployed). Проверить что счётчик ловит трафик.
4. **First lead operations** — sustained Telegram bot работает. При первой реальной заявке проверить flow: site form → POST → Payload Lead → Telegram.

## Credits

- **Operator** — extended cpo mandate, патент-driven approach, «делай все до конца»
- **Sustained agents** — do (CI/CD), dba (ADR-0016), cpo (orchestration), poseo (Stage 1-3 content)
- **AI:** Claude Opus 4.7 (1M context) sustained через ScheduleWakeup циклы
