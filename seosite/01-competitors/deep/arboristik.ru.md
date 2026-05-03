# arboristik.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** арбо-only (ядро) + чистка крыш как доп. услуга

## Sitemap / IA

- Sitemap.xml: 78 URL, lastmod 2017-01-10 (давно не обновлялся, но навигация ссылается на /районы/)
- WordPress, плоская структура без вложенных категорий услуг

```
arboristik.ru/
├── /                                  # главная
├── /o-kompanii/                       # о компании
├── /kontaktyi/                        # контакты
├── /tsenyi/                           # цены
├── /nashi-rabotyi/                    # портфолио (категории /category/vyipolnennyie-rabotyi/)
├── /dopolnitelnyie-uslugi/            # доп. услуги
├── /poleznie-idei/ + /page/2..5/      # блог-листинг (5 страниц)
├── /category/poleznie-idei/           # категория блога
├── /category/snarjgenie-dlia-arboristiki/  # категория блога: снаряжение
├── /category/treeclimbing/            # категория блога: древолазание
├── /category/vyipolnennyie-rabotyi/udalenie-derevev/
│
├── /[service-slug]/                    # плоский каталог услуг
│   ├── /korchevanie-pney/
│   ├── /kronirovanie-derevev/
│   ├── /kronirovanie-berezyi/
│   ├── /kronirovanie-klenov/
│   ├── /kronirovanie-topoley/
│   ├── /sanitarnaya-obrezka-derevev/
│   ├── /osennyaya-obrezka-derevev/
│   ├── /tipyi-obrezki-derevev-i-kustarnikov/
│   ├── /sposobyi-obrezki-derevev/
│   ├── /sposobyi-ukrepleniya-derevev/
│   ├── /usloviya-obrezki-derevev/
│   ├── /valka-derevev-chastyami-i-polnostiyu/
│   ├── /izmelchenie-pney-penodrobilkoy/
│   ├── /udalenie-pney-penegryizkoy/
│   ├── /promyishlennyiy-alpinizm/
│   ├── /kak-bezopasno-udalit-derevo/
│   └── ... (десятки информационных страниц вперемешку с услугами)
│
└── /[district]/                       # гео-страницы (60+ районов МО, см. навигация)
    ├── /balashiha/, /himki/, /odintsovo/, /mytishi/ и т.д.
```

## Pillar-категории

**Pillar явно не выделены** — навигация плоская, услуги и информационные статьи смешаны в одном уровне:
- Удаление деревьев (валка, спил, удаление аварийных)
- Обрезка деревьев (санитарная, омолаживающая, формовочная, кронирование)
- Удаление пней (корчевание, измельчение пенодробилкой)
- Промышленный альпинизм
- Чистка крыш (упоминается, отдельной pillar нет)
- Доп. услуги (/dopolnitelnyie-uslugi/)

## Дробление подуслуг

- Глубина 1 уровень — все услуги на корне домена: `/spilivanie-derevev-vo-dvorah/`, `/kronirovanie-berezyi/`
- Подвиды по породам (кронирование берёзы / клёнов / тополей) — отдельные URL
- Тематическое смешение: на тех же URL живут информационные статьи («что такое арбористика», «опасен ли короед»)

## Гео-страницы

- **Есть отдельный раздел /Районы/ в навигации, ~60+ населённых пунктов МО** (упомянуто в WebFetch главной)
- В sitemap не выгружены отдельно — это говорит о слабой технической реализации
- Покрыты районы Москвы и МО (Балашиха, Химки, Одинцово, Мытищи, Пушкино и др.)

## B2B

- **Отдельного раздела нет**
- В контенте упоминается «работаем с юридическими лицами» (УК/ТСЖ/застройщикам)
- Нет /b2b/, /korporativnyim/, /uk/

## Блог

- Есть: /poleznie-idei/ (5 страниц листинга) + категории /category/poleznie-idei/, /treeclimbing/, /snarjgenie-dlia-arboristiki/
- Объём: ~50 информационных URL в sitemap, фактически больше через пагинацию
- Темы: уход, болезни деревьев, методы валки, законодательство, регуляторика (порубочный билет, штрафы)

## Уникальные элементы

- ❌ Калькулятор отсутствует
- ❌ Форма «фото→смета» отсутствует
- ❌ Онлайн-чат не виден
- ✅ Таблица цен /tsenyi/
- ✅ Глубокая семантика по подвидам (кронирование тополей / клёнов / берёз)

## URL-паттерны

- `/[service-or-info-slug]/` — плоский, всё на корне (доминирующий, ~70%)
- `/category/[topic]/` — категории блога (4 шт)
- `/[district]/` — гео-страницы (вне sitemap)
- `/page/N/` — пагинация
- `/category/[topic]/page/N/` — пагинация в категориях

**Канонический паттерн:** `arboristik.ru/[slug]/`. Никакой иерархии услуг — типичный SEO-старый-WordPress.

---

## Δ от Stage 2 W11 (refresh 2026-05-03)

- **URL count:** **78** (W11 ~150 estimate) — **-48%**. Реальный sitemap.xml даёт 78 URL; W11 оценка была завышена. Sitemap-генератор: gensitemap.ru, lastmod 2017-01-10 (sustained — давно не обновлялся).
- **Notable:** sustained legacy WordPress, никакой иерархии. Контент outdated (2017 sitemap).
- **Schema-coverage:** sustained ~5% (no JSON-LD).
- **CTA / pricing:** sustained.
- **W14 implication:** наш Stage 3 ~230 vs arboristik **78** = closure **295%** (мы значительно опережаем). Sustained опережение confirmed по URL + содержательной свежести.
