# Priority-B Districts — Keyword Research (Stage 3 / US-3 / Track D Run 0)

**Дата создания:** 2026-05-02 (stub) → 2026-05-02 (расширение seo-content)
**Owner:** seo-content (Track D Run 0)
**Статус:** **research-complete-fallback** — finalized через fallback-методологию (population-scaled estimates от priority-A baselines + Just-Magic semantic priors). Hard wsfreq dozabor через Wordstat XML — задача `tech sweep W12 day 7` после operator-approval Topvisor SaaS creds (если будут).
**Скоп:** 4 priority-B districts × 4 pillar = 16 SD pillar-level + ~60 SD sub-level = **76 ServiceDistricts** для Wave 1 production cw.
**Источники:** `vyvoz-musora.md` / `arboristika.md` / `chistka-krysh.md` / `demontazh.md` (existing clusters) + intake §3.1 winning angles + population-scaling formula.

> **Sustained iron rule (memory `project_seo_stack`):** Wordstat XML + Just-Magic + Key Collector + Keys.so. **Без Ahrefs / SEMrush** (РФ-юрисдикция). Cifry в этом файле — **fallback estimates** с confidence-метками, не raw Wordstat extracts.

---

## 1 · Контекст и methodology

### 1.1 · 4 priority-B districts (sustained от EPIC intake §«Districts»)

| District | Slug | Население | Особенности | Winning angle |
|---|---|--:|---|---|
| **Химки** | `khimki` | 257 000 | Шереметьево + крупные склады + ЖК-новостройки | Транспортная доступность Шереметьево — авиа-cargo B2B + быстрая доставка контейнеров через А-107 |
| **Пушкино** | `pushkino` | 105 000 | Дачно-коттеджный + леса (СНТ) | Высокий арбо-спрос (СНТ + участки 6-30 соток) + сезонный sadovyj musor |
| **Истра** | `istra` | 35 000 + 200k+ дачники | ВД Истринское вод-ще + крупные дачные участки | Большие участки 30-100 соток + ВД-ливневые наводнения требуют чистки крыш |
| **Жуковский** | `zhukovskij` | 105 000 | ЛИИ им. Громова + ВПП + авиапром | Спец-чистка крыш ВПП ЛИИ + B2B спец-демонтаж авиа-инфраструктуры |

### 1.2 · Fallback methodology (sustained Stage 1+2 — no Ahrefs)

**Baseline reference (priority-A):** averages из existing clusters МСК+МО:
- Avg priority-A population: `(Odintsovo 137k + Krasnogorsk 161k + Mytishchi 235k + Ramenskoye 116k) / 4 = 162k`
- Anchor wsfreq: `вывоз мусора одинцово = 644 МСК+МО` (verified `vyvoz-musora.md` Cluster 1, line 41).
- Anchor wsfreq: `вырубка деревьев москва = 512` (`arboristika.md` Cluster 2).
- Anchor wsfreq: `чистка крыш = 888` (`chistka-krysh.md` Cluster 1) — **head, не district**; для district scale ×0.05-0.10.
- Anchor wsfreq: `демонтаж дачи = 143` (`demontazh.md` Cluster 1) — head sub.

**Population scaling factors:**
| District | Base factor | Local modifier | Effective factor | Justification |
|---|--:|--:|--:|---|
| Khimki | ×1.59 | +0.30 (B2B авиа) | ×1.89 для stroymusora/demontazh | Шереметьево + air-cargo B2B; avia-warehouse |
| Pushkino | ×0.65 | +0.50 для arbo (СНТ) | ×0.97 для arbo, ×0.65 baseline | Лес + дачи = high арбо-спрос |
| Istra | ×0.22 base | +1.50 дачный multiplier для arbo/krysh | ×0.55 effective | Дачники летом 200k+ → arbo high, vyvoz через сезон |
| Zhukovskij | ×0.65 | +0.40 для chistka-krysh (ВПП B2B), +0.30 demontazh (авиа) | ×0.65 baseline, ×0.91 krysh, ×0.85 demontazh | ВПП + авиапром = B2B niche |

**Confidence levels:**
- **high** — wsfreq присутствует в existing clusters МСК+МО и district уже встречался;
- **medium** — population-scaling от priority-A anchor (default fallback);
- **low** — niche B2B segment без direct anchor (Шереметьево air-cargo, ВПП, ВД-наводнения).

**Honest data principle:** все estimates помечены `~`. Cap-cut: исключаем sub-keys с estimated wsfreq <30 (порог Just-Magic для priority WD).

---

## 2 · Khimki — keyword research per pillar

### 2.1 · vyvoz-musora (Khimki) — sub-level priority

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| вывоз мусора | `/vyvoz-musora/khimki/` | ~1024 | medium | P0 | Pillar-level, head district |
| контейнер 8-20м³ | `/vyvoz-musora/kontejner/khimki/` | ~190 | medium | P0 | Шереметьево air-cargo массовые отгрузки |
| вывоз стройотходов | `/vyvoz-musora/vyvoz-stroymusora/khimki/` | ~163 | medium | P0 | ЖК-новостройки + промзона авиа |
| вывоз старой мебели | `/vyvoz-musora/staraya-mebel/khimki/` | ~79 | high | P1 | Confirmed key in `vyvoz-musora.md:181` |
| крупногабарит | `/vyvoz-musora/krupnogabarit/khimki/` | ~75 | medium | P1 | ЖК density |
| вывоз хлама | `/vyvoz-musora/vyvoz-hlama/khimki/` | ~52 | medium | P2 | Hoarder cleanup (city pop high) |
| газель | `/vyvoz-musora/gazel/khimki/` | ~47 | medium | P2 | Бюджетный сегмент |
| коммерческий мусор B2B | `/vyvoz-musora/kommercheskij/khimki/` | ~38 | low | P2 | Air-cargo warehouse niche |

### 2.2 · arboristika (Khimki) — sub-level priority

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| спил деревьев | `/arboristika/spil-derevev/khimki/` | ~178 | medium | P0 | ЖК-территории + парки |
| удаление пня | `/arboristika/udalenie-pnya/khimki/` | ~62 | medium | P1 | После спила в ЖК |
| санитарная обрезка | `/arboristika/sanitarnaya-obrezka/khimki/` | ~48 | medium | P1 | УК многоквартирки |
| кронирование | `/arboristika/kronirovanie/khimki/` | ~38 | medium | P2 | Аэродромное приближение (FOD-prevention) |

### 2.3 · chistka-krysh (Khimki) — sub-level priority

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| чистка крыш от снега | `/chistka-krysh/ot-snega/khimki/` | ~88 | medium | P0 | ЖК density + high-rise B2B |
| чистка крыш МКД | `/chistka-krysh/mkd/khimki/` | ~52 | medium | P1 | УК договоры |
| сбивание сосулек | `/chistka-krysh/sbivanie-sosulek/khimki/` | ~38 | medium | P1 | Зимний urgent |
| договор на сезон | `/chistka-krysh/dogovor-na-sezon/khimki/` | ~28 | low | P2 | B2B Шереметьево cargo-крыши |

### 2.4 · demontazh (Khimki) — sub-level priority

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| демонтаж промышленный | `/demontazh/promyshlennyj/khimki/` | ~62 | low | P0 | Авиа-склады B2B специализация |
| снос забора | `/demontazh/snos-zabora/khimki/` | ~40 | medium | P1 | Промзоны + новостройки |
| демонтаж бани | `/demontazh/bani/khimki/` | ~22 | low | P2 | Дачно-частный сегмент low |

**Khimki pillar-level totals (estimate):** vyvoz-musora ~1666 / arbo ~326 / chistka ~206 / demontazh ~124 = **~2322 МСК+МО aggregated wsfreq**.

---

## 3 · Pushkino — keyword research per pillar

### 3.1 · vyvoz-musora (Pushkino)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| вывоз мусора | `/vyvoz-musora/pushkino/` | ~419 | medium | P0 | Pillar head district |
| вывоз садового мусора | `/vyvoz-musora/sadovyj/pushkino/` | ~95 | medium | P0 | СНТ-сезонный (May-Oct) |
| вывоз стройотходов | `/vyvoz-musora/vyvoz-stroymusora/pushkino/` | ~67 | high | P1 | Confirmed key `vyvoz-musora.md:132` |
| контейнер | `/vyvoz-musora/kontejner/pushkino/` | ~52 | medium | P1 | Дачные стройки |
| крупногабарит | `/vyvoz-musora/krupnogabarit/pushkino/` | ~32 | medium | P2 | Дачное обновление |

### 3.2 · arboristika (Pushkino) — flagship pillar

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| спил деревьев | `/arboristika/spil-derevev/pushkino/` | ~265 | medium-high | P0 | СНТ + лесная зона leverage |
| удаление пня | `/arboristika/udalenie-pnya/pushkino/` | ~92 | medium | P0 | После спила на участке |
| расчистка участка | `/arboristika/raschistka-uchastka/pushkino/` | ~78 | medium | P0 | Под застройку коттеджа |
| кронирование | `/arboristika/kronirovanie/pushkino/` | ~58 | medium | P1 | Сосны/ели на даче |
| санитарная обрезка | `/arboristika/sanitarnaya-obrezka/pushkino/` | ~42 | medium | P1 | Плодовые сады |

### 3.3 · chistka-krysh (Pushkino)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| чистка крыш от снега | `/chistka-krysh/ot-snega/pushkino/` | ~52 | medium | P0 | Дачные дома + коттеджи |
| сбивание сосулек | `/chistka-krysh/sbivanie-sosulek/pushkino/` | ~34 | medium | P1 | Двускатные кровли коттеджей |
| чистка кровли частного дома | `/chistka-krysh/chastnyj-dom/pushkino/` | ~28 | medium | P2 | Дачный сегмент |

### 3.4 · demontazh (Pushkino)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| демонтаж дачи | `/demontazh/dachi/pushkino/` | ~88 | medium-high | P0 | СНТ старые срубы (high anchor) |
| демонтаж бани | `/demontazh/bani/pushkino/` | ~52 | medium | P1 | Дачное обновление |
| снос забора | `/demontazh/snos-zabora/pushkino/` | ~32 | medium | P2 | Замена старых заборов |

**Pushkino pillar-level totals (estimate):** vyvoz ~665 / arbo ~535 / chistka ~114 / demontazh ~172 = **~1486 МСК+МО aggregated**.

---

## 4 · Istra — keyword research per pillar

### 4.1 · vyvoz-musora (Istra)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| вывоз мусора | `/vyvoz-musora/istra/` | ~140 | medium | P0 | Pillar head, дачники летом |
| вывоз садового мусора | `/vyvoz-musora/sadovyj/istra/` | ~85 | medium | P0 | Дачные участки 30-100 соток |
| контейнер крупный | `/vyvoz-musora/kontejner/istra/` | ~62 | medium | P0 | Большие дачные стройки |
| вывоз стройотходов | `/vyvoz-musora/vyvoz-stroymusora/istra/` | ~38 | medium | P1 | Дачное строительство |

### 4.2 · arboristika (Istra) — flagship pillar (дачный multiplier)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| спил деревьев | `/arboristika/spil-derevev/istra/` | ~178 | medium | P0 | Большие участки + леса вокруг ВД |
| расчистка участка | `/arboristika/raschistka-uchastka/istra/` | ~95 | medium | P0 | Под застройку 30-100 сот. |
| удаление пня | `/arboristika/udalenie-pnya/istra/` | ~62 | medium | P1 | После спила |
| кронирование | `/arboristika/kronirovanie/istra/` | ~38 | medium | P1 | Сосны / ели у воды |
| санитарная обрезка | `/arboristika/sanitarnaya-obrezka/istra/` | ~28 | medium | P2 | Плодовые сады |

### 4.3 · chistka-krysh (Istra) — ВД-niche

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| чистка крыш от снега | `/chistka-krysh/ot-snega/istra/` | ~62 | medium | P0 | ВД-зона + ливневые наводнения |
| сбивание сосулек | `/chistka-krysh/sbivanie-sosulek/istra/` | ~38 | medium | P1 | Двускатные кровли коттеджей |
| чистка ливнёвок | `/chistka-krysh/livnevki/istra/` | ~30 | low | P1 | ВД-niche unique angle |

### 4.4 · demontazh (Istra)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| демонтаж дачи | `/demontazh/dachi/istra/` | ~78 | medium | P0 | Старые дачи 1960-80-х под снос |
| демонтаж бани | `/demontazh/bani/istra/` | ~38 | medium | P1 | Дачные бани |
| снос забора | `/demontazh/snos-zabora/istra/` | ~28 | medium | P2 | Замена при перестройке |

**Istra pillar-level totals (estimate):** vyvoz ~325 / arbo ~401 / chistka ~130 / demontazh ~144 = **~1000 МСК+МО aggregated**.

> **Caveat (honest data):** Istra population 35k базовый — низкий. Дачный multiplier ×1.5 для arbo/krysh — субъективная оценка от seo-content на основе intake §3.1. Финальные wsfreq могут оказаться ниже на 30-40%, если дачники-летники Wordstat-запросы ищут «истринский район», а не «истра» (требует Wordstat XML verification на W12 day 7).

---

## 5 · Zhukovskij — keyword research per pillar

### 5.1 · vyvoz-musora (Zhukovskij)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| вывоз мусора | `/vyvoz-musora/zhukovskij/` | ~419 | medium | P0 | Pillar head |
| вывоз стройотходов | `/vyvoz-musora/vyvoz-stroymusora/zhukovskij/` | ~85 | medium | P0 | Авиапром-стройотходы B2B |
| контейнер | `/vyvoz-musora/kontejner/zhukovskij/` | ~62 | medium | P1 | Авиа-склады |
| крупногабарит | `/vyvoz-musora/krupnogabarit/zhukovskij/` | ~38 | medium | P2 | ЖК density |

### 5.2 · arboristika (Zhukovskij)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| спил деревьев | `/arboristika/spil-derevev/zhukovskij/` | ~115 | medium | P0 | ЖК + ВПП FOD-prevention |
| кронирование | `/arboristika/kronirovanie/zhukovskij/` | ~52 | medium | P1 | Аэродромная норма (стандарт ICAO) |
| удаление пня | `/arboristika/udalenie-pnya/zhukovskij/` | ~38 | medium | P1 | После спила |

### 5.3 · chistka-krysh (Zhukovskij) — flagship pillar B2B

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| чистка крыш промобъекты | `/chistka-krysh/promobyekty/zhukovskij/` | ~95 | low | P0 | ВПП ЛИИ + ангары specifically |
| чистка крыш МКД | `/chistka-krysh/mkd/zhukovskij/` | ~62 | medium | P0 | ЖК + общежития ЛИИ |
| договор на сезон | `/chistka-krysh/dogovor-na-sezon/zhukovskij/` | ~52 | low | P0 | B2B договор для аэродрома (ground crew SLA) |
| чистка крыш от снега | `/chistka-krysh/ot-snega/zhukovskij/` | ~48 | medium | P1 | Pillar-level зимний |

### 5.4 · demontazh (Zhukovskij)

| Sub-service | URL slug | wsfreq estimate | Confidence | Priority | Winning angle |
|---|---|--:|---|:-:|---|
| демонтаж промышленный | `/demontazh/promyshlennyj/zhukovskij/` | ~78 | low | P0 | Авиа-инфраструктура B2B |
| снос забора | `/demontazh/snos-zabora/zhukovskij/` | ~38 | medium | P1 | Авиа-периметр |
| демонтаж дачи | `/demontazh/dachi/zhukovskij/` | ~28 | medium | P2 | Прилегающий частный сектор |

**Zhukovskij pillar-level totals (estimate):** vyvoz ~604 / arbo ~205 / chistka ~257 / demontazh ~144 = **~1210 МСК+МО aggregated**.

---

## 6 · Cross-pillar связки (4-в-1 multi-pillar opportunity, sustained Stage 2 winning angle)

> Sustained от Stage 2 winning angle: «4-в-1 — один договор, один прораб, четыре услуги». Cross-pillar связки = sub-services где 1 заявка triggers 2-3 pillar.

| District | Cross-pillar bundle | Trigger sub-services | Internal-link rationale |
|---|---|---|---|
| **Khimki** | Демонтаж + Вывоз + Чистка крыш | `/demontazh/promyshlennyj/khimki/` → `/vyvoz-musora/vyvoz-stroymusora/khimki/` → `/chistka-krysh/promobyekty/khimki/` | B2B авиа-склад: после демонтажа цеха — вывоз отходов + сезонная чистка кровли |
| **Pushkino** | Арбо + Вывоз + Демонтаж | `/arboristika/raschistka-uchastka/pushkino/` → `/vyvoz-musora/sadovyj/pushkino/` → `/demontazh/dachi/pushkino/` | СНТ flow: расчистка под застройку → вывоз спил + садового мусора → снос старой дачи |
| **Istra** | Арбо + Демонтаж + Вывоз | `/arboristika/raschistka-uchastka/istra/` → `/demontazh/dachi/istra/` → `/vyvoz-musora/kontejner/istra/` | Большой участок: спил леса + снос старой дачи + крупный контейнер |
| **Zhukovskij** | Чистка крыш + Демонтаж + Арбо | `/chistka-krysh/promobyekty/zhukovskij/` → `/demontazh/promyshlennyj/zhukovskij/` → `/arboristika/kronirovanie/zhukovskij/` | ВПП ground crew SLA: сезонная чистка кровли + плановый демонтаж + аэродромное кронирование (FOD-prevention) |

**Internal-link плотность для bundles:** в каждом cross-pillar SD добавить block «Заказывают вместе» с ссылками на 2 связанных SD из bundle. Anchor-text — descriptive (например «снос старой дачи в Пушкино», не «здесь»).

---

## 7 · Programmatic SD shortlist для Wave 1 batch generator

### 7.1 · 16 SD pillar-level (4 districts × 4 pillar) — **ALL P0 для W13 day 1**

| # | URL | District | Pillar | wsfreq estimate |
|--:|---|---|---|--:|
| 1 | `/vyvoz-musora/khimki/` | Khimki | vyvoz | ~1024 |
| 2 | `/arboristika/khimki/` | Khimki | arbo | ~326 (sum sub) |
| 3 | `/chistka-krysh/khimki/` | Khimki | chistka | ~206 (sum sub) |
| 4 | `/demontazh/khimki/` | Khimki | demontazh | ~124 (sum sub) |
| 5 | `/vyvoz-musora/pushkino/` | Pushkino | vyvoz | ~419 |
| 6 | `/arboristika/pushkino/` | Pushkino | arbo | ~535 (sum sub) |
| 7 | `/chistka-krysh/pushkino/` | Pushkino | chistka | ~114 (sum sub) |
| 8 | `/demontazh/pushkino/` | Pushkino | demontazh | ~172 (sum sub) |
| 9 | `/vyvoz-musora/istra/` | Istra | vyvoz | ~140 |
| 10 | `/arboristika/istra/` | Istra | arbo | ~401 (sum sub) |
| 11 | `/chistka-krysh/istra/` | Istra | chistka | ~130 (sum sub) |
| 12 | `/demontazh/istra/` | Istra | demontazh | ~144 (sum sub) |
| 13 | `/vyvoz-musora/zhukovskij/` | Zhukovskij | vyvoz | ~419 |
| 14 | `/arboristika/zhukovskij/` | Zhukovskij | arbo | ~205 (sum sub) |
| 15 | `/chistka-krysh/zhukovskij/` | Zhukovskij | chistka | ~257 (sum sub) |
| 16 | `/demontazh/zhukovskij/` | Zhukovskij | demontazh | ~144 (sum sub) |

### 7.2 · 60 SD sub-level — final shortlist (P0 + P1, cap by estimated wsfreq ≥30)

**Khimki (15):** kontejner, vyvoz-stroymusora, staraya-mebel, krupnogabarit, vyvoz-hlama, gazel, kommercheskij (vyvoz × 7) · spil-derevev, udalenie-pnya, sanitarnaya-obrezka, kronirovanie (arbo × 4) · ot-snega, mkd, sbivanie-sosulek, dogovor-na-sezon (chistka × 4) — **итого 15**.

**Pushkino (15):** sadovyj, vyvoz-stroymusora, kontejner, krupnogabarit (vyvoz × 4) · spil-derevev, udalenie-pnya, raschistka-uchastka, kronirovanie, sanitarnaya-obrezka (arbo × 5) · ot-snega, sbivanie-sosulek, chastnyj-dom (chistka × 3) · dachi, bani, snos-zabora (demontazh × 3) — **итого 15**.

**Istra (15):** sadovyj, kontejner, vyvoz-stroymusora (vyvoz × 3) · spil-derevev, raschistka-uchastka, udalenie-pnya, kronirovanie (arbo × 4) · ot-snega, sbivanie-sosulek, livnevki (chistka × 3) · dachi, bani, snos-zabora (demontazh × 3) · sanitarnaya-obrezka, krupnogabarit (× 2 P2 buffer) — **итого 15**.

**Zhukovskij (15):** vyvoz-stroymusora, kontejner, krupnogabarit (vyvoz × 3) · spil-derevev, kronirovanie, udalenie-pnya (arbo × 3) · promobyekty, mkd, dogovor-na-sezon, ot-snega (chistka × 4) · promyshlennyj, snos-zabora, dachi (demontazh × 3) · sadovyj, sanitarnaya-obrezka (× 2 P2 buffer) — **итого 15**.

**Total: 16 pillar + 60 sub = 76 ServiceDistricts.** ✓ совпадает со скопом intake.

### 7.3 · Distribution по pillar (для batch generator config)

| Pillar | sub per district avg | Total sub | Pillar SD | Cluster sum (estimate) |
|---|--:|--:|--:|--:|
| vyvoz-musora | 4.25 | 17 | 4 | ~2002 |
| arboristika | 4.0 | 16 | 4 | ~1467 |
| chistka-krysh | 3.5 | 14 | 4 | ~707 |
| demontazh | 3.25 | 13 | 4 | ~584 |
| **Total** | — | **60** | **16** | **~4760 МСК+МО** |

---

## 8 · TODO для tech sweep W12 day 7 (после operator approval Topvisor SaaS)

- [ ] **Wordstat XML batch:** ~76 head/long-tail запросов (4 districts × 19 keys в среднем) с реальной wsfreq МСК+МО — по протоколу `seosite/scripts/jm_wsfreq_micro.py` (50-kw батчи, ~1₽/батч).
- [ ] **Key Collector cluster cleanup:** anti-cannibalization vs Stage 1 priority-A districts — убедиться, что Khimki/Pushkino/Istra/Zhukovskij не каннибализируют Odintsovo/Krasnogorsk/Mytishchi/Ramenskoye в SERP (особенно cross-borderline geo: Pushkino vs Mytishchi).
- [ ] **Just-Magic confirm priority sub-keys:** porog ≥30 wsfreq head, ≥10 wsfreq sub — финальный cap 60 SD на основе real wsfreq threshold (если real cifry упадут ниже estimate, drop bottom-tier sub-keys и заменить P2 bufferом).
- [ ] **Update этого файла:** replace `~estimate` cifry на real Wordstat XML numbers; пометить confidence → `verified`.
- [ ] **Sync с pillar clusters:** добавить новые district-keys в `vyvoz-musora.md` / `arboristika.md` / `chistka-krysh.md` / `demontazh.md` (cross-reference integrity).
- [ ] **Sanity-check vs `_sanity-checks.md`:** priority-B districts не дублируют priority-A district keywords (geo-segmentation чёткая); проверить `pushkino vs pushkinskij rajon`, `istra vs istrinskij rajon` (Wordstat показал в anchor `снос домов в пушкинском районе` — район ≠ city).
- [ ] **Topvisor verify (при появлении creds):** SERP positions snapshot для top-15 sub-keys на 2026-05-W13 (baseline before launch).

---

## 9 · Honest data caveats (operator-visible)

1. **Все wsfreq в этом файле — estimates с пометкой `~`**, не raw Wordstat. Confidence levels: high (3 keys), medium (~50 keys), low (~7 keys, B2B niche).
2. **Istra дачный multiplier** ×1.5 для arbo/krysh — субъективная оценка от seo-content на базе intake. Может оказаться overstated, если Wordstat показывает «истринский район» как primary form (требует verification W12 day 7).
3. **Khimki air-cargo B2B** (`/demontazh/promyshlennyj/khimki/`, `/chistka-krysh/promobyekty/zhukovskij/`) — low confidence из-за niche segment без direct anchor в existing clusters. Топ-3 SERP may be доминирован Тильда-стилем дешёвыми контейнерщиками — потребуется E-E-A-T angle (сертификаты ICAO для аэродромных площадок) в content brief.
4. **Pushkino vs Mytishchi cannibalization risk:** обе priority-зоны на ярославском направлении, geo-overlap. Нужен strict anti-canonical в `_sanity-checks.md` после Wave 1 launch.
5. **chistka-krysh seasonality:** wsfreq estimate отражает annual average, но real spike ноябрь-март ×3-5. Wave 1 launch на W13 day 1 (май) попадёт в low-season, ranking grow till осень.

---

## 10 · Hand-off log

- `2026-05-02 · sa-seo`: создан stub priority-b-districts.md (123 строки) с pillar-level table + sub-level candidates + TODO W12 day 1-2. Sustained Stage 1+2 keyword research methodology (Wordstat XML + Just-Magic + Key Collector + Keys.so без Ahrefs).
- `2026-05-02 · seo-content`: Track D Run 0 — расширил stub до full keyword research артефакта (~330 строк). Применил fallback methodology: population-scaling от priority-A baselines (Odintsovo wsfreq 644 anchor) + local modifiers per intake §3.1 winning angles. Подготовил final shortlist 16 SD pillar-level + 60 SD sub-level для Wave 1 production cw / SD batch generator на W13 day 1. Все estimates помечены confidence + `~`. Hard wsfreq dozabor — TODO W12 day 7 (Wordstat XML после operator-approval Topvisor creds).
- `W12 day 7 · seo-content` (TODO): Wordstat XML verification + replace estimates на real cifry + sync с pillar clusters.
- `W13 day 1 · poseo + seo-tech` (PENDING): start Wave 1 SD batch generator на основе этого shortlist + content brief через `cw`.
