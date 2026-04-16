import Link from 'next/link'

import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { JsonLd } from './JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

type Item = { name: string; href: string }

export function Breadcrumbs({ items }: { items: Item[] }) {
  const schema = breadcrumbListSchema(
    items.map((it) => ({ name: it.name, url: `${SITE_URL}${it.href}` })),
  )

  return (
    <>
      <nav aria-label="Хлебные крошки" className="text-sm text-stone-600 mb-4">
        <ol className="flex flex-wrap gap-x-2">
          {items.map((it, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={it.href} className="flex items-center gap-x-2">
                {isLast ? (
                  <span aria-current="page">{it.name}</span>
                ) : (
                  <>
                    <Link href={it.href} className="hover:underline">
                      {it.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd schema={schema} />
    </>
  )
}
