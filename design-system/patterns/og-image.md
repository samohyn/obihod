# OG-image · pattern

**Статус:** v1.0 · approved 2026-04-24
**Endpoint:** `/api/og` — dynamic через `next/og` (ImageResponse). Fallback — статичный `/og-default.png`.

## Purpose

Каждая страница Обихода в соцсетях (Telegram / MAX / VK / WhatsApp / Facebook) должна иметь свой OG-превью. Для 28+ programmatic LP ручная генерация невозможна — делаем dynamic endpoint.

## Формат

- **Размер:** 1200×630 px (стандарт Facebook Graph / Twitter `summary_large_image` / VK).
- **Format:** PNG, quality 90%.
- **Мегабайты:** ≤ 400 KB (OG-парсер некоторых соцсетей режет большие файлы).
- **HTTP Cache:** `s-maxage=86400, stale-while-revalidate=604800` (1 день cached, 1 неделя stale — OG редко меняется).

## Варианты

| Variant | Когда | Шаблон |
|---|---|---|
| `default` | Главная, About, Контакты | Знак + wordmark + slogan + тел |
| `service-district` | LP `/uslugi/<cluster>/<district>/` | Knoбка «Сервис в Районе · фикс 12 800 ₽» |
| `service-index` | `/uslugi/<cluster>/` | Название сервиса + 4 подуслуги + тел |
| `blog-article` | `/blog/<slug>/` | Title статьи + обложка + авторство |
| `case` | `/cases/<slug>/` | Before/after split + name кейса |

## Шаблон `service-district`

```
┌──────────────────────────────────────────────────────────────┐
│  [cream bg #f0ead8]                                          │
│                                                              │
│    [Mark icon 120px — brand-зелёный]                        │
│                                                              │
│    АРБОРИСТИКА                              [Eyebrow mono]  │
│                                                              │
│    Спил деревьев в Раменском                [H1 48/800]     │
│                                                              │
│    Фикс-цена 12 800 ₽ за объект             [Lead 24/500]   │
│    Смета за 10 минут по фото                                │
│                                                              │
│    ──────────────────────────────                            │
│                                                              │
│    obikhod.ru                  +7 985 170 51 11             │
│    [logo horizontal bottom-right]                            │
└──────────────────────────────────────────────────────────────┘
```

## Design rules

### Типографика

- **Wordmark:** 'Inter' Bold 800 (next/font/google pre-loaded в edge runtime).
- **Заголовок:** 48-56 px, letter-spacing -0.03em.
- **Lead:** 24-28 px, letter-spacing -0.015em.
- **Mono (цифры / тел):** 'JetBrains Mono' 18 px, tabular-nums.

### Цвет

- **Background:** `#f0ead8` cream (тот же что master logo) / fallback `#f7f5f0`.
- **Text primary:** `#2d5a3d` бренд-зелёный.
- **Ink:** `#1c1c1c` для основных тайтлов.
- **Muted:** `#8c8377` для второстепенного.

### Layout grid

- Padding: 64 px от края со всех сторон (safe zone).
- Line-height компактный — лишнего воздуха нет.
- Logo-mark в верхнем левом или центр — decorative, не обязателен.

### Brand elements

- `mark.svg` как central icon для главной / service-index.
- `horizontal.svg` bottom-right для service-district (brand-подпись).
- **Никаких фото в OG для service-LP** — они делают картинку тяжёлой и замыленной на превью. Фото добавляются только для `case` варианта (before/after split).

## Реализация

### Edge endpoint

```tsx
// site/app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const service = searchParams.get('service') ?? 'default'
  const district = searchParams.get('district')
  const template = chooseTemplate(service, district)

  // Fonts — обязательно в edge, next/font не работает
  const inter = await fetch(new URL('./_assets/Inter-Bold.ttf', import.meta.url)).then((r) => r.arrayBuffer())

  return new ImageResponse(template, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Inter', data: inter, weight: 800 }],
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
```

### Использование в Metadata

```tsx
// В generateMetadata LP
openGraph: {
  images: [{
    url: `/api/og?service=${cluster}&district=${district}`,
    width: 1200,
    height: 630,
    alt: `${serviceName} в ${districtName} — Обиход`,
  }]
}
```

## Fallback

Статичный `/og-default.png` (генерируется один раз через `site/scripts/render-og-default.ts`) — используется для:
- `/` главной (если не хотим динамики для index)
- Странных случаев когда endpoint недоступен (cold boot, edge error)

Лежит в `site/public/og-default.png`. 1200×630, PNG, ≤ 200 KB.

## Fonts в edge

**Проблема:** `next/font` не работает в edge-runtime. Решение — `fetch` TTF/OTF файлов в runtime.

**Хранение шрифтов:**
- `site/app/api/og/_assets/Inter-Bold.ttf` (только Bold, чтобы не раздувать bundle)
- `site/app/api/og/_assets/JetBrainsMono-Regular.ttf`

Только варианты которые реально используются в OG-шаблонах. Golos Text **не тянем** в edge (большой, 200 KB) — для OG достаточно Inter.

## SVG-элементы

`mark.svg` / `horizontal.svg` — inline-копируем в template (не через `<img>` — edge не может fetch из S3). Размер SVG в шаблоне скоромный, fill через `currentColor`.

## Проверка

- **Facebook Sharing Debugger** — https://developers.facebook.com/tools/debug/
- **Twitter Card Validator** — https://cards-dev.twitter.com/validator
- **VK OG-preview** — запись в группу с URL
- **Telegram inline preview** — отправка ссылки в Saved Messages

На каждой LP после релиза — smoke-тест превью в 3 соцсетях.

## A11y

- **Alt-text обязательно** в `openGraph.images.alt` — «Арбористика в Раменском — Обиход».
- **Text content in image** — большинство OG-парсеров не OCR'ят, поэтому title/description дублируются в meta, OG-картинка — визуальная поддержка.
- **Контраст** — проверяется как обычно (AAA body 8.1:1 на кремовом).

## Performance

- Edge runtime — генерация 100-300ms cold, 20-50ms warm.
- CDN cache 1 день — большинство запросов идут с CDN.
- Image size budget: ≤ 400 KB per image.

## Anti-patterns

- ❌ Фото-фон под большим текстом — на превью 600×315 px это мусор
- ❌ Фирменная типографика в OG (Golos Text) — тяжело + плохо работает в edge
- ❌ Динамический prompt через LLM на каждый запрос — стоимость, медленно
- ❌ Больше 3 типографических уровней в одном OG — перегружено
- ❌ Rainbow-gradient бэкграунд — cheap
- ❌ OG без логотипа — теряется узнаваемость Обихода

## Integration

- **SEO spec:** каждая LP генерирует OG через свой `/api/og?...` в metadata.
- **Blog:** `/api/og?slug=<post>` для статей.
- **Cases:** before/after split — `/api/og?case=<slug>` другой шаблон.

## DoD

- [x] Размер / формат / cache-рules
- [x] 5 variants шаблонов
- [x] Design-rules (типографика / цвет / grid)
- [x] Edge-runtime реализация
- [x] Fonts handling
- [x] Fallback static
- [x] A11y + performance
- [x] Anti-patterns
- [ ] Реализация `/api/og/route.tsx` — **TODO fe2** (отдельный US, после Header/Footer refresh)
- [ ] Генерация static `/og-default.png` через `render-og-default.ts` — TODO
- [ ] Smoke-test OG на 3 соцсетях после реализации — TODO в release checklist
