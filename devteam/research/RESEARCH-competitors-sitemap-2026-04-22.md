# RESEARCH: sitemap-снапшот конкурентов (2026-04-22)

**Владелец:** re
**Метод:** curl sitemap.xml (с рекурсией по nested sitemap-index), grep `<loc>`, awk-разбивка по path-root.
**Повторяемость:** команды воспроизводятся в один bash-проход (см. §4).

---

## 1. Сводка

| # | Сайт | Всего URL | Контент* | Стек (по sitemap-структуре) |
|---|---|---:|---:|---|
| 1 | liwood.ru | 266 | **252** | 1С-Битрикс (iblock-*.xml) |
| 2 | arborist.su | 217 | **170** | 1С-Битрикс (iblock-*.xml × 21) |
| 3 | spilservis.ru | 157 | **157** | плоский sitemap, кастом/WP |
| 4 | arboristik.ru | 78 | **78** | плоский sitemap, WordPress |
| 5 | bratiya-lesoruby.ru | 59 | **59** | 4SEO-плагин WordPress (sitemap-4seo.xml пуст, контент в /sitemap.xml) |

\* контент = всего минус `sitemap-files.xml` (PDF / изображения).

## 2. Анатомия контента (разбивка по path-root)

### spilservis.ru — 157 URL
- `our-works/` — 89 (кейсы)
- `services/` — 42 (услуги)
- `blog/` — 11
- `udaleniye-derevyev-v-moskovskoy-oblasti/` — 6 (programmatic по районам — **только 6!**)
- `reviews/` — 2
- `price/`, `about/`, `faq/`, `contact/`, `politika-konfidencialnosti/` — по 1

**Ключевое:** кейсы (89) — основной контент. Programmatic по районам почти нет.

### arboristik.ru — 78 URL
- `category/` — 8
- блог-статьи в корне — ~68 (арбористика, фитопатология, дендрология, виды обрезки)
- `poleznie-idei/` — 5
- `author/` — 5

**Ключевое:** SEO-стратегия на контенте и экспертизе (E-E-A-T). Services и districts — почти нет.

### arborist.su — 170 URL (без files), разбивка по iblock
- `company/` — 47
- `tariffs/` — 33 (прайсы)
- `services/` — 29
- `projects/` — 12
- `product/` — 10
- `sales/` — 7
- `gallery/` — 7
- `cabinet/` — 6
- `articles/` — 6
- `news/` — 5
- `contacts/` — 4
- `landings/` — 3
- `info/` — 1

**Ключевое:** типичный Битрикс-сайт с множеством разделов. Широко, но без заметной programmatic-стратегии по районам.

### liwood.ru — 252 URL
- `services/` — **150** (programmatic-like: услуга × район или услуга-вариант)
- `info/` — 85 (статьи, FAQ, инструкции)
- `gallery/` — 13
- `promo/` — 4

**Ключевое:** самый плотный по контенту + **единственный** с выраженной programmatic-стратегией.

### bratiya-lesoruby.ru — 59 URL
- `uslugi/` — 35
- `novosti/` — 15
- `portfolio/`, `otzyvy/`, `okompanii/`, `oferta/`, `kontakty/`, `polity/`, `dogovor-okazaniya-uslug/`, `ceni/` — по 1

**Ключевое:** минимальный набор, без программатики и глубокого контента.

## 3. Выводы для Обихода

1. **Максимум у конкурента — 252 страницы** (liwood.ru). Planned для Обихода: 4 кластера × 15–74 района = **60–300+ programmatic**. На первом релизе матрицы 4×15 обгоняем 4 из 5, на полном 4×74 — всех.
2. **Programmatic по районам почти никто не применяет** — только liwood.ru (услуги ×N) и spilservis.ru (6 районов МО). Это **окно возможностей**, подтверждено живыми sitemap.
3. **spilservis.ru силён кейсами (89)** — нам нужно закладывать процесс: бригадир присылает фото после каждого объекта, `cw` + `ui` оформляют, `be3`/`be4` добавляют в Payload-коллекцию `Cases`.
4. **arboristik.ru — контент-лидер** (~68 блог-статей). Ориентир для `seo1` по глубине E-E-A-T контента (для нейро-SEO особенно важно).
5. **bratiya-lesoruby** слабый (59 страниц) — бить проще всего.

## 4. Воспроизведение (bash)

```bash
count() { curl -sSL --max-time 20 -A "Mozilla/5.0" "$1" | grep -oE "<loc>[^<]+</loc>" | wc -l; }

# Плоские sitemap:
count https://spilservis.ru/sitemap.xml
count https://arboristik.ru/sitemap.xml
count https://bratiya-lesoruby.ru/sitemap.xml

# Индексированные (arborist.su, liwood.ru) — сумма по вложенным:
for url in https://www.arborist.su/sitemap.xml https://www.liwood.ru/sitemap.xml; do
  total=0
  for sub in $(curl -sSL --max-time 15 "$url" | grep -oE "<loc>[^<]+</loc>" | sed -E 's|</?loc>||g' | grep -v sitemap-files); do
    total=$((total + $(count "$sub")))
  done
  echo "$url → $total"
done

# Разбивка по типу (path-root):
curl -sSL "https://<host>/sitemap.xml" | grep -oE "<loc>[^<]+</loc>" \
  | sed -E 's|</?loc>||g; s|^https?://[^/]+||' \
  | awk -F'/' '{print $2}' | sort | uniq -c | sort -rn
```

## 5. Методические оговорки

- Цифры — **sitemap-декларированные**, могут не совпадать с реальной индексацией в Яндекс.Вебмастере / Google Search Console.
- URL могут включать дубликаты (trailing slash, canonical-ответвления) — грубый подсчёт завышает истинное количество **уникальных HTML-страниц** на ~5–10%.
- Для arborist.su и liwood.ru у sitemap-index **≤ 50 вложенных** (предел sitemap-протокола — 50k URL на файл, 50k файлов в индексе). Оба далеко от лимита.
- Источник истины по услугам Обихода — [PROJECT_CONTEXT.md §4](../PROJECT_CONTEXT.md), по районам — §5. Для сравнения с конкурентами важна как ширина каталога, так и глубина кейсов.
