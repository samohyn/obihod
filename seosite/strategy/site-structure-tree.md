# Структура сайта obikhod.ru — дерево

Снимок: 2026-05-11. Источник: роуты `site/app/` + живой `sitemap.xml` (283 URL).

```
obikhod.ru
│
├─ /                                    ← главная
│
├─ /uslugi/                             ← хаб всех услуг (T1)
│  └─ tseny/                            ← мега-хаб цен
│     ├─ vyvoz-musora/
│     ├─ arboristika/
│     ├─ chistka-krysh/
│     ├─ demontazh/
│     ├─ uborka-territorii/
│     ├─ dizain-landshafta/
│     ├─ arenda-tehniki/
│     ├─ promyshlennyj-alpinizm/
│     ├─ porubochnyj-bilet/
│     ├─ foto-smeta/
│     └─ raschet-stoimosti/
│
├─ /vyvoz-musora/                       ← PILLAR
│  ├─ vyvoz-stroymusora/                ┐
│  ├─ vyvoz-sadovogo-musora/            │
│  ├─ uborka-uchastka/                  │
│  ├─ staraya-mebel/                    ├─ под-услуги (T3) ×9
│  ├─ gazel/                            │
│  ├─ kontejner/                        │
│  ├─ krupnogabarit/                    │
│  ├─ vyvoz-porubochnyh/                │
│  ├─ dlya-uk-tszh/                     ┘
│  └─ {city}/  ← SD по городам ×30      (balashikha … krasnoznamensk)
│
├─ /arboristika/                        ← PILLAR
│  ├─ spil-derevev/  kronirovanie/  udalenie-pnya/  avariynyy-spil/
│  ├─ sanitarnaya-obrezka/  izmelchenie-vetok/  kabling/  raschistka-uchastka/
│  ├─ spil-alpinistami/  spil-s-avtovyshki/  valka-derevev/  vyrubka-elok/   (T3 ×12)
│  └─ {city}/  ← SD ×30
│
├─ /chistka-krysh/                      ← PILLAR
│  ├─ chistka-krysh-chastnyy-dom/  chistka-krysh-mkd/  sbivanie-sosulek/
│  ├─ ot-snega/  uborka-territorii-zima/  dogovor-na-sezon/                  (T3 ×6)
│  └─ {city}/  ← SD ×30
│
├─ /demontazh/                          ← PILLAR
│  ├─ demontazh-dachi/  demontazh-bani/  demontazh-saraya/
│  ├─ snos-doma/  snos-garazha/  snos-zabora/                                (T3 ×6)
│  └─ {city}/  ← SD ×30
│
├─ /uborka-territorii/                  ← PILLAR (опубликован, под-услуг пока нет)
│
├─ /dizain-landshafta/                  ← PILLAR
│  └─ proekt-uchastka/  posadka-rasteniy/  gazon-i-poliv/
│     osvescheniye-uchastka/  moshchenie-i-dorozhki/                         (T3 ×5)
│
├─ /arenda-tehniki/                     ← услуга
│  ├─ avtovyshka/  izmelchitel-vetok/  minitraktor/  samosval/               (T3 ×4)
│  └─ {city}/  ← SD ×4  (krasnogorsk, mytishchi, odincovo, ramenskoye)
│
├─ /promyshlennyj-alpinizm/             ← услуга-лендинг
├─ /porubochnyj-bilet/                  ← услуга-лендинг
├─ /foto-smeta/                         ← услуга-лендинг
├─ /raschet-stoimosti/                  ← услуга-лендинг
│
├─ /raiony/                             ← список районов
│  └─ {city}/  ← страница района ×30
│
├─ /kejsy/                              ← список кейсов
│  └─ {slug}/  ← кейс ×16
│
├─ /blog/                               ← список статей
│  └─ {slug}/  ← статья ×26
│
├─ /b2b/                                ← хаб B2B
│  └─ uk-tszh/  zastrojschikam/  fm-operatoram/  goszakaz/
│     dogovor/  dogovor-na-sezon/  shtrafy-gzhi-oati/   (+ артефакты: b2b/, kejsy/)
│
├─ /avtory/                             ← список авторов (E-E-A-T)
│  └─ {slug}/  ← карточка автора (в sitemap 1, в сиде ~5)
│
├─ /kalkulyator/
│  └─ foto-smeta/                       ← приложение «фото → смета» (Claude API)
│
├─ ─── trust / о компании ───
│  ├─ /o-kompanii/
│  ├─ /garantii/
│  ├─ /kak-my-rabotaem/
│  ├─ /kontakty/
│  ├─ /otzyvy/
│  ├─ /komanda/         ⚠ роут есть, в sitemap нет
│  ├─ /park-tehniki/    ⚠ роут есть, в sitemap нет
│  └─ /sro-licenzii/    ⚠ роут есть, в sitemap нет
│
├─ ─── служебное / SEO ───
│  ├─ /sitemap.xml   /robots.txt   /llms.txt   /llms-full.txt
│  ├─ /indexnow/{keyfile}     /og/*
│  └─ redirects: /ochistka-krysh/* → /chistka-krysh/* · /arboristika/spil/ → …/spil-derevev/ · /{pillar}/ramenskoe/ → …/ramenskoye/
│
├─ ─── /admin/ (Payload CMS) ───
│  ├─ /admin/[[...segments]]   ← основная админка
│  ├─ /admin/catalog
│  └─ /admin/login/2fa
│
└─ ─── /api/ ───
   ├─ публичные:  /api/leads   /api/rum   /api/fal/generate   /api/health
   │              /api/revalidate   /api/preview*   /api/exit-preview   /api/seed
   ├─ Payload:    /api/[...slug]   /api/graphql   /api/graphql-playground
   ├─ Telegram:   /api/telegram/webhook
   └─ /api/admin/: audit/[id]  audit  auth/2fa-*(6)  leads/count  leads/utm-sources
                   media/orphans  page-catalog/csv  search
```

## Итого по объёму (live sitemap, 283 URL)

| Раздел | Кол-во |
|---|---|
| Главная | 1 |
| Услуги (pillar/landing roots) | 11 |
| Страницы цен (`/uslugi/tseny/…`) | 12 (1 хаб + 11) |
| Под-услуги T3 | 42 (vyvoz 9 + arbo 12 + chistka 6 + demontazh 6 + landshaft 5 + arenda 4) |
| SD-страницы по городам T4 | 124 (arbo 30 + chistka 30 + demontazh 30 + vyvoz 30 + arenda 4) |
| Районы | 31 (1 + 30) |
| Блог | 27 (1 + 26) |
| Кейсы | 17 (1 + 16) |
| B2B | 10 (1 + 9) |
| Авторы | 2 (1 + 1) |
| Trust / конверсия | 6 (`o-kompanii`, `garantii`, `kak-my-rabotaem`, `kontakty`, `otzyvy`, `kalkulyator/foto-smeta`) |
| **Всего** | **283** |

## Города (30, МО)

Class A: balashikha, mytishchi, ramenskoye, odincovo, krasnogorsk, podolsk, khimki, korolyov, lyubertsy, elektrostal, reutov, dolgoprudnyj.
Class B: istra, pushkino, zhukovskij, serpukhov, sergiev-posad, noginsk, orekhovo-zuevo, dmitrov, chekhov, vidnoe, domodedovo, voskresensk, klin, shchelkovo, lobnya, kotelniki, fryazino, krasnoznamensk.

## Несостыковки на момент снимка

1. **CLAUDE.md говорит «5 pillar», в проде 6** (добавлен `dizain-landshafta` 2026-05-10) + ещё 5 услуг-лендингов в коллекции `services` (`arenda-tehniki`, `promyshlennyj-alpinizm`, `porubochnyj-bilet`, `foto-smeta`, `raschet-stoimosti`). `uborka-territorii` сделан pillar'ом вместо ожидавшегося в `02-url-map.json`.
2. **`uborka-territorii` опубликован без под-услуг** — pillar есть, контента под ним нет.
3. **`/b2b/b2b/` и `/b2b/kejsy/`** в sitemap — похоже на кривые слаги в данных B2BPages, стоит проверить.
4. `/komanda/`, `/park-tehniki/`, `/sro-licenzii/` — роуты живут в `app/(marketing)/`, но в sitemap отсутствуют (не опубликованы / выключены).

## Шаблоны URL (для справки)

- Pillar: `/{service}/`
- Под-услуга: `/{service}/{sub}/`
- SD (услуга × город): `/{service}/{city}/`  ← плоский, 2 уровня; роут `app/(marketing)/[service]/[slug]/page.tsx` обслуживает и под-услуги, и SD
- Цены: `/uslugi/tseny/` и `/uslugi/tseny/{service}/`
- Район: `/raiony/{city}/`
- Блог / Кейс / B2B / Автор: `/blog/{slug}/`, `/kejsy/{slug}/`, `/b2b/{slug}/`, `/avtory/{slug}/`
