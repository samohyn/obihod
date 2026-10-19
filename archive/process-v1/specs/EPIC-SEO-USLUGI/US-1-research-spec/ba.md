---
us: US-1
title: Research+Spec — liwood-паспорт finalize, ADR-0019 routing-resolver, namespace-audit, 191-URL inventory, target-keys
team: seo
po: poseo
type: research + spec
priority: P0
segment: services
phase: research
role: ba
status: active
blocks: [US-2, US-3, US-4, US-5, US-6, US-7, US-8]
blocked_by: []
related:
  - specs/EPIC-SEO-USLUGI/intake.md
  - team/adr/ADR-0018-url-map-compete-3.md
  - seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md
created: 2026-05-07
updated: 2026-05-07
---

# US-1 — Research+Spec для EPIC-SEO-USLUGI

## Бизнес-цель

Закрепить **подписанный fundament** для оставшихся 7 US, чтобы команда могла дальше работать без переоткрытия архитектурных вопросов и без расхождения по scope.

US-1 — это **спеки/ADR/инвентарь, кода нет**. Это намеренно: каждый US — отдельный релиз; первый релиз закладывает контракт, на который будут опираться остальные.

## Почему этот US нужен сейчас

1. **Routing-конфликт `[service]/[slug]/`** — sustained маршрут уже занят T3 (sub-service); ADR-0018 фиксирует 2-сегмент SD `/<pillar>/<city>/`. Без ADR-0019 (slug-resolver + namespace-disjoint guard) US-3 seed 150 SD сломает существующие 35 sub-pages при slug-collision.
2. **Inventory**: точные 191 URL с pattern/cluster/priority нужны US-3 (для seed-скриптов) и US-7 (для sitemap regen verify).
3. **target-keys-191.csv** — без таргета по ключам US-5 не сможет писать заточенный hero/FAQ; US-8 не сможет проверить ≥80 keys top-10.
4. **liwood-паспорт final** — sustained `liwood-page-templates-analysis-2026-05-07.md` строился под EPIC-SEO-COMPETE-3 (общий конкурентский паспорт). Для нашего эпика нужен фокус-расширение по разделу `/services/` (4 шаблона, 169 URL, gap-analysis по нашим 5 leverage'ам).
5. **Namespace-audit** перед US-3 seed — единственная защита от collision live 35 sub-slugs vs 30 city-slugs (riskи #4 в плане).

## AC US-1 (что должно быть на выходе)

- [ ] **`specs/EPIC-SEO-USLUGI/intake.md`** — DoD 8 метрик, 8 US декомпозиция, релиз-цикл per US ✅ (создан 2026-05-07)
- [ ] **`specs/EPIC-SEO-USLUGI/US-1-research-spec/ba.md`** — этот файл
- [ ] **`specs/EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md`** — техспек: AC по deliverables, контракт slug-resolver, контракт JSON-LD composer, контракт seed-скриптов
- [ ] **`team/adr/ADR-0019-uslugi-routing-resolver.md`** — accepted, без расхождений с ADR-0018, с явным fallback-pattern
- [ ] **`seosite/01-competitors/liwood-services-passport-final.md`** — расширение sustained `liwood-page-templates-analysis-2026-05-07.md` с фокусом на наши 5 leverage'ов
- [ ] **`seosite/strategy/03-uslugi-url-inventory.json`** — 191 URL с полями: `url, pattern, pillar, sub|city, cluster, sitemapPriority, sitemapChangefreq, expectedTemplate (T1|T2|T3|T4)`
- [ ] **`seosite/02-keywords/derived/target-keys-191.csv`** — `url, primaryKey, wsfreq, wsk, intent, currentTopvisorPos` (минимум 1 primaryKey per URL)
- [ ] **`specs/EPIC-SEO-USLUGI/US-1-research-spec/namespace-audit.md`** — отчёт: pass/fail по collision check (existing 35 sub-slugs vs 30 city-slugs шорт-листа)
- [ ] **`team/backlog.md`** — секция EPIC-SEO-USLUGI добавлена

## Не входит в US-1 (out-of-scope)

- Имплементация slug-resolver в коде — это US-4
- Imp `pnpm lint:slug` script — это US-3
- Создание `newui/uslugi-*.html` макетов — это US-2
- bulk-seed Districts/ServiceDistricts — это US-3
- Контент 191 URL — это US-5

## Верификация (для leadqa US-1)

leadqa US-1 проверяет **полноту артефактов**, не код:
1. Все 9 файлов из AC присутствуют в `git diff main`
2. ADR-0019 не противоречит ADR-0018 §«SD route depth уточнено» (зеркальное чтение)
3. URL inventory содержит ровно 191 URL (`jq '. | length'` = 191)
4. CSV содержит ≥191 строк (1 primaryKey per URL минимум, может быть больше)
5. Liwood passport покрывает все 4 шаблона liwood с примерами URL
6. Namespace-audit — pass (0 collisions) ИЛИ fail с перечисленными slug-конфликтами + planned rename

## Risks US-1

| # | Risk | Mitigation |
|---|---|---|
| 1 | namespace-audit найдёт >0 collisions → US-3 нужно будет переименовывать sub-slugs (поломаем live SEO) | План rename ДО seed: переименовать ТОЛЬКО city-slug (новый), не sub-slug (sustained); если city-slug совпадает с sub-slug — выбираем альтернативу из existing data (например `khimki-go` вместо `khimki` если коллизия) |
| 2 | target-keys-191.csv построение требует Topvisor/Just-Magic/Wordstat данных — может занять >3 дней | sustained данные в `seosite/02-keywords/raw/` от EPIC-SEO-COMPETE-3 US-1 (4685 keys, 438 commercial). Делаем mapping, не повторный pull |
| 3 | ADR-0019 потребует cross-team review (tamd для архитектуры) | poseo передаёт ADR draft tamd через hand-off log; if pushback — встреча через cpo (но iron rule #7: внутри SEO команды tamd consults без cpo) |

## Hand-off log

```
2026-05-07 · poseo → ba: dispatch US-1, цель — fundament для 7 US, scope только спеки/ADR/inventory
2026-05-07 · ba → poseo: ba.md draft готов, переход к sa-seo.md
```
