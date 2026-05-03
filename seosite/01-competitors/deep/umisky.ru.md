# umisky.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** промальп (кровля/фасад/мойка/монтаж) с фокусом на B2B-обслуживание

## Sitemap / IA

- Sitemap-индекс: 4 sub-sitemaps (files/iblock_1-3, iblock_14)
- Bitrix-структура
- **В sitemap отсутствуют URL услуг** — выгружены только /about/articles/, /about/news/, /about/faq/, /about/docs/
- 69 URL по факту в sitemap, но реальная структура шире (выяснено через WebFetch главной)

```
umisky.ru/
├── /                              # главная
├── /services/                     # **/услуги и цены/** (из меню)
│   └── (страницы услуг существуют, но не в sitemap — техн. недогляд)
├── /gallery/                      # галерея
├── /reviews/                      # отзывы
├── /contacts/                     # контакты
├── /about/                        # о компании
│
├── /about/articles/[slug]/        # 41 статья блога
│   ├── /abonentskoe-obsluzhivanie-krovli-zimoj/
│   ├── /cena-na-mojku-okon-i-fasadov/
│   ├── /cena-ochistki-krysh-ot-snega/
│   ├── /demontazh-dymovoj-truby/
│   ├── /gidrofobizaciya-fasadov/
│   ├── /kak-chasto-nuzhno-ochishat-krovlu-ot-snega/
│   ├── /mojka-fasadov-zdanij-apparatom-vysokogo-davleniya/
│   ├── /multilift-dlya-snega/
│   ├── /normativnye-akty-po-ochistke-snega/
│   └── ... (тематика — мойка, снег, кровля, фасад, нормативка)
│
├── /about/docs/[id]/              # 6 страниц документов (СРО, лицензии)
├── /about/faq/[id]/               # 11 FAQ
├── /about/news/[slug]/            # 9 новостей компании
└── (umi-price.pdf — прайс на скачивание)
```

## Pillar-категории

Из WebFetch главного меню (5 пунктов):
- О компании (/about/)
- **Услуги и цены** (/services/) — общий каталог
- Галерея (/gallery/)
- Отзывы (/reviews/)
- Контакты (/contacts/)

Услуги из главной (без отдельных URL в sitemap):
- Очистка кровель от снега (от 10 000 ₽) <!-- obihod:ok -->
- Мойка остекления и фасадов на высоте (от 20 000 ₽) <!-- obihod:ok -->
- Фасадные работы
- Герметизация швов
- Монтажные работы
- Ремонт кровли

## Дробление подуслуг

- Из меню — единая «Услуги и цены» (без иерархии)
- Реальная глубина не вытащена через sitemap

## Гео-страницы

- **Нет programmatic гео**
- Сайт работает по «Москва + МО + СПб» (упомянуто Mytishchi, Stalinskaya vysotka в статьях)

## B2B

- **Отдельного раздела нет**
- Упоминается «программа лояльности для бюджетных организаций»
- Абонентское обслуживание — implicit B2B (есть в статьях /abonentskoe-obsluzhivanie-krovli-zimoj/)
- Клиенты-логотипы на главной

## Блог

- /about/articles/ — **41 статья**
- Темы: цены на мойку/чистку, нормативка по снегу, оборудование, гидрофобизация, монтаж бан­неров, безопасность
- Хорошее покрытие commercial-intent тематики «цена на ...»

## Уникальные элементы

- ✅ **PDF-прайс** umi-price.pdf — нетипично, но удобно для B2B
- ✅ /about/docs/ — лицензии/СРО как отдельные URL (E-E-A-T-сигналы)
- ✅ FAQ как 11 отдельных URL
- ❌ Калькулятор отсутствует
- ❌ Sitemap не покрывает услуги (техническая проблема)

## URL-паттерны

1. `/services/` — общий каталог
2. `/about/articles/[slug]/` — блог
3. `/about/docs/[id]/`, `/about/faq/[id]/`, `/about/news/[slug]/` — поддержка/контент
4. `/gallery/`, `/reviews/`, `/contacts/` — корневые

**Канонический паттерн:** `umisky.ru/about/[type]/[slug]/` для контента, `/services/` для услуг. Sitemap-эмиссия неполная.
