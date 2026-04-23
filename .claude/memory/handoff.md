# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-04-23 вечер)

### Prod — живой, частично обновлён
- https://obikhod.ru, VPS 45.153.190.107 (deploy@), Node 22, PM2 `obikhod`, auto-deploy на push `main`
- **Repo публичный** (`samohyn/obihod`) — GH Actions безлимитно на linux, branch protection теперь доступен бесплатно
- Живое на prod после US-2:
  - Главная, Hero CTA и Header = `+7 (985) 170-51-11` из `chrome.contacts.phoneE164` ✅
  - JSON-LD Organization читает SiteChrome ✅
  - Dashboard админки: кремовый фон + группы `01·Заявки / 02·Контент / 03·Медиа / 04·SEO / 05·Рамка сайта / 09·Система`; tile `Site Chrome (Header / Footer)` виден ✅
- **НЕ применилось на prod** (ждёт починки):
  - `/admin/globals/site-chrome/` → "Nothing found" — устаревший `importMap.js` в бандле
  - Дефолтный Payload-логотип вместо «ОБИХОД» (тот же importMap)
  - `/arboristika/ramenskoye/` → 404 — **seed-prod workflow ни разу не запускался**

### Workflows (все в репо, работают)
- `deploy.yml` — auto-deploy на push main. **Последний push `d2cac65` УПАЛ** на шаге «Regenerate Payload admin importMap»
- `ci.yml` — тоже упал на `d2cac65` (вероятно новый `site-chrome.spec.ts` без живой БД)
- `prod-backup.yml` — ручной pg_dump, работает. Pre-US2 backup сделан ✅
- `seed-prod.yml` — fallback seed runner по ADR-0001, НЕ запускался
- `admin-rebuild.yml` — `generate:importmap + pm2 restart` на VPS. Сам отрабатывает, но бесполезен пока Next.js бандл собран с устаревшим importMap

### Последний коммит и 11 предыдущих (все на origin/main, repo public)
- `d2cac65` fix(deploy): regen Payload importMap перед build — **deploy failure, нужен лог**
- `5dd76c6` chore(memory): handoff + learnings
- `1b533dc` fix(cms): Hero + CtaMessengers из SiteChrome + e2e `site-chrome.spec.ts`
- `539ce8d` docs(contex): 07_brand_system.html
- `2b016a4` feat(admin): брендирование (палитра art, BrandLogo, BrandIcon, префиксы групп)
- `2806c14` feat(ops): admin-rebuild workflow
- `41d93e9` docs(contex): revert eb25c74 (`contex/` восстановлен)
- `aea00bc` chore(release): US-1 seed release artifacts
- `bb0f6f8` feat(cms): US-2 SiteChrome global + dedup SeoSettings + seed 28 LP
- `fdf86ea` fix(backup): без sudo
- `d3eb3df` feat(tooling): fal.ai integration + prod-backup workflow

### US pipeline — CONDITIONAL APPROVE по обоим
- **US-1 seed prod db**: ba→sa→dba→be3→qa1→cr→out · 28 LP (4 кластера × 7 пилотных районов) · ADR-0001 safety-gate + fallback workflow · placeholder-медиа через fal:gen (41+45 KB)
- **US-2 SiteChrome globals**: ba→sa→dba→be4+fe1+seo2→qa2→cr→out · 1 global `site-chrome` · drop 9 полей + `sameAs[]` SeoSettings по ADR-0002

### fal.ai интеграция — работает локально
- `site/lib/fal/` + `site/app/api/fal/` + `pnpm fal:gen <hero|og|case-viz|blog-cover> --json '...'`
- `FAL_KEY` — в `site/.env.local`. На prod НЕ проброшен (offline batch достаточно)
- **TODO:** провернуть FAL_KEY в dashboard — был в чате, не ротирован

## В работе / блокер на завтра

**P0: deploy.yml шаг «Regenerate Payload admin importMap» упал.**

Нужно от оператора при старте:
- GH Actions → Deploy to Beget #22 (sha `d2cac65`) → job «Build production bundle» → step «Regenerate Payload admin importMap» → **полный вывод 10-20 строк**. Без лога не починить точечно.

Fallback-гипотезы:
- `@next/env loadEnvConfig` bug → обёртка через `tsx --env-file` как в `seed.ts`
- «Cannot find module …/Users» (ESM strict resolver) → `.js` расширения в `payload.config.ts`
- `DATABASE_URI` не доступен скрипту → проверить env на шаге

## Следующий шаг (при старте завтра)

1. **Лог от оператора → починить шаг → push → проверить auto-deploy до зелёного**
2. После успеха повторить `admin-rebuild` (на всякий, если importMap на VPS старее бандла) и проверить через MCP Playwright:
   - `/admin/globals/site-chrome/` — форма с 5 секциями
   - `/admin/login` (из incognito) — логотип «ОБИХОД» + «порядок под ключ · admin»
   - Navbar — иконка «О» на зелёном квадрате
3. **Запустить seed-prod**: GH Actions → Seed prod DB (fallback) → confirm=`seed`. После — smoke:
   - `/arboristika/ramenskoye/` = 200
   - `/sitemap.xml` содержит programmatic-URL
   - `Organization.telephone` в JSON-LD = `+79851705111`
4. **Оператор в /admin/globals/site-chrome:** заполнить `social[]` — Telegram/MAX/WhatsApp реальными URL (инвариант CLAUDE.md, seed кладёт `[]`)
5. **Backlog к закрытию после релиза:**
   - Ротация FAL_KEY
   - Branch protection на `main` (public + Free позволяет)
   - Цели Метрики: lead_sent, photo_upload, phone_click, tg_click, max_click, wa_click, calc_submit
   - ADR по Payload migrations (текущая схема на prod через `push:true` — тех.долг)
   - Реальные фото Cases (не placeholder от fal:gen)
   - cw: реальные тексты для кластеров крыши/мусор/демонтаж

## Подсказки для следующей сессии

- `git push origin main` у меня BLOCK rule — каждый push через оператора
- Prod health: `curl -fsSL 'https://obikhod.ru/api/health?deep=1'` (URL в кавычках для zsh)
- GH Actions статус без токена: `curl 'https://api.github.com/repos/samohyn/obihod/actions/runs?per_page=5&branch=main'` — работает на public. Логи упавших шагов через API дают 403; просить у оператора из UI
- Uptime растёт ≠ последний push ещё не применился (deploy failure или ISR кеш)
- Playwright MCP скрины: относительный путь `screen/foo.png` рабочий, `screen/` в `.gitignore`
- prod-backup лежит в `$BEGET_DEPLOY_PATH/backups/manual-<reason>-<UTC>.sql.gz` + GH Actions artifact (30 дней)

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Домен backup: `obixod.ru`, `obihod-servis.ru`
- [ ] Юрлицо / СРО / лицензия Росприроднадзора (после регистрации — заполнить `/admin/site-chrome/requisites`)
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
