# seosite/ — SEO-артефакты Обихода

Все выгрузки из SEO-сервисов (Keys.so, Just-Magic, Topvisor) и обработанные результаты для семантического ядра, конкурентного аудита и контент-плана.

## Назначение

Папка живёт **отдельно от `site/`** (код) и **отдельно от `contex/`** (стратегия). Здесь — только *операционные* SEO-данные, которые меняются итеративно.

Связана с эпиками:
- **US-4** — semantic core + competitor audit (заполняем сейчас)
- **US-7** — content + SEO coverage audit
- **US-10** — SEO + neuro tech audit + monitoring

## Структура

```
seosite/
├── 01-competitors/      # конкурентный аудит (15 доменов)
│   ├── README.md         # сводка + матрица позиций
│   ├── shortlist.md      # 15 конкурентов с обоснованием
│   ├── deep/<domain>.md  # детальный профиль каждого: трафик, топ-страницы, URL-паттерны, IA, контент-стратегия
│   └── content-gaps.md   # пересечения keys, что у конкурентов есть, у нас нет
├── 02-keywords/         # выгрузки из сервисов и обработанные ключи
│   ├── seed.txt          # стартовые seed-запросы (~150–200)
│   ├── raw/              # сырые экспорты Keys.so / Topvisor / Wordstat
│   └── normalized.csv    # дедуп + canonical частоты + регион
├── 03-clusters/         # кластеризация (Just-Magic + ручная сортировка)
│   ├── arboristika.md
│   ├── chistka-krysh.md
│   ├── vyvoz-musora.md
│   ├── demontazh.md
│   ├── b2b.md
│   └── tools-and-docs.md  # порубочный билет, аренда техники, штрафы ГЖИ
├── 04-url-map/          # IA сайта — что фаундер видит и согласовывает
│   ├── sitemap-tree.md   # tree всех URL: pillar / sub-services / programmatic / B2B / blog
│   ├── pages-summary.md  # таблица: URL · цель · ключевые запросы · приоритет · статус
│   └── decisions.md      # архитектурные развилки (что сделали и почему)
├── 05-content-plan/     # темник для cw на 3-6 мес
│   ├── content-plan.md
│   ├── pillar-briefs/    # ТЗ на pillar-страницы
│   ├── programmatic/     # шаблоны для service × district
│   └── blog-topics.md
├── 06-eeat/             # E-E-A-T-проработка
│   ├── experience.md     # кейсы, фотодок, до/после
│   ├── expertise.md      # авторы, СРО, лицензии
│   ├── trust.md          # реквизиты, отзывы, гарантия
│   └── neuro-faq.md
├── 07-neuro-seo/        # требования к нейро-присутствию
│   ├── tldr-blocks.md
│   ├── faq-format.md
│   └── schema-checklist.md
├── 08-monitoring/       # позиции, видимость, нейро-цитируемость
│   ├── topvisor-projects.md
│   ├── positions-weekly/  # YYYY-MM-DD-week-N.md
│   └── neuro-mentions/
└── raw/                 # любые сырые выгрузки до классификации
```

## Кто пишет сюда

- **`re`** — экспорты Keys.so/Topvisor → `02-keywords/raw/`, `01-competitors/deep/`
- **`seo1`** — кластеры → `03-clusters/`, URL-карта → `04-url-map/`, контент-план → `05-content-plan/`, E-E-A-T → `06-eeat/`, нейро-SEO → `07-neuro-seo/`
- **`cw`** — валидация темника на TOV в `05-content-plan/`
- **`ux`** — со-ревью URL-карты в `04-url-map/`
- **`seo2`** — техническое ТЗ на основе артефактов отсюда (но техреализация — не здесь, в `site/`)

## Что НЕ кладём сюда

- ❌ Код сайта (это `site/`)
- ❌ Стратегические доки бренда/TOV/оффера (это `contex/`)
- ❌ Personal данные клиентов
- ❌ API-ключи (они в `site/.env.local`)

## Git

`seosite/` коммитится в repo (это публичный repo `samohyn/obihod`). **Нельзя класть сюда** ничего, что не должно быть публичным:
- логины/пароли — в `.env.local`
- персональные данные клиентов — нигде в repo
- внутренние финансовые цифры конкурентов (если когда-то достанем) — в gitignored файл или внешний vault

## Артефакты по US-4 — что появится через ~3-5 дней работы команды

1. `01-competitors/shortlist.md` — 15 конкурентов с приоритетом
2. `01-competitors/deep/*.md` — 5–7 глубоких профилей (минимум: arboristik, liwood, promtehalp, lesoruby, alpme)
3. `02-keywords/normalized.csv` — ≥ 1 500 ключей с частотами по МО
4. `03-clusters/*.md` — кластеризация по 4 направлениям + B2B + docs
5. `04-url-map/sitemap-tree.md` — tree всех URL для согласования с фаундером
6. `05-content-plan/content-plan.md` — темник на 3 месяца
