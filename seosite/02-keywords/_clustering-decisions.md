# Clustering decisions — US-1 baseline

**Дата:** 2026-05-06 · **EPIC:** EPIC-SEO-COMPETE-3 · **Owner:** poseo

## Что и почему

### 1. Just-Magic API → отложен в US-2

Operator передал `JUSTMAGIC_API_KEY=19e91bb…` (приватный API access из тарифа «Эцилопп»+). Однако:

- Точный API endpoint Just-Magic не публикуется на сайте — требует ticket в support после регистрации.
- WebFetch на `just-magic.org/api`, `/help`, `/wiki` → 404.

**Решение:** TF-IDF + MiniBatchKMeans baseline в US-1, Just-Magic deep clustering → US-2 follow-up, когда (a) operator дозапросит endpoint у support, или (b) поднимем платформу через login.

### 2. TF-IDF параметры

```python
TfidfVectorizer(
    token_pattern=r"(?u)\b[А-Яа-яёЁA-Za-z]{2,}\b",  # русский + латиница, ≥2 символа
    stop_words=RU_STOPWORDS,                          # 28 слов (мин. набор)
    ngram_range=(1, 2),                               # unigram + bigram (для «спил дерева» как фраза)
    min_df=2,                                          # игнорировать unique термы
    max_df=0.7,                                        # игнорировать «цена» / «москва» которые повсеместны
)
MiniBatchKMeans(n_clusters=60, random_state=42, batch_size=128)
```

**Почему 60 кластеров на 438 keys:**
- Среднее ≈7 keys/cluster — оптимум для page-mapping (1 cluster → 1 sub-pillar URL).
- При k=30 — слишком обобщённо, теряем nuance.
- При k=100 — фрагментация, многие clusters с 1-2 keys.
- Эмпирическая проверка: топ-15 кластеров дают 25%+ от total wsk.

### 3. Intent classification — regex baseline

Файл: `seosite/scripts/keysso_classify.py`. 5 классов:

| Class | Pattern (примеры) | Назначение |
|---|---|---|
| `lead` | заказ\|услуг\|нанять\|подрядчик | → страницы с lead-form |
| `pricing` | цена\|стоимость\|тариф\|калькулятор | → mega-прайс + pricing-блоки |
| `local` | <city МО>\|москва\|рядом | → ServiceDistricts (programmatic) |
| `info` | как\|почему\|что такое\|закон | → blog + info-bridge cases |
| `other` | fallback | → перепроверить вручную |

**Слабость:** ≈55% (2 606 / 4 685) keys попали в `other`. Причина — много пограничных формулировок («сколько стоит спилить дерево» = pricing+lead). TF-IDF clustering (см. выше) компенсирует regex слабость через semantic-группировку.

### 4. Pillar classification — regex baseline

5 классов: `vyvoz-musora` / `arboristika` / `demontazh` / `uborka-snega-i-chistka-krysh` / `uborka-territorii` + `other`.

**Слабость:** ≈91% (4 270 / 4 685) keys попали в `pillar=other` потому что:
- Морфология русского языка → regex не покрывает все падежи / суффиксы. Пример: «спилить» (глагол) попадает в `other`, хотя relevant arboristika.
- Регекс upper-case morphology requires lemmatization (pymorphy2) — отложено в US-2 follow-up.

**Workaround:** TF-IDF clustering на 60 групп → ручная разметка top-15 кластеров (см. master doc §4 таблица). Этого достаточно для US-2 (URL-карта).

### 5. Override list

Тонкие decisions для US-1:

| Override | Reason | Source |
|---|---|---|
| C18 «калькулятор расхода дров» — exclude | Не наша вертикаль (печной расчёт) | manual review topcluster |
| «короед штукатурка» — exclude | Out of vertical (фасадная отделка) | sustained from prior session |
| «жук короед» / «короед типограф» — keep as arboristika | Insect treatment = наша услуга | semantic match |
| «селитра в пень» — keep as arboristika | DIY removal info-traffic, lead-bridge возможен | high vis |
| «штраф за спил» — info+B2B | Cross-link blog ↔ b2b/porubochnyi-bilet | E-E-A-T axis |

### 6. Sustained items для follow-up US

| Pending | When | Why |
|---|---|---|
| Wordstat XML dop-сбор для 5 pillar | US-2 после operator OAuth token | dofill частотность; ~+200-500 новых keys на vyvoz-musora/demontazh |
| Keys.so pull для vertical-конкурентов vyvoz-musora (musor.moscow, beggar-msk) | US-2 follow-up | 3-конкурента покрывают только 1-2 keys vyvoz-musora |
| Keys.so pull для demontazh (snos-msk, demontazh-msk) | US-2 follow-up | 27 keys total в pillar, нужно расширение |
| Just-Magic deep clustering | US-2 после endpoint от support | cross-validate TF-IDF baseline |
| Pymorphy2 lemmatization для pillar regex | US-2 spec | поднять `pillar=other` ratio с 91% до <50% |

## Reproducibility

```bash
# 1. Pull Keys.so deep
KEYSO_API_KEY="<valid-token>" python3 -u seosite/scripts/keysso_pull_3competitors.py

# 2. Classify intent + pillar
python3 -u seosite/scripts/keysso_classify.py

# 3. TF-IDF baseline cluster
python3 -u seosite/scripts/tfidf_cluster.py
```

Все 3 скрипта детерминированные (random_state=42 в KMeans). Re-run даёт идентичный output при тех же raw JSON.
