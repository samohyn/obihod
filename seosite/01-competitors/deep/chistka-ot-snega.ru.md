---
domain: chistka-ot-snega.ru
pillar: крыши
audit_status: pending
last_audit_date: pending
audit_method: pending
source_keys_so: pending
source_topvisor: pending
ia_score: 0
benchmark_phase: W3-baseline
---

# chistka-ot-snega.ru

> **STUB-профиль.** Создан 2026-05-01 для W3 baseline. Live audit запланирован на W3.
>
> **Контекст:** единственный явный конкурент в нашем pillar «крыши» (помимо liwood.ru `/services/promyshlennyy-alpinizm/ochistka-krysh-ot-snega/` где это sub-услуга промальпа). EMD-домен — потенциальный лидер по `чистка от снега`.

## Зона силы (гипотеза)

pending live audit W3 — чистка крыш от снега, зимняя сезонность, B2B УК/ТСЖ (кто отвечает за крышу).

### Prima facie hypothesis (W2 ahead-of-audit)

- EMD `chistka-ot-snega.ru` — точное соответствие фразы «чистка от снега» в URL.
  Pillar `chistka-krysh` в нашем семядре имеет 888 wsfreq vs `vyvoz-musora`
  161 781 — узкая, но конкурентная семантика; EMD-домен здесь — реальная
  угроза в зимний сезон.
- Гипотеза: peak-сезон ноябрь–март, в межсезонье страница-pillar на B2C-канале
  тише; B2B-клиенты (УК) держат подрядчика по договору на год → конкурент,
  скорее всего, гнёт B2B-стратегию.

### Топ-3 гипотез

1. `hypothesis` — sub-структура методов (промальп / автовышка / лестница /
   ручная / механизированная) — копируем как sub-кластер для нашего
   `chistka-krysh`; уже учли в seed.ts расширении (chistka-krysh-ot-snega,
   chistka-krysh-uborka-territorii-zima, chistka-krysh-dogovor-na-sezon).
2. `hypothesis` — B2B-договор на сезон с УК/ТСЖ как primary CR — копируем
   `dogovor-na-sezon` sub + усиливаем «штрафы ГЖИ берём на себя» (наш USP).
3. `hypothesis` — зимний контент-календарь (что делать после снегопада, как
   готовить кровлю к зиме, законодательство МО по сосулькам) — нейро-формат
   для блога, в US-1 cornerstone-статья «Чистка крыш зимой по нормативу МО».

## URL-объём

| Категория | URL у конкурента | Наш план к W14 |
|---|---:|---:|
| Всего в sitemap.xml | pending | ~250 |
| Pillar (крыши) | pending | 1 (chistka-krysh) |
| Sub-services (механизированная / ручная / абонентское / альпинистами) | pending | 6 |
| Programmatic SD | pending | ~24 |
| Blog | pending | 30 |
| B2B УК/ТСЖ | pending | 10 |

## Ключевые слова

pending live audit W3 — зимняя сезонность, peak в Я.Wordstat ноябрь-март.

## Контент-следы

pending live audit W3.

## Что копируем (гипотеза)

- Sub-services крыш (методы: альпинисты / лестница / механизированная)
- B2B-крючки УК/ТСЖ (договор, абонентское обслуживание на сезон)
- Зимний сезонный контент (что делать с наледью, сосульками, безопасность)

## Что превосходим (гипотеза)

- 4-в-1 (у них только крыши, у нас крыши + мусор + арбо + демонтаж — летом / межсезонье клиент остаётся с нами)
- E-E-A-T авторы
- «Штрафы ГЖИ берём на себя» B2B-крючок (мы единственные кто это делает по договору)
- Programmatic 6 sub × 8 районов = 48 SD

## Риски

- **R-mid:** EMD-эффект, в зимний сезон могут вытеснять нас в топ-1. Mitigation: глубина sub + локальная привязка по districts + B2B-преимущество.

## TODO для live audit (W3)

- [ ] sitemap.xml fetch + count URL
- [ ] **EMD-эффект** — позиция по «чистка от снега крыш» в Я.Москва+МО
- [ ] Зимняя сезонность — есть ли календарь / лендинги под сезон
- [ ] B2B-блок — формат договоров, штрафы ГЖИ
- [ ] Keys.so export топ-100 ключей в Я.Москва+МО (особенно сезонные)
- [ ] Manual IA-скан главной + 3 random URL → screenshots
- [ ] Schema-coverage (LocalBusiness?, Service?, FAQPage?)
- [ ] Заполнить все «pending» поля

---

## Δ от Stage 2 W11 (refresh 2026-05-03)

- **URL count:** **no live measure** (ECONNREFUSED). W11 hypothesis sustained ~50.
- **Notable:** EMD-домен «чистка-от-снега», B2B-focused.
- **Schema-coverage:** sustained hypothesis.
- **CTA / pricing:** sustained.
- **W14 implication:** **honest flag — no W14 measure**, sustained от W11.
