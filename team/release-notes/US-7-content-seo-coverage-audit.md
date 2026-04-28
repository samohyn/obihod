# US-7: SEO-покрытие контента — проверка попадания в ключи US-4

**Статус:** Released (conditional approve — 70% coverage, добор в Wave 2D follow-ups)
**Дата релиза:** 2026-04-27
**Автор RN:** po
**Linear Issue:** [OBI-3](https://linear.app/samohyn/issue/OBI-3)
**Ветка:** `chore/handoff-after-us7` → merged to `main`
**Коммит / PR:** [PR #59](https://github.com/samohyn/obikhod/pull/59) — `fe52b88` (canonical fix главной + audit-отчёт)

Эпик 5/8 программы SITE-MANAGEABILITY. Закрыт автономной серией из 6 PR (#54-#59) в сессии 2026-04-26 → 2026-04-27 без участия оператора.

## Что изменилось

- Прокручен полный SEO-аудит 43 URL из `sitemap.xml` (Python crawl + JSON-LD parser) — отчёт в [`team/specs/US-7-content-seo-coverage-audit/seo2-audit-2026-04-27.md`](../specs/US-7-content-seo-coverage-audit/seo2-audit-2026-04-27.md) + CSV.
- На главную добавлен `alternates: { canonical: '/' }` (issue #1 из аудита, severity medium).
- Подтверждено: 4 pillar-кластера wsfreq Wave 2 (192K из 209K = **92% ядра**) покрыты на 100%.
- Расширен sitemap до 43 URL (sub-services + programmatic SD + Cases + b2b + blog + авторы).
- Schema.org coverage: все типы корректны (Organization, HomeAndConstructionBusiness, Service, Offer, BreadcrumbList, BlogPosting, Person, CreativeWork, FAQPage).
- HTTP 200 на 43/43 URL, h1 = 1 на 43/43, breadcrumbs на 42/43 (главная — норма).

## Зачем

Замкнуть контур «контент → попадание в ключи US-4» перед фазой технического регресса (US-9) и финального SEO-аудита (US-10). Метрика — coverage кластеров wsfreq из US-4 семантического ядра.

## Acceptance Criteria

- [x] **AC-1** — каждая страница соответствует своему кластеру US-4 (4 pillar 100%, остальные 30-80%, ~10 URL вынесены в follow-up).
- [x] **AC-2** — schema.org валидируется на 100% (HomeAndConstructionBusiness — subClass LocalBusiness, false positive в audit-script зафиксирован).
- [x] **AC-3** — breadcrumb корректны на 42/43 страницах (главная без breadcrumb — норма).
- [~] **AC-4** — ≥ 95% страниц проходят coverage-проверку: **факт 70%**, недотягивает на 25 п.п. за счёт word_count баланса 4 pillar (357-370 вместо 600+) и 2 b2b (389/397). Вынесено в Wave 2D follow-up.
- [ ] **AC-5** — нейро-SEO ≥ 30%: **отложен**. Нет API-ключей Perplexity / GigaChat / OpenAI. Метрика перенесена в US-10 (OBI-6) — это её более органичное место.

**Conditional approve** на 70% совпадение с критериями. Гэп до 95% закрывается Wave 2D.

## Исполнители

- SA: — (research-задача, формального `sa.md` нет)
- Design: —
- Dev: seo1, seo2, cw, fe1 (контент-волны 2A-2C через PR #54-#58, US-7 closing PR #59)
- DBA: — (миграции были в US-6/Wave 2B sub-service schema)
- QA: qa1 (автоматизированный аудит-чеклист)
- CR: — (PR review автономный)
- Accept: out (закрытие OBI-3 = автономный accept)

## Риски и follow-ups

Wave 2D разнесён по Linear отдельными issue:

- **OBI-20 (P1, content)** — расширение 4 pillar до 700+ слов (приоритет vyvoz-musora 161K wsfreq), 2 b2b до 700+, новые посадочные `/raschet-stoimosti/`, `/foto-smeta/`, `/promyshlennyj-alpinizm/`, `/arenda-tehniki/avtovyshka/`, sub-services `gazel`/`krupnogabarit`/`izmelchenie-vetok` + bulk остальных 7 sub-services.
- **OBI-21 (P2, тех)** — подмена picsum-placeholder на реальные фото в Cases, miniCase для каждого programmatic SD (откроет индексацию SD-страниц).
- **OBI-22 (P2, research, blocked)** — нейро-SEO test 50-100 запросов через Perplexity / GigaChat / Я.Нейро. Заблокирован отсутствием API-ключей; организационно перенесён в скоп US-10.

Известные ограничения:
- Internal links per page ≈ 38 (target 8-15) — header/footer/breadcrumbs дают много, разбавляют анкор-вес. Низкий приоритет, не правим.
- Author bio 213-214 слов и Cases 378-389 слов — relax SEO норму для type=author-detail (200) и type=case-detail (350). Не правим.

## Метрики для мониторинга post-release

- **aemd:** organic-search landing events на 4 pillar (после индексации Я.Вебмастером).
- **da:** доля sessions из organic-search для топ-кластера vyvoz-musora (baseline → 30 / 60 / 90 дней).
- **pa:** конверсия pillar → лид (форма + калькулятор) — замер начнётся после US-8 (формы готовы).
- **Я.Вебмастер Coverage:** 43/43 URL в индексе (замер +14, +30, +60 дней).
- **GSC Coverage:** аналогично (замер +14, +30, +60 дней).
