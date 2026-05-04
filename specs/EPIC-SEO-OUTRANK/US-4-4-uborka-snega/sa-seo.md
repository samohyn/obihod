---
us: US-4.4
title: Уборка снега + чистка крыш — finishing (53% covered → 75%+)
epic: EPIC-SEO-OUTRANK
team: seo
po: poseo
sa: sa-seo
type: programmatic + content + ADR
priority: P2 (closest to closure)
segment: services
phase: spec
role: sa-seo
status: ready-for-dev
related:
  - seosite/strategy/per-direction/uborka-snega.md
  - seosite/03-clusters/uborka-snega-i-chistka-krysh.md
  - seosite/04-url-map/decisions.md (ADR-uМ-19+)
created: 2026-05-04
updated: 2026-05-04
---

# US-4.4 · sa-seo: Уборка снега + чистка крыш — finishing

## Контекст

Wave 3 covered % = **52.9%** (best in directions) — closest to closure. Champion = cleaning-moscow.ru (271 / 6 123) + moscleaning24.ru (143 / 2 604, vis 141). Whitespace всего 3 ключа: A2 «чистка кровли» 159 + B «механизированная уборка» 46+37.

Direction раздроблен: chistka-krysh (sustained от Stage 3) + новая семантика «уборка снега» (с участка / механизированная / вывоз).

## Скоп

### Rename done (этой волной)

✅ `git mv seosite/03-clusters/chistka-krysh.md → uborka-snega-i-chistka-krysh.md` (выполнено 2026-05-03 в Phase E).

### 2 новых sub-services

| URL | Target ключи | Words |
|---|---|---|
| `/chistka-krysh/chistka-krovli/` | «чистка кровли» 159 (у 6 d) + «чистка кровли от снега» (long-tail) | 1 500-1 800 |
| `/chistka-krysh/uborka-snega/mehanizirovannaya/` | «механизированная уборка» 46 + «механизированная уборка территории» 37 | 1 200-1 500 |

### USP «уборка снега с участка»

Новый sub `/chistka-krysh/uborka-snega/` (parent для механизированной + ручной):

| Aspect | Detail |
|---|---|
| Target ключи | «уборка снега с участка», «вывоз снега», «убрать снег с участка» (long-tail wsk собирается из orphans + Wave 4) |
| Words | 2 000-2 500 |
| Cross-link | `/vyvoz-musora/` (вывоз снега как услуга — синергия 2 pillar) |
| B2B-секция | УК / парковки / дворы / производственные территории (cross-link на `/b2b/`) |

### ADR-uМ-19 — URL-структура uborka-snega vs chistka-krysh

**Open вопрос:** делать ли отдельный pillar `/uborka-snega/` или sub `/chistka-krysh/uborka-snega/`?

**Recommendation (sa-seo):** sub `/chistka-krysh/uborka-snega/`. Причины:
1. Sustained ranking сохраняется — `/chistka-krysh/` уже в индексе (после Stage 3 W12 migration `ochistka-krysh` → `chistka-krysh`, sustained от ADR-uМ-13).
2. Семантическое overlap «снег + крыша» >50% (большая часть запросов «снег с крыши»).
3. Не плодим новый pillar URL когда можем расширить существующий.

**Альтернатива:** отдельный `/uborka-snega/` — лучше под B2B-семантику (УК + дворы), которой сейчас мало (sustained ADR-uМ-07 «B2B без programmatic в Wave 1»).

**Решение:** **sub-path выбираем**, redirect от `/uborka-snega/*` → `/chistka-krysh/uborka-snega/*` 301-permanent. Если Wave 4 показывает >30% B2B-traffic в этом sub — split в отдельный pillar.

ADR draft: создать `seosite/04-url-map/decisions.md` ADR-uМ-19 (next available ID после sustained ADR-uМ-18).

### Pillar `/chistka-krysh/` обновление

- H1: «Уборка снега и чистка крыш в Москве и МО — частные дома, дачи, офисы»
- Title: «Уборка снега и чистка крыш — Обиход»
- Meta desc: «Чистка крыш от снега и наледи, уборка снега с участка, механизированная уборка территории. Берём штрафы ОАТИ. Москва и МО.»
- USP «штрафы ОАТИ берём» — sustained от Stage 2 unique selling
- FAQ block (10 вопросов): высота снега для обязательной чистки, штрафы, наледь, кто отвечает в МКД, etc.

### Cases добавление

1-2 новых кейса по ЖК / УК (sustained от Stage 2 USP «штрафы ГЖИ берём»). Cross-link с `/kejsy/`.

## Schema

- 2 новых sub: `Service` + `Offer` + `BreadcrumbList` + `FAQPage`
- `/chistka-krysh/uborka-snega/`: `Service` + `CollectionPage` + `ItemList` (sub-services внутри)
- Pillar: `Service` + `CollectionPage` + `BreadcrumbList` + `FAQPage`

`pnpm lint:schema --sample 4` → 0 errors / 0 warns.

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC-1 | 2 sub published + parent `/chistka-krysh/uborka-snega/` |
| AC-2 | Pillar H1+Title+desc обновлены |
| AC-3 | ADR-uМ-19 merged в `decisions.md` |
| AC-4 | 301 redirect от `/uborka-snega/*` → `/chistka-krysh/uborka-snega/*` (через site middleware) |
| AC-5 | Schema 0/0 errors |
| AC-6 | Cross-link на `/vyvoz-musora/` (вывоз снега synergy) + `/b2b/` (УК секция) |
| AC-7 | Photo→quote lead-form на 2 sub + parent + pillar |
| AC-8 | Wave 3 covered % с 52.9% → ≥75% |
| AC-9 | leadqa real-browser smoke по 4 URL |

## Estimation

- 2 sub × 1 500 слов + parent /uborka-snega/ × 2 200 = ~10h cw
- Pillar update + FAQ: ~3h cw
- ADR-uМ-19 (с tamd): ~2h
- 1-2 case studies: ~3h cw + photo from operator
- Schema + Payload publish: ~3h
- QA + leadqa: ~3h
- **Σ ~24h (≈ 3 days team-time)**

## Out of scope

- Полная B2B-программатика по districts — sustained от ADR-uМ-07 (Wave 1)
- Кровля repair (фасад + кровля как fasadrf.ru) — out of vertical
- Промышленный alpinism (промальп services) — out of vertical
- DIY blog «как почистить крышу самому» — Wave 4
