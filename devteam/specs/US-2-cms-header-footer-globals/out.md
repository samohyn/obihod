# US-2: CMS-global `SiteChrome` + Header/Footer refactor — Release Acceptance

**Автор:** out
**Дата:** 2026-04-23
**Входы:** `./intake.md`, `./ba.md` (approved), `./sa.md` (approved, 14 REQ → 28 AC), `./dba.md` (approved with conditions), `./qa.md` (PASS WITH NOTES, B-1 fixed), `./cr.md` (APPROVE WITH COMMENTS), `../../adr/ADR-0002-site-chrome-dedup-seosettings.md` (Accepted).
**Окружение:** код-ревью + static-analysis; фактический prod-прогон миграции (`push:true`) + seed `SiteChrome` — фаза 11 Release (зона `do` + `dba`).
**Решение:** **CONDITIONAL APPROVE** — бизнес-приёмка кода и готовности к релизу получена. Merge PR в main разрешён при выполнении **одного блокирующего условия перед мержем** (DBA §1: pre-US2 `pg_dump -Fc`) и **двух операторских действий сразу после деплоя** (заполнить `social[]`, подтвердить `legalName`).

Краткая логика: `ba` → 14 REQ → `sa` → 28 AC → `dba` ok with pre-merge dump → `qa` PASS (B-1 закрыт) → `cr` APPROVE. Архитектурно код даже чище спеки (локальный revalidate вместо HTTP-hop, split-address вместо textarea). Блокеров бизнес-acceptance нет; есть два UX-риска первого запуска, закрываются оператором в `/admin` за минуту после деплоя.

---

## 1. Соответствие бизнес-цели (ba.md §1)

| Бизнес-цель (GOAL) | Закрыта? | Комментарий |
|---|---|---|
| **GOAL-1.** Оператор правит рамку сайта без PR/деплоя | ✅ по коду | В `/admin` → `Globals → Site Chrome` — 5 табов (Header / Footer / Контакты / Реквизиты / Соцсети). Все 14 REQ-1.x–REQ-5.1 реализованы. Фактическая проверка «< 30 сек за правку» — после прод-прогона. |
| **GOAL-2.** Revalidation ≤ 60 сек | ✅ по коду | `SiteChrome.afterChange` hook вызывает `revalidateTag('site-chrome','max')` + `revalidatePath('/','layout')` в том же процессе Payload/Next (без HTTP-hop на `/api/revalidate` — архитектурное улучшение vs SA §UC-1). `unstable_cache` с tag-revalidation. Замер таймера — фаза 11 post-deploy. |
| **GOAL-3.** Ноль хардкода в Header/Footer | ✅ | Grep `'\+7|tel:|t\.me/|#services|#calc|…'` по `Header.tsx` + `Footer.tsx` = 0 литералов (только `tel:${phoneE164}` шаблоны). Подтверждено qa2 §3 + cr §Локальная проверка. |
| **GOAL-4.** Инвариант каналов Telegram+MAX+WhatsApp+phone на всех страницах | ⚠️ accept-with-risk | Код инфраструктурно готов (Footer итерирует `social[]` и рендерит phone). На **первом запуске** seed даёт `social: []` — до первой правки оператора ни одного мессенджера в Footer (см. §7 Риск N-4). Решение cr: не класть фейковые t.me/obihod в seed, а закрыть чеклистом оператора в `/admin` сразу после деплоя. |

**Вывод:** код закрывает все 4 бизнес-цели; GOAL-4 требует 60-секундного действия оператора после деплоя.

---

## 2. AC-BA coverage (ba.md §8)

| AC-BA | Реализация | Комментарий |
|---|---|---|
| AC-BA-1 (`/admin` → SiteChrome, 5 секций) | ✅ | Все 5 табов + все поля REQ-1.1…REQ-1.6 (qa §4 AC-1.1). |
| AC-BA-2 (редактирование без терминала/git/DevTools) | ✅ | Стандартный Payload-UI, inline-валидация, drag-and-drop для social. |
| AC-BA-3 (правка → prod ≤ 60 сек) | ✅ по коду | afterChange revalidate + unstable_cache с тегом. Таймер — фаза 11. |
| AC-BA-4 (0 литералов в Header/Footer.tsx) | ✅ | Grep-чистка подтверждена qa2 + cr. |
| AC-BA-5 (Telegram+MAX+WhatsApp+phone на каждой странице) | ⚠️ accept-with-risk | Инфраструктура ок, seed пустой — см. N-4. |
| AC-BA-6 (soft-fallback при пустом global) | ✅ | `getSiteChrome()` try/catch → `null` → компоненты используют `DEFAULT_SITE_CHROME` каскадно (qa §4 AC-4.1/4.2/4.3). |
| AC-BA-7 (read public, update admin) | ✅ | `read: () => true`; `update: user?.role === 'admin'` после B-1 fix (cr §Блокер B-1). |
| AC-BA-8 (JSON-LD Org читает из SiteChrome) | ✅ | `organizationSchema(chrome, seo)` — telephone/taxID/legalName/sameAs из `chrome` (qa §8). |
| AC-BA-9 (maxLength → validation error) | ✅ | Все maxLength из SA §10.8 проставлены; E2E визуальной регрессии — фаза 11. |
| AC-BA-10 (нет banner/region switcher) | ✅ | Out-of-scope соблюдён; лишних секций нет. |

---

## 3. REQ coverage (14 REQ · MoSCoW)

| REQ | MoSCoW | Реализован? | Заметка |
|---|---|---|---|
| REQ-1.1 (1 global, 5 секций) | **Must** | ✅ | `slug: 'site-chrome'` + 5 табов. |
| REQ-1.2 (phoneDisplay + phoneE164) | **Must** | ✅ | Раздельные поля + `validateE164`. |
| REQ-1.3 (social array + enum 7 + DnD) | **Must** | ✅ | Payload array DnD by default. |
| REQ-1.4 (menu union anchor/route/external) | **Must** | ✅ | `validateMenuItem` + conditional admin.condition. |
| REQ-1.5 (реквизиты: временный ИНН + подсказки) | **Must** | ✅ | `taxId='7847729123'` с admin-description «временный ИНН». `legalName` — пустой в seed (по запросу оператора: юрлицо не оформлено, комментарий в коде + memory `project_inn_temp`). |
| REQ-1.6 (copyright: год авто + ссылки) | **Must** | ✅ | `© Обиход, {new Date().getFullYear()}` + privacyUrl/ofertaUrl из global. |
| REQ-1.7 (Telegram+MAX+WhatsApp+phone) | **Must** | ⚠️ accept-with-risk | Код готов; seed `social: []` — оператор закрывает в `/admin` за 1 мин. |
| REQ-2.1 (revalidation ≤ 60 сек) | **Must** | ✅ | Локальный revalidateTag+Path в hook (архитектурно лучше SA). |
| REQ-2.2 (мягкая деградация) | **Must** | ✅ | try/catch + DEFAULT_SITE_CHROME каскадно. Nit: catch тихий (N-2 follow-up). |
| REQ-2.3 (access: update admin-only) | **Must** | ✅ | Закрыто cr-fix B-1 (`user?.role === 'admin'`). |
| REQ-2.4 (max-length) | Should | ✅ | Все лимиты из SA §10.8. |
| REQ-4.1 (SEO читает из SiteChrome) | **Must** | ✅ | `jsonld.ts` pure, 4 callsite обновлены. SeoSettings cleanup (ADR-0002): 9 полей + `sameAs[]` удалены. |
| REQ-5.1 (seed мигрирует текущие значения) | **Must** | ✅ с отклонениями: 2 колонки footer вместо 3 (третья «Контакты» рендерится динамически — функционально эквивалентно); `social: []` вместо 4 каналов из SA §8. |
| REQ-6.1 (out-of-scope) | Won't | ✅ | Нет banner / region switcher / бургера. |

**14/14 Must и Should покрыты.** Два accept-with-risk семантического уровня (seed `social[]` и seed-колонки) — закрываются оператором или follow-up US, не кодом.

---

## 4. Scope integrity

- ✅ **Scope creep не обнаружен.** Site-wide баннер, region switcher, бургер-меню, смена лого — не появились.
- ✅ **`lib/seo/*` затронут строго по плану ADR-0002.** `jsonld.ts` — сигнатуры pure-функций + `stripUndefined` + `hasAnyAddress`. Все 4 callsite обновлены. `queries.ts` + `metadata.ts` — не тронуты за рамками контракта.
- ✅ **SeoSettings cleanup точечный.** Удалены ровно 9 полей organization + `sameAs[]`; остались `name`, `localBusiness.*`, `credentials`, `verification`, `defaultOgImage`, `organizationSchemaOverride`, `indexNowKey`, `robotsAdditional` — совпадает с ADR-0002.
- ✅ **Миграций Payload-файлов нет.** `site/migrations/` пусто, `payload.config.ts:52` (`push: true`) сохраняется — schema changes применятся автоматически на первом старте после мержа.
- ✅ **Новых npm-зависимостей нет.**

---

## 5. NFR

| NFR | Статус | Источник |
|---|---|---|
| **Soft degradation** | ✅ | `DEFAULT_SITE_CHROME` fallback каскадный; try/catch в `getSiteChrome`. |
| **Revalidation** | ✅ | afterChange → `revalidateTag('site-chrome','max')` + `revalidatePath('/','layout')` (SiteChrome.ts:138–141). |
| **Access** | ✅ | read public, update admin-only после B-1 (`user?.role === 'admin'`). |
| **SEO** | ✅ | JSON-LD Organization.telephone/taxID/legalName/sameAs из `SiteChrome`; `stripUndefined` гасит пустые поля (нет фейкового `+7 (000) 000-00-00`). |
| **TOV** | ✅ | Seed-строки проверены: слоган, меню, CTA, колонки — matter-of-fact, 0 стоп-слов. Пустой `legalName` в seed — осознанное решение оператора (нет юрлица, memory `project_inn_temp`), без заглушек. |
| **a11y** | ✅ | `aria-label="Основное меню"`; `target="_blank" rel="noopener noreferrer"` на всех external; нативные `<a>`/`<Link>` — Tab-поддержка. |
| **TypeScript strict** | ✅ | `pnpm type-check` exit 0. Inline-типы в `lib/chrome.ts` с TODO на `payload-types.ts` (Node 24 bug, follow-up). |
| **Observability** | ⚠️ | `req.payload.logger.info/.error` в hook; но catch в `getSiteChrome` тихий (N-2 follow-up). |

---

## 6. Готовность к релизу

### Что изменится на prod после деплоя

1. **Schema change применится автоматически.** Payload (`push: true`) при первом старте: drop 9 колонок из `globals_seo_settings_organization` + drop таблицы `globals_seo_settings_same_as` + create 5 таблиц `globals_site_chrome*`. Данных на prod нет (БД пустая) — потеря невозможна.
2. **Header и Footer** продолжат работать без регрессий: при пустом global → `DEFAULT_SITE_CHROME` каскадно; при прогоне seed → реальные значения (телефон `+7 (985) 170-51-11`, 6 anchor-меню, 2 footer-колонки).
3. **`/admin/globals/site-chrome`** — новый раздел для редактирования.
4. **JSON-LD Organization** обновлён: `telephone=+79851705111`, `taxID=7847729123`, `sameAs=[]` до заполнения соц; `stripUndefined` выкидывает пустые поля — поисковики видят минимально-валидный schema без фейков.

### Блокирующее условие для мержа PR (DBA §1)

- **Обязательный pre-US2 `pg_dump -Fc`** от `do` на Beget **до** мержа (auto-deploy на push в main). Команда и путь: DBA §3.2. Имя файла фиксируется в PR-description. Без этого rollback невозможен.

### Операторские действия после деплоя (не блокер мержа, блокер B2B-acceptance)

1. Зайти в `/admin/globals/site-chrome` — убедиться, что seed применился (телефон, меню, реквизиты на месте).
2. **В секции `social` — добавить минимум Telegram, MAX, WhatsApp.** Без этого нарушен инвариант CLAUDE.md § Immutable «Каналы — Telegram+MAX+WhatsApp+телефон». 60 секунд через drag-and-drop. Реальные URL нужны от оператора (например, `https://t.me/obihod`, `https://max.ru/obihod`, `https://wa.me/79851705111`).
3. Открыть https://obikhod.ru/ → `view-source` или Rich Results Test → убедиться, что `Organization` JSON-LD содержит корректный `telephone` + `taxID` + `sameAs`.
4. **После регистрации юрлица** — заполнить `requisites.legalName`, `kpp`, `ogrn`, `legalAddress` (сейчас пустые по просьбе оператора, т.к. ООО «Обиход» ещё не зарегистрировано; `taxId=7847729123` — временный СПб, заменить при регистрации).

---

## 7. Summary для оператора

**US-2 CONDITIONAL APPROVE — мерж разрешён после выполнения одного условия.**

Header и Footer теперь редактируются через `/admin/globals/site-chrome` (5 табов). Captures шапки, подвала, контактов, реквизитов, соцсетей. JSON-LD Organization читает телефон и ИНН оттуда же — SEO и UI теперь не рассинхронятся. SeoSettings упрощён (убраны 9 дублей). Schema change прокатится автоматически при первом старте PM2 — prod БД пустая, терять нечего.

**Что сделать оператору:**

1. **Перед мержем PR:** `do` делает `pg_dump -Fc` pre-US2 на Beget (DBA §3.2, имя файла — в PR-description). Без этого мерж не разрешён.
2. **Сразу после деплоя (~3 мин):** зайти в `/admin/globals/site-chrome` → в таб «Соцсети» добавить Telegram + MAX + WhatsApp (реальные URL). Без этого Footer покажет только телефон — инвариант 4-каналов будет нарушен до первой правки.
3. **Проверить JSON-LD** через `curl https://obikhod.ru/ | grep -A20 'application/ld+json'` — должен быть `+79851705111` и `7847729123`.
4. **После регистрации юрлица** — заполнить `legalName`, `kpp`, `ogrn`, `legalAddress` и заменить временный ИНН.

---

## 8. Топ-1 риск после релиза

**N-4: инвариант каналов нарушен до ручной правки.** Seed кладёт `social: []` (cr отказался от фейковых t.me/obihod без подтверждения оператора). Пока оператор не войдёт в `/admin` и не добавит Telegram+MAX+WhatsApp — на главной и в Footer видно только телефон. Для B2C-клиента это регресс vs текущий хардкод `Telegram @obihod` в старом `Footer.tsx`. Митигация — задача #2 из чеклиста оператора выше, закрывается за 60 сек. Эскалация, если оператор забудет: `cr` явно пометил это как «блокер объявления публичного запуска», не блокер кода.

**Второстепенные риски (follow-up US, P2):**

- N-2: тихий catch в `getSiteChrome` → нет диагностики при Payload-readFailure на prod.
- N-5: admin-warning banner для missing critical channels не реализован (SA допустил MVP без него).
- N-8: `legalName` пустой до регистрации юрлица — OK сейчас, но закрыть при оформлении ООО.

---

## 9. Связка с US-1

**Можно релизить одним мержем, при соблюдении порядка в одном PR-pipeline, но это НЕ рекомендуется.**

- **Почему технически можно:** US-1 (seed prod БД) и US-2 (SiteChrome) обе идут через `main` → auto-deploy; US-2 включает `push:true` schema-change + свой seed-блок внутри `scripts/seed.ts` (строки 513–592), который уже переносит значения Header/Footer в global. Зависимости однонаправленные: US-2 не зависит от US-1, но `scripts/seed.ts` от US-1 теперь содержит SiteChrome-блок.
- **Почему лучше двумя деплоями по очереди:**
  1. US-2 содержит **schema migration через `push:true`** — рисковая операция, даже на пустой БД (DBA §2.3 оценил как «приемлемый риск при pre-US2 dump»). Отдельный деплой США-2 изолирует симптомы и упрощает rollback (git revert + pg_restore = 20 мин RTO).
  2. US-1 — чистый insert данных в существующие коллекции, без DDL. Его можно катить первым отдельно, проверить 28 programmatic-URL → 200, потом US-2.
  3. При совместном деплое seed-скрипт US-1 потребует свежих таблиц SiteChrome **до** прогона seed. Порядок: (a) мерж US-2 → авто-деплой → Payload применил schema → (b) `do` прогоняет `pnpm seed:prod` (US-1 + SiteChrome-блок сразу). Нарушать этот порядок нельзя — seed упадёт на updateGlobal(site-chrome), если схема ещё не применена.

**Рекомендация out:** катить последовательно — сперва мерж US-2 (пустой БД изменение схемы без данных) → post-deploy smoke (`/api/health?deep=1` + JSON-LD curl) → затем мерж US-1 (или прогон seed на существующей схеме). В одном цикле `pnpm seed:prod` US-1 seed-блок и US-2 SiteChrome-блок уживаются — но запускать его только **после** успешного деплоя US-2 + подтверждения schema по DBA §4.2.

---

## Подпись

**out**, 2026-04-23. Hand-off `→ operator`: CONDITIONAL APPROVE. Merge PR — после pre-US2 `pg_dump`. Объявление публичного запуска — после операторской правки `social[]` в `/admin`. Код архитектурно корректен, spec-контракты замкнуты, блокеров нет.
