# kronotech.ru

**Дата сканирования:** 2026-04-25
**Статус:** **Заблокирован DDoS-Guard / Antibot Cloud** — не удалось получить ни sitemap, ни главную

## Sitemap / IA

- Sitemap.xml возвращает HTML antibot-страницы (Loading...) вместо XML
- Главная также блокирована для curl и WebFetch
- Удалось получить **только robots.txt** — он содержит подсказки о структуре

## Что известно из robots.txt

Disallow-правила раскрывают существующие категории URL:
```
/krovelnye-raboty/
  ├── /montazh-falcevoj-krovli
  ├── /remont-myagkoy-krovli
  ├── /remont-metallicheskoy-krovli
  ├── /remont-kryshi-iz-metallocherepicy
  ├── /remont-shifera-krovli
  ├── /montazh-naplavlyaemoj-krovli
  └── /prays-krovelnye-raboty
/otdelka-pomeshcheniy/
  ├── /remont-ofisov-klassa-a
  ├── /remont-ofisov-klassa-b
  ├── /remont-ofisov-klassa-c
  └── /remont-medicinskoy-сliniсi
/publications/                    # блог-статьи (закрыт ряд URL)
/nashi-proekty/                   # портфолио (закрыты пагинации)
/materials/                       # материалы
/home-teg/, /publications-teg/    # тег-страницы
```

## Технологии

- Drupal (по структуре /core/, /profiles/, /sites/default/files/)
- DDoS-Guard / Antibot Cloud — антипарсинг

## Pillar-категории (восстановлено)

Можно предположить минимум:
- /krovelnye-raboty/ — кровельные работы (минимум 6 sub-services)
- /otdelka-pomeshcheniy/ — отделка помещений (включая офисы класса A/B/C, мед. клиники)

## Что не удалось установить

- Полный список pillar-категорий
- Глубина каталога
- Наличие гео-страниц
- B2B-структура
- Калькулятор
- Объём блога

## Рекомендация

Для Wave 2 — попробовать через Yandex Webmaster (если будет токен), Keys.so / Serpstat domain export, или ручной обход с настоящим браузером (Playwright с stealth-mode). DDoS-Guard блокирует только curl/WebFetch — браузер с JS пройдёт.

## URL-паттерны

1. `/krovelnye-raboty/[sub-service]` — 2 уровня
2. `/otdelka-pomeshcheniy/[sub-service]` — 2 уровня
3. `/publications/[slug]` — блог
4. `/nashi-proekty/[slug]` — портфолио
5. `/home-teg/[tag]`, `/publications-teg/[tag]` — теги

**Канонический паттерн:** `kronotech.ru/[pillar]/[sub-service]` (без слеша в конце по robots).
