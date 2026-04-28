# Записка для `po` — US-11 IA Extension

**От:** `art` (Design Director)
**Дата:** 2026-04-27
**Статус:** требует оформления intake.md + Linear OBI issue + декомпозиции по ролям

## Что произошло

Оператор 2026-04-27 в сессии расширил сайт с 4 до 6 направлений:
- 5-е: **«Дизайн ландшафта»** — flat-link, монолитная страница (на старте без подменю).
- 6-е: **«Магазин»** — mega-menu, 9 preliminary категорий саженцев и товаров для сада.

И отдельным треком — попросил добавить в дизайн-систему **страницы ошибок** (404 / 500 / 502 / 503 / offline), которых раньше не было.

## Что я сделал как `art`

1. **Обновил `CLAUDE.md` immutable** — добавил «Расширения навигации (2026-04-27)» в таблицу, раздел «Что это» расширил с «4-в-1» на «4 сервисных pillar + 2 расширения».
2. **`design-system/brand-guide.html` v1.6 → v1.7:**
   - 9 shop-иконок line-art (24×24 stroke 1.5 currentColor) в секции «08 · Иконография».
   - Mega-menu Магазина (3 колонки: Деревья / Кустарники / Цветы) в секции «09 · Навигация» — заменил flat-link.
   - Flat-link «Дизайн ландшафта» в той же секции.
   - Mobile accordion обновлён (раскрыт под 9 категорий + Дизайн ландшафта).
   - Новая секция «11.5 · Страницы ошибок» — 5 карточек 404/500/502/503/offline с уникальными line-art иллюстрациями, draft-копией в TOV, картой Next.js файлов, принципами копирайта.
   - Changelog обновлён, footer → v1.7.
3. **`art-brief-ui.md`** — для `ui`+`fe1`: вынос 9 shop-иконок в `site/components/icons/shop/`, перенос mega-menu Магазина в `Header.tsx`, добавление flat-link «Дизайн ландшафта», + дополнительно вынос 9 district-иконок в `site/components/icons/districts/` (техдолг от v1.6).
4. **`art-brief-cw.md`** — для `cw`: финал текстов 5 error-pages в TOV «бригадира».

## Что нужно от тебя (`po`)

### 1. Завести US-11 в Linear (team OBI)

Минимальный intake (`intake.md`):

```
US-11 IA Extension · Магазин mega + Дизайн ландшафта flat + Error pages 5 шт.

Бизнес-цель: расширить сайт до 6 направлений согласно решению оператора 2026-04-27.
Не делать: контент категорий и страницы /dizain-landshafta/ (отдельный US после URL slugs от seo1).

Pre-intake:
- Дизайн готов (brand-guide.html v1.7)
- Art-brief ui — есть
- Art-brief cw — есть
```

Декомпозиция:
- `ui` → `fe1`: Header.tsx + 9 shop-иконок + 9 district-иконок (techdebt вынос). Spec — `art-brief-ui.md`.
- `cw`: финал текстов error-pages. Spec — `art-brief-cw.md`.
- `fe1`: реализация `app/not-found.tsx` + `app/error.tsx` + `app/global-error.tsx` + `<ErrorState>` компонент.
- `do`: nginx конфиг `/errors/502.html` + `503.html` на Beget VPS, header `Retry-After`.
- `seo1`: URL-slugs для `/magazin/<категория>/`, `/dizain-landshafta/`, мета-теги, `<title>` на 404/503, `noindex` где нужно.
- `be3`/`be4`: Payload коллекции `Products` (для Магазина) — отдельный мини-эпик после согласования URL.
- `qa1`: Playwright e2e на mega-menu Магазина + error pages.

### 2. Подтвердить URL-slugs

Я в `art-brief-ui.md` указал preliminary slugs:
```
/magazin/plodovye-derevya/
/magazin/kolonovidnye/
/magazin/listvennye/
/magazin/khvoynye/
/magazin/krupnomery/
/magazin/plodovye-kustarniki/
/magazin/dekorativnye-kustarniki/
/magazin/cvety/
/magazin/rozy/
/dizain-landshafta/
```

Это **должен подтвердить `seo1`** (под wsfreq) перед merge — иначе придётся ещё раз менять Header.tsx и ставить редиректы.

### 3. Решить порядок навигации

Я выбрал дефолт:
```
Услуги ▾ · Районы ▾ · Кейсы ▾ · Магазин ▾ · Дизайн ландшафта · Цены · Блог · Контакты
```

Альтернативы (могут быть лучше с точки зрения IA):
- A. Услуги ▾ · Магазин ▾ · Дизайн ландшафта · Районы ▾ · Кейсы ▾ · Цены · Блог · Контакты — все «коммерческие пути» подряд.
- B. Уменьшить до 7 пунктов, убрав «Контакты» в footer (есть CTA + footer + телефон в шапке).

На 1024 px 8 пунктов уже близко к перегрузу. Предлагаю **B** или **A**, реши.

### 4. Решить — нужно ли в этой же US делать заглушку контента

`/magazin/` и `/dizain-landshafta/` без страниц = 404 после merge Header.tsx. Варианты:
- **Заглушка-страница** «Скоро открываем» (быстро, минимум работы) с CTA «Получить смету» — в этой же US.
- **Не мерджить Header** до готовности контента — большой блок, разделять не хочется.
- **Редирект** `/magazin/* → /uslugi/` или `/dizain-landshafta/ → /uslugi/arboristika/` — кривовато.

Рекомендую **заглушку-страницу** с TOV-копи от `cw` (5 минут работы) — отдельный sub-task в этой же US.

## Risks / open questions

- **Расширение immutable** — такое решение принимали 2026-04-27 в чате, не оформлено ADR. Стоит зафиксировать `ADR-0004-ia-extension-shop-landscape.md` после ответа `po` (это нужно `tamd`).
- **Магазин = e-commerce** — это новая зона для всего стека. Payload коллекция `Products`, корзина, checkout (или leadgen-only?) — большая программа. На уровне навигации это Магазин ▾ ведёт **в каталог-листинг без корзины** в первой итерации, заявка идёт через PhotoQuoteForm как и сейчас.
- **«Дизайн ландшафта» — мини-калькулятор?** В brief'е я не ставил эту задачу `ui`, но если оператор захочет — нужен отдельный US.

## Что не делал

- Не трогал `Header.tsx` (не моя зона по мандату art) — это задача `ui`+`fe1` через art-brief.
- Не заводил Linear issue (не моя зона — это `in`+`po`).
- Не писал ADR-0004 (не моя зона — это `tamd`).
- Не решал URL slugs финально (не моя зона — `seo1`).

## Файлы

```
team/specs/US-11-ia-extension/
├── art-brief-ui.md      # для ui+fe1
├── art-brief-cw.md      # для cw
└── note-po.md           # этот файл
```

Оператор → `in` → ты сам берёшь US-11 → пилишь intake.md и декомпозицию.
