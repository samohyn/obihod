import Link from 'next/link'

import { Wrap } from '@/components/blocks/v3/shared'
import type { Crumb } from '@/lib/breadcrumbs'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'

import { JsonLd } from './JsonLd'
import s from './Breadcrumbs.module.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/**
 * Хлебные крошки (brand-guide §breadcrumbs): полоса сразу под шапкой, по её колонке.
 * Цепочка — из lib/breadcrumbs.ts (карта 08). Предыдущие пункты — ссылки, последний —
 * текущая страница. На телефоне — одна строка с прокруткой к текущему пункту.
 * `schema={false}` — если страница уже кладёт BreadcrumbList в свой JSON-LD.
 */
export function Breadcrumbs({ items, schema = true }: { items: Crumb[]; schema?: boolean }) {
  if (items.length < 2) return null
  return (
    <>
      <nav aria-label="Хлебные крошки" className={s.bar}>
        <Wrap>
          <ol className={s.list}>
            {items.map((it, i) =>
              i === items.length - 1 ? (
                <li key={it.href} className={s.current} aria-current="page">
                  {it.name}
                </li>
              ) : (
                <li key={it.href}>
                  <Link href={it.href}>{it.name}</Link>
                </li>
              ),
            )}
          </ol>
        </Wrap>
      </nav>
      {schema && (
        <JsonLd
          schema={breadcrumbListSchema(
            items.map((it) => ({ name: it.name, url: `${SITE_URL}${it.href}` })),
          )}
        />
      )}
    </>
  )
}
