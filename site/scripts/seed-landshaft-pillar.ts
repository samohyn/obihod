/**
 * seed-landshaft-pillar — создаёт `dizain-landshafta` 5-й pillar Service.
 *
 * Контекст: ADR-0020 фиксирует landshaft = 5-й pillar (паритет с liwood).
 * URL `/dizain-landshafta/` уже в Header.tsx + Footer.tsx, но Service doc
 * отсутствует → 404 на проде.
 *
 * Pattern зеркалит `seed-uborka-pillar.ts` (4-й pillar, sustained 2026-05-09).
 *
 * Запуск local:
 *   PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs \
 *     --env-file=.env.local scripts/seed-landshaft-pillar.ts
 *
 * Запуск prod (через CI или SSH):
 *   ssh root@VPS 'cd /home/deploy/obikhod/current && set -a; . .env; set +a; \
 *     pnpm dlx tsx --require=./scripts/_payload-cjs-shim.cjs scripts/seed-landshaft-pillar.ts'
 */
/* eslint-disable no-console */

import { getPayload } from 'payload'
import config from '../payload.config.js'

const lex = (text: string) => ({
  root: {
    type: 'root' as const,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        textFormat: 0,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
        ],
      },
    ],
  },
})

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'dizain-landshafta' } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    console.log('• dizain-landshafta: уже есть, пропуск')
    process.exit(0)
  }

  const result = await payload.create({
    collection: 'services',
    data: {
      slug: 'dizain-landshafta',
      title: 'Дизайн ландшафта',
      h1: 'Дизайн ландшафта участка под ключ',
      metaTitle: 'Дизайн ландшафта в Москве и МО — Обиход',
      metaDescription:
        'Проект участка, посадка растений, газон с автополивом, освещение, мощение. Сроки от 14 дней, фикс-смета по 5 фото. Гарантия 2 года на работы.',
      intro: lex(
        'Обиход проектирует и обустраивает участки в Москве и МО под ключ — от концепции и 3D-визуализации до посадки растений, газона, систем полива и подсветки. Цены от 50 000 ₽ за участок 6 соток (концепт + посадка), до 500 000 ₽ за полный проект с мощением, освещением и автополивом. Смета по 5 фото за 1 рабочий день.',
      ),
      priceFrom: 50000,
      priceTo: 500000,
      priceUnit: 'object',
      faqGlobal: [
        {
          question: 'С чего начинается проект ландшафтного дизайна?',
          answer: lex(
            'С выезда инженера на участок (бесплатно в пределах ЦКАД), замеров и обсуждения предпочтений. За 5–7 дней готовим концепцию с 3D-визуализацией. После согласования — рабочий проект и смета на материалы и работы.',
          ),
        },
        {
          question: 'Какая гарантия на растения и работы?',
          answer: lex(
            'На работы по мощению, освещению и системам полива — 2 года. На посадочный материал — 1 вегетационный сезон при условии соблюдения нашего регламента ухода. Подменим погибшее растение бесплатно при первом же выезде.',
          ),
        },
        {
          question: 'Можно ли совместить с другими работами Обихода?',
          answer: lex(
            'Да. Частая связка: расчистка участка → удаление аварийных деревьев (арбористика) → выравнивание → ландшафт. Сводим всё в одну смету с дисконтом 5–10%.',
          ),
        },
      ],
      subServices: [
        {
          slug: 'proekt-uchastka',
          title: 'Проект участка',
          h1: 'Проект ландшафтного дизайна с 3D-визуализацией',
          priceFrom: 30000,
          intro:
            'Концепция и рабочий проект участка с 3D-визуализацией за 5–7 дней. Подбор растений по зоне морозостойкости 4 (МО), генплан, дендроплан, сметы.',
        },
        {
          slug: 'posadka-rasteniy',
          title: 'Посадка растений',
          h1: 'Посадка деревьев, кустарников и многолетников',
          priceFrom: 1500,
          intro:
            'Посадка крупномеров с гарантией приживаемости, кустарников и многолетников по дендроплану. Своя дендрологическая база — растения адаптированы к МО.',
        },
        {
          slug: 'gazon-i-poliv',
          title: 'Газон и автополив',
          h1: 'Рулонный и посевной газон с системой автополива',
          priceFrom: 250,
          intro:
            'Рулонный газон Hunter / Toro «под ключ» с автополивом. Подготовка основания, дренаж, монтаж форсунок и контроллера, запуск. Цена за м² с материалами.',
        },
        {
          slug: 'osvescheniye-uchastka',
          title: 'Освещение участка',
          h1: 'Архитектурное и декоративное освещение участка',
          priceFrom: 25000,
          intro:
            'Низковольтное светодиодное освещение дорожек, деревьев, фасада и зон отдыха. IP65, гарантия 2 года, расход 30–80 Вт на 100 м² ландшафта.',
        },
        {
          slug: 'moshchenie-i-dorozhki',
          title: 'Мощение и дорожки',
          h1: 'Мощение участка тротуарной плиткой и натуральным камнем',
          priceFrom: 1800,
          intro:
            'Дорожки, площадки, парковочные карманы. Тротуарная плитка, клинкерный кирпич, гранит и песчаник. Подготовка основания «под автомобиль» — выдерживает 3 т.',
        },
      ],
    } as never,
  })

  console.log(`✓ dizain-landshafta: создан (id=${(result as { id: number }).id})`)
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed-landshaft-pillar] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
