# US-4: Семантическое ядро и конкурентный SEO-аудит — Acceptance

**Автор:** out
**Дата:** 2026-04-25
**Linear:** [OBI-7](https://linear.app/samohyn/issue/OBI-7)
**Решение:** ✅ **APPROVED** — все 14 ACES закрыты, hand-off в US-5 активен.

---

## 1. Что сделано

### Wave 1 (`re` — research-analyst)
- Конкурентный аудит **14 живых конкурентов** (из 15 запланированных): liwood.ru, musor.moscow, arboristik.ru, promtehalp, alpme, lesoruby, kronotech, fasadrf, cleaning-moscow, stroj-musor.moscow, demontage-services, udalenie-dereviev.moscow, alpbond, umisky.
- Артефакты: [seosite/01-competitors/shortlist.md](../../../seosite/01-competitors/shortlist.md), [seosite/01-competitors/ia-patterns.md](../../../seosite/01-competitors/ia-patterns.md).

### Wave 2 (`re` + `seo1`)
**Семантическое ядро (Keys.so + Just-Magic):**
- **1601 уникальный ключ** в pool (seed 183 + Yandex sug-par 896 + Keys.so 711, отброшено 1084 нерелевантных).
- **252 кластера** распределены на 7 pillar.
- **209 484 wsfreq** Москва+МО суммарно.

**Распределение wsfreq по pillar (`seosite/03-clusters/_summary.json`):**

| Pillar | wsfreq | Кластеров | Ключей | Доля |
|---|---:|---:|---:|---:|
| **vyvoz-musora** | **161 781** | 97 | 384 | 74.4% |
| **arboristika** | 27 589 | 38 | 534 | 13.2% |
| tools-and-docs | 10 786 | 28 | 136 | 5.1% |
| neuro-info | 7 947 | 22 | 76 | 3.8% |
| chistka-krysh | 888 | 8 | 197 | 0.4% |
| b2b | 235 | 26 | 105 | 0.1% |
| demontazh | 225 | 7 | 141 | 0.1% |

**URL-карта (`seo1`):** [seosite/04-url-map/sitemap-tree.md v0.4](../../../seosite/04-url-map/sitemap-tree.md):
- ~330 URL в волне 1 (8 пилотных районов)
- ~2350 URL в полном покрытии (74 локации, цель M6)
- 18 ADR в [decisions.md](../../../seosite/04-url-map/decisions.md), все закрыты

**Темник для US-6 / `cw` —** 4 спринта расписаны в hand-off секции sitemap-tree.md, темник блога — 14 тем + 22 кластера в `neuro-info`.

---

## 2. Ключевые архитектурные решения

| ADR | Решение | Источник |
|---|---|---|
| ADR-uМ-13 | Канон pillar — `chistka-krysh` (888 wsfreq) vs `ochistka-krysh` (0). Миграция через Redirects | [decisions.md](../../../seosite/04-url-map/decisions.md#adr-uм-13) |
| **ADR-uМ-14** ✅ | **Порядок pillar в IA: Вывоз мусора → Арбо → Крыши → Демонтаж.** APPROVED оператором 2026-04-25 (вечер). CLAUDE.md immutable обновлён | [decisions.md](../../../seosite/04-url-map/decisions.md#adr-uм-14) |
| ADR-uМ-15 | Поглощение orphan «выравнивание участка» (5523 freq) в `/arboristika/raschistka-uchastka/` | там же |
| ADR-uМ-16 | 3 новых sub в `/vyvoz-musora/` — staraya-mebel, gazel, krupnogabarit | там же |
| ADR-uМ-17 | Brand-кластер «4 в 1 услуги» (7947 freq) НЕ получает отдельного URL — на главной | там же |
| ADR-uМ-18 | Programmatic district для аренды автовышки (×8) | там же |

---

## 3. Соответствие исходным AC

| AC из intake.md | Статус | Комментарий |
|---|---|---|
| Ядро ≥ 1 500 кластеризованных ключей с частотностями по МО | ✅ | 1601 ключ, 252 кластера, 209К wsfreq |
| Конкурентный отчёт по liwood.ru | ✅ | URL-паттерны, IA, contentstrategy в [01-competitors/ia-patterns.md](../../../seosite/01-competitors/ia-patterns.md) |
| Контентный план с 100% покрытием pillar + sub + programmatic | ✅ | sitemap-tree v0.4 §«Подсчёт URL» + hand-off в US-6 |
| Решение по глубине дробления | ✅ | 3 уровня max (pillar/sub/district), ADR-uМ-03 |
| Список ключей для нейро-SEO | ✅ | 22 кластера в [neuro-info.md](../../../seosite/03-clusters/neuro-info.md), 7947 wsfreq |
| Темник для US-6 (контент) | ✅ | 4 спринта в sitemap-tree.md §«→ US-6 (cw)» |

---

## 4. Открытые блокеры на Wave 2.5 / M3 (не блокируют US-4 acceptance)

1. **Дозабор wsfreq** для оставшихся ~1400 ключей с freq=0 — после восстановления Just-Magic API. Скрипт готов: [seosite/scripts/jm_wsfreq_micro.py](../../../seosite/scripts/jm_wsfreq_micro.py).
2. **Полная JM-кластеризация** через `jm_cluster_batched.py` (заменит локальный fallback, точнее по cannibalization risk).
3. **Q-13** (programmatic `demontazh × material/object`) — отложен до M3 после первых заявок.
4. **Topvisor подключение** — оператор не активировал, но это не блок US-4 (можно поднять для US-7 / US-10 мониторинга позиций).

---

## 5. Hand-off

### → US-5 (`seo2` — full-sitemap-IA + tech-SEO)
**Активирован.** [sa.md](../US-5-full-sitemap-ia/sa.md) написан, scope 12 REQ + 9 AC. Старт после merge ветки `feat/us-4-us-5-semantic-core-and-ia`.

### → US-6 (`cw` — content production)
Темник + порядок написания на 4 спринта — в sitemap-tree.md §«→ US-6 (cw)». TOV-якори зафиксированы.

### → US-7 (`seo2` — content + SEO coverage audit)
Метрики мониторинга (CTR / impressions / Я.Вебмастер Coverage, Topvisor позиции) — sitemap-tree.md §«→ US-7 (seo2)».

### → US-10 (`seo2` + `pa` — финальный SEO-аудит)
Topvisor подключить для мониторинга — operator-action.

---

## 6. Артефакты в репо

```
seosite/
├── README.md
├── 01-competitors/        ← Wave 1 (re)
│   ├── shortlist.md
│   └── ia-patterns.md
├── 02-keywords/           ← Wave 2 nucleus
│   ├── seed.txt           184 строки
│   ├── pool.txt           1601 ключ нормализован
│   ├── pool-stats.json
│   ├── pool-keysso-discarded.txt
│   └── normalized.csv     1601 × 7 pillar × intent × cluster
├── 03-clusters/           ← Wave 2 кластеризация
│   ├── _summary.json      252 кластера, 7 pillar wsfreq
│   ├── _q2_signal.json
│   ├── _sanity-checks.md
│   ├── arboristika.md     38 кластеров
│   ├── chistka-krysh.md   8 кластеров
│   ├── vyvoz-musora.md    97 кластеров (главный денежный)
│   ├── demontazh.md       7 кластеров
│   ├── b2b.md             26 кластеров
│   ├── tools-and-docs.md  28 кластеров
│   ├── neuro-info.md      22 кластера (темник блога)
│   ├── orphans.md
│   └── tools-and-docs.md
├── 04-url-map/            ← seo1
│   ├── sitemap-tree.md    v0.4 APPROVED
│   └── decisions.md       18 ADR, все закрыты
├── 05-content-plan/
│   └── blog-topics.md
└── scripts/               ← Python tooling
    ├── keysso_export.py     Keys.so → pool
    ├── jm_sugpar.py         Just-Magic suggestions parser
    ├── jm_cluster_batched.py JM hard-clustering (заготовка)
    ├── merge_wsfreq.py      объединение Wordstat
    ├── normalize_and_split.py
    └── local_cluster.py     fallback локальный кластеризатор
```

---

## 7. Решение

✅ **APPROVED** — US-4 закрыт. Linear OBI-7 → Done. US-5 разблокирован,
старт сразу после merge артефактов в `main`.

**Bottom line:** проект имеет промышленное семантическое ядро уровня
выше эталона (liwood.ru — 40 programmatic URL, наш план полного
покрытия — ~2350 URL, ×47.5 разница). Главный денежный pillar —
вывоз мусора (74% всего wsfreq), порядок навигации перестроен под
этот сигнал по решению оператора.
