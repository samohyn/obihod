# promalper.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** промальп (фасад/кровля/клининг/герметизация/удаление деревьев/монтаж)

## Sitemap / IA

- Sitemap: 66 URL, плоская структура
- Все услуги — корневые URL с расширением `.html` (нетипично, legacy-CMS)
- Нет HTTPS на части ссылок

```
promalper.ru/
├── /
├── /czenyi.html, /otzivi.html, /vakansii.html, /kontaktyi.html
├── /vyipolnennyie-rabotyi.html
├── /stati.html
├── /nashi-uslugi.html
│
├── /[service-slug].html        # ~55 услуг плоско на корне
│   ├── # — Фасад —
│   ├── /fasadnyie-rabotyi.html
│   ├── /pokraska-fasada.html
│   ├── /pokraska-zagorodnyix-domov.html
│   ├── /pokraska-dachi.html
│   ├── /shtukaturka-fasada.html
│   ├── /remont-shtukaturki-fasada.html
│   ├── /remont-fasadov.html, /kosmeticheskij-remont-fasadov.html
│   ├── /razrushenie-fasadov.html
│   ├── /remont-treshhin-na-fasade.html
│   ├── /mojka-fasadov.html
│   ├── /pomyivka-fasadov-s-ispolzovaniem-penogeneratora.html
│   ├── /gidrofobizaciya-fasadov.html
│   ├── /ochistka-sten-ot-vysolov.html
│   │
│   ├── # — Герметизация —
│   ├── /germetizacziya-mezhpanelnyix-shvov.html
│   ├── /germetizacziya-balkonov-i-lodzhij.html
│   ├── /germetizacziya-okon.html, /germetizaciya.html
│   ├── /teplyij-shov.html
│   │
│   ├── # — Кровля / Снег —
│   ├── /uborka-snega-s-kryish.html
│   ├── /mexanizirovannaya-uborka-snega-s-kryish.html
│   ├── /uborka-snega-s-krovel-chastnyix-kottedzhej-dach-domov.html
│   ├── /obsluzhivanie-krovli-v-zimniy-period.html
│   ├── /pokraska-krovli.html
│   ├── /montazh-vodostokov.html
│   ├── /ochistka-vodostokov-i-zhelobov.html
│   ├── /montazh-kryishek-na-vodostochnyie-voronki.html
│   │
│   ├── # — Клининг / Мойка —
│   ├── /mojka-okon.html
│   ├── /udalenie-vodnogo-kamnya.html
│   ├── /poslestroitelnyij-klining-novostroek.html
│   ├── /kliningovyie-uslugi.html
│   ├── /mojka-czexov-i-promyishlennyix-pomeshhenij.html
│   │
│   ├── # — Деревья —
│   ├── /valka-derevev.html
│   ├── /vyrubka-derevev.html
│   ├── /udalenie-derevev.html
│   ├── /snos-derevev.html
│   ├── /raspil-derevev.html
│   ├── /obrezka-vetvej-derevev.html
│   ├── /kronirovanie-derevev.html
│   ├── /korchevanie-pnej.html
│   ├── /ochistka-uchastka-ot-derevev.html
│   │
│   ├── # — Монтаж / Покраска —
│   ├── /montazh-kondiczionerov.html
│   ├── /montazhnyie-rabotyi.html
│   ├── /montazh-vozduxovodov.html
│   ├── /montazh-bannerov.html
│   ├── /pokraska-pozharnyix-lestnicz.html
│   ├── /pokraska-metallokonstrukczij.html
│   ├── /pokraska-promyshlennyh-obektov.html
│   ├── /pokraska-zaborov.html
│   ├── /pokraska-vodonapornyh-bashen.html
│   ├── /pokraska-dymovyh-trub.html
│   ├── /obespyilivanie-balok.html
│   ├── /otdelka-monolitnyh-poyasov.html
│   └── /remont-kirpichnoj-kladki.html
│   │
│   └── # — Информационные (статьи на корне) —
│       ├── /vyibor-moyushhego-sredstva-dlya-fasada.html
│       ├── /kak-pomyit-gryaznyie-okna.html
│       └── /rzhavchina-na-vodonapornyix-bashnyax-i-trubax-kak-borotsya-s-korroziej.html
```

## Pillar-категории

Из WebFetch главной — 7 pillar в меню:
1. Фасадные работы
2. Покрасочные работы
3. Клининг на высоте
4. Герметизация
5. Удаление деревьев
6. Монтажные работы
7. Обслуживание кровли зимой (включая снег)

В URL pillar **не выделены** — все услуги плоско на корне с `.html`.

## Дробление подуслуг

- **1 уровень**, плоско
- Семантика по объектам и материалам (заборы, лестницы, водонапорные башни)
- Информационные статьи без префикса /blog/, перемешаны с услугами на корне (антипаттерн)

## Гео-страницы

- **Нет programmatic гео**

## B2B

- **Отдельного раздела нет**
- На главной упоминают «индивидуальные условия для УК/ТСЖ»
- /pokraska-promyshlennyh-obektov.html, /mojka-czexov-i-promyishlennyix-pomeshhenij.html — implicit B2B

## Блог

- /stati.html — листинг
- Статьи смешаны с услугами на корне (нет /blog/[slug]/)
- ~5-10 информационных URL

## Уникальные элементы

- ❌ Калькулятор отсутствует
- ❌ Форма «фото→смета» отсутствует
- ✅ /vyipolnennyie-rabotyi.html — портфолио

## URL-паттерны

1. `/[slug].html` — услуги (доминирующий)
2. `/[info-slug].html` — статьи (без префикса)

**Канонический паттерн:** `promalper.ru/[slug].html`. Самый legacy в выборке — `.html`-расширения, нет блог-префикса.
