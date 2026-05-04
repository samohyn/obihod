---
title: Wave 3 cluster update — Keys.so multi-domain intersect
created: 2026-05-03
parent: ../strategy/seo-master-strategy-2026-05.md
sources:
  - seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv
  - seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv
note: Append-only update to existing cluster .md (5 directions). Detailed action plans in strategy/per-direction/*.md.
---

# Wave 3 cluster update — 2026-05-03

> Сводное дополнение к 5 cluster.md по результатам Keys.so multi-domain pull (32 services-конкурента, 21 051 уникальный ключ).

## Why this format vs append in each cluster.md

Sustained 4 cluster.md (vyvoz-musora / arboristika / demontazh / uborka-snega-i-chistka-krysh) от Wave 1-2 — историческое snapshot. Этот файл = **append-only Wave 3 layer**, не редактирующий sustained артефакты. Отсылка из каждого cluster.md делается одной строкой в footer.

## Per-direction summary (Wave 3)

### Вывоз мусора → [`vyvoz-musora.md`](vyvoz-musora.md)

- Wave 1 sustained: 97 кластеров, 384 ключей, 161 781 freq
- **Wave 3 add:** 3 405 ключей у 32 конкурентов; 9.7% covered нашим discovery pool
- **A2 whitespace 13 + B 116 = 129 actionable** (см. [`strategy/whitespace-priority-A.md#вывоз-мусора`](../strategy/whitespace-priority-A.md))
- **Stage 4 action:** US-4.1 — 4 sub-services (КГМ / ТБО / контейнер / крупногабарит) + 4 SD по объёмам контейнеров. Detail в [`strategy/per-direction/vyvoz-musora.md`](../strategy/per-direction/vyvoz-musora.md).

### Арбористика → [`arboristika.md`](arboristika.md)

- Wave 1 sustained: 38 кластеров, 534 ключей, 27 589 freq
- **Wave 3 add:** 2 579 ключей; 11.9% covered
- **A1 whitespace: 1 (** «арборист» 1 020 wsk у 6 d) **+ A2: 16 + B: 621 = 638 actionable**
- **Stage 4 action:** US-4.2 — A1 pillar-bridge `/arboristika/arborist/` + 4 расширения sub (опиловка / обработка от короеда / аренда измельчителя). Detail в [`strategy/per-direction/arboristika.md`](../strategy/per-direction/arboristika.md).

### Демонтаж B2C → [`demontazh.md`](demontazh.md)

- Wave 1 sustained: 7 кластеров, 141 ключ, 225 freq (smallest cluster)
- **Wave 3 add:** 1 144 ключей; **4.0% covered — biggest gap**
- **A2 whitespace: 2 + B: 40 = 42 actionable**, ВЧ «демонтаж» 3 587 wsk
- **Stage 4 action:** US-4.3 (P0 priority) — расширение pillar 2→8 sub (снос-дома / снос-дачи / снос-бани / демонтаж-забора / демонтаж-фундамента / снос-гаража). Detail в [`strategy/per-direction/demontazh-b2c.md`](../strategy/per-direction/demontazh-b2c.md).

### Уборка снега + чистка крыш → [`uborka-snega-i-chistka-krysh.md`](uborka-snega-i-chistka-krysh.md) ⚡ renamed Wave 3

- Wave 1 sustained: 8 кластеров, 197 ключей, 888 freq
- **Wave 3 add:** 178 ключей; **52.9% covered (best)**
- **A2 whitespace: 1 + B: 2 = 3 actionable** — close to closure
- **Stage 4 action:** US-4.4 (P2) — rename done в этой волне (`git mv`); 2 sub (чистка-кровли + механизированная-уборка-территории) + USP «уборка снега с участка» секция. Detail в [`strategy/per-direction/uborka-snega.md`](../strategy/per-direction/uborka-snega.md).

### Ландшафтный дизайн → `landshaft/` (skeleton sustained от EPIC-SEO-LANDSHAFT)

- Wave 1: 0 (skeleton README only)
- **Wave 3 add:** 76 ключей через extraction (services-домены overlap); 0% covered
- **0 whitespace** в этом extraction-pool — direct landshaft-конкуренты не в Keys.so базе
- **Stage 4 action:** US-4.5 — 3 phase plan (re Wave 2 deep → pillar create → Wave 4 retrofit). Detail в [`strategy/per-direction/landshaft.md`](../strategy/per-direction/landshaft.md).

## Cross-cluster signal — out-of-vertical noise

13 875 ключей не попали ни в одно из 5 directions (regex unmatched). Анализ показал out-of-vertical категории:

- **Промальп / фасады** (~25 A2 + 100 B) — out of vertical, не покрываем
- **Клининг офисов / складов** (~5 A2) — out of vertical
- **«Короед»** (5 348 wsk) + «обработка от короеда» — false-negative regex, реально arboristika cluster (override Stage 4)
- **«ОСИГ» / «АИС ОССИГ»** — TBD, возможно ТКО-реестр (cpo decision)

Override list — в [`02-keywords/derived/_clustering-decisions.md`](../02-keywords/derived/_clustering-decisions.md).

## Что append в каждый cluster.md — footer pointer

Footer-добавка в 4 sustained cluster.md (1 строка):

```markdown
---

> **Wave 3 update (2026-05-03):** см. [`_wave3-update-2026-05-03.md`](_wave3-update-2026-05-03.md) (Wave 3 multi-domain intersect, ~XX whitespace ключей, action plan в `strategy/per-direction/*.md`).
```

Будет добавлено через US-2 в EPIC-SEO-OUTRANK (минимальный edit без перезаписи sustained тела артефакта).
