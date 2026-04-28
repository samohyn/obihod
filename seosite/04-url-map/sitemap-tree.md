# Sitemap Tree — obikhod.ru (v0.4 — APPROVED)

**Статус:** v0.4 — **APPROVED оператором 2026-04-25 (вечер).** Q-14
закрыт: оператор утвердил новый порядок pillar в IA (Вывоз мусора →
Арбо → Крыши → Демонтаж). CLAUDE.md immutable обновлён.
**Дата:** 2026-04-25.
**Эпик:** US-4 (semantic core), Linear [OBI-7](https://linear.app/samohyn/issue/OBI-7), Wave 2.
**Цель документа:** структура сайта для запуска US-5 (`seo2` — full-sitemap-IA
+ tech-SEO) и US-6 (`cw` — content production). URL-приоритизация
опирается на wsfreq из Wave 2; гипотезы остались только там, где Wave 2
не дала покрытия (большинство district-модификаторов).

**Δ v0.3 → v0.4:**
- **Q-14 ✅ APPROVED** оператором: новый порядок pillar утверждён.
  Цитата: «я не сделать против делать Вывоз мусора #1 в навигации —
  у нас всё равно большой сайт и будет много страниц под услуги».
- **Открытых вопросов к оператору 0** (все 18 ADR закрыты).
- **Hand-off → US-5 / `seo2`** активен — стартует сразу после merge ветки
  с артефактами Wave 2.

**Δ v0.2 → v0.3:**
- **Outcompete priority пересобран под wsfreq** — топ-1 теперь
  `/vyvoz-musora/` (102 789 freq), pillar арбористики опускается на #2.
- **Q-2 закрыт ADR-uМ-13:** канон `chistka-krysh` (888 freq) vs
  `ochistka-krysh` (0 freq). Везде заменено. Миграция БД через Redirects
  передана `seo2` в US-5 / `be3` в US-6.
- **ADR-uМ-14:** новый порядок pillar в IA — Мусор → Арбо → Крыши →
  Демонтаж (под wsfreq разрыв 5.86×). Под оператора на финал-утверждение.
- **ADR-uМ-15:** orphan-кластер «выравнивание участка» (5523 freq)
  поглощён в `/arboristika/raschistka-uchastka/`.
- **ADR-uМ-16:** добавлены 3 sub-service в pillar мусора —
  `staraya-mebel` (4957 freq), `gazel` (1453 freq), `krupnogabarit` (750
  freq). Это +24 programmatic URL × 8 districts.
- **ADR-uМ-17:** brand-cluster «4 в 1 услуги» (7947 freq) **не получает
  отдельного URL** — это запрос на главную `/`.
- **ADR-uМ-18:** `/arenda-tehniki/avtovyshka/<district>/` programmatic
  (×8 districts) — единственный sub аренды с явным гео-сигналом
  (633 freq на «москва»).
- **8-й пилотный район:** Жуковский добавлен (legend-обещание оператора),
  Истра помечена low-priority publish (1 ключ в pool, см. § Гео-pillar).
- 6 новых ADR (13–18) в [decisions.md](decisions.md).

---

## Outcompete priority v0.3 (под wsfreq Wave 2)

**Сравнение Wave 2 wsfreq по pillar
(`seosite/03-clusters/_summary.json`):**

| Pillar | wsfreq Москва+МО | Кластеров | Ключей | Доля |
|---|---:|---:|---:|---:|
| **vyvoz-musora** | **161 781** | 97 | 384 | **74.4%** |
| **arboristika** | **27 589** | 38 | 534 | 12.7% |
| tools-and-docs | 10 786 | 28 | 136 | 5.0% |
| neuro-info | 7 947 | 22 | 76 | 3.7% |
| chistka-krysh | 888 | 8 | 197 | 0.4% |
| b2b | 235 | 26 | 105 | 0.1% |
| demontazh | 225 | 7 | 141 | 0.1% |
| _orphan | 33 | 26 | 28 | 0.0% |
| **Итого** | **209 484** | 252 | 1601 | 100% |

**Главный инсайт:** «вывоз мусора» в **5.86×** больше арбо и в **182×**
больше крыш по wsfreq. Это пере-оранжирует приоритет URL и порядок
навигации (см. ADR-uМ-14).

### Top-priority URL для Wave 1 publish (порядок publish):

1. **`/vyvoz-musora/`** — pillar #1, 102 789 freq на одном ключе
   «вывоз мусора». **Самая денежная посадочная проекта.** Conкуренты:
   musor.moscow (137 гео), grunlit-eco, mosgortrans-mo. Наш приём:
   sub-service tree глубже (8 sub vs 1 у musor.moscow) + 4-в-1
   cross-sell в hero.
2. **`/vyvoz-musora/<district>/` × 8** — programmatic district
   pillar-уровня (Одинцово, Красногорск, Мытищи, Химки, Истра,
   Пушкино, Раменское, Жуковский). Самый прямой outcompete-приём
   против musor.moscow в МО.
3. **`/arboristika/spil-derevev/`** — sub-service арбо #1, 11 228 freq
   на одном ключе «спил деревьев» (отдельный кластер 1).
4. **`/arboristika/spil-derevev/<district>/` × 8** — programmatic
   district. Прямой outcompete liwood.ru (40 districts × 1 service).
5. **`/arboristika/`** — pillar арбо #2, общий вход в кластер.
6. **`/foto-smeta/`** — отдельная посадочная под USP «фото→смета за
   10 мин». Никого нет в выборке `re`. Low-volume but high-intent.
7. **`/raschet-stoimosti/`** — pillar 4 калькуляторов (CR-сигнал).
8. **`/b2b/shtrafy-gzhi-oati/` + `/b2b/dogovor/`** — закрепление
   уникального B2B-крючка (штрафы ГЖИ/ОАТИ берём на себя по договору).
   Wave 2 wsfreq низкий (235 freq на pillar), но это semantic-niche —
   важно для CR на B2B-каналах.
9. **`/chistka-krysh/`** — pillar #3 по brand-логике, низкий wsfreq
   (888) но критично для УК/ТСЖ (B2B-конверсия зимой). Не «денежный»,
   но обязательный для 4-в-1 позиционирования.
10. **`/demontazh/`** — pillar #4. wsfreq низкий (225), но категория
    обязательна по immutable «4 услуги».

### Отдельные обновления outcompete map v0.3:

| Наш URL | Конкурирует с | Наш преимущественный приём |
|---|---|---|
| `/vyvoz-musora/<district>/` × 8 | `musor.moscow/rajony-obsluzhivanija/<район>/` × 109 + `/goroda/vyvoz-musora-<город>/` × 19 | Одна каноническая ось `<district>` (vs 3 оси у конкурента). 8 пилотных → M3 30+ → M6 60+ |
| `/vyvoz-musora/staraya-mebel/<district>/` × 8 | musor.moscow (есть head, нет district programmatic), avito (рассыпан) | Уникальный kg-tail: 4957 freq на head |
| `/vyvoz-musora/gazel/<district>/` × 8 | gazelkin (бренд), avito | 1453 freq на head + локальная конкретика |
| `/vyvoz-musora/krupnogabarit/<district>/` × 8 | musor.moscow (есть, без programmatic) | 750 freq на head + B2B-связка УК (КГМ-вывоз ↔ норматив УК) |
| `/arboristika/spil-derevev/<district>/` × 8 | `liwood.ru/services/udalenie-derevev/<district>/` × 40 | URL короче на 1 сегмент; гейт publish с miniCase + ≥2 localFaq снимает Scaled Content Abuse risk; B2B-блок «штрафы ГЖИ/ОАТИ» |
| `/arboristika/raschistka-uchastka/` | landscape-узкие сайты, нет крупного игрока | **Поглощает 5523 freq orphan** «выравнивание участка» + 4 кластера расчистки |
| `/chistka-krysh/<sub>/<district>/` | `liwood.ru` (нет programmatic у крыш), `musor.moscow/snegouborka/cao/` (округа, не районы) | Programmatic районный, не окружной |
| `/demontazh/<sub>/<district>/` + `/demontazh/<material>/<object>/` | `demontazhmsk.ru/services/<стены/полы/санузлы>/<material>/` | Двойная программатика — резерв до M3 (см. ADR-13 в этом файле, отложено) |
| `/foto-smeta/` | **никто** (0/14) | Уникальная посадочная под USP проекта |
| `/raschet-stoimosti/` | `liwood.ru/info/calculator/`, `alpme.ru/calculator`, `udalenie-dereviev.moscow/kalkulyator-stoimosti/`, `musor.moscow` (виджет) | 4 калькулятора в одной воронке |
| `/b2b/` + `/b2b/shtrafy-gzhi-oati/` + `/b2b/dogovor/` | `cleaning-moscow.ru/korporativnym-klientam/` (1/14) | 5 B2B-сегментов + 2 спец-страницы; уникальный B2B-крючок |
| `/avtory/<slug>/` | `cleaning-moscow.ru/avtor-<name>/` (1/14) | E-E-A-T best-practice |
| `/promyshlennyj-alpinizm/` | alpme.ru | 2415 freq на head, наш приём — связка с арбо/крышами в одном подрядчике |
| `/arenda-tehniki/avtovyshka/<district>/` × 8 | spectextarena (point-solution) | 2384 freq head + 633 «москва» — единственная техника с гео-сигналом |
| `/arenda-tehniki/izmelchitel-vetok/` | садовая аренда (рассыпана) | 1760+1091+167 = 3018 freq на 3 кластерах |
| `/raiony/<district>/` | у liwood такой страницы нет (только service × district) | Один district = все 4 услуги |
| `/blog/<slug>/` | liwood (85), fasadrf (148), musor.moscow (103) | 60–100 статей за год |

**Главный outcompete-приём:** **никто из 14 не делает 4 услуги × 60+
районов**. Полное покрытие даёт ~1900 programmatic URL (см. § Подсчёт),
0 у самого крупного 4-в-1 конкурента. Защита от Scaled Content Abuse —
гейт publish (miniCase + ≥2 localFaq).

---

## Принципы (без изменений с v0.2, кроме порядка pillar)

1. **3 уровня глубины максимум:** pillar → sub-service → programmatic district.
2. **Canonical slug из БД-сидов** (`site/app/api/seed/route.ts`).
   **Исключение:** `chistka-krysh` (новый канон, ADR-uМ-13) — миграция
   через Redirects.
3. **Гео-страницы — только для районов реального выезда** (8 пилотных
   в волне 1 → второй эшелон 5 городов → полное покрытие ~74).
4. **B2B — отдельная вертикаль** с подсегментами + 2 спец-страницы.
5. **Блог — pillar** для информационных запросов и нейро-цитируемости.
6. **Gate на programmatic publish:** ServiceDistricts publish только
   при miniCase + ≥2 localFaq.
7. **`/foto-smeta/` и `/raschet-stoimosti/` — отдельные pillar.**
8. **E-E-A-T через `/avtory/<slug>/`.**
9. **Brand-cluster «4 в 1 услуги»** (7947 freq) **не получает отдельного
   URL** — это запрос на главную `/` (ADR-uМ-17).
10. **Порядок pillar в навигации** (новое v0.3, ADR-uМ-14):
    Вывоз мусора → Арбористика → Чистка крыш → Демонтаж.

---

## Корень

| URL | Цель | Pillar | wsfreq-якорь Wave 2 |
|---|---|---|---:|
| `/` | Главная: 4 услуги + оффер «порядок под ключ» + CTA «фото→смета» — поглощает brand-кластер «4 в 1 услуги» (ADR-17) | — | brand 7947 |
| `/o-kompanii/` | О компании, команда, СРО, лицензии | trust | — |
| `/kontakty/` | Контакты, реквизиты, мессенджеры (TG/MAX/WA), карта | trust | — |
| `/kak-my-rabotaem/` | Процесс: фото → смета → бригада → закрытие | trust | — |
| `/garantii/` | Гарантия + штрафы ГЖИ/ОАТИ на нас по договору | trust | — |
| `/foto-smeta/` | pillar v0.2 — посадочная под USP «фото→смета за 10 мин» | conversion | low-vol high-intent |
| `/raschet-stoimosti/` | pillar v0.2 — индекс 4 калькуляторов | conversion | — |
| `/sro-licenzii/` | СРО, Росприроднадзор, полигоны МО | trust/E-E-A-T | — |
| `/komanda/` | Команда: арбористы, бригадиры, эксперт B2B (E-E-A-T) | trust/E-E-A-T | — |
| `/avtory/` | Индекс авторов (для блога и кейсов) | E-E-A-T | — |
| `/avtory/<slug>/` | Каждый автор отдельно (~3–5 человек на старте) | E-E-A-T | — |

---

## Pillar 1: Вывоз мусора (`/vyvoz-musora/`)  ← новый #1 в IA (ADR-uМ-14)

Slug `vyvoz-musora` (canonical, в БД). **161 781 wsfreq** — самый
денежный pillar проекта.

| URL | Тип | В БД? | wsfreq head |
|---|---|---|---:|
| `/vyvoz-musora/` | pillar | seed | 102 789 (cluster 1) |
| `/vyvoz-musora/vyvoz-stroymusora/` | sub: строительный | seed | 10 284 |
| `/vyvoz-musora/kontejner/` | sub: с контейнером 8/20/27 м³ | гипотеза | 11 991 |
| `/vyvoz-musora/staraya-mebel/` | **новый v0.3** sub: мебель/хлам (ADR-uМ-16) | гипотеза | 4 957 + 539 |
| `/vyvoz-musora/krupnogabarit/` | **новый v0.3** sub: КГМ (ADR-uМ-16) | гипотеза | 750 |
| `/vyvoz-musora/gazel/` | **новый v0.3** sub: газель (ADR-uМ-16) | гипотеза | 1 453 |
| `/vyvoz-musora/vyvoz-sadovogo-musora/` | sub: садовый + листва | seed | 187 + 108 |
| `/vyvoz-musora/uborka-uchastka/` | sub: уборка участка | seed | (пересекается с arbo) |
| `/vyvoz-musora/vyvoz-porubochnyh/` | sub: порубочные остатки | гипотеза | 239 |
| `/vyvoz-musora/dlya-uk-tszh/` | sub: для УК/ТСЖ (B2B) | гипотеза | (cross-link с /b2b/) |

**Programmatic (sub × district):** 8 sub × 8 districts = **64 URL**
(было 4×7=28 в v0.2 → +36 URL).

```
/vyvoz-musora/<district>/                   × 8 (через ServiceDistricts)
/vyvoz-musora/vyvoz-stroymusora/<district>/ × 8
/vyvoz-musora/kontejner/<district>/         × 8
/vyvoz-musora/staraya-mebel/<district>/     × 8
/vyvoz-musora/krupnogabarit/<district>/     × 8
/vyvoz-musora/gazel/<district>/             × 8
/vyvoz-musora/vyvoz-sadovogo-musora/<district>/ × 8
/vyvoz-musora/uborka-uchastka/<district>/   × 8
/vyvoz-musora/vyvoz-porubochnyh/<district>/ × 8
```

**Outcompete priority:** ranks #1. Самый крупный wsfreq + самая широкая
sub-service tree.

---

## Pillar 2: Арбористика (`/arboristika/`)

База — кластер из [PROJECT_CONTEXT.md §4](../../team/PROJECT_CONTEXT.md).
Slug услуги в БД: `arboristika`. **27 589 wsfreq.**

| URL | Тип | В БД? | wsfreq head |
|---|---|---|---:|
| `/arboristika/` | pillar | seed | 1 099 (валка) + tail |
| `/arboristika/spil-derevev/` | sub: спил/удаление (ADR-13: slug `derevev`, без `i`) | seed | **11 228** + 7 937 (вырубка) |
| `/arboristika/kronirovanie/` | sub: обрезка/кронирование | seed | tail (info-cluster в blog) |
| `/arboristika/udalenie-pnya/` | sub: пни и остатки | seed | 398 (выкорчёвка) |
| `/arboristika/avariynyy-spil/` | sub: аварийный спил | seed | 320 |
| `/arboristika/sanitarnaya-obrezka/` | sub: санитарная обрезка | seed | tail |
| `/arboristika/raschistka-uchastka/` | **расширен v0.3** sub: расчистка + выравнивание + раскорчёвка (ADR-uМ-15) | гипотеза | **5 523** + tail |
| `/arboristika/spil-alpinistami/` | sub: альпинисты | гипотеза | tail |
| `/arboristika/spil-s-avtovyshki/` | sub: автовышка | гипотеза | tail |
| `/arboristika/valka-derevev/` | sub: валка частями | гипотеза | 1 099 + 24 |
| `/arboristika/udalenie-pod-lep/` | sub: под ЛЭП | гипотеза | tail (info) |
| `/arboristika/udalenie-na-kladbische/` | sub: на кладбище | гипотеза | tail |
| `/arboristika/raskorchevka/` | sub: раскорчёвка (cross-link с raschistka-uchastka) | гипотеза | tail |
| `/arboristika/izmelchenie-vetok/` | sub: измельчение веток | гипотеза | 727 |
| `/arboristika/vyvoz-porubochnyh/` | sub: вывоз порубочных | гипотеза | 239 |
| `/arboristika/kabling/` | sub: каблинг (растяжки) | гипотеза | tail |
| `/arboristika/pokos-travy/` | sub: покос травы | гипотеза | tail |
| `/arboristika/vyrubka-elok/` | sub: вырубка ёлок (сезон) | гипотеза | tail |

**Programmatic (sub × district):** 5 ключевых sub × 8 districts =
**40 URL** в Wave 1.

```
/arboristika/spil-derevev/<district>/   × 8
/arboristika/kronirovanie/<district>/    × 8
/arboristika/udalenie-pnya/<district>/   × 8
/arboristika/avariynyy-spil/<district>/  × 8
/arboristika/raschistka-uchastka/<district>/ × 8
```

**Pillar × district** (`/arboristika/<district>/`) для общего запроса
«арбористика [район]» — реализовано через ServiceDistricts (×8).

**Outcompete priority:** ranks #2 (см. § Outcompete priority). Прямой
удар по liwood.ru.

---

## Pillar 3: Чистка крыш (`/chistka-krysh/`)  ← переименовано (ADR-uМ-13)

Канон **`chistka-krysh`** (новый, ADR-uМ-13). В БД сейчас `ochistka-krysh`
— миграция через коллекцию Redirects (`/ochistka-krysh/* → /chistka-krysh/*`,
301), регенерация sitemap.xml. **888 wsfreq.**

| URL | Тип | В БД? | wsfreq head |
|---|---|---|---:|
| `/chistka-krysh/` | pillar | seed (под миграцию) | **888** |
| `/chistka-krysh/chistka-krysh-chastnyy-dom/` | sub: частный дом | seed (под миграцию) | tail |
| `/chistka-krysh/chistka-krysh-mkd/` | sub: МКД (для УК/ТСЖ) | seed (под миграцию) | tail |
| `/chistka-krysh/sbivanie-sosulek/` | sub: сосульки и наледь | seed (под миграцию) | tail |
| `/chistka-krysh/ot-snega/` | sub: от снега (общая) | гипотеза | tail (cluster 2 — info-сильный, 146 ключей) |
| `/chistka-krysh/uborka-territorii-zima/` | sub: зимняя уборка территории | гипотеза | tail |
| `/chistka-krysh/dogovor-na-sezon/` | sub: договор на сезон (B2B-крючок) | гипотеза | (cross-link с /b2b/) |

**Programmatic (sub × district):** 4 sub × 8 districts = **32 URL**.

```
/chistka-krysh/<sub>/<district>/   × 32
/chistka-krysh/<district>/         × 8 (через ServiceDistricts)
```

**Outcompete priority:** ranks #9 (низкий wsfreq, но обязателен для
4-в-1 позиционирования и B2B-конверсии зимой).

---

## Pillar 4: Демонтаж (`/demontazh/`)

Slug `demontazh` (canonical). **225 wsfreq.**

| URL | Тип | В БД? | wsfreq head |
|---|---|---|---:|
| `/demontazh/` | pillar | seed | 143 (дача) + 82 (баня) |
| `/demontazh/demontazh-dachi/` | sub: дача | seed | 143 |
| `/demontazh/demontazh-bani/` | sub: баня | seed | 82 |
| `/demontazh/demontazh-saraya/` | sub: сарай | seed | tail |
| `/demontazh/snos-doma/` | sub: дом | гипотеза | tail (но big SERP) |
| `/demontazh/snos-garazha/` | sub: гараж | гипотеза | tail |
| `/demontazh/snos-zabora/` | sub: забор | гипотеза | tail |
| `/demontazh/raschistka-uchastka/` | sub: расчистка под стройку | гипотеза | (cross-link с arbo) |

**Programmatic (sub × district):** 4 sub × 8 districts = **32 URL**.

> **Open Q-13 (Wave 2.5):** programmatic по материалу/объекту в стиле
> demontazhmsk.ru (`/demontazh/<material>/<object>/`)? Wave 2 wsfreq
> на demontazh = 225 (низкий) → **отложено до M3** (см. ADR-uМ-13 в
> decisions.md, переразмечен как ADR-uМ-19 на пересмотр).

---

## B2B-вертикаль (`/b2b/`) — без изменений с v0.2

Главный B2B-крючок проекта — «штрафы ГЖИ/ОАТИ на нас по договору».
**235 wsfreq** в Wave 2 (низкий, но интент жирный — каждый запрос =
real B2B-lead).

Сегменты + 2 спец-страницы + кейсы:

| URL | Цель | wsfreq head |
|---|---|---:|
| `/b2b/` | pillar: преимущества для бизнеса, штрафы на нас, договор | tail |
| `/b2b/uk-tszh/` | для УК и ТСЖ (главный B2B-сегмент) | 214 (247 ст УК РФ) + 21 |
| `/b2b/fm-operatoram/` | для FM-операторов | tail |
| `/b2b/zastrojschikam/` | для застройщиков (расчистка под стройку) | tail |
| `/b2b/goszakaz/` | госзаказ, 44-ФЗ/223-ФЗ | tail |
| `/b2b/dogovor-na-sezon/` | абонентский договор на сезон | tail |
| `/b2b/shtrafy-gzhi-oati/` | **уникальный B2B-крючок** (deep info+sales) | tail (но см. info-cluster в neuro-info) |
| `/b2b/dogovor/` | новое в v0.2 — что в нашем договоре, как штрафы переходят на нас | tail |
| `/b2b/kejsy/` | новое в v0.2 — индекс кейсов B2B | — |
| `/b2b/kejsy/uk-tszh/` | новое в v0.2 — кейсы по УК/ТСЖ | — |
| `/b2b/kejsy/zastrojschikam/` | новое в v0.2 — кейсы по застройщикам | — |
| `/b2b/kejsy/fm-operatoram/` | новое в v0.2 — кейсы по FM | — |

> **Closed:** Q-3 (B2B-программатик) и Q-5 (`/shtrafy-gzhi-oati/`
> дублирует) подтверждены на v0.3 — без изменений.

---

## Документы и техника (info-pillar)  ← обновлено v0.3 (ADR-uМ-18)

Кросс-категорийные info-страницы. **10 786 wsfreq** в pillar — третий по
размеру pillar. Аренда автовышки даёт 2384+633 freq (единственный sub
с явным гео-сигналом).

| URL | Цель | wsfreq head |
|---|---|---:|
| `/porubochnyj-bilet/` | как получить, сроки, мы помогаем оформить | tail (info) |
| `/promyshlennyj-alpinizm/` | направление промальпа (расширение арбо) | **2 415** |
| `/arenda-tehniki/` | индекс: измельчитель, автовышка, минитрактор, самосвал | — |
| `/arenda-tehniki/izmelchitel-vetok/` | sub | 1 760 + 1 091 + 167 = **3 018** |
| `/arenda-tehniki/avtovyshka/` | sub | 1 875 + 509 + 633 = **3 017** |
| `/arenda-tehniki/avtovyshka/<district>/` | **новое v0.3** programmatic ×8 (ADR-uМ-18) | 633 (москва) + tail |
| `/arenda-tehniki/minitraktor/` | sub | 280 |
| `/arenda-tehniki/samosval/` | sub | 1 083 |
| `/park-tehniki/` | новое в v0.2 — наш парк (E-E-A-T, по эталону stroj-musor.moscow) | — |

> **Closed:** Q-4 (аренда — индексная или подстраницы) — подстраницы по
> 4 техникам, без изменений.

---

## Гео-pillar `/raiony/`  ← 8-й район добавлен (Жуковский)

Комплексная страница района (4 услуги + локальная команда + кейсы).

| URL | Slug в БД | Wave 2 sanity | Приоритет publish |
|---|---|---|---|
| `/raiony/` | индекс районов (карта МО + список) | — | high |
| `/raiony/odincovo/` | `odincovo` | 14 KW в pool, 644 wsfreq — **сильный сигнал** | **#1** |
| `/raiony/krasnogorsk/` | `krasnogorsk` | 6 KW, нужен дозабор | high |
| `/raiony/mytishchi/` | `mytishchi` | 5 KW, нужен дозабор | high |
| `/raiony/khimki/` | `khimki` | 4 KW, нужен дозабор | high |
| `/raiony/pushkino/` | `pushkino` | 3 KW, нужен дозабор | high |
| `/raiony/ramenskoye/` | `ramenskoye` | 3 KW, нужен дозабор | high |
| `/raiony/istra/` | `istra` | 1 KW, **слабый сигнал** | **low** (после дозабора Wave 2.5) |
| `/raiony/zhukovskij/` | `zhukovskij` (новый) | 0 KW в pool, **очень слабый** | **low** (после Wave 2.5 дозабора по seed «спил/мусор/крыши/демонтаж жуковский») |

**Note для US-6 (`cw`):** Истра и Жуковский **в tree остаются** (8-й
пилот по обещанию оператора в legend), но текстовое наполнение и
publish-приоритет понижается — пишем в последнюю очередь, после
дозабора wsfreq в Wave 2.5. Это снимает риск Scaled Content Abuse от
gat publish для районов без явного спроса.

**Второй эшелон (волна 1.5):** Домодедово, Подольск, Королёв, Балашиха.

**Полное покрытие (волна 2+):** до ~74 локаций.

> **Closed:** Q-6 (`/raiony/<district>/` vs `/<district>/`) — подтверждён,
> без изменений.

---

## Кейсы (`/kejsy/`)

| URL | Цель |
|---|---|
| `/kejsy/` | индекс кейсов (фильтры: услуга, район, B2C/B2B) |
| `/kejsy/<slug>/` | каждый кейс отдельно (фото до/после, объект, цена факт) |

В seed уже есть один — `/kejsy/snyali-pen-gostitsa-2026/`. Кейсы
прокидываются в ServiceDistricts как miniCase (снимает гейт publish).

---

## Блог (`/blog/`)  ← темник Wave 2 от `re`

| URL | Цель |
|---|---|
| `/blog/` | индекс (фильтры: рубрика, теги, район) |
| `/blog/<slug>/` | статья |

**Норма по `re`:** 60–100 статей за первый год (медиана ~70).

**Темник Wave 2 (из `seosite/03-clusters/neuro-info.md`, 22 кластера,
7 947 wsfreq):**
- `kak-spilit-derevo-na-svoem-uchastke-zakon/` (47 ключей кластер 2 — большой info)
- `shtraf-za-spil-bez-razresheniya/` (info, нейро-цитируемый)
- `kogda-mozhno-obrezat-grushu-slivu/` (info-сезонник, кластер 3 + 7)
- `mozhno-li-szhigat-musor-na-uchastke/` (info, B2C, кластер 11)
- `kak-pravilno-sortirovat-musor/` (info, ESG-тренд, кластер 9)
- `nuzhno-li-platit-za-musor-esli-ne-prozhivaesh/` (УК/B2C-info, кластер 5)
- `rabota-na-vysote-s-kakoy-vysoty/` (B2B-info, кластеры 4/6/17/18/19)
- `porubochnyj-bilet-kak-poluchit/` (cross-link с pillar `tools-and-docs`)
- `kak-vybirat-arborista/` (commercial-info, по `re` темник Wave 1)
- `regulyatsiya/` (порубочный билет, штрафы ГЖИ/ОАТИ, нормативы)
- `sezony/` (что делать с деревом весной/осенью)
- `kejs-razbory/` (анализ сложных кейсов)
- `tseny/` («сколько стоит спил Московская область»)
- `tehnologii/` (валка частями, дробление пней, уборка снега техникой)

Рубрики реализуем тегами/категориями, не отдельным namespace в URL.

---

## Лендинги под Я.Директ (`/lp/`)

> **Closed:** Q-7 — `/lp/<campaign>/` + noindex (без изменений с v0.2).

---

## Сервисные / технические URL

| URL | Тип |
|---|---|
| `/sitemap.xml` | sitemap для Яндекса (auto-gen, фильтр draft+lp+admin) |
| `/robots.txt` | директивы (noindex для /lp/, /admin/, draft) |
| `/admin/` | Payload CMS |
| `/api/health` | health-check |
| `/api/health?deep=1` | health + Payload DB ping |

---

## Подсчёт URL — Волна 1 (пилот, **8 районов**)

| Группа | Кол-во URL | Δ vs v0.2 |
|---|---:|---:|
| Корень + новые pillar (`/foto-smeta/`, `/raschet-stoimosti/`, `/komanda/`, `/avtory/` + 3–5 авторов, `/park-tehniki/`) | ~13 | 0 |
| Pillar (4 услуги + B2B + блог + кейсы + раíëны + arenda-tehniki) | 9 | 0 |
| Sub-services (по 4 pillar) — добавлены 3 в `vyvoz-musora` (ADR-16) | ~33–38 | +3 |
| Programmatic service × district (8 sub vyvoz × 8 districts + 5 sub arbo × 8 + 4 sub krysh × 8 + 4 sub demontazh × 8) | 64 + 40 + 32 + 32 = **168** | +28 |
| Pillar × district (через ServiceDistricts) | 32 (4 × 8) | +4 |
| District-pillar (`/raiony/<district>/`) | 8 | +1 |
| **Programmatic арендa автовышки** (ADR-18) `/arenda-tehniki/avtovyshka/<district>/` × 8 | 8 | **+8** |
| B2B (pillar + 4 сегмента + 2 спец + 4 кейс-страницы) | 11 | 0 |
| Документы и техника | ~11 | 0 |
| Кейсы (стартовый пакет) | ~15 | 0 |
| Блог (стартовый пакет) | ~10–20 | 0 |
| **Итого Волна 1** | **~330–360** | **+50** |

## Подсчёт URL — Волна 1.5 (+5 городов второго эшелона)

| | |
|---|---:|
| +Programmatic (sub × district) | +130 |
| +Pillar × district | +20 |
| +District-pillar | +5 |
| +Аренда автовышки × district | +5 |
| **Итого волна 1.5** | **~490–520** |

## Подсчёт URL — Полное покрытие (~74 локации)

| | |
|---|---:|
| Programmatic (полный sub × district) | ~26 sub × 74 = ~1900 |
| Pillar × district | 4 × 74 = ~300 |
| District-pillar | 74 |
| Аренда автовышки × 74 | 74 |
| **Итого** | **~2350** |

> **Сравнение с лидерами (`re` Wave 1):**
> - liwood.ru: ~40 programmatic
> - musor.moscow: ~137 programmatic
> - obikhod.ru при полном покрытии: ~1900 programmatic = **×13.9 vs musor.moscow,
>   ×47.5 vs liwood**.

---

## Сводка principles → решения v0.3

| Принцип | Решение |
|---|---|
| Глубина URL ≤ 3 уровней | ✅ pillar / sub / district — максимум |
| Canonical slug из БД | ✅ + миграция `chistka-krysh` через Redirects (ADR-uМ-13) |
| Гео только под реальный выезд | ✅ Волна 1 = 8 пилотных (Истра/Жуковский — low-priority publish) |
| B2B — отдельная вертикаль | ✅ `/b2b/` + 5 сегментов + 2 спец + кейсы |
| Уникальный USP — отдельный pillar | ✅ `/foto-smeta/` |
| Калькуляторы — собранный pillar | ✅ `/raschet-stoimosti/` |
| E-E-A-T через авторов | ✅ `/avtory/<slug>/` |
| Блог как нейро-SEO pillar | ✅ `/blog/` плоский, темник Wave 2 |
| Programmatic с гейтом publish | ✅ miniCase + ≥2 localFaq |
| Лендинги Директа отдельно | ✅ `/lp/<campaign>/` + noindex |
| **Порядок pillar в IA — под wsfreq** (новое v0.3) | ✅ Мусор → Арбо → Крыши → Демонтаж (ADR-uМ-14) |
| **Brand-кластер «4 в 1» — на главной** (новое v0.3) | ✅ без отдельного URL (ADR-uМ-17) |
| **Поглощение orphan «выравнивание»** (новое v0.3) | ✅ `/arboristika/raschistka-uchastka/` (ADR-uМ-15) |

---

## Принципы slug-генерации (без изменений с v0.2)

1. Транслит без диакритики и спорных букв.
2. Базовые корни — каноничны в БД (исключение — `chistka-krysh` через миграцию).
3. Sub-service slug — 2–3 слова через дефис.
4. District slug — устоявшееся транслит-имя из БД.
5. Без trailing -1, -2, -msk в URL.
6. Без `.html`-расширений.
7. Английские identifiers только в коде, в URL — транслит.

---

## Открытые вопросы для оператора (после v0.3)

| # | Вопрос | Гипотеза `seo1` | Статус |
|---|---|---|---|
| 1 | `/tseny/` отдельной страницей? | Нет, цены on-page | ✅ закрыт `re` |
| 2 | `ochistka-krysh` или `chistka-krysh`? | **chistka-krysh** (888 vs 0 freq) | ✅ закрыт ADR-uМ-13 |
| 3 | B2B-программатик `/b2b/uk-tszh/<service>/`? | Не в Wave 1 | ✅ закрыт `re` |
| 4 | Аренда техники — индексная или подстраницы? | Подстраницы | ✅ закрыт `re` |
| 5 | `/shtrafy-gzhi-oati/` дублирует B2B-версию? | Свернули | ✅ закрыт v0.2 |
| 6 | `/raiony/<district>/` vs `/<district>/`? | `/raiony/<district>/` | ✅ закрыт ADR-02 |
| 7 | `/lp/<campaign>/` для Директа? | Да, отдельно + noindex | ✅ закрыт ADR-05 |
| 8 | `/foto-smeta/` как отдельный pillar? | Да | ✅ закрыт ADR-08 |
| 9 | 4 калькулятора — где жить? | Pillar `/raschet-stoimosti/` | ✅ закрыт ADR-09 |
| 10 | `/avtory/<slug>/` для E-E-A-T? | Да, 3–5 авторов | ✅ закрыт ADR-10 |
| 11 | B2B расширение `/b2b/dogovor/` + кейсы? | Да | ✅ закрыт ADR-11 |
| 12 | `/msk/`-сегмент для расширения? | Резерв | ✅ закрыт ADR-12 |
| 13 | demontazh × material/object programmatic? | После M3 | 🟡 ждёт Wave 2.5 / прод-фактов |
| **14** | **Новый порядок pillar в IA** (Мусор → Арбо → Крыши → Демонтаж) под wsfreq? | **Да, ADR-uМ-14** | **✅ APPROVED оператором 2026-04-25 (вечер)** |
| 15 | Поглощение orphan «выравнивание участка» 5523 freq? | В `/arboristika/raschistka-uchastka/` | ✅ закрыт ADR-uМ-15 |
| 16 | 3 новых sub в `/vyvoz-musora/` (мебель/газель/КГМ)? | Да | ✅ закрыт ADR-uМ-16 |
| 17 | Brand-pillar `/4-v-1-uslugi/`? | Нет, на главной | ✅ закрыт ADR-uМ-17 |
| 18 | Programmatic district для аренды автовышки? | Да, ×8 | ✅ закрыт ADR-uМ-18 |

**Все 18 вопросов закрыты.** Q-14 ✅ APPROVED оператором 2026-04-25 (вечер).
Sitemap-tree v0.4 разблокирует US-5 (`seo2` — full-sitemap-IA + tech-SEO).

---

## Hand-off

### → US-5 (`seo2` — full-sitemap-ia + tech-SEO)

Что нужно добавить/уточнить в US-5 на основе v0.3:

1. **`sitemap.xml` auto-generation:**
   - Фильтр draft + `/lp/*` + `/admin/*` + `/api/*`.
   - priority по wsfreq pillar:
     - `/vyvoz-musora/` priority=1.0
     - `/arboristika/` priority=0.9
     - `/chistka-krysh/` priority=0.7 (после миграции slug)
     - `/demontazh/` priority=0.6
     - sub-services priority=0.6–0.8 в зависимости от wsfreq
     - programmatic district priority=0.5 (после publish-gate)
   - lastmod из CMS (Payload `updatedAt`).
   - changefreq: pillar=weekly, sub=monthly, district=monthly,
     blog=weekly.

2. **`robots.txt`:**
   - `Disallow: /admin/`, `/api/`, `/lp/`.
   - Host: `obikhod.ru`.
   - Sitemap: `https://obikhod.ru/sitemap.xml`.

3. **Миграция slug `ochistka-krysh` → `chistka-krysh` (ADR-uМ-13):**
   - Payload migration: `ALTER` slug у Service + sub-services
     (Service `ochistka-krysh` → `chistka-krysh`; sub: `chistka-krysh-chastnyy-dom`,
     `chistka-krysh-mkd`, `sbivanie-sosulek` остаются + `chistka-krysh-ot-snega`,
     `chistka-krysh-uborka-territorii-zima`, `chistka-krysh-dogovor-na-sezon`
     добавить в seed).
   - Коллекция Redirects: regex/glob правила
     `^/ochistka-krysh(/.*)?$ → /chistka-krysh$1` (301).
   - Регенерация sitemap.xml после миграции.
   - Обновить `site/app/api/seed/route.ts`.
   - QA — `qa1`: проверить 301 не сломал prod-ссылки + Я.Метрика
     цели не потеряны.

4. **Canonical-теги** на programmatic-страницах: `<link rel="canonical">`
   на основной URL (без UTM, без trailing slash variants).

5. **Hreflang:** не используем (РФ-only, ru-RU единственный).

6. **Schema.org:**
   - `LocalBusiness` на `/`, `/kontakty/`, `/raiony/<district>/`.
   - `Service` на pillar и sub-services.
   - `FAQPage` где есть localFaq в ServiceDistricts.
   - `Person` на `/avtory/<slug>/` (E-E-A-T).
   - `BreadcrumbList` везде.

### → US-6 (`cw` — content production)

Порядок написания текстов **под wsfreq priority**:

**Спринт 1 (3 недели):**
1. `/vyvoz-musora/` (102K freq) ← главный денежный pillar
2. `/vyvoz-musora/odincovo/` (644 freq, единственный district с явным
   сигналом)
3. `/arboristika/spil-derevev/` (11K freq)
4. `/arboristika/spil-derevev/odincovo/` (district-pilot)
5. `/foto-smeta/` (USP, низкий volume но high-intent)
6. `/` (главная, brand-кластер «4 в 1 услуги» 7947 freq)

**Спринт 2 (2 недели):**
7. `/vyvoz-musora/<остальные 7 districts>/` (без явного wsfreq, но
   pillar-magnet)
8. `/vyvoz-musora/staraya-mebel/` (4957) + `/vyvoz-musora/kontejner/`
   (11991) + `/vyvoz-musora/vyvoz-stroymusora/` (10284)
9. `/arboristika/raschistka-uchastka/` (5523) — поглощает orphan
10. `/arboristika/<остальные 4 sub × 7 districts>/`

**Спринт 3 (2 недели):**
11. `/b2b/` + `/b2b/shtrafy-gzhi-oati/` + `/b2b/dogovor/` (B2B-крючок)
12. `/raschet-stoimosti/` + 4 sub-калькулятора
13. `/chistka-krysh/` + 4 sub × 8 districts (32 URL, последний приоритет
    из 4 услуг по wsfreq)
14. `/demontazh/` + 4 sub × 8 districts

**Спринт 4 (2 недели):**
15. `/promyshlennyj-alpinizm/` (2415 freq)
16. `/arenda-tehniki/avtovyshka/` + 8 districts (3017 freq)
17. `/arenda-tehniki/izmelchitel-vetok/` (3018 freq) +
    `/arenda-tehniki/samosval/` (1083) + `/arenda-tehniki/minitraktor/` (280)
18. Блог seed — 10 статей по темнику Wave 2 (priority — info-cluster
    «как спилить дерево по закону» 47 ключей).

**Истра + Жуковский:** publish последними в каждом спринте, текст
короче (стандарт ServiceDistricts), помечается «обновляется» до
дозабора Wave 2.5.

**TOV-якори (immutable из CLAUDE.md):** «обиход», «хозяйство», «объект»,
«порядок», «сделаем», «приедем», «12 800 ₽ за объект». Запрещены:
«услуги населению», «имеем честь», «от 1 000 ₽», «в кратчайшие сроки»,
«индивидуальный подход».

### → US-7 (`seo2` — audit + Я.Вебмастер)

Что мерить после publish (первые 90 дней):

1. **CTR / impressions из Я.Метрики:**
   - Главная: CTR верхней навигации pillar (если ADR-14 утверждён —
     должно быть Vyvoz > Arbo > Krysh > Demontazh). Если порядок CTR
     не соответствует — сигнал на пересмотр ADR-14.
   - Pillar-страницы по wsfreq priority: vyvoz-musora должен прийти
     #1 по impressions / clicks.
2. **Я.Вебмастер:**
   - Разделение sitemap.xml по pillar (4 sitemap-файла или
     один с приоритетами — обсудить с `seo2`).
   - Гео-привязка: Москва+МО (один регион).
   - Мониторинг 301 после миграции `ochistka-krysh` → `chistka-krysh`
     (через Я.Вебмастер «изменение URL» инструмент).
3. **Programmatic publish-gate:**
   - Каждый ServiceDistricts publish только если miniCase + ≥2 localFaq.
   - QA по `qa1`: random-sample 10 districts, проверить уникальность.
4. **Дозабор wsfreq Wave 2.5:**
   - Восстановление JM (`info`-ping → 200) → запустить
     `seosite/scripts/jm_wsfreq_micro.py` на 1400 ключей с freq=0.
   - После — пересчёт priority в sitemap.xml.
   - **Q-14 пересмотр** в M3.

---

## Что блокирует Wave 2.5 / M3

1. **Дозабор wsfreq** для оставшихся 1400 ключей через
   `seosite/scripts/jm_wsfreq_micro.py` — после восстановления JM.
2. **Полная JM-кластеризация** через `jm_cluster_batched.py` (заменит
   локальный fallback на TOP-10 SERP signal — точнее по cannibalization
   risk).
3. **Решение оператора по Q-14** — порядок pillar в IA.
4. **Темник блога** — Wave 2 уже даёт 22 кластера в neuro-info, темник
   передан в US-6 (см. § Hand-off).

---

## Источники

- [seosite/03-clusters/_summary.json](../03-clusters/_summary.json)
  (Wave 2 итоги: clusters, keywords, freq по 7 pillar)
- [seosite/03-clusters/_q2_signal.json](../03-clusters/_q2_signal.json)
  (888 vs 0 — обоснование ADR-uМ-13)
- [seosite/03-clusters/_sanity-checks.md](../03-clusters/_sanity-checks.md)
  (sanity по 8 пилотным районам, статус Истра/Жуковский)
- [seosite/03-clusters/vyvoz-musora.md](../03-clusters/vyvoz-musora.md)
  (97 кластеров, 161K freq — главный денежный pillar)
- [seosite/03-clusters/arboristika.md](../03-clusters/arboristika.md)
  (38 кластеров, 27K freq — pillar #2)
- [seosite/03-clusters/chistka-krysh.md](../03-clusters/chistka-krysh.md)
  (Q-2 ANSWER + 8 кластеров)
- [seosite/03-clusters/demontazh.md](../03-clusters/demontazh.md)
  (7 кластеров, 225 freq)
- [seosite/03-clusters/b2b.md](../03-clusters/b2b.md)
  (26 кластеров, 235 freq)
- [seosite/03-clusters/tools-and-docs.md](../03-clusters/tools-and-docs.md)
  (28 кластеров, 10K freq — аренда + промальп)
- [seosite/03-clusters/neuro-info.md](../03-clusters/neuro-info.md)
  (22 кластера, 7947 freq — brand «4 в 1» + темник блога)
- [seosite/03-clusters/orphans.md](../03-clusters/orphans.md)
  (3 ключа orphan, freq=0 — оставлены вне URL-tree)
- [seosite/02-keywords/normalized.csv](../02-keywords/normalized.csv)
  (1601 ключ × 7 pillar × intent × cluster)
- [seosite/01-competitors/ia-patterns.md](../01-competitors/ia-patterns.md)
  (Wave 1 от `re`, 15 доменов)
- [seosite/01-competitors/shortlist.md](../01-competitors/shortlist.md)
  (матрица 14 живых конкурентов)
- [team/PROJECT_CONTEXT.md](../../team/PROJECT_CONTEXT.md) §4
  (каталог услуг), §5 (география)
- [CLAUDE.md](../../CLAUDE.md) (immutable, roadmap)
- `site/app/api/seed/route.ts` (canonical slug — миграция `chistka-krysh`)
- `site/src/payload.config.ts` + `site/src/collections/` (Services,
  ServiceDistricts, Districts, Cases, Blog, B2BPages, Redirects)
- [seosite/04-url-map/decisions.md](decisions.md) — ADR 01–18
