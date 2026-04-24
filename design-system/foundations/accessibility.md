# Accessibility · foundation

**Статус:** v1.0 · approved 2026-04-24
**Стандарт:** WCAG 2.2 Level AA — **минимум**. Некоторые требования ужесточены до AAA там, где это достижимо и критично для B2B-заказчиков (УК/ТСЖ часто требуют 152-ФЗ + доступность).

## Принцип

Не «a11y после», а **a11y в spec'е**. Каждый компонент в `components/` имеет обязательный раздел «A11y». PR без a11y-раздела в spec'е не принимается в `fe`.

## Контраст

| Пара | Требование WCAG | Наш минимум |
|---|---|---|
| Body-текст (17 px default) | 4.5:1 | **16.8:1** (AAA) ink `#1c1c1c` на bg `#f7f5f0` |
| Large text (18+ / 14+ bold) | 3:1 | **5.2:1** (AA) muted `#6b6256` на bg (admin); `#8c8377` только на 18+ на публичном сайте |
| UI-компоненты (рамка, иконка) | 3:1 | Primary `#2d5a3d` на bg = 8.1:1 ✓; line `#e6e1d6` на bg = 1.3:1 ❌ — **это только декор, не UI-индикатор** |
| On-primary (текст на бренд-зелёном) | 4.5:1 | **8.9:1** (AAA) `#f7f5f0` на `#2d5a3d` |
| Accent (янтарный) | 3:1 UI | 3.3:1 на bg ✓ (только как UI-бейдж/фокус-ring, не body) |
| Error | 4.5:1 | 4.7:1 `#b54828` на bg |

**Инструмент проверки:** Chrome DevTools Contrast checker или `npx @adobe/leonardo-contrast-colors`. Записываем в spec каждого компонента.

## Клавиатура

- Весь функционал **доступен с клавиатуры** (WCAG 2.1.1). Нет мышиных-only паттернов (hover-menu без кликабельного trigger, drag-only интерфейсы без keyboard-эквивалента).
- **Tab-order** логичный: сверху вниз, слева направо. Без `tabindex > 0`. Используем только `tabindex="0"` для интерактивных не-form элементов и `tabindex="-1"` для programmatic focus.
- **Focus-visible** всегда видим (2.4.7). Даже на dark-фоне — focus-ring через accent `#e6a23c` с bg-gap (см. `{shadow.focus-ring}`).
- **Skip-link** в header: `<a href="#main" class="sr-only focus:not-sr-only">Пропустить навигацию</a>` (TODO — реализовать при полноценном Header).
- **Escape** закрывает modal/drawer/dropdown. `Enter` активирует button. `Space` тоже активирует button и чекбокс.

## Screen reader

- **Семантика сначала.** `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>` — не все `<div>`.
- **Heading hierarchy** без пропусков (`h1 → h2 → h3`). 1 `h1` на страницу.
- **Landmarks** с `aria-label` если их несколько (`<nav aria-label="primary">`).
- **Forms:** `<label htmlFor>` для всех полей, `aria-describedby` для helper + error, `aria-invalid` при ошибке.
- **Live regions:** toast-уведомления `role="status"` (polite) или `role="alert"` (assertive для критичного). Loading-прогресс — `aria-busy` на контейнере.
- **Русский язык:** `<html lang="ru">` — обязательно. Для латинских вставок в тексте (B2B, amoCRM) — не размечаем отдельно, доверяем screen reader'у.

## Touch-target

- **Минимум 44×44 px** для всех интерактивов на mobile (WCAG 2.5.5 AA). Используем `min-height: 44px` в `.btn` и инпутах.
- Иконка-кнопка: icon может быть 24 px, но `padding` расширяет кликабельную зону до 44+.
- На mobile CTA в формах — 48 px, не скупимся на высоту.

## Motion

- **prefers-reduced-motion** уважается (WCAG 2.3.3). Базовый CSS в `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- **Автовоспроизведение видео** запрещено. Видео-кейсы — по клику с контролами.
- **Карусели и авто-прокрутка** запрещены. Если есть — пауза по умолчанию или контрол Play/Pause на видном месте.
- **Parallax** запрещён — см. [`tokens/motion.json`](../tokens/motion.json).

## Формы и ошибки

- **Inline validation** после blur поля (не во время ввода) — не раздражаем.
- **Error text** обязательно + иконка `AlertCircle` (не только цвет) — для дальтоников.
- **Required fields помечены `*`** + `aria-required="true"`. «Все поля обязательны если не указано иное» — плохо, делаем явно.
- **Success state** не только цветом + иконкой, но и текстом: «Телефон сохранён» — явно.

## Изображения

- **Все функциональные `<img>` имеют `alt`**. Декоративные — `alt=""` (пустая, не отсутствует).
- **Фото кейсов до/после** — описываем словами: `alt="Участок до удаления бурелома — сухое дерево над крышей"`.
- **Logo в header** — `aria-label="Обиход — главная"` + `<title>` в SVG.
- **Фото на фоне hero** — декоративное, `alt=""`, текст над ним в отдельном DOM-элементе с реальным контрастом.

## Цвет и смысл

- **Не используем только цвет для передачи информации** (WCAG 1.4.1):
  - «Красный» = ошибка: всегда + иконка + текст
  - «Зелёный» = успех: всегда + иконка + текст
  - «Янтарный» = внимание/draft: всегда + текст-бейдж «Черновик»

## Язык и локализация

- **Lang="ru"** на `<html>`. Страницы без русского контента (редирект/404) могут быть `lang="ru"` с английским fallback-текстом в content.
- **Дата:** формат `24 апреля 2026` для body, `2026-04-24` только в mono/tabular (ID, коммиты).
- **Телефон:** `+7 985 170 51 11` (E.164 с пробелами для читаемости), для `tel:` — `tel:+79851705111` без пробелов.

## Тестирование

| Инструмент | Когда |
|---|---|
| axe DevTools (Chrome) | Перед каждым PR с UI-изменением |
| Playwright + `@axe-core/playwright` | В E2E тестах — проверка axe violations на всех маршрутах |
| Lighthouse | Перед релизом — a11y score ≥ 95 |
| Ручной keyboard-тест | Каждое новое interactive component |
| VoiceOver (Safari) / NVDA (Chrome/Firefox) | Формы, модалки, toast — перед релизом |

## Anti-patterns

- ❌ `outline: none` без замены
- ❌ `placeholder` вместо `label`
- ❌ Контраст < 4.5:1 для body
- ❌ Только цвет для error/success
- ❌ Disable кнопки без причины (disabled без `aria-disabled` + tooltip «почему»)
- ❌ Auto-focus первого поля на mobile (клавиатура закрывает экран)
- ❌ Карусели без паузы
- ❌ Прыгающие элементы при загрузке (layout shift > 0.1 CLS)

## DoD

- [x] Контраст-матрица проверена для базовой палитры
- [x] Правила клавиатуры / screen reader / touch-target / motion зафиксированы
- [x] Anti-patterns перечислены
- [ ] axe-тест в CI — **TODO P1** (в E2E Playwright suite)
- [ ] Skip-link в Header — TODO
- [ ] VoiceOver smoke-тест главного flow «фото → смета» — перед релизом MVP
