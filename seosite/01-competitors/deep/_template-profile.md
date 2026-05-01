---
domain: example.ru
pillar: арбо | мусор | крыши | демонтаж | E-E-A-T | контент
audit_status: pending | in_progress | done
last_audit_date: YYYY-MM-DD
audit_method: sitemap+robots | site-scan | keys.so + topvisor | playwright
source_keys_so: pending | <ссылка-или-id-проекта>
source_topvisor: pending | <ссылка-или-id-проекта>
ia_score: 0
benchmark_phase: W3-baseline | W7-mid | W14-final
---

# <domain>

> **Шаблон deep-профиля конкурента для W3 Competitor Benchmark Baseline (EPIC-SEO-CONTENT-FILL).**
> Заполнять по факту live-аудита (Keys.so + Topvisor + ручной IA-скан). Поля без данных оставлять «pending live audit W3» — НЕ инвентировать цифры.

## Зона силы (1 абзац)

<В одном абзаце: главное конкурентное преимущество (по чему ранжируется, на чём собирает трафик, какой паттерн у них копируется).>

## URL-объём

| Категория | URL у конкурента | Метод подсчёта | Наш план к W14 | Δ % |
|---|---:|---|---:|---:|
| Всего в sitemap.xml | pending | sitemap.xml вручную | ~250 | pending |
| Pillar-страницы | pending | site-scan | 4 | pending |
| Sub-services | pending | site-scan | 33 | pending |
| Programmatic SD (service × district) | pending | site-scan | ~150 | pending |
| District hubs | pending | site-scan | 8 | pending |
| Blog | pending | site-scan | 30 | pending |
| Cases / portfolio | pending | site-scan | 12 | pending |
| B2B (отдельный хаб) | pending | site-scan | 10 | pending |
| Authors / E-E-A-T URL | pending | site-scan | 2 | pending |

## Ключевые слова (топ-30 в Я.Москва+МО)

> Источник: Keys.so > Топ-страницы домена > Топ-100 ключей. Пересечение с нашим 1601-ключевым семядром (`seosite/03-clusters/`).

| # | Ключ | Поз. конкурента | wsfreq | Наш URL | Наш кластер | Status |
|---|---|---:|---:|---|---|---|
| 1 | pending | pending | pending | pending | pending | pending |

**Топ-10 «утерянных» ключей** (конкурент в топ-10, мы в 50+ или нет URL):
- pending live audit W3

**Пересечение с нашим семядром:**
- Всего ключей конкурента в Я.Москва+МО: pending
- Пересечение с нашими 1601: pending (X%)
- Наш URL отвечает на ключ: pending (Y%)

## Контент-следы

### Блог
- Кол-во статей: pending
- Средний объём слов: pending
- Наличие FAQ-блока: pending (Y/N)
- Наличие TLDR / нейро-формата: pending (Y/N)
- Авторы статей атрибутированы: pending (Y/N)
- URL-pattern: pending (`/blog/[slug]/` / `/articles/...` / etc.)

### Кейсы / портфолио
- Кол-во: pending
- Глубина (фото до/после, цифры результата): pending
- Привязка к district / sub-service: pending

### Авторы (E-E-A-T)
- Отдельные посадочные: pending (Y/N)
- Person schema: pending
- sameAs (VK / TG / LinkedIn): pending

### Schema-типы (по 3 random-pages)
- Service: pending (Y/N)
- FAQPage: pending
- BreadcrumbList: pending
- LocalBusiness / Organization: pending
- Article / BlogPosting: pending
- Person: pending

## B2B-сегменты (если есть)

- Отдельный хаб /b2b/: pending (Y/N)
- Подсегменты (УК / ТСЖ / застройщики / FM / госзаказ): pending
- Договор-страница: pending
- Цитата эксперта / реальный B2B-автор: pending
- Уникальные крючки (штрафы ГЖИ/ОАТИ, абонентское обслуживание, и т.п.): pending

## Что копируем (что у них лучше нас, как именно)

| Их элемент | Где (URL-паттерн) | Как мы улучшаем |
|---|---|---|
| pending | pending | pending |

## Что превосходим (где они слабы, наш differentiation)

| Их слабость | Наш differentiation | Где живёт у нас |
|---|---|---|
| pending | pending | pending |

## Уникальные паттерны (которых нет у других в выборке 17)

- pending

## Риски (если расширятся в нашу зону — что они могут сделать)

- **R-low / R-mid / R-high:** pending — что они теоретически могут сделать → как мы реагируем
- pending

## Источники

- Sitemap.xml: pending
- Robots.txt: pending
- Keys.so проект: pending
- Topvisor проект: pending
- Ручной IA-скан screenshots: pending (`screen/competitors/<domain>/`)

## TODO для live audit (W3)

- [ ] sitemap.xml fetch + count URL по категориям
- [ ] Keys.so export топ-100 ключей домена в Я.Москва+МО
- [ ] Topvisor добавить домен в проект сравнения позиций
- [ ] Manual IA-скан главной + 3 random pillar/sub/blog/case URL → screenshots
- [ ] Schema validation 3 random URL через Google Rich Results Test
- [ ] Заполнить все «pending» поля выше
- [ ] Обновить frontmatter: `audit_status: done`, `last_audit_date`
- [ ] Внести данные в `differentiation-matrix.md`
