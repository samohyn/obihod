# Pitfalls Research

**Domain:** Cross-competitor benchmark + monitoring + roadmap unification on top of running 5-pillar lead-gen site (obikhod.ru, 174+ URL prod, 9-role Scrum, Next 16 + Payload 3 + Beget VPS)
**Researched:** 2026-05-15
**Confidence:** HIGH (на 90% базируется на внутренних артефактах — B2 benchmark / overtake-roadmap / ADR-0017/18/20/21 / WORKFLOW; на 10% — на validated indust mistakes у Bitrix-2018-конкурентов из contex/01)

## Контекст и scope

Этот milestone **не зелёное поле**, а brownfield-надстройка над уже запущенной системой:

- **Что нельзя сломать:** 5 LEAD / 1 PARITY / 2 LAG vs liwood (ADR-0017 schema +50pp, photo→quote USP, E-E-A-T 4 авторов, mobile-first brand-guide v2.3).
- **Что нельзя обойти:** brand-guide-first, spec-before-code, green CI, qa real-browser smoke, merge = qa + po + CI green, 152-ФЗ / РФ-юрисдикция, protect-secrets / protect-immutable хуки.
- **Что нельзя задублировать:** 9 OVT-* US (`seosite/.../overtake-roadmap-2026-05.md`), EPIC-SEO-COMPETE-3 US-2..11, «Обиход 2.0» 4 эпика.
- **Что нельзя добавить:** Tilda/WP/Bitrix, магазин саженцев (ADR-0020), Vercel, финтех-следы.

Каждая pitfall ниже привязана либо к iron rule, либо к Out of Scope из `.planning/PROJECT.md`.

---

## Critical Pitfalls

### Pitfall 1: Каннибализация контента при расширении benchmark с 1 → 3 конкурентов и сведении 3 leverage-points в один roadmap

**What goes wrong:**

При расширении benchmark на arboristik.ru и arborist.su команда генерирует новые pillar/sub-страницы под их кластеры (например, `/arboristika/arboristik-style-tseny/` зеркально под mega-прайс arboristik), которые **семантически дублируют** уже опубликованные T2/T3 страницы Обихода. Происходит каннибализация: Yandex/Google не понимают, какой из URL ранжировать, оба теряют позиции, и **5 LEAD из B2 benchmark откатываются к PARITY**.

Дополнительно: при наивном merge 3 benchmarks в один roadmap получается «гибрид» из несовместимых стратегий — arboristik «4-в-1 от 1000 ₽», arborist.su «нишевый эксперт», liwood «комплексный 17 услуг». Если roadmap бездумно перекладывает 3 best practices в одно place, **USP photo→quote AI размывается** copy-нарративом «и у нас тоже всё дёшево, как у arboristik» (что прямо противоречит «Caregiver + Ruler» Immutable из CLAUDE.md).

**Why it happens:**

- B2/B3/B5 уже был построен под одного противника (liwood); при добавлении 2 ещё противников tempting расширить роадмап addition-style («у того тоже есть X — давайте сделаем»), не subtraction-style («что из 3 leverages дополняет наш existing 5 LEAD, а что — заменяет»).
- ADR-0018 уже зафиксировал URL-map (5 pillar + 35 sub + ~211 SD); любые «зеркальные» новые URL под слова конкурентов нарушают этот lockdown — но команда может не сверить с ADR-0018 §13 SEO-правилами.
- copywriter (cw) под давлением «обогнать 3 разом» теряет TOV-фильтр Caregiver+Ruler и берёт фразы от arboristik (демпинг) или arborist.su (нишевая риторика).

**How to avoid:**

- **Phase B1 (benchmark capture) — закрепить subtraction-rule:** каждая leverage-point из benchmark arboristik/arborist.su проходит через 3-фильтр:
  1. Дополняет ли существующее LEAD (если да → marketing-angle, не новый URL)?
  2. Закрывает ли LAG (B2B/local) или PARITY (URL/IA)?
  3. Создаёт ли каннибализацию по ADR-0018 §13?
- **Phase B5 (cross-roadmap)** — обязательная сводная **canniba-matrix** «новые URL × existing URL» с проверкой через `pnpm lint:schema` + manual SERP intent check (lead-intent vs informational-intent vs pricing-intent). Любой row с >70% lexical/intent overlap = **reject новый URL → расширить existing**.
- **Iron rule «brand-guide-first»** распространяется на copy: cw перед публикацией текста сверяется с `design-system/brand-guide.html` §1-14 TOV. **Анти-паттерн словарь** (демпинг «от X ₽», нишевый «спец по дереву») фиксируется в C2/C3 acceptance criteria.
- **Cross-competitor roadmap (REQ ROADMAP-CROSS-01)** = объединение **leverage-points**, не URL и не страниц. Output — список новых US с RICE, каждая ссылается на existing OVT-N или US-N или **explicitly создаёт новую** с явной cross-link с ADR-0018.

**Warning signs:**

- Новая US в backlog со словом «зеркальный» / «как у arboristik» / «копируем структуру».
- В B5 roadmap появляются >2 новых T3 sub под существующий pillar без обновления ADR-0018.
- cw присылает copy с фразой «от 1000 ₽» или «лидер рынка арбористики» — индикатор слива в TOV конкурента.
- Topvisor weekly показывает дрифт позиций existing URL вниз после publication новых URL в том же кластере (это сигнал каннибализации, фиксируем в OVT-MONITOR threshold).

**Phase to address:**

- **Phase B1 (benchmark capture):** define subtraction-rule per leverage в template benchmark axes.
- **Phase B5 (cross-roadmap merge):** cannibalisation matrix как **hard gate** перед apruv'ом roadmap.
- **Phase Execution (per US):** spec.md acceptance criteria включает «canonical check vs ADR-0018» + TOV анти-паттерн словарь.

---

### Pitfall 2: Watcher эфемерности — multi-target monitoring отваливается без алерта

**What goes wrong:**

OVT-MONITOR расширяется с 1 → 3 конкурентов (REQ MONITOR-3X-01). На вторую неделю watcher.ts начинает silently ломаться по 4-5 причинам:

1. **WebFetch / fetch упирается в robots.txt** одного из конкурентов (arborist.su часто имеет агрессивный `Disallow: /sitemap.xml` или WAF на User-Agent без браузерных headers) → метрики приходят `null`, threshold не triggered, **false-negative** «всё ок».
2. **Rate-limit** при последовательной fetch 3 сайтов × N URL (например, JSON-LD coverage check по 50 sub-страницам). Bitrix-2018 у liwood даёт 429/503 при >5 req/s; arboristik.ru — CloudFlare с challenge → fetch hang.
3. **Cron в UTC vs Москва** — GitHub Actions cron всегда UTC; команда настраивает `0 6 * * 1` думая «понедельник утром МСК», получает воскресенье 09:00 МСК. Алерты приходят когда оператор спит / в выходной — пропускаются.
4. **Snapshot drift между Москвой и серверным runner'ом** — обновления конкурентов могут пушиться вечером МСК, а snapshot снимается до этого, расхождение sustained 3-7 дней.
5. **False-positive alerts** при HTML re-render — Bitrix-2018 у liwood может менять HTML class names при cache rebuild без content change, naïve `diff html` алертит, реальных изменений нет → команда учится игнорировать алерт → реальные изменения тоже игнорируются.

**Why it happens:**

- OVT-MONITOR build'ился под одного конкурента liwood (sustained 2026-05-09 в EPIC-LIWOOD-OVERTAKE), там robots.txt дружелюбный, cron окно стабильно. Опыт «одного watcher'а» не масштабируется автоматически.
- Команда не знает про специфику GitHub Actions cron (UTC) и про MSK-офсет (UTC+3).
- Watcher не имеет explicit «liveness check» — отличия `null result` от `no change` нет → ошибка silently проглатывается.

**How to avoid:**

- **Phase Execution OVT-MONITOR расширения:**
  - Каждый конкурент-target — отдельный config-блок (robots.txt allowlist, throttling rps, retry policy, expected min content size). Никакого «общего fetcher для всех 3».
  - **Cron explicitly в UTC + комментарий MSK:** `cron: '0 5 * * 1'  # 08:00 МСК Mon` — оператор читает комментарий.
  - **Liveness assertion:** если у любого target за last run пришло `null` или content size < 50% baseline → **немедленный** Telegram алерт `OVT-MONITOR DEGRADED [target]`, не ждём threshold по delta.
  - **Diff на normalized content** (strip whitespace + sort attrs + remove cache-busting params), не на raw HTML, чтобы избежать Bitrix-pseudo-changes false-positive.
  - **Test mode:** `pnpm seo:watch --target liwood --dry-run` показывает diff без алерта, qa должен прогонять перед merge OVT-MONITOR-3x.
- **Iron rule «green CI before merge»** — Playwright/jest unit-tests для watcher fixture (фейковый sitemap + assertion на parse) обязательны до merge.

**Warning signs:**

- 2+ алерта подряд без видимых изменений на сайте конкурента (открой URL в браузере — content same → false-positive).
- 0 алертов более 3 недель при том что у конкурентов точно идёт публикация (например liwood публикует blog с регулярностью 2 article/week) → false-negative.
- GitHub Actions log show `null` или `429` или `403` в JSON output — watcher не падает, но данные битые.
- `lighthouse` или `PageSpeed quota exceeded` в логах (это уже было 2026-05-09 при B1 capture, line 153) → деградация без алерта.

**Phase to address:**

- **Phase Execution MONITOR-3X-01:** rate-limit / robots.txt / cron-UTC чек как acceptance criteria (явно в spec.md).
- **Phase Acceptance (po + qa):** demo runs ≥7 дней в dry-run против всех 3 целей перед prod cron-enable.

---

### Pitfall 3: Benchmark snapshot drift — 2-3-недельный gap между capture (B1) и cross-roadmap synthesis (B5)

**What goes wrong:**

B1 snapshot arboristik.ru снимается, скажем, 2026-05-16. B5 cross-roadmap финализируется 2026-06-05 (3 нед). За 3 недели arboristik.ru:
- Опубликовал 2 новые city-страницы (изменился URL count на +4%).
- Поменял title pattern на T2.
- Включил schema.org Service на одной страницы (теперь 2/N вместо 0/N).

Roadmap построен на «нулевой schema у arboristik» как marketing-angle. Через месяц после деплоя кампании это **больше не правда**, угол спущен впустую, доверие команды и оператора к benchmark-методологии падает.

Худший случай при **противоречии 3 источников**:
- Keys.so показывает 5097 keys top-50 у liwood на дату X.
- WebFetch sitemap-iblock-8.xml на дату X+10 показывает -12 URL (значит liwood удалил часть).
- PageSpeed на дату X+15 даёт другую CWV-картинку.

Команда тратит часы на reconciliation, оператор получает 3 разных «снимка действительности» в одном milestone.

**Why it happens:**

- B1 → B5 у нас sustained процесс из 5 этапов (capture → benchmark → classification → US-draft → roadmap merge); каждый этап минимум 2-3 рабочих дня. Итого SLA от snapshot до roadmap = 2-3 нед, и это **архитектурно встроенный drift**.
- 3 источника правды не имеют explicit priority — команда часто берёт «свежее» вместо «правильнее».

**How to avoid:**

- **Source-of-truth priority** (закрепляется в spec.md обоих BENCHMARK-* US):
  1. **WebFetch live capture** = ground truth для **URL/IA / Schema coverage / on-page meta** (поскольку это видно публично и можно перепроверить за 1 минуту).
  2. **Keys.so** = ground truth для **top-50 keys count / traffic estimate** (наш единственный источник для traffic delta).
  3. **PageSpeed / RUM (наш)** = ground truth для **CWV** (PSI квота nazaltyvalena, поэтому RUM как primary для нас + PSI 3 URL × 4 нед runs для liwood).
  4. **Конфликт между 3** разрешается в пользу WebFetch + явной пометки «keys.so/PSI отстаёт на N дней».
- **Snapshot age stamp** в B5 roadmap: каждая axis-row имеет колонку `as_of: YYYY-MM-DD` + `staleness_max_d: 14`. Если row старше 14 дней — **block roadmap apruv** до refresh B1 этой строки (точечно, не весь B1).
- **Phase Execution BENCHMARK-* completion criteria** включает «B5 sync ≤ 7 дней с B1 finalization» как hard gate. Если drift >7 дней — re-capture critical axes (Schema + URL/IA), остальное допустимо.
- **Diff log:** после re-capture в B4-B5 окно — публиковать `seosite/01-competitors/<target>-diff-YYYY-MM-DD.md` со списком changed metrics + impact на verdict.

**Warning signs:**

- В B5 roadmap-row фраза «по данным B1» без даты или с датой >14 дней назад.
- Оператор задаёт вопрос «а почему у нас в roadmap N URL а в sitemap M URL» → drift проявился.
- B5 рекомендация marketing-angle строится на gap, который >7 дней не верифицирован WebFetch'ем.

**Phase to address:**

- **Phase B1 (capture):** source-of-truth priority + `as_of` stamp обязательны.
- **Phase B5 (synthesis):** drift gate — refresh critical rows если >7 дней.
- **Phase Execution OVT-MONITOR continuous:** автоматизирует часть refresh — не вручную перед каждым roadmap edit.

---

### Pitfall 4: Cross-competitor roadmap dilution — RICE-инфляция и потеря фокуса в US с low score

**What goes wrong:**

В B5 cross-roadmap влетает 15-20 новых US «дополнений» по результатам 3 benchmarks. Каждая US получает RICE, но команда (под давлением «обогнать 3 разом») искусственно завышает Reach и Impact чтобы протолкнуть свою — иронично, потому что Reach большинства из них < 1000 sessions/мес (нишевые city × sub-pages), Impact < 0.5 (marginal feature). RICE < 1 у 60% US, но они **всё равно попадают** в active backlog.

Результат:
- Команда распыляется на 15 US вместо 5-7 priority.
- Existing OVT-1..7 + US-2..11 застывают (because новые US «более срочные»).
- Через 8 нед оператор спрашивает «где результаты обгона liwood» — а программа OVT забуксовала из-за cross-roadmap noise.
- Каннибализация (Pitfall 1) умножается, потому что low-RICE US не проходили строгий filter.

Особо опасный паттерн: **дубликация уже sustained EPIC-SEO-COMPETE-3 US-N** в виде новых cross-roadmap US «потому что не нашли existing». Команда работает над двумя identical US, мерж конфликтует.

**Why it happens:**

- B5 synthesis под давлением «бенчмарка трёх» хочется выглядеть exhaustive — добавить много US «для полноты».
- RICE без жёсткой шкалы Reach (обычно 0-10) и без верхней границы количества US в roadmap легко надувается.
- Существующий backlog в `team/backlog.md` + `seosite/.../overtake-roadmap-2026-05.md` 9 OVT-* + US-2..11 = 16 уже open US; команда (новая или забывшая) не делает diff и предлагает дубль.
- Operator overload (см. Pitfall 6) → roadmap апрувится без построчного review.

**How to avoid:**

- **RICE hard floor:** US с RICE < 1.5 в B5 cross-roadmap **rejected by default**, выносятся в `later` секцию backlog. Гейтер — `po` + `seo` в B5 review.
- **Cap количества US:** не более **8 новых US** в cross-roadmap (мы уже несём 16 open). Если >8 кандидатов — приоритизация top-8, остальное в `seosite/01-competitors/parking-lot.md`.
- **Phase B5 dedup-step (mandatory):** для каждой кандидатной US делается diff vs `team/backlog.md` open items + `seosite/.../overtake-roadmap-2026-05.md` + sustained EPIC-SEO-COMPETE-3 US-N. Если covered-by ≥80% → новая US отклоняется, расширяется existing.
- **«Done before new» rule:** перед добавлением новой US в active, **минимум 2 из существующих OVT-1..7 должны быть в `done` или вышли на final qa**. Это force-функция доводить, не накапливать.
- **Existing programs respect** (PROJECT.md Out of Scope: «Параллельные эпики execution-level вне specs/EPIC-* — .planning/ хранит стратегию + REQ-IDs, исполнение остаётся в specs/»). Cross-roadmap = REQ-уровень, не execution-уровень.

**Warning signs:**

- В B5 draft >12 новых US.
- RICE-таблица показывает 60%+ rows с RICE < 1.5 (но они «interesting»).
- В B5 нет колонки `covered-by` / `dedup-check`.
- В backlog появляется US с slug, аналогичным существующему OVT-N (например OVT-7 «landshaft» + новая OVT-LS-SD без явной декомпозиции).
- Параллельно открыто >3 PR с тагом `EPIC-LIWOOD-OVERTAKE` от разных авторов одной недели — distributed work без приоритета.

**Phase to address:**

- **Phase B4 (US-draft):** RICE shкала + Reach floor + cap-8 enforced via spec template.
- **Phase B5 (roadmap merge):** dedup-step + «done before new» — hard gates, po+seo+arch signed off.
- **Phase Acceptance (operator):** оператор апрувит **не более 5 новых US** за один milestone-edit; остальные — в `next` спринт по результатам OVT execution.

---

### Pitfall 5: Подражание плохим практикам конкурентов — копирование демпинга, нишевости и Bitrix-baggage

**What goes wrong:**

При наивном «copy that works» benchmark предлагает копировать:

1. **arboristik.ru «от 1000 ₽»** → cw публикует hero «Удаление дерева от 1000 ₽» в master-template T4 для arboristika pillar. Это:
   - Прямо нарушает Immutable «Caregiver + Ruler» (CLAUDE.md + brand-guide v2.3 §1-14) — мы «порядок под ключ», не демпинг.
   - Приводит «дешёвых клиентов» с низкой маржой и плохими отзывами (contex/01 §6 anti-pattern).
   - Создаёт repuтационный риск (когда фактическая смета 8 000 ₽ — клиент ругается «обманули»).
2. **arborist.su нишевая позиция** «спец только по деревьям» → seo предлагает «убрать B2B-блок с T2 arboristika чтобы выглядеть как нишевый эксперт». Это:
   - Прямо противоречит REQ B2B/local LAG closure (B2B PDF + Я.Карты + Я.Бизнес — наш existing investment).
   - Теряем 60-80% будущей выручки (B2B самый маржинальный, contex/01 §5).
3. **liwood.ru Bitrix-2018 horizontal-scroll на mobile (440 > 375 px), font 12px, sticky-header 88px** → fe «копирует layout liwood T2» (потому что у них 3500 слов и хорошо ранжируются) и переносит баги:
   - Horizontal scroll = -20% mobile CR (anatomy §2 critical findings).
   - Font 12px = a11y violation + iron rule «mobile-first» (CLAUDE.md, ADR-0021 §mobile-first).
   - Sticky 88px перекрывает hero на iPhone SE → потеря photo→quote USP visibility.
4. **liwood 3 копии lead-form на странице** → fe копирует «больше форм — больше лидов». На самом деле это **антипаттерн** (sustained brand-guide v2.3 §lead-form, наша норма — 1 lead-form внизу + 1 CTA inline + photo→quote entry в hero).

**Why it happens:**

- Команда смотрит «у конкурента 3500 слов и они ранжируются» → выводит «надо так же». Не отделяет **что работает несмотря на X** от **что работает благодаря X**.
- C1.b liwood anatomy уже зафиксировал bad practices как «**не повторять**», но новые роли (или старые в спешке) могут не прочитать anatomy перед действиями.
- TOV-импровизация cw особенно опасна — текст легко копируется из live сайта конкурента; brand-guide-first iron rule не покрывает копирайт явно (требует расширения).

**How to avoid:**

- **Phase B1 (capture) — explicit «what NOT to copy» секция** в каждом benchmark-документе (по аналогии с contex/01 §6 anti-paтterns + liwood-page-anatomy-2026-05.md «6 копировательных приёмов + 8 анти-паттернов»).
- **Iron rule «brand-guide-first» extended for copy:** cw перед публикацией любого нового hero/lead/CTA сверяет с brand-guide §1-14 TOV анти-паттерн словарь:
  - ❌ «от X ₽», «дёшево», «самые низкие цены»
  - ❌ «единственный спец», «только мы»
  - ❌ Прямые цитаты из 3 конкурентов
  - ✅ «фиксированная цена по фото за 10 мин», «порядок под ключ», «5 направлений на одном договоре»
- **Mobile-first hard gate (qa real-browser smoke):** перед approve любой service-page изменения qa проверяет 375 / 414 / 768 / 1024 viewports в браузере (sustained memory `feedback_newui_mobile_first.md`). Horizontal scroll / font <16px / sticky >56px = **block merge**.
- **«1 lead-form per page» rule** в ADR-0021 master-template: 1 LeadForm block внизу + inline CTA-banner + photo→quote entry в hero. Дублирование формы = ADR violation.
- **B5 marketing-angle filter:** «копируем X у конкурента» → автоматический challenge от arch «почему это работает у них и сработает у нас», доказательство = data, не интуиция.

**Warning signs:**

- В draft hero/copy фраза «от X ₽» или «самые низкие».
- В PR description «копируем стиль liwood / arboristik».
- Playwright скрин (`screen/`) на mobile показывает horizontal-scroll bar или sticky-header > 60px.
- cw присылает текст с word count 3500 на T4 (это liwood-density, не наша; sustained ≥1200 city-specific).
- В backlog появляется задача «убрать B2B-блок» или «упростить позиционирование как у arborist.su».

**Phase to address:**

- **Phase B1:** «what NOT to copy» — обязательная секция benchmark.
- **Phase Execution copy + UI:** brand-guide-first iron rule + анти-паттерн словарь + mobile-first qa gate.
- **Phase B5 synthesis:** marketing-angle filter (arch challenge).

---

### Pitfall 6: Operator overload — слишком много параллельных decision-gates в один milestone

**What goes wrong:**

Текущий roadmap Liwood Overtake (overtake-roadmap-2026-05.md §Operator actions required) требует от оператора **5 одновременных решений** до W1 kickoff:
1. Apruv roadmap 9 OVT-* US.
2. Я.Бизнес owner setup ETA (hard blocker OVT-4).
3. Video footage coordination с EPIC-HOMEPAGE-V2 US-17.
4. OVT-MKT phase 1 Я.Директ budget (~5-10k₽).
5. ADR-0020 closure дата.

Milestone Overtake-3 добавляет **ещё 5 потенциальных gate'ов**:
6. Apruv 2 BENCHMARK-* finalization (arboristik + arborist.su).
7. Apruv cross-roadmap merge.
8. Apruv MONITOR-3X-01 расширения (cron config + alert threshold).
9. Apruv 8 новых US (по cap-rule из Pitfall 4).
10. Re-prioritization existing OVT-1..7 + US-2..11.

Итого ≥10 decision-gates concurrent. Операторный человеческий throughput по бизнес-решениям — **1-2 per day**. При 10 gate'ах milestone застывает на 2-3 нед просто из-за бутылочного горлышка. Команда тем временем находит себе работу, часто **не aligned с не-апрувленным roadmap** → лишняя работа.

Sustained memory `feedback_operator_role_boundaries.md`: «оператор не делает техзадачи, только бизнес-решения». Но количество бизнес-решений в этом milestone превышает кадровые возможности.

**Why it happens:**

- Milestone «обогнать 3 конкурентов» бизнес-уровнем большой; декомпозиция в decision-gates естественно даёт много gate'ов.
- Часть gate'ов — операторские по historic-привычке, хотя могли бы быть делегированы (например OVT-MKT budget < 10k₽ technically может быть авто-апрувлен если есть budget envelope).
- po роль традиционно «эскалирует наверх» при сомнении (sustained feedback `feedback_delegate_checks_to_roles.md` уменьшает это, но не для бизнес-решений).
- Decision-gates не сгруппированы по типу/срокам → оператор получает их randomly throughout the milestone.

**How to avoid:**

- **Phase planning (operator decision batching):**
  - **Day-0 batch (kickoff):** один сводный gate, оператор апрувит roadmap + RICE + budget envelope (например «до 30k₽ маркетинг auto-apruv в рамках milestone») + Я.Бизнес ETA — 1 сессия, 30 мин.
  - **Wave-gate (mid-milestone):** после Wave 1 monitoring (W2) — один gate на «продолжаем / меняем».
  - **Final-gate (milestone close):** один gate на release + DoD review.
  - Итого **3 operator sessions** на milestone вместо 10 точечных.
- **Decision-tree pre-fill:** po готовит каждый gate в формате «решение A vs B vs C, рекомендация: A, обоснование, риски» — оператор делает choose, не think-from-scratch.
- **Budget envelope** (CLAUDE.md Constraints sustained): «до X₽ маркетинг / до Y часов dev per US — auto-apruv». Фиксируется в PROJECT.md Constraints.
- **Hard blocker explicit flag:** в roadmap each US помечена `blocked_by_operator: yes/no`. Если 3+ US подряд blocked → escalation `po → operator` с предложением «один разговор сразу за 4 US».
- **Spec-before-code iron rule** уже работает: команда не стартует без spec, поэтому unaligned работа минимизируется (memory `feedback_spec_first_iron_rule.md`).

**Warning signs:**

- В roadmap >5 «operator actions required» без даты/группировки.
- handoff.md показывает >2 US в статусе `blocked_by_operator` одновременно.
- Между сессиями оператор-Claude проходит >5 рабочих дней без movement по milestone.
- po эскалирует операторские вопросы по 1 за раз вместо batching.
- Команда начинает «работу про запас» на следующий US пока текущий blocked — потом приходится переделывать.

**Phase to address:**

- **Phase Planning (kickoff):** batch all operator gates в Day-0 session + budget envelope.
- **Phase Execution (continuous):** po monitors blocked-by-operator count, при ≥2 — escalates сразу batched.
- **Phase Milestone-close:** final-gate single session.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-code competitor URLs в watcher.ts вместо config | Faster prototype | При смене конкурента (например замены arboristik на alpbond.org как 3-го таргета) — touching code + new PR; в случае забывания env-secret — секреты в репо | Только в спайке, не в US с status `done` |
| Brave watcher через WebFetch без robots.txt check | Faster initial build | Юридический риск (нарушение TOS конкурента) + ban на IP Beget VPS → теряем prod runtime | **Never** — robots.txt check обязателен |
| Сводить 3 benchmarks в один `.md` файл без machine-readable экспорта (json) | Easier для cw | Roadmap-merge становится manual reconciliation между 3 docs; нет diff-friendly source для следующих milestones | До B3 (classification) — допустимо; B4-B5 требуют json/csv |
| Запустить OVT-MONITOR на 3 цели без unit-tests на parse | -1 PR cycle | First sitemap format change у конкурента (например смена namespace XML) → silent break → false-negative на месяцы | Только в dry-run mode, prod = tests обязательны |
| Перенести анти-каннибализация check на «потом, когда заметим в Search Console» | Faster B5 finalize | Cannibalisation проявляется через 4-8 нед, recovery = canonicalization + redirects + reindex (3-6 мес reverse-cost) | Never для high-traffic кластеров (pillar T2 + top-10 sub) |
| Skip diff-log в re-snapshot между B1 и B5 | -2 часа manual work | При вопросе оператора «почему verdict изменился» — нет audit trail; доверие к benchmark методологии падает | Только для axes verdict которых не изменился; **diff обязателен** для changed verdict |
| Использовать «average RICE» из 3 benchmarks вместо max | Faster prioritization | Среднее размывает high-impact insights одного конкурента (например, photo→quote AI USP — у одного arboristik «нет», у двух other «нет», average = «не имеет смысла», max = «hard moat») | Never — берём max impact, документируем где именно lead |
| Не trick'ать operator overload (Pitfall 6) — собирать gates по одному | Каждый gate проще оператору в моменте | Milestone застывает; sustained loss 1-3 нед velocity per milestone | Never; всегда batching |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **WebFetch / fetch (multi-target watcher)** | Один общий fetcher с дефолтным User-Agent → CloudFlare/WAF блокирует на 2-м target | Per-target config: User-Agent, throttle (rps), retry policy, robots.txt allowlist; explicit timeout |
| **Keys.so API** | Дёргать на каждый watcher cron (квота быстро тратится) | Кэшировать на 24h в JSON; на cron сравнивать только если cache stale; всё manual через `pnpm seo:keys-so --target X` для финализации B5 |
| **PageSpeed Insights** | Public quota exceeded (sustained issue 2026-05-09 line 153 B2) | Использовать наш RUM как primary (sustained OVT-3); PSI 3-URL × 4 нед runs maximum; оператор выдаёт API key или Lighthouse CLI локально на runner |
| **GitHub Actions cron** | Naive `0 9 * * 1` (думают МСК) → реально UTC = 12:00 МСК | Explicit comment `# 08:00 MSK = 05:00 UTC` + один офсет место в config |
| **Я.Бизнес / Я.Карты embed** | Embed iframe без lazy-load → LCP +500ms → CWV regression на T4 | Lazy-load (loading="lazy" + IntersectionObserver), shadcn `<Suspense>` boundary, fallback static map image |
| **arboristik.ru / arborist.su sitemap** | Доверять `<lastmod>` (часто фейк, ставится на build) | Использовать HTTP HEAD `Last-Modified` + content hash для diff, не doверять sitemap-meta |
| **Topvisor / Я.Webmaster** | Дёргать через scraping вместо API | API obязательный (есть free tier); scraping ловит капчу и кладёт IP runner'а |
| **Telegram алерты OVT-MONITOR** | Один общий чат «ovt-monitor» — алерты от 3 целей мерджатся, теряется context | Per-target thread или per-severity тред: `OVT-MONITOR-CRITICAL` / `OVT-MONITOR-INFO` |
| **Я.Метрика Webvisor** | Включать на prod до qa real-browser smoke — Webvisor пишет всё, включая sensitive form values | Webvisor конфиг с маской паролей/телефонов + post-smoke enable |
| **amoCRM (sustained US-13)** | OVT lead-flow optimization без sync с amoCRM ETA | OVT-* lead-flow US **blocked** до amoCRM ready ИЛИ fallback Telegram lead-only (US-8 W15 baseline) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Multi-target watcher блокирует runner** на 30+ мин из-за serial fetch 3 sites × 50 URL | GitHub Actions billable minutes растут (sustained Beget runner — self-hosted ОК, но GitHub-hosted = $) | Parallel fetch per target + concurrent limit (3 worker pool); shared timeout 5 мин per target | При расширении до 50+ URL per target (третья wave) |
| **JSON-LD validation на 3 целях × 50 URL × weekly** | Memory pike у runner (Cheerio/JSDOM на больших HTML) | Streaming parse + early-exit on first 4-6 schema nodes (мы знаем pattern, не ищем все); per-page timeout | На 100+ URL per target |
| **Cron-collision** — OVT-MONITOR + Dependabot + ci.yml weekly run в одно окно UTC Monday | Runner queue + retries +false-positive фейлы | Stagger cron times: monitor 05:00 UTC, dependabot 06:00, ci-cleanup 07:00 | Сразу при добавлении нового weekly job |
| **Snapshot bloat в repo** | `seosite/01-competitors/*.json` накапливаются по weekly snapshot × 3 цели × 52 wkк = 156 файлов/год | Хранить только N=8 последних + diff-only; archive в S3/CDN bucket; main repo чистый | На 6-9 мес работы milestone |
| **Cannibalisation regression** в SERP через 4-8 нед после новых URL | Topvisor показывает падение позиций existing T2/T3 после publication новых cross-roadmap URL | Pre-publication SERP overlap check (manual + Topvisor query) per US в B5 | При >5 новых URL в одной семантической нише за квартал |
| **PostgreSQL connection pool starvation** при OVT-MONITOR concurrent watchers + Payload hooks | Audit_log hang баг sustained (memory `reference_payload_hooks_async_fire_and_forget.md`) | Fire-and-forget pattern для watcher Payload updates; max-clients alarm | На 3-м target watcher + sync hook |
| **CDN cache miss на competitor snapshot pages** при scheduled fetch | Beget S3 egress costs growth | Серверный cache (Next.js fetch cache 86400s) + Cloudflare proxy для read; нет point дёргать twice/week | Сразу |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Хранить Keys.so / PageSpeed API keys в `.env.local` коммитом | Утечка ключей в public repo (sustained 2026-05-09 repo public для billing bypass — memory `project_repo_public_2026-05-09.md`) | Только в `.env` (gitignore), GitHub Actions secrets, или 1Password CLI; protect-secrets хук блокирует |
| WebFetch с identifiable User-Agent `obikhod.ru-watcher/1.0` | Конкурент видит и может вернуть «обманный» контент (cloaking) | Generic browser UA + `Accept-Language: ru-RU`; respectful rate-limit + robots.txt |
| Логировать full HTML response в GitHub Actions log | Если в response утекли PII (например liwood embed телефонов команды) → у нас в логе | Strip PII перед log; logging level = WARN+ only |
| Хранить cross-roadmap в `.planning/` без gitignore secrets check | Если cw случайно вставит amoCRM API URL или Telegram bot token в спеку — утечка | `protect-secrets.sh` хук покрывает `.planning/`; обязателен Pre-commit run |
| Scraping arborist.su без robots.txt — попадаем в blacklist | IP Beget VPS = production server. Блок → даун prod | Watcher на отдельный VPS / runner; **никогда** не вешать на prod IP |
| OVT-MONITOR Telegram bot token в repo | Утечка → spam в наш канал | Только GitHub Actions secret + `TELEGRAM_BOT_TOKEN` env |
| Public repo + benchmark JSON содержит UTM от наших объявлений в Я.Директ | Конкуренты копируют UTM-структуру = знают наш медиа-микс | Sanitize URL params в snapshot до commit (drop utm_*, yclid, gclid) |
| Раскрытие в B5 roadmap.md внутренних RICE/Reach цифр в public repo | Конкуренты видят наш TAM-расчёт и приоритеты — competitive intel | Internal `.planning/` секции — git-tracked но **internal-only**; public README только high-level milestone goals |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Embed Я.Карты iframe full-load on T4 SD | LCP +500ms, CLS +0.05 → mobile drop 15-20% | Lazy-load + static placeholder image (Я.Карты static API); init на user click / scroll |
| Видео-кейс (OVT-5) auto-play на mobile | Battery drain + data usage + autoplay-block by Safari = broken section | Click-to-play; poster image обязателен; <video preload="metadata"> not "auto" |
| Дублирование 3 lead-form на странице (имитация liwood) | -10-15% CR из-за form fatigue + brand-guide §lead-form violation | 1 LeadForm + inline CTA banners + photo→quote entry — sustained ADR-0021 |
| Marketing-angle copy «Единственные в Москве с 100% schema» написан crypto-language | B2C client не понимает SEO-термины → trust drop | Translate: «Нас находят сразу в Я.Поиске / Алисе / ChatGPT — даже когда у конкурентов 0 ответов» |
| 4-в-1 USP коммуникация (как arboristik «всё под ключ») затмевает USP photo→quote AI | Главный differentiator скрыт за «общим» оффером | Hero T1 highlights photo→quote AI (deep-link), 4-в-1 = supporting bullet |
| B2B-trail контент технический (СРО / 152-ФЗ / ОКПД2) на T4 SD для B2C | B2C client воспринимает страницу как «не для меня» → bounce | Separate route `/b2b/<doc>/` (sustained ADR-0018), на T4 SD только 1 трастовый bullet |
| Sticky bottom-CTA mobile перекрывает FAQ accordion при expand | -5-10% mobile FAQ engagement → меньше long-tail в Speakable | Sticky CTA = 56px (sustained ADR-0021), FAQ aware-padding-bottom: 80px |
| Cookie banner перекрывает 25% screen mobile (как liwood) | A11y violation + immediate exit signal | Brand-guide compliant minimal cookie banner, dismissible с одного клика |

## "Looks Done But Isn't" Checklist

- [ ] **BENCHMARK-ARB-01:** часто missing `as_of` stamp на каждой axis row — verify все 8 axes имеют дату ≤14 дней до B5 finalization.
- [ ] **BENCHMARK-ARB-01:** часто missing «what NOT to copy» секция (anti-patterns) — verify ≥5 bullets per benchmark.
- [ ] **BENCHMARK-ARBSU-01:** часто missing comparison «leverage уже LEAD у нас? PARITY? LAG?» — verify per axis explicit verdict + cross-link to liwood B2.
- [ ] **ROADMAP-CROSS-01:** часто missing dedup-check vs existing OVT-1..7 + US-2..11 — verify каждая new US имеет `covered-by: <existing-or-null>` field.
- [ ] **ROADMAP-CROSS-01:** часто missing RICE floor — verify все active US имеют RICE ≥ 1.5; нижние — в `later`.
- [ ] **ROADMAP-CROSS-01:** часто missing cannibalisation matrix — verify SERP intent overlap check per новый URL.
- [ ] **MONITOR-3X-01:** часто missing robots.txt allowlist per target — verify `pnpm seo:watch --dry-run` log shows respected robots для всех 3.
- [ ] **MONITOR-3X-01:** часто missing liveness assertion (отличать null от no-change) — verify Telegram алерт fires при content size <50% baseline.
- [ ] **MONITOR-3X-01:** часто missing UTC→MSK comment в cron config — verify yml comment matches actual local time.
- [ ] **MONITOR-3X-01:** часто missing per-target throttle config — verify config-блок per target в `seo-monitor.yml`.
- [ ] **EXEC-COMPLETE-01:** часто missing «done before new» check — verify ≥2 OVT-N in done/final-qa перед адванс нового US.
- [ ] **EXEC-COMPLETE-01:** часто missing operator action batching — verify ≤3 operator sessions per milestone (Day-0, Wave-mid, Final).
- [ ] **EXEC-COMPLETE-01:** часто missing post-W12 re-benchmark — verify закрытие milestone включает refresh B1 snapshot всех 3 целей.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Каннибализация (P1) проявилась в SERP через 4-8 нед | **HIGH** (3-6 мес reverse) | 1. Identify cannibalized pairs via Topvisor `same query → 2 URL drop`. 2. Choose canonical URL (older + higher backlinks). 3. 301 redirect or `rel="canonical"` для weaker. 4. Reindex via Я.Webmaster + Search Console. 5. Update ADR-0018 + lint rule. |
| Watcher silent fail (P2) >2 нед без алерта | **LOW-MEDIUM** | 1. Manual re-snapshot 3 targets via WebFetch. 2. Diff vs last good snapshot. 3. Fix root cause (robots/throttle/cron). 4. Add liveness assertion test. 5. Backfill missed weeks в diff log. |
| Snapshot drift (P3) — roadmap built on stale data | **MEDIUM** | 1. Re-capture critical axes (Schema + URL/IA) via WebFetch — 2-4 часа. 2. Diff vs B5 row, mark `as_of` updated. 3. Re-validate marketing-angle (если verdict changed → angle reject). 4. Operator informed. |
| RICE inflation (P4) — milestone perebooked | **MEDIUM** | 1. Force re-RICE all open US с floor 1.5. 2. Downscope `now` → `later` ≥40% of US. 3. Operator batch-apruv subset. 4. Pause execution on demoted US until next milestone. |
| Демпинг copy опубликован (P5) | **LOW** (если ≤7 дней live) до **HIGH** (если индексировался) | 1. Immediate copy revert через cw + brand-guide check. 2. Я.Метрика проверка bounce rate за 7 дней. 3. Если индексировался — Search Console URL inspection + reindex request. 4. Add анти-паттерн в TOV check-list. |
| Mobile bug регрессия (horizontal scroll, font 12px) | **LOW** | 1. qa Playwright reproduce. 2. PR revert или hotfix. 3. brand-guide-first audit на soruced commit (что вызвало drift). 4. Mobile-first qa gate как hard requirement. |
| Operator overload → milestone застрял на 2-3 нед (P6) | **MEDIUM** | 1. po собирает все open gates batched в Markdown. 2. Один operator session 60-90 min — все решения batch. 3. Budget envelope зафиксирован в PROJECT.md Constraints. 4. po monitors blocked-count и escalates по 2+, не по одному. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| P1 Каннибализация | **B1 + B5 + Execution** | `pnpm lint:schema` + SERP overlap check + ADR-0018 §13 audit per new URL; Topvisor monthly position diff |
| P2 Watcher эфемерность | **Execution MONITOR-3X-01** | Dry-run ≥7 дней prod-like + unit-tests на parse + liveness Telegram alert demo |
| P3 Snapshot drift | **B1 + B5** | `as_of` stamp obязателен; B5 gate отвергает rows >14 дней без refresh |
| P4 Roadmap dilution | **B4 + B5** | RICE ≥1.5 floor + cap-8 + dedup-check vs existing 16 open US + «done before new» rule |
| P5 Подражание плохим практикам | **B1 (anti-pattern section) + Execution (brand-guide-first + mobile-first qa gate)** | Анти-паттерн словарь в cw checklist; qa Playwright 375/414/768/1024 viewport audit; ADR-0021 master-template compliance |
| P6 Operator overload | **Planning (kickoff) + Continuous** | Operator action count ≤3 batched sessions; budget envelope в PROJECT.md; `blocked_by_operator` count ≤2 sustained |

## Sources

- `.planning/PROJECT.md` (target features + Validated + Out of Scope + Constraints + Key Decisions) — 2026-05-15
- `/Users/a36/obikhod/contex/01_competitor_research.md` §6 «Анти-паттерны (чего НЕ делать)» — sustained 2026-04-15, не противоречит current state
- `/Users/a36/obikhod/seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` — 8 осей verdict + B3 classification (action class per axis) + threshold table per axis для weekly monitoring
- `/Users/a36/obikhod/seosite/01-competitors/overtake-roadmap-2026-05.md` — 9 OVT-* US + 5 operator actions required + RACI + Gantt + dependencies (sustained pending operator apruv)
- `/Users/a36/obikhod/CLAUDE.md` — iron rules + поведенческие правила Karpathy-derived + запрещено в проекте
- `/Users/a36/obikhod/team/adr/ADR-0017-homepage-content-source.md` — +50pp rich-results window (нельзя сломать JSON-LD)
- `/Users/a36/obikhod/team/adr/ADR-0018-url-map-compete-3.md` §13 SEO правила (canonical + slug-discipline) — нельзя дублировать URL без обновления ADR
- `/Users/a36/obikhod/team/adr/ADR-0020-shop-sunset-landshaft-positioning.md` — Out of Scope магазин; landshaft = 5-й pillar
- `/Users/a36/obikhod/team/adr/ADR-0021-service-page-master-template.md` — 13 секций fixed order + mobile-first контракт + brand-guide-first iron rule for UI
- `/Users/a36/obikhod/team/WORKFLOW.md` §5 железные правила (skill-check + design-system awareness + green CI + real-browser smoke + secrets) — нельзя обойти
- Memory `feedback_newui_mobile_first.md` — 375/414/768/1024 viewport audit на каждой итерации
- Memory `feedback_brand_guide_only_source.md` — никакого globals.css или CSS «по памяти»
- Memory `reference_payload_hooks_async_fire_and_forget.md` — fire-and-forget pattern для async hooks
- Memory `feedback_operator_role_boundaries.md` — оператор не делает техзадачи, только бизнес-решения

---
*Pitfalls research for: cross-competitor benchmark + monitoring + roadmap unification on brownfield 5-pillar lead-gen site*
*Researched: 2026-05-15*
