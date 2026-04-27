# Art-brief для `cw` — US-12 Admin Micro-copy

**От:** `art` (Design Director) · **Дата:** 2026-04-27 (вечер)
**Источник:** [`art-concept-v2.md`](./art-concept-v2.md), [`brand-guide.html` v1.8 §12](../../../design-system/brand-guide.html).

## Что нужно сделать

Финализировать всю микро-копию admin panel. Я как `art` дал draft в TOV «бригадира» — твоя задача отшлифовать и расширить.

## Принципы (фиксированные)

1. **Caregiver, не Apologist** — admin это рабочий инструмент, ошибка = «вижу проблему, делаю», не «простите».
2. **Никогда «Упс! / Ой! / К сожалению»** — анти-TOV из CLAUDE.md immutable.
3. **Конкретика > общих фраз** — «Услуга „Вывоз мусора" сохранена» ≠ «Успешно сохранено!».
4. **Tabular nums** для всех чисел в копи (если идёт в HTML — в spec пометь `font-variant-numeric: tabular-nums`).
5. **Без «пожалуйста»** — это admin, не клиент-зона.
6. **Длина:** заголовки ≤ 40 символов, описания ≤ 150 символов, button labels ≤ 20 символов.
7. **Существующие admin.descriptions полей** — пройди их аудитом по списку из [art-concept v1 §7.2](../admin-visual/art-concept.md#72-tov-для-admindescription-на-полях).

## Список текстов (что писать)

### 1. Login screen

| Элемент | Draft от art | Что нужно от cw |
|---|---|---|
| Welcome message | (нет) | 0 или короткая строка типа «С возвращением». Решай — нужно ли вообще приветствие до auth. |
| Email label | `Email` | OK или «Почта» — твоё решение |
| Password label | `Пароль` | OK |
| Submit button | `Войти` | OK |
| Forgot password link | `Забыли пароль? →` | OK или «Забыли пароль» (без →, стрелка декоративная) |
| Error: wrong creds | `Email или пароль неверны` | Финал |
| Error: locked account | (нет) | «Аккаунт заблокирован. Спросите у администратора» — нужен ли? |
| Error: server | (нет) | «Сервер не отозвался. Попробуйте через минуту.» |
| Loading state | `[Войти]` (с спиннером) | OK или «Входим…» если decision |
| Copyright | `© 2026 · Обиход` | OK |

### 2. Dashboard greeting

Уже есть в `<BeforeDashboardStartHere>` (286 строк, 2026-04-23). Пройди ревью — поправь анти-TOV если есть.

### 3. Stat-cards (4 карточки)

| Card | Draft | Cw нужен |
|---|---|---|
| Card 1 | `3 / Новые заявки` | OK или «новых заявок» |
| Card 2 | `+1.2k / Уник. за 7д` | «Посетителей за 7 дней» — короткий пересмотр |
| Card 3 | `53 / Публ. страниц` | «Опубликованных страниц» |
| Card 4 | `0 / Ошибок CI` | «Сборок без ошибок» / «Ошибок сборки» / «Зелёный CI» |

Каждая карточка = ссылка → решай target page (Leads list / Analytics dashboard / Page Catalog widget / GitHub Actions external).

### 4. Page Catalog widget

| Элемент | Draft | Финал |
|---|---|---|
| Section heading | `КАТАЛОГ ОПУБЛИКОВАННЫХ СТРАНИЦ` | OK или короче «Публичные страницы» |
| Counter | `53 шт.` | OK |
| Filter button | `фильтр ▾` | OK или «Фильтр» |
| CSV button | `⇩ CSV` | OK или «Экспорт» |
| Group label «Услуги (4)» | OK | OK |
| Status — live | `✓ live` | «Опубликовано» / «✓» / «Live» |
| Status — pending revalidate | `⏱ обновляется` | твой вариант |
| Empty state | (если 0 страниц) | «Каталог пуст. Создайте первую страницу — она появится здесь.» |

### 5. List view filters / actions

| Элемент | Draft | Финал |
|---|---|---|
| Search placeholder | `Найти услугу, район, кейс…` | OK для глобального; для list view — «Поиск по [collection]» |
| Filter «Статус: все ▾» | OK | OK |
| CTA «+ Добавить» | OK | «+ Добавить услугу» / «+ Создать кейс» — варьируй по коллекции |
| Counter | `Найдено: 4` | OK или «4 элементов» |

### 6. Bulk action bar

| Элемент | Draft | Финал |
|---|---|---|
| Counter | `3 выбраны` | OK |
| Action 1 | `Опубликовать` | OK |
| Action 2 | `В архив` | OK |
| Action 3 (danger) | `Удалить` | OK или «Удалить навсегда» (с подтверждением) |

### 7. Edit view tabs (по коллекциям)

См. [art-concept-v2 §5](./art-concept-v2.md#5-edit-view-с-tabs-pattern-новое) — таблица tabs по 10 коллекциям. Все названия tabs в моих draft. Утверди / поправь:

```
Services → Основные · Контент · Sub-services · FAQ · SEO · Превью
Districts → Основные · Контент · Программа SEO · Превью
ServiceDistricts → Основные · Контент · MiniCase · FAQ · SEO · Превью
Cases → Основные · История · Галерея · SEO · Превью
Blog → Основные · Контент · How-to · FAQ · SEO · Превью
Authors / Persons → Основные · Био · Связи · Превью
B2BPages → Основные · Контент · SEO · Превью
Leads → Основные · Контакт · Услуга · Файлы · CRM-sync
SiteChrome → Header · Footer · Контакты · Соцсети · Trust-bar · Hooks
SeoSettings → По умолчанию · Robots · Sitemap · Schema
```

### 8. Status footer (edit view)

| Элемент | Draft | Финал |
|---|---|---|
| Label | `Статус:` | OK |
| Радио опции | `Черновик` / `Опубликован` | OK или «В работе» / «На сайте» |
| Save button | `Сохранить` | OK |
| Cancel button | `Отмена` | OK |
| Save toast (success) | `Услуга «Вывоз мусора» сохранена.` | OK или «Сохранено: Вывоз мусора» |
| Save toast (error) | `Не получилось сохранить. Попробуйте ещё раз.` | OK |
| Validation toast | `Заполните обязательные поля во вкладке "SEO".` | OK |

### 9. Empty / Error / 403 states

См. brand-guide v1.8 §12.6.

| State | Eyebrow | Title | Text | CTA |
|---|---|---|---|---|
| Empty Cases | (нет) | `Кейсов пока нет.` | `Добавьте первый — он попадёт в каталог сайта и в виджет dashboard.` | `+ Добавить кейс` |
| Empty Leads | (нет) | `Новых заявок нет.` | `Когда поступит заявка с сайта — появится здесь.` | (нет — пассивное ожидание) |
| 500 server | `SERVER ERROR · 500` | `Не удалось загрузить` | `Скорее всего — временная проблема. Попробуйте обновить страницу через минуту.` | `Обновить` / `На дашборд` |
| 403 access | `ACCESS · 403` | `Нет доступа к коллекции` | `Спросите у администратора — выдадут.` | `На дашборд` |
| 404 not found | `NOT FOUND · 404` | `Страницы admin нет` | `Возможно адрес из закладок устарел. Откройте дашборд.` | `На дашборд` |
| Loading | (skeleton — копи нет) | — | — | — |

Финализируй каждое — особенно для коллекций с разной семантикой (Cases empty ≠ Leads empty по смыслу).

### 10. admin.description полей (массовый аудит)

**Самая большая часть работы.** Посмотри список полей по основным коллекциям (из [be4-fields-checklist.md](../US-3-admin-ux-redesign/be4-fields-checklist.md) если ещё актуален). Для каждого `admin.description` — пройди anti-TOV фильтр.

Примеры из [art-concept v1 §7.2](../admin-visual/art-concept.md#72-tov-для-admindescription-на-полях):

- ❌ «Пожалуйста, загрузите фото объекта» → ✅ «Фото объекта. JPEG/WebP, до 5 МБ»
- ❌ «Мы рекомендуем указывать заголовок до 60 символов» → ✅ «Title тега до 60 символов»
- ❌ «В кратчайшие сроки опубликуется» → ✅ «Публикация — после прохождения гейта: miniCase + ≥ 2 FAQ»
- ❌ «Индивидуальный slug» → ✅ «Slug: латиница, дефисы, без пробелов»

Делается в `agents/cw/admin-descriptions-final.md` или дополни существующий [`cw-admin-descriptions-dictionary.md`](../US-3-admin-ux-redesign/cw-admin-descriptions-dictionary.md) (если есть).

### 11. Profile dropdown

| Item | Draft | Финал |
|---|---|---|
| Trigger | (инициалы в круге) | (визуал) |
| Item 1 | `Мой профиль` | OK или «Профиль» |
| Item 2 | `Выйти` | OK |
| Toast on logout | (нет) | «Сессия завершена.» — нужен ли? |

## Definition of Done

- [ ] Все 11 секций выше — финализированы.
- [ ] admin.description массовое ревью завершено (10 коллекций × N полей).
- [ ] Анти-TOV filter пройден (никаких «упс / индивидуальный подход / в кратчайшие сроки»).
- [ ] Tabular-nums помечены везде где числа.
- [ ] Длина: titles ≤ 40 символов, descriptions ≤ 150, buttons ≤ 20.
- [ ] Передача в `ui` для финального макета (некоторые места могут не помещаться — pingaнём).
- [ ] Approval от `art` (меня) перед merge в `cw-admin-descriptions-final.md`.

## Не входит

- Visual design — `ui`.
- Реализация в `.tsx` — `fe1`+`be4`.
- Toast UX (auto-dismiss / position) — `ux` + `ui`.

## Источники

- [art-concept-v2.md](./art-concept-v2.md) — концепт с micro-copy в drafts.
- [art-concept v1 §7.2](../admin-visual/art-concept.md#72-tov-для-admindescription-на-полях) — TOV фильтр.
- [brand-guide.html v1.8 §13 «Tone of Voice»](../../../design-system/brand-guide.html) — общие правила.
- [`contex/03_brand_naming.md`](../../../contex/03_brand_naming.md) — TOV манифест.
- [Anti-TOV хук](../../../.claude/hooks/protect-immutable.sh) — формальный фильтр.

Финал в `agents/cw/admin-copy.md` или раздел в существующем `agents/cw/`.
