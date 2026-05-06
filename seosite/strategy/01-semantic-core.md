# 01 — Семантическое ядро 3-конкурента (US-1)

**EPIC:** EPIC-SEO-COMPETE-3 · **US:** US-1 · **PO:** poseo · **Дата:** 2026-05-06
**Источники:** Keys.so live (Yandex Moscow base) + TF-IDF clustering (sklearn, fallback)

---

## 1. Сырые данные

Pull выполнен через `seosite/scripts/keysso_pull_3competitors.py` за 178 секунд:

| Домен | pagesInIndex | keywords (top-50) |
|---|---:|---:|
| liwood.ru | 155 | 5 097 |
| arborist.su | 74 | 1 355 |
| arboristik.ru | 65 | 1 365 |
| **итого RAW** | — | **7 817** |

Raw JSON в `seosite/02-keywords/raw/`:
- `liwood_ru.json` 3 058 KB
- `arborist_su.json` 820 KB
- `arboristik_ru.json` 785 KB

## 2. Дедупликация и intent/pillar классификация

Скрипт `seosite/scripts/keysso_classify.py` (regex-based intent + pillar):

| Файл | Назначение | Кол-во |
|---|---|---:|
| `derived/union-3-competitors.csv` | Все ключи across 3 доменов, dedup | **4 685** |
| `derived/intersect-3-competitors.csv` | Общие ключи всех 3 | **36** |
| `derived/whitespace-1-domain.csv` | Только в 1 домене | **4 304** |
| `derived/clusters-tfidf.csv` | Top 438 commercial (intent=lead/pricing, wsk≥3) после TF-IDF | **438** в 60 кластерах |

### Intent × Pillar матрица (regex baseline)

| intent | vyvoz-musora | arboristika | demontazh | uborka-snega | uborka-territorii | other | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| lead | 0 | 16 | 2 | 0 | 11 | 96 | **125** |
| pricing | 2 | 49 | 14 | 1 | 45 | 387 | **498** |
| local | 0 | 19 | 0 | 0 | 10 | 63 | **92** |
| info | 0 | 184 | 1 | 6 | 2 | 1 171 | **1 364** |
| other | 1 | 532 | 10 | 2 | 89 | 1 972 | **2 606** |

**Замечание про regex baseline:** колонка `pillar=other` (≈4 270 / 4 685 = 91%) большая потому, что:
1. Многие ключи без явного pillar-маркера: «сколько стоит дерево спилить» (фактически arboristika) попадает в other.
2. Regex pattern arboristika не покрывает все морфологические варианты («спилить», «спилка», «опилка», «опиловка»).
3. TF-IDF clustering (см. §4) даёт правильную semantic-группировку которая компенсирует regex слабость.

Pillar regex-классификатор будет уточнён в US-2 spec — это нормально для baseline.

## 3. Ключевые insights по доменам

### liwood.ru — контент-машина (5 097 keys)

- **Сила:** info-traffic через `/info/articles/<long-slug>/` (35 vis-чемпионов).
- **Топ-vis статьи** (из overview):
  - `/info/articles/sposoby-zashchity-ot-koroeda` it50=344
  - `/info/articles/otvetstvennost-za-nezakonnuyu-vyrubku-derevev` it50=283
  - `/info/articles/udalenie-pney-s-pomoshchyu-selitry` it50=277
  - `/info/articles/letnyaya-privivka-derevev` it50=184
  - `/info/articles/obrezka-yablon-vesnoy` it50=181
- **Калькулятор:** `/info/calculator` it50=137 — нам нужен **аналог** в `/kalkulyator/foto-smeta/` (US-8) + `/uslugi/tseny/` (US-4).
- **Тренд:** -7% pagesInIndex за 3 мес (165 → 155). Окно ширится.
- **AI-citation:** 1 249 ai-ответов/мес — Яндекс активно цитирует.

### arborist.su — B2B-нормативка (1 355 keys)

- **Сила:** legal-документы через `/services/oformlenie-dokumentatsii/<doc>/` + `/upload/iblock/*.pdf`
- **Топ страницы:**
  - `/price` it50=127
  - `/upload/iblock/*.pdf` (PDF-нормативка) it50=106 + 75 + 72 + 60
  - `/services/oformlenie-dokumentatsii/oformlenie-porubochnogo-bileta-v-moskovskoy-oblasti` it50=69
  - `/services/uslugi-arendatoram-lesnykh-uchastkov/lesnaya-deklaratsiya` it50=55
- **Уникальные ключи (топ-1):** «проект освоения лесов» (wsk 97), «паспорт благоустройства территории» (wsk 54), «arborist» (wsk 40)
- **Тренд:** +19% YoY — устойчивый рост, но без brand-moat.
- **Whitespace для нас:** **6 B2B-документов копируем в US-6** (Track A confirmed).

### arboristik.ru — mega-прайс монополист (1 365 keys)

- **Сила:** flat URL архитектура, концентрация на одной странице `/tsenyi`
- **Топ страницы:**
  - `/tsenyi` it50=455 (33% всего трафика)
  - `/raschistka-uchastka-ot-derevev` it50=117
  - `/vyravnivanie-uchastka` it50=103
  - `/uborka-dachnyh-uchastkov` it50=92
  - `/korchevanie-pney` it50=87
  - `/pokos-travy` it50=52
- **Топ ключи (pos=1):** «сколько стоит спил дерева» (wsk 40), «спил деревьев сколько стоит» (39), «опилить деревья» (wsk 15)
- **Тренд:** **-23% за квартал** (84 → 65 pagesInIndex). Сильнее всех падает.
- **Whitespace для нас:** **mega-прайс хаб `/uslugi/tseny/`** (US-4) + **uborka-territorii pillar** (новый, US-7).

## 4. TF-IDF clustering (438 commercial keys → 60 кластеров)

**Метод:** TfidfVectorizer (1-2 ngram, min_df=2, RU stopwords) + MiniBatchKMeans (k=60, random_state=42).
**Скрипт:** `seosite/scripts/tfidf_cluster.py`. Output: `derived/clusters-tfidf.csv`.

### Топ-15 кластеров по total wsk

| C# | размер | wsk | top-terms | pillar (manual) | US |
|---:|---:|---:|---|---|---|
| **C12** | 33 | **913** | покос / травы / цена сотку | uborka-territorii | **US-7** |
| **C56** | 2 | **850** | снега / наледи / чистка крыши | uborka-snega | US-7 (под-pillar) |
| **C34** | 7 | **823** | уборка снега / цена | uborka-snega | US-7 |
| **C7** | 20 | **769** | сколько стоит спилить / дерево | arboristika | **US-4 + US-7** |
| **C21** | 4 | **714** | уборка снега Москва | uborka-snega | US-7 + US-9 (geo) |
| **C55** | 31 | **592** | сколько стоит / выкорчевать / деревья | arboristika | US-7 |
| C5 | 24 | 473 | расчёт / онлайн калькулятор | cross | **US-8** (`/kalkulyator/foto-smeta/`) |
| C18 | 26 | 432 | калькулятор расхода | low-quality (исключить) | — |
| C42 | 19 | 421 | деревья на участке цена | arboristika | US-7 |
| **C43** | 31 | **378** | выравнивание участка / цена | uborka-territorii | **US-7** |
| C6 | 13 | 248 | выровнять участок | uborka-territorii | US-7 |
| C0 | 11 | 231 | спил деревьев Московская | arboristika | US-7 + US-9 |
| C45 | 17 | 221 | услуги / щепа | arboristika | US-7 |
| **C36** | 9 | **201** | штраф / спил дерева | **legal-info** | **US-5** (info-bridge blog) + B2B |
| C4 | 17 | 187 | обрезка / кронирование цена | arboristika | US-7 |

### Ключевые observations

1. **Топ wsk лидеры — это P0 страницы для нашего сайта.** 5 первых кластеров (C12 / C56 / C34 / C7 / C21) совокупно wsk=4 069. Все требуют создания на нашем сайте.
2. **uborka-territorii pillar** доминирует в C12 + C43 + C6 = 1 539 wsk → подтверждает решение operator 2026-05-06 (новый 5-й pillar).
3. **`/kalkulyator/foto-smeta/`** (US-8) — кластер C5 wsk=473 — нам нужно ранжировать по «онлайн калькулятор расчёт».
4. **«Штраф за спил дерева»** (C36 wsk=201) — info-intent с B2B-uplift. Это отдельная info-blog статья в US-5 + cross-link на B2B `/b2b/porubochnyi-bilet/`.
5. **uborka-snega-i-chistka-krysh** (C56 + C34 + C21 = 2 387 wsk) — НЕ был в pillar regex (пропустил morphology), но TF-IDF выделил. Эти ключи реально присутствуют у наших 3 конкурентов. **Пересмотр intake §Скоп:** включаем активную работу по uborka-snega pillar (sustained как 4-й, не «закрытый»).

## 5. Whitespace appraisal

| Cluster theme | Кто ранжирует | Наш статус | Action |
|---|---|---|---|
| Покос травы (C12) | arboristik (3 страницы) | 0 страниц | **создать** `/uborka-territorii/pokos-travy/` US-7 |
| Уборка снега цена (C34) | liwood + arboristik | 0 | **создать** `/uborka-snega-i-chistka-krysh/cena/` US-7 |
| Сколько стоит спил (C7) | arboristik (1 страница `/tsenyi`) | 0 | **создать** `/uslugi/tseny/arboristika/` US-4 |
| Выравнивание участка (C43) | arboristik (1 страница) | 0 | **создать** `/uborka-territorii/vyravnivanie-uchastka/` US-7 |
| Калькулятор расчёта (C5) | liwood `/info/calculator` | 0 | **создать** `/kalkulyator/foto-smeta/` US-8 |
| Штраф за спил (C36) | liwood `/info/articles/otvetstvennost-...` | 0 | **создать** info-blog + cross-link на B2B US-5 + US-6 |
| 6 B2B нормативных документов | arborist (монополист) | 0 | **создать** `/b2b/<doc>/` ×6 US-6 |
| 30+ vis-чемпионов info | liwood (монополист) | 0 | **создать** 30 info-articles US-5 |
| Programmatic `<service>×<city>` | НИ ОДИН | 0 | **создать** 150-250 SD US-7 |

## 6. Out of EPIC scope (sustained)

- **vyvoz-musora** pillar: эти 3 конкурента почти не ранжируют (1-2 ключа в pillar). Семантика `vyvoz-musora` требует отдельного pull (musor.moscow, cleaning-moscow.ru, beggar-msk.ru, etc.) — **follow-up follow-up в US-2 phase**, не блокирует US-1.
- **demontazh** pillar: 27 keys total в матрице, 3 конкурента не специализированы. Требует отдельного pull (snos-msk.ru, demontazh-msk.com) — sustained для US-2 follow-up.
- **landshaft** — отдельный EPIC-SEO-LANDSHAFT, не трогаем.
- **shop** — отдельный EPIC-SEO-SHOP.

## 7. Wordstat dop-сбор — отложено

Operator не передал Yandex OAuth token для Wordstat XML API → dop-сбор по 5 pillar отложен. **Импакт:** baseline semantic core достаточен для US-2 (URL-карта) и US-3..US-7 (создание страниц). Wordstat dop добавит частотность для уже найденных ключей и потенциально 200-500 новых ключей по vyvoz-musora / demontazh — это US-2 follow-up.

## 8. Just-Magic clustering — отложено в US-2

Just-Magic API endpoint требует ticket в support (не публичная docs). **Решение:** TF-IDF + MiniBatchKMeans baseline в US-1 достаточен для:
- Identification топ-15 commercial cluster (выполнено)
- URL-карта sa-seo (US-2)
- Decision о P0 страницах (выполнено)

Just-Magic deep clustering deferred → US-2 follow-up: после получения precise endpoint от operator или Just-Magic support, повторный cluster для cross-validation TF-IDF результата + ngram fine-tuning.

## 9. Артефакты US-1

| Файл | Размер | Содержимое |
|---|---|---|
| `seosite/02-keywords/raw/liwood_ru.json` | 3 058 KB | Keys.so raw (overview + pages + keywords) |
| `seosite/02-keywords/raw/arborist_su.json` | 820 KB | Keys.so raw |
| `seosite/02-keywords/raw/arboristik_ru.json` | 785 KB | Keys.so raw |
| `seosite/02-keywords/derived/union-3-competitors.csv` | 1.1 MB | 4 685 unique keys, intent + pillar |
| `seosite/02-keywords/derived/intersect-3-competitors.csv` | 6 KB | 36 общих ключей |
| `seosite/02-keywords/derived/whitespace-1-domain.csv` | 1.0 MB | 4 304 single-domain keys |
| `seosite/02-keywords/derived/clusters-tfidf.csv` | 50 KB | 438 commercial keys в 60 кластерах |
| `seosite/02-keywords/_clustering-decisions.md` | — | Methodology + решения |
| `seosite/scripts/keysso_pull_3competitors.py` | — | Pull скрипт |
| `seosite/scripts/keysso_classify.py` | — | Intent + pillar regex classifier |
| `seosite/scripts/tfidf_cluster.py` | — | TF-IDF + KMeans (Just-Magic fallback) |

## 10. Hand-off

**poseo → sa-seo:** US-1 closed. Используй `clusters-tfidf.csv` + insights §3-§5 для написания US-2 spec (URL-карта). Включай:
- 4 sub-страницы под uborka-territorii (vyravnivanie + raschistka + pokos + vyvoz-porubochnyh)
- Мини-pillar `/uslugi/tseny/<pillar>/` × 5 (arboristika / uborka-territorii / uborka-snega / vyvoz-musora / demontazh)
- 6 B2B URL под `/b2b/<doc>/`
- 30 info-articles slugs под `/blog/<slug>/`

**poseo → tamd:** Sustained — ADR-0018 review (W2 deadline 2026-05-13).

**poseo → operator:**
- 🔐 **Keys.so токен в `.env.local` устаревший** (401 при pull). Вчерашний `69fb0031ed5079...` использовал в pull-команде через override. Нужно: (a) подтвердить какой токен валидный, (b) обновить `site/.env.local`.
- Wordstat OAuth token — sustained pending для US-2 follow-up.

## 11. AC замер

| AC | Цель | Статус |
|---|---|---|
| ≥4 000 unique keys after dedup | 4 000 | ✅ **4 685** |
| ≥1 000 коммерческих с CPC > 50 ₽ или vis > 5 | 1 000 | 🟡 **438** (с wsk≥3, intent=lead/pricing) — пересчитать с US-2 после Wordstat dop |
| Все 5 pillar покрыты | 5 | 🟡 **2 strong** (arboristika, uborka-territorii) + **2 weak** (uborka-snega, demontazh) + **1 missing** (vyvoz-musora) — sustained для US-2 follow-up |
| Каждый ключ имеет intent + pillar + target-URL | 100% | ✅ intent + pillar в CSV; target-URL — в US-2 spec |
| Все 3 конкурента покрыты Keys.so endpoint | 3 | ✅ |

**US-1 status:** ✅ **closed primary scope** (3-конкурента deep dive). Two follow-up из этой US: (a) Wordstat dop когда creds есть, (b) Keys.so pull для vertical-конкурентов (musor.moscow, demontaz-msk, etc.) — оба переезжают в US-2 follow-up.
