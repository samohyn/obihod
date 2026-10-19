# US-3 — два PR для prod-деплоя

После merge в `main` auto-deploy через `deploy.yml`. Порядок важен — миграция **сначала**.

---

## PR #1 — `chore(db): Payload migrations on (push→false) + US-3 schema migration`

**Branch:** `chore/payload-migrations-on`
**Target:** `main`

### Scope

Перевод Payload со `db.push: true` (интерактивный, опасный) на proper migrations + первая миграция под US-3 (12 новых таблиц blocks + site_chrome + cleanup seo_settings наследия US-2).

### Changes

- `site/payload.config.ts` — `push: true` → `push: false` + `prodMigrations` config
- `site/migrations/20260424_133242_us_3_blocks_and_seo.{ts,up.sql,down.sql}` — 35 KB up / 6 KB down, проверены apply+rollback локально
- `.github/workflows/deploy.yml` — новый шаг `pnpm payload migrate` между `pnpm build` и `pm2 reload` (+ удалён проблемный шаг «Regenerate Payload admin importMap» — root cause `d2cac65`, см. Notes)
- `deploy/README.md` — раздел «Миграции Payload» (когда запускать, как откатывать)
- `team/ops/migrations/us-3-schema-diff.md` — artifact dba

### Pre-deploy runbook (оператор)

```bash
# 1. Backup (обязательный)
gh workflow run prod-backup.yml -f reason=pre-us-3-migration

# 2. Merge PR → auto-deploy применит миграцию через payload_migrations tracker

# 3. Verify
ssh deploy@45.153.190.107 "psql $DATABASE_URI -c 'SELECT name FROM payload_migrations'"
# ожидаем: 20260424_133242_us_3_blocks_and_seo

curl -s https://obikhod.ru/api/health?deep=1 | jq
```

### Rollback (emergency)

```bash
ssh deploy@45.153.190.107 "psql $DATABASE_URI -f $BP/current/site/migrations/20260424_133242_us_3_blocks_and_seo.down.sql && psql $DATABASE_URI -c \"DELETE FROM payload_migrations WHERE name='20260424_133242_us_3_blocks_and_seo'\""
./deploy/rollback.sh  # переключить symlink на prev release
```

### Risk

**Low.** Prod-БД пустая (0 строк в бизнес-таблицах), data-loss = 0. Downtime = 0 (все DDL на новых таблицах или пустых колонках). DOWN восстанавливает bit-for-bit, cycle UP→DOWN→UP проверен.

### Notes — root cause `d2cac65`

`payload generate:importmap` на Node 22 CI падает с `ERR_MODULE_NOT_FOUND: Cannot find module '/site/collections/Users'` из-за extensionless ESM imports в `payload.config.ts`. Фиксить это сейчас нельзя (tsconfig `moduleResolution: bundler` без `allowImportingTsExtensions`). **Решение:** `importMap.js` поддерживаем вручную через be4 (уже делаем), CI не регенит. Шаг из deploy.yml удалён. Детали — learnings.md `2026-04-23 · admin`.

---

## PR #2 — `feat(cms): US-3 блочный редактор, SEO-поля, Custom Dashboard`

**Branch:** `feat/us-3-admin-blocks-and-seo`
**Target:** `main`
**Blocked by:** PR #1 (миграция должна примениться первой)

### Scope

Первая волна US-3 — оператор управляет страницами через блочный редактор, SEO-поля на публичных коллекциях, Custom Dashboard с 6 tile-сценариями.

### Changes

**Payload admin:**
- `site/blocks/{Hero,TextContent,LeadForm,CtaBanner,Faq}.ts` + `index.ts` — 5 типов блоков с `admin.images` иконками
- `site/public/admin/blocks/*.svg` — 5 SVG-иконок (зелёный #2d5a3d)
- `site/components/admin/{BeforeDashboardStartHere,DashboardTile,BrandLogo,BrandIcon}.tsx` — Custom Dashboard + бренд-слой
- `site/components/admin/icons.tsx` — 39 Lucide-style иконок для коллекций и блоков
- `site/lib/admin/{publish-gate,publish-gate-messages,preview-routes}.ts` — publish-gate hook + тексты в TOV оператора
- `site/app/api/{preview,exit-preview,preview-sign}/route.ts` — preview-flow через signed cookie
- `site/app/(payload)/admin/importMap.js` — обновлён вручную (3 новых entry: BrandLogo, BrandIcon, BeforeDashboardStartHere)
- `site/app/(payload)/layout.tsx` — Payload RootLayout + custom.scss

**Коллекции (обновления полей + admin.description в TOV):**
- `site/collections/{Services,ServiceDistricts,Districts,Cases,B2BPages}.ts`
  - 90+ эталонных `admin.description` на русском
  - `Services.priceTo` → optional (REQ-7.2)
  - `Districts.localPriceAdjustment` → collapsible «Для калькулятора» (REQ-7.2)
  - `Cases.photosBefore/After` → убран `minRows: 1` + новый гейт «≥1 медиа любого типа» (REQ-7.1)
  - `B2BPages.title/h1` → `maxLength` для консистентности
  - ServiceDistricts — новый tab **Контент** с `blocks[]` + 3 tabs (Контент / SEO / Статус и реклама)
- `site/payload.config.ts` — подключены `beforeDashboard` + `livePreview`

**Публичный рендер:**
- `site/components/blocks/{Hero,TextContent,LeadForm,CtaBanner,Faq,BlockRenderer}.tsx`
- `site/components/PreviewBanner.tsx`
- `site/app/(marketing)/[service]/[district]/page.tsx` — интегрирован BlockRenderer с zero-downtime fallback на legacy layout

**Layout refactor (исправление hydration):**
- `site/app/layout.tsx` — удалён
- `site/app/(marketing)/layout.tsx` — новый root (fonts, JsonLd, YandexMetrika, SiteChrome)

**Env:**
- `site/.env.example` — добавлен `PAYLOAD_PREVIEW_SECRET`
- На prod нужно добавить `PAYLOAD_PREVIEW_SECRET` в GitHub Actions secrets + Beget env

### Backlog (не в этот PR)

- 10 оставшихся блоков (photo-estimate-form, calculator, cases-carousel, services-grid, districts-grid, trust-badges, testimonials, promotion-banner, map-region, video)
- AddBlockPalette custom override (карточная сетка вместо дефолтного Payload UI)
- 85 оставшихся admin.description из 175
- `blocks[]` на Services/Cases/Blog/B2BPages
- `/admin/docs` MDX-справочник с 6 гайдами
- Checklist widget «заполнено X из Y» перед Save
- petrovich автосклонение падежей
- Индикатор «применено на prod»
- OBI-9 обратный поиск блоков (где используется блок X)

### Pre-merge checklist

- [x] PR #1 (миграция) замёрджен и deploy.yml применил её на prod
- [x] `PAYLOAD_PREVIEW_SECRET` добавлен в GitHub Actions secrets + Beget `.env`
- [x] Локально `pnpm build` success
- [x] type-check / lint / format:check зелёные
- [x] E2E `site-chrome.spec.ts` зелёный (anti-TOV regression)

### Verify after deploy

```bash
# 1. Dashboard
curl -I https://obikhod.ru/admin/ | head -3
# 200 ok

# 2. Блочный редактор
curl -sI https://obikhod.ru/admin/collections/service-districts/create/ | head -3
# 200 ok

# 3. Публичный блочный render
curl -sI https://obikhod.ru/arboristika/ramenskoye/ | head -3
# 200 ok (после seed-prod.yml — отдельный шаг)

# 4. Preview route
curl -sI https://obikhod.ru/api/preview?collection=service-districts&id=1 | head -3
# 401 (без токена — ожидаемо), 200 с валидным токеном
```
