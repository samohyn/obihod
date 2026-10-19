# CMS-операция — миграция slug `ochistka-krysh` → `chistka-krysh`

**Дата:** 2026-04-26
**Actor:** `do` через REST API (Authorization: users API-Key) под учёткой `samohingeorgy@gmail.com` (id=1, role=admin)
**Triggered by:** US-5 REQ-5.3 / ADR-uМ-13 (отдельный issue в backlog)
**Связанные PR:** [#44 Header pillar order](https://github.com/samohyn/obihod/pull/44), [#45 Migration slug + redirect](https://github.com/samohyn/obihod/pull/45)

---

## Что сделано

### 1. Код (PR #45 merged → deploy #66)

- `next.config.ts` — `redirects()` для `/ochistka-krysh/` и `/ochistka-krysh/:path*` → `/chistka-krysh/...` (permanent: true)
- `app/api/seed/route.ts`, `scripts/seed.ts` — type union + slug literal
- `app/(marketing)/raiony/[district]/page.tsx` — fallback ALL_SERVICES
- `collections/Districts.ts` — afterChange revalidate-tags список

### 2. Данные (REST PATCH под admin API key)

```
PATCH /api/services/2
Authorization: users API-Key 2bd20b…ee7d
Content-Type: application/json

{"slug":"chistka-krysh"}
```

**Before:**
```
id=2 slug=ochistka-krysh _status=published title=Чистка крыш от снега и наледи
```

**After:**
```
id=2 slug=chistka-krysh _status=published title=Чистка крыш от снега и наледи
```

ServiceDistricts (7 штук связанных с этой услугой через `service: 2` — id, не slug) не пострадали.

### 3. Revalidate

`Revalidate ISR` workflow → `tag=services` + 6 paths (`/`, 4 pillar, `/ochistka-krysh/`)
→ run #N success, all `revalidatePath()` returned ok.

## Результаты smoke (2026-04-26 после deploy #66)

```
/                  → 200
/vyvoz-musora/     → 200
/arboristika/      → 200
/chistka-krysh/    → 200  ✨ (раньше 404)
/demontazh/        → 200

/ochistka-krysh/   → 308 redirect → /chistka-krysh/ → 200  ✓
```

## Влияние на SEO

- **Wsfreq capture:** теперь сайт собирает 888 wsfreq для «чистка крыш» (было 0 для «очистка крыш»).
- **Я.Вебмастер:** оператор должен подать «Изменение URL» в Я.Вебмастер инструменте → ускорит реиндексацию.
- **Sitemap.xml:** автоматически отдаёт `/chistka-krysh/` (через `getAllServiceSlugs` Payload).
- **Старые внешние ссылки** на `/ochistka-krysh/` (если были) → 308 redirect не теряет authority (Google/Yandex понимают permanent).

## Followup tasks

- [ ] **Sub-services slug**: `ochistka-krysh-mkd`, `ochistka-krysh-chastnyy-dom`, `sbivanie-sosulek` — пока не существуют как separate slug (sub-services hardcoded inline в Service.subServices array). Когда `cw` начнёт писать sub-pages в US-6 — использовать `chistka-krysh-*` префикс.
- [ ] **ServiceDistricts slug**: 7 SD `ochistka-krysh × district` сейчас связаны через FK `service_id=2`. Их URL формируется в runtime как `/${service.slug}/${district.slug}/` → автоматически `/chistka-krysh/<district>/`. Никакой миграции не требуется.
- [ ] **Header sub-services hrefs**: `Header.tsx` колонка «Чистка крыш» использует legacy slug `/krysha/uborka-snega/` etc. Переписать на `/chistka-krysh/<sub>/` — задача для US-6 / `fe1`.

## Auth trail

API key создан 2026-04-26 после PR #43 (`auth: { useAPIKey: true }` + миграция `20260426_153500_users_api_key`). Ключ принадлежит юзеру id=1 (оператор). Audit пишется в Payload `_services_v` versions table — каждое PATCH создаёт новую версию с `updatedAt` + `_status: published`.
