---
title: llms.txt спецификация для obikhod.ru
owner: sa-seo
co-owners: [seo-tech]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-3.2, AC-3.4]
related:
  - "./sge-readiness.md"
  - "./jsonld-completeness.md"
  - "../04-url-map/sitemap-tree.md"
---

# llms.txt спецификация

> Опциональный community-driven LLM-friendly content map для `obikhod.ru/llms.txt`. Конкурентов в shortlist 17 с llms.txt — 0; uniqueness +1pp (sustained competitive matrix W14 +1 angle).

## 1. Что такое llms.txt

- **Источник:** [llmstxt.org](https://llmstxt.org/) (proposal от Jeremy Howard, 2024) — community-driven спецификация LLM-friendly content map.
- **Цель:** дать LLM-агентам (Anthropic claude.ai webfetch / OpenAI SearchGPT / Perplexity / Google Gemini) markdown-доступ к ключевым URL сайта + краткие descriptions.
- **Расположение:** корень сайта `https://obikhod.ru/llms.txt` (единственный canonical путь по proposal).
- **Format:** plain markdown (Content-Type: `text/markdown` или `text/plain; charset=utf-8`).
- **Status:** emerging standard (НЕ W3C / IETF), но adoption растёт (Anthropic claude.ai, Vercel, Mintlify уже добавили).

## 2. Sa-seo decision

**Создать `llms.txt`** на корне `obikhod.ru/llms.txt`. **Why:**
- Низкий риск (статический markdown / dynamic route handler — ~50 LOC).
- Потенциальный upside для AI-citation в SearchGPT / Anthropic webfetch / Perplexity.
- Конкурентов с llms.txt в нашем shortlist 17 — **0** → uniqueness +1pp на W14 differentiation matrix.
- Maintenance низкий (auto-regen on sitemap update — см. §5).

## 3. Структура llms.txt

Per llmstxt.org proposal: H1 brand → blockquote brief → H2 sections → bullet links с короткими descriptions.

### 3.1 · Финальный draft контента

```markdown
# Обиход — Порядок под ключ для Москвы и МО

> Комплексный подрядчик по 4 услугам: вывоз мусора (включая ФККО I-IV класса) + арбористика и уход за садом + чистка крыш от снега и сосулек + демонтаж и спец-доп-услуги. B2C (частные дома, дачи, СНТ) + B2B (УК, ТСЖ, FM, застройщики, госзаказ).
>
> USP: фото→смета за 10 минут (заказчик отправляет 2-3 фото, оператор присылает смету). 4-в-1 (вся уборка под одним подрядчиком). СРО + договор с штрафами ГЖИ/ОАТИ на нашей стороне.

## Pillars
- [Вывоз мусора](https://obikhod.ru/vyvoz-musora/): pillar 1 — контейнеры 8/27 м³, ФККО I-IV класса, СНТ + ИЖС + B2B
- [Арбористика](https://obikhod.ru/arboristika/): pillar 2 — спил деревьев, обработка сада, уход за садом
- [Чистка крыш](https://obikhod.ru/chistka-krysh/): pillar 3 — снег и сосульки, частные дома + B2B
- [Демонтаж](https://obikhod.ru/demontazh/): pillar 4 — сараи, заборы, мелкие постройки + спец-демонтаж

## B2B
- [Б2Б хаб](https://obikhod.ru/b2b/): услуги для УК / ТСЖ / FM / застройщиков / госзаказа
- [УК и ТСЖ](https://obikhod.ru/b2b/uk-tszh/): долгосрочные договоры, штрафы ГЖИ/ОАТИ на нашей стороне
- [Договор](https://obikhod.ru/b2b/dogovor/): структура договора + примеры + escrow

## E-E-A-T
- [Команда](https://obikhod.ru/komanda/): авторы и эксперты с сертификатами и опытом
- [СРО и лицензии](https://obikhod.ru/sro-licenzii/): СРО членство, лицензии Росприроднадзора
- [Авторы](https://obikhod.ru/avtory/): index страница авторов с Person schema

## USP
- [Foto-smeta](https://obikhod.ru/foto-smeta/): USP-страница «фото→смета за 10 минут»

## Optional
- [Блог](https://obikhod.ru/blog/): 31 статья info+commercial-bridge
- [Кейсы](https://obikhod.ru/kejsy/): 14 cases B2C+B2B с фото before/after
```

### 3.2 · Что НЕ включаем

- ServiceDistrict pages (~150 URL) — слишком много для llms.txt; они попадают в `sitemap.xml` (sustained).
- Технические URL (admin / api / sitemap.xml / robots.txt).
- Blog отдельные post-URL (только index `/blog/` + `/kejsy/`).

## 4. Implementation TODO для seo-tech (W14 day 5 optional)

### 4.1 · Recommendation: dynamic route handler

```typescript
// site/app/llms.txt/route.ts
import { NextResponse } from 'next/server'
import { getPublishedPillars, getPublishedB2BPages } from '@/lib/payload-queries'

export async function GET() {
  const pillars = await getPublishedPillars()
  const b2bPages = await getPublishedB2BPages()
  const lastmod = new Date().toISOString().split('T')[0]

  const body = `# Обиход — Порядок под ключ для Москвы и МО

> ${SITE_DESCRIPTION}

## Pillars
${pillars.map(p => `- [${p.title}](https://obikhod.ru${p.slug}): ${p.shortDescription}`).join('\n')}

## B2B
${b2bPages.map(b => `- [${b.title}](https://obikhod.ru${b.slug}): ${b.shortDescription}`).join('\n')}

<!-- last modified: ${lastmod} -->
`
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```

### 4.2 · Альтернатива: статический файл

Положить в `site/public/llms.txt` если seo-tech bandwidth не хватает на route handler. **Минус:** требует manual regen после каждого нового pillar / B2B page.

### 4.3 · Sa-seo recommendation

**Route handler** — динамическая генерация после deploys, lastmod auto-updated, no manual sync с Payload CMS.

## 5. Maintenance

- **Auto-regen on sitemap update** — route handler читает Payload CMS → consistent с sitemap.xml.
- **Cache TTL 1 hour** (`Cache-Control: max-age=3600`) — баланс свежести vs нагрузки.
- **Triggered regen:** не нужен — route handler читает live-данные из Payload каждый запрос.
- **Monitoring:** Я.ВебМастер / GSC не tracking llms.txt; manual periodic check (sa-seo monthly).

## 6. Verification checklist (post-deploy)

- [ ] `curl -i https://obikhod.ru/llms.txt` → HTTP 200 + `Content-Type: text/markdown`.
- [ ] Body parseable as markdown (manual check).
- [ ] Все URL валидны (не 404 / не 5xx).
- [ ] H1 + blockquote + H2 sections структурированы per llmstxt.org proposal.
- [ ] Lastmod в HTML-комменте отражает свежий deploy.
- [ ] Robots.txt НЕ блокирует `/llms.txt` (sustained: default Allow для root).

## 7. Acceptance

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-3.2 | `llms-txt-spec.md` written + sample content + implementation TODO | sa-seo | Hard |
| AC-3.4 | `obikhod.ru/llms.txt` published (route handler) | seo-tech | Soft (Hard если poseo apruv «доделать») |
