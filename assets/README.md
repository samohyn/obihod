# assets/ — медиа-активы Обихода

Тяжёлые бинарные файлы проекта: фотокейсы бригад, видео-процессы, продакшн-экспорты брендинга, исходники иконок. **Не путать с `site/public/`** — туда кладём только то, что реально идёт в prod-бандл.

## Структура

```
assets/
├── photos/           # Фотокейсы до/после, бригада на объектах, техника
│   └── <YYYY-MM-DD>-<district>-<cluster>/
├── brand/            # Production-экспорты логотипа и брендинга (PDF/AI/EPS для типографии, dieline визиток)
├── icons-raw/        # Исходники кастомных иконок в Figma/SVG (если рисуются вне ServiceIcons.tsx)
├── videos/           # Видео-кейсы, съёмка процесса работы бригад
└── temp/             # Рабочие файлы в процессе обработки — чистится вручную
```

## Правила

- **Именование:** `YYYY-MM-DD-<district-slug>-<service-slug>-<stage>` → `2026-04-28-ramenskoye-spil-after.jpg`.
- **Forbid:** лица клиентов, номера машин клиентов, читаемые документы с ПДн (см. [foundations/photography.md](../design-system/foundations/photography.md)).
- **Форматы:** исходники JPG/HEIC (с телефонов бригад) / RAW / PSD. Для прод-использования — конверсия в `site/public/` (WebP / AVIF через Next.js Image).
- **Размер:** single-file лимит 50 МБ (для видео). Всё крупнее — во внешний storage (Beget S3 / Яндекс.Объектное).
- **Git:** папки `assets/photos/` и `assets/videos/` не коммитятся по умолчанию — добавляем в `.gitignore`. Коммитим только mini-примеры / thumbnail'ы для дизайн-референсов.

## Связанные артефакты

- [design-system/foundations/photography.md](../design-system/foundations/photography.md) — правила съёмки кейсов
- [design-system/foundations/print-materials.md](../design-system/foundations/print-materials.md) — CMYK-экспорты для типографии
- [agents/brand/logo/](../agents/brand/logo/) — мастер-файлы логотипа (SVG), не здесь
