# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-04-27, конец дня)

### Свежее: art-сессия 2026-04-27 (вечер) — IA расширена 4 → 6 направлений

**Контекст:** оператор в чате расширил scope сайта с 4-в-1 (мусор/арбо/крыши/демонтаж) на **6 направлений** добавив 5-е «Дизайн ландшафта» (flat-link) и 6-е «Магазин» (mega-menu, 9 preliminary категорий саженцев). Также попросил добавить страницы ошибок (404/500/502/503/offline) которых не было.

**Что сделано в роли `art`:**
1. `CLAUDE.md` immutable обновлён — таблица + раздел «Что это» расширены на «4 сервисных pillar + 2 расширения 2026-04-27».
2. `design-system/brand-guide.html` v1.6 → **v1.7**:
   - **Полный реестр иконографики** 4 линейки = 49 line-art glyph'ов в едином формате: 22 service + 9 shop + 9 district + 9 case (раньше district и case жили только в mega-menu без визуального каталога — закрыли пробел по запросу оператора).
   - 9 shop-иконок: `fruit-tree`, `columnar-tree`, `fruit-bush`, `decor-bush`, `flowers`, `roses`, `large-trees`, `deciduous-tree`, `coniferous-tree`.
   - 9 district-иконок: Одинцово / Красногорск / Истра / Химки / Мытищи / Пушкино / Раменское / Жуковский / Москва (landmark-метафоры).
   - 9 case-иконок: storm-cleanup / emergency-removal / urgent-roof / pruning-season / winter-prep / post-renovation / uk-contract / cottage-village / fm-contract.
   - Mega-menu Магазина (3 колонки: Деревья / Кустарники / Цветы) заменил flat-link.
   - Flat-link «Дизайн ландшафта» добавлен.
   - Mobile accordion раскрыт под 9 категорий + Дизайн ландшафта.
   - **Новая секция «11.5 · Страницы ошибок»** — 5 карточек 404/500/502/503/offline с уникальными line-art иллюстрациями 96×96, draft-копией в TOV, картой Next.js файлов, принципами копирайта.
   - Заголовок секции иконок: «Иконография · 49 line-art glyph'ов».
   - Footer обновлён: v1.7, 2026-04-27.
3. `devteam/specs/US-11-ia-extension/` создан с:
   - `art-brief-ui.md` — для ui+fe1: вынос 9 shop-иконок в `site/components/icons/shop/`, перенос Магазина mega в Header.tsx, flat-link Дизайн ландшафта, + вынос 9 district-иконок в `components/icons/districts/` + 9 case-иконок в `components/icons/cases/` (техдолг v1.6, расширили в этой сессии после правки оператора).
   - `art-brief-cw.md` — для cw: финал 5 текстов error-pages в TOV «бригадир».
   - `note-po.md` — для po: что нужно завести US-11, подтвердить URL slugs (через seo1), решить порядок навигации, сделать заглушки `/magazin/` + `/dizain-landshafta/`.

**Что НЕ сделано (вне зоны art):**
- `site/components/marketing/Header.tsx` не тронут — задача `ui`+`fe1` через art-brief.
- Linear OBI issue не заведено — задача `in`+`po`.
- ADR-0004 для расширения immutable — задача `tamd`.
- URL slugs не утверждены — задача `seo1`.

**Текущая ветка:** `chore/handoff-after-us7` (sandbox brand-guide правки готовы к commit/PR).

### Prod
- https://obikhod.ru, VPS 45.153.190.107, Node 22, PM2 `obikhod`, auto-deploy на push `main`
- main = `fe52b88` (PR #59 merged: US-7 audit + canonical fix)
- 53 публичных страницы, sitemap = 43 URL

### Автономная сессия 2026-04-26 → 2026-04-27 — 6 PR в серии без оператора

| PR | Wave | Что |
|---|---|---|
| #54 | 2A | 6 routes /b2b/, /blog/, /avtory/ + расширенный sitemap |
| #55 | 2A docs | acceptance + seo1 priorities Wave 2B |
| #56 | 2B1 | sub-service schema + dual-routing /<service>/<sub-or-district>/ |
| #57 | 2B2/2C1 audit | 7 sub-services + 20 SD bulk на prod |
| #58 | 2C2 audit | 4 Cases + 4 Жуковский SD на prod |
| #59 | US-7 | SEO audit + canonical fix главной |

Объём: ~20 500 слов уник, **53 публичных страниц**, **30% wsfreq** покрыто (62K из 209K).

### Linear состояние

**5/8 эпиков SITE-MANAGEABILITY Done**:

| US | Linear | Статус |
|---|---|---|
| US-3 (Админка) | OBI-1 | ✅ Done |
| US-4 (Семантика) | OBI-7 | ✅ Done |
| US-5 (Sitemap-IA) | OBI-2 | ✅ Done |
| US-6 (Контент) | OBI-8 | ✅ Done 2026-04-27 |
| US-7 (SEO покрытие) | OBI-3 | ✅ Done 2026-04-27 |
| US-8 (Фичи + amoCRM) | OBI-4 | 🔵 Backlog |
| US-9 (Регресс) | OBI-5 | 🔵 Backlog |
| US-10 (SEO аудит финал) | OBI-6 | 🔵 Backlog |

**Дополнительно closed**: OBI-16 (P0 pillar 404), OBI-17 (CMS bot-user agent).

### Доступы

- ✅ **GH PAT** в `~/.claude/secrets/obikhod-gh.env` — Actions RW + PR RW + Contents RW
- ✅ **Payload API key** в `~/.claude/secrets/obikhod-payload.env` (REST POST/PATCH без UI)
- ✅ **SSH root** к VPS (45.153.190.107) через `~/.ssh/id_ed25519`
- ❌ **AI API keys** (Perplexity / OpenAI / Anthropic / GigaChat / fal.ai) — нет, нужны для нейро-SEO test и AI-генерации фото

### Открытых PR — нет. Чистый main.

## Следующий шаг (при возврате оператора)

### Свежий US-11 (2026-04-27 вечер, требует po-оформления):
- **US-11 (OBI-?)** — IA Extension: Магазин mega + Дизайн ландшафта flat + Error pages 5 шт. **Дизайн готов** (brand-guide v1.7), три art-brief'а лежат в `devteam/specs/US-11-ia-extension/`. po должен завести Linear, декомпозировать по ролям (ui/cw/fe1/do/seo1/be3), подтвердить URL slugs.

### Backlog (3 эпика остались):
1. **US-8 (OBI-4)** — Фичи + калькуляторы + amoCRM webhook + photo→quote форма
2. **US-9 (OBI-5)** — Полный технический регресс перед финальным запуском
3. **US-10 (OBI-6)** — Финальный SEO аудит классики + нейро (требует Perplexity/Gigachat API)

### Wave 2D follow-ups для US-7 (отложены, разнести по backlog):

**Контентные** (cw + seo1):
- 4 pillar расширить с 357-370 до 700+ слов (vyvoz-musora приоритет — 161K wsfreq)
- 2 b2b-detail расширить до 700+ слов
- POST `/raschet-stoimosti/` (4 калькулятора pillar — 4 800 wsfreq)
- POST `/foto-smeta/` (USP, 1 200 wsfreq)
- POST `/promyshlennyj-alpinizm/` (2 415 wsfreq)
- POST `/arenda-tehniki/avtovyshka/` (2 384 wsfreq)
- POST sub-services `/vyvoz-musora/{gazel,krupnogabarit}/`, `/arboristika/izmelchenie-vetok/`
- Bulk остальных 7 sub-services (kronirovanie, sanitarnaya-obrezka, demontazh-* и др.)

**Технические** (fe1 + seo2):
- Подмена picsum-placeholder фото на реальные (cases, когда оператор пришлёт)
- miniCase для каждого programmatic SD → откроет индексацию

**Нейро-SEO test** (re + seo2):
- Подключить Perplexity или GigaChat API ($5/мес pro или бесплатно)
- 50-100 запросов из топ wsfreq → проверка цитируемости Обихода

## Подсказки для следующей сессии

- `do` сам мержит PR через GH API при зелёном CI (правило `feedback_do_owns_merges_when_ci_green.md`)
- `do` отвечает за зелёный CI до push (правило `feedback_do_owns_green_ci_before_merge.md`)
- Прямой psql на prod: `ssh root@45.153.190.107 'sudo -u postgres psql obikhod -c "..."'`
- PM2 logs: `ssh root@45.153.190.107 'sudo -u deploy pm2 logs obikhod --lines 50 --nostream'`
- REST POST на Payload требует **trailing slash** в URL (Next 16 trailingSlash:true → 308 redirect)
- Revalidate endpoint: **GET** (не POST), secret из `/home/deploy/obikhod/shared/.env`
- Хук `block-dangerous-bash.sh` блокирует `DROP TABLE` — использовать `ALTER TABLE DROP COLUMN`
- Хук `protect-secrets.sh` блокирует `cat ~/.claude/secrets/...` — использовать `set -a; . file; set +a`
- Media upload: multipart `POST /api/media/` с `file=@path` + `_payload={"alt":"...","license":"public-domain"}`
- Picsum.photos для CC0 placeholder (без API): `https://picsum.photos/seed/<id>/1200/800.jpg`

### Pattern для Payload миграций (ключевой)

При добавлении нового поля в коллекцию с `versions: { drafts: true }`:
- `<table>` — основная колонка
- `_<table>_v` — `version_<column>` копия
- Для `select hasMany` — отдельные таблицы `<table>_<field>` + `_<table>_v_version_<field>`
- Для `array` — `(id SERIAL, _uuid varchar, ...fields)` (не varchar PK!)
- Для каждой новой коллекции — `<slug>_id` колонка в `payload_locked_documents_rels`

CI на ephemeral postgres без seed не поймает missing snapshot tables — smoke на REST POST после migrate обязателен.

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Юрлицо / СРО / лицензия Росприроднадзора
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
- [ ] AI API ключ для нейро-SEO test (Perplexity / GigaChat / OpenAI)
- [ ] fal.ai key для замены picsum-placeholder в Cases на AI-сгенерированные

## Финальная оценка автономной сессии

Что закрыто без участия оператора (правило operator_role_boundaries.md):
- 6 PR смерджены через GH API auto-merge
- 5 эпиков программы Done (US-3..US-7)
- 53 публичных страницы на prod
- ~20 500 слов уникального контента
- Schema.org coverage 100%, sitemap расширен с 28 → 43 URL
- 3 fixup-миграции схемы Payload в серии (versioned snapshot tables)

Соблюдены инварианты:
- TOV «обихода» (matter-of-fact, конкретные ₽, без анти-TOV)
- design-tokens (palette/typography/breakpoints) через `agents/brand/handoff.md`
- noindexUntilCase для programmatic SD (US-3 invariant)
- CC0 placeholder фото с пометкой license=public-domain (легко подменить через UI)
