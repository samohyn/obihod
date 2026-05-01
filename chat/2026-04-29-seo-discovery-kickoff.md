# Сессия 2026-04-29 — SEO discovery kickoff (shop + landshaft)

**Роль:** poseo (Product Owner SEO)
**Длительность:** ~поздняя ночь, продолжение мульти-сессионного дня (после panel backlog rebuild)
**Тема:** запуск SEO research для двух необработанных зон — питомника саженцев и услуги «Дизайн ландшафта»

---

## Summary

Оператор пришёл с интуицией «нам нужно ресерч для shop и landshaft — какое ядро, структура итд». Обсудили в plan-mode → подтверждено что зоны действительно green-field в `seosite/` (1600 ключей и 252 кластера только для 4 services pillar; для shop = 0; для landshaft = 2 ключа freq=0). Решено открывать **2 параллельных discovery EPIC'а**, full research, с timeline 5 недель. US-11 IA Extension не блокируем (URL-slug'и принимаем как фиксированные вводные). Сделан первичный intake-каркас всех артефактов; ничего не закоммичено, ждём твоего сигнала на kick-off в `ba`.

---

## Цитаты оператора (raw)

> мне почему то кажется что нам нужно провести ресерч для питомника растений и дизайна ландшафта? какое ядро, структура итд

> хотя норм согласен с планом

> пока просто зафиксируем эти задачи

> давай сделаем папку chat и будем в нее сохранять диалоги сессии?

> не, корень проекта - чат - лог каждой сессии в формате md
> и кладем эту папку железным правилом в .gitignore
> и обновляем это в claude.md и где еще требуется

---

## Развилки и решения

| # | Развилка | Выбор | Альтернативы (отвергнуты) |
|---|---|---|---|
| 1 | Порядок discovery | **Параллельно** оба эпика | landshaft-first / shop-first |
| 2 | Глубина research | **Full** (252-кластерный подход) | MVP / strategic-only |
| 3 | Связь с US-11 IA Extension | **Не блокируем**, slug'и mega-menu принимаем как fixed | влить в US-11 / ждать закрытия US-11 |

---

## Созданные артефакты

**Спеки эпиков:**
- [specs/EPIC-SEO-SHOP/intake.md](../specs/EPIC-SEO-SHOP/intake.md) — 9 категорий саженцев, 15 deliverables, 3 open questions (positioning, Topvisor проект, регионы парсинга)
- [specs/EPIC-SEO-LANDSHAFT/intake.md](../specs/EPIC-SEO-LANDSHAFT/intake.md) — pillar + 5-8 cluster, 4 open questions (B2B-структура, кейсы, brand-guide-landshaft приоритет, 5-й pillar или просто посадочная)

**Каркасы artifact-папок:**
- [seosite/03-clusters/shop/README.md](../seosite/03-clusters/shop/README.md) — 9 категорий с URL+файл маппингом
- [seosite/03-clusters/landshaft/README.md](../seosite/03-clusters/landshaft/README.md) — pillar + cluster + B2B + cross-link map

**Расширения source-of-truth:**
- [seosite/01-competitors/shortlist.md](../seosite/01-competitors/shortlist.md) — Wave 2 секции: 5 ecommerce кандидатов (Леруа/Подворье/Савватеевы/Поиск/agroprosperis) + 7 landscape-студий (углубление liwood + studio-fito + landshaft-bureau + dachnyu + yardesign + landschaft + 2 TBD)
- [seosite/04-url-map/decisions.md](../seosite/04-url-map/decisions.md) — 7 DRAFT ADR-uМ-19..25 с рекомендациями PO и списком вводных, нужных для финала
- [team/backlog.md](../team/backlog.md) — секция `seo` пересобрана (2 EPIC в Now / 2 Wave-1 в Later / 3 cross-team зависимости)

**План-файл (вне репо):**
- `~/.claude/plans/team-seo-poseo-md-radiant-hartmanis.md` — 5-недельный roadmap

---

## Ключевые гипотезы PO (для последующих фаз)

- **Shop positioning:** B2B-питомник + B2C-премиум (избегать head-fight с Леруа). Финал — после ответа оператора на open question #1 в shop intake.
- **Shop фасеты:** гибрид (1 уровень в URL, остальное query) — рекомендация в ADR-uМ-19 DRAFT.
- **Landshaft URL:** pillar + 5-8 cluster (не one-pager) — больше точек захвата, соответствует 252-кластерному подходу services. Рекомендация в ADR-uМ-23 DRAFT.
- **Landshaft B2B:** под общий `/b2b/` хаб (`/b2b/landshaft/`), не внутри pillar. Рекомендация в ADR-uМ-24 DRAFT.
- **Landshaft кейсы:** унифицированная коллекция `Cases` + URL `/keysy/<slug>/?service=landshaft` (фильтр). Рекомендация в ADR-uМ-25 DRAFT.

---

## Open follow-ups (для следующей сессии)

1. **Ответы оператора на 3+4 open questions** в intake.md обоих эпиков:
   - shop: positioning (head/niche/B2B?), Topvisor отдельный проект да/нет, регионы парсинга
   - landshaft: B2B-структура (рекомендация B), кейсы (рекомендация унифицированные), приоритет brand-guide-landshaft, landshaft = 5-й pillar или просто посадочная
2. **Hand-off в `ba`** — `ba.md` для обоих эпиков (приоритизация, RICE-обоснование cluster'ов)
3. **Trigger в `art` через `cpo`** на старт `design-system/brand-guide-landshaft.html` — это блокер для контентных волн `cw`, не для discovery
4. **Подтверждение списка конкурентов** для Wave 2 разведки `re` (5+7 кандидатов)
5. **Решение по chat/** — сделано в этой же сессии (см. ниже)

---

## Параллельная мини-задача в этой же сессии: chat/ folder

Оператор по ходу: «давай сделаем папку chat и будем в нее сохранять диалоги сессии?» → уточнение: «корень проекта - чат - лог каждой сессии в формате md, и кладем эту папку железным правилом в .gitignore, и обновляем это в claude.md и где еще требуется».

Сделано:
- `chat/README.md` — формат session-логов
- `chat/2026-04-29-seo-discovery-kickoff.md` — этот файл
- `.gitignore` — добавлено `chat/`
- `CLAUDE.md` — новое железное правило #7 (chat/ в gitignore), апдейт «Структура проекта» и «Память и хуки»
- `.claude/README.md` — упомянут chat/ в системе памяти
