---
us: US-7
epic: EPIC-SEO-USLUGI
title: SA-SEO US-7 — Release (seed prod + sitemap 191 URL + IndexNow + Я.Вебмастер + 7-day monitor)
team: seo
po: poseo
type: release + post-deploy
priority: P0
phase: release
role: poseo + seo-tech + do
status: active
created: 2026-05-08
updated: 2026-05-08
skills_activated: [seo, deployment-patterns, github-ops]
depends_on: US-6 (leadqa-6 PASS 2026-05-08)
blocks: US-8-post-launch-tuning
---

# US-7 — Release: seed prod + sitemap 191 URL + IndexNow

## Контекст

US-6 QA PASS (2026-05-08). Deploy к Beget прошёл автоматически (push → main, PR #192 merged).

**Проблема обнаруженная в US-7:** Продакшн БД не содержит данных EPIC-SEO-USLUGI:
- Districts: только 7 базовых из seed.ts (Жуковский, Раменское, …), нет 23 новых приоритетных городов
- ServiceDistricts: 0 записей (150 нужно по DoD)
- SD Class-A content: 0 записей (60 нужно Phase A)
- Результат: `/vyvoz-musora/balashikha/` → 404, sitemap 87 URL (не 191)

**Корень:** `seed-prod.yml` не включал три seed-скрипта EPIC-SEO-USLUGI + не загружал `seosite/strategy/03-uslugi-url-inventory.json` на VPS.

## Что сделано в US-7 (2026-05-08)

- [x] Обновлён `.github/workflows/seed-prod.yml` — добавлены:
  - rsync `seosite/strategy/03-uslugi-url-inventory.json` → `$BP/seosite/strategy/`
  - шаг `seed-cities` (30 городов из inventory)
  - шаг `seed-sd-bulk` (5×30=150 ServiceDistricts)
  - шаг `seed-sd-class-a` (60 Class-A контент записей)
  - revalidate sitemap + service-districts после seed

## DoD US-7

| # | Метрика | Target | Verification |
|---|---|---|---|
| 1 | seed-prod workflow SUCCESS | green CI | GitHub Actions run |
| 2 | `/vyvoz-musora/balashikha/` HTTP 200 | 200 | curl |
| 3 | `/uborka-territorii/mytishchi/` HTTP 200 | 200 | curl |
| 4 | Sitemap URL count `/uslugi/*` | ≥150 SD в sitemap | `curl /sitemap.xml | xmllint --count` |
| 5 | IndexNow или Я.Вебмастер — sitemap submitted | submitted | manual Вебмастер |
| 6 | Lighthouse mobile LCP < 2.5s на prod T4 | <2.5s | Lighthouse job |

## Следующий шаг после US-7

1. Запустить `seed-prod.yml` workflow_dispatch (confirm: "seed") → дождаться green
2. Проверить SD-страницы curl
3. Подать sitemap в Я.Вебмастер вручную (оператор / poseo — нужен доступ к кабинету)
4. Через 7 дней — US-8 post-launch tuning

## Hand-off log

```
2026-05-08 · poseo: US-7 dispatch — operator approve received
2026-05-08 · poseo: обнаружена проблема — prod БД не сидирована, SD-страницы 404
2026-05-08 · seo-tech: seed-prod.yml обновлён (seosite upload + 3 EPIC-SEO-USLUGI seed steps)
2026-05-08 · do: ожидает оператора для запуска seed-prod workflow_dispatch
```
