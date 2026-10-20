import type { Metadata } from 'next'
import Link from 'next/link'

import { Wrap } from '@/components/blocks/v3/shared'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { canonicalFor } from '@/lib/seo/canonical'
import { getSitemapTree, type SitemapSection } from '@/lib/sitemapTree'

import s from './karta.module.css'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Карта сайта',
  description:
    'Все страницы Обихода по разделам: услуги и подуслуги, цены, районы, кейсы, для бизнеса, о компании, блог и документы.',
  alternates: { canonical: canonicalFor('/karta-sajta/') },
}

/** Раскладка по колонкам примерно равной высоты; разделы идут по порядку карты 08. */
function columns(sections: SitemapSection[], n: number) {
  const weight = (x: SitemapSection) =>
    3 + x.links.reduce((sum, l) => sum + 1 + (l.children?.length ?? 0) * 0.8, 0)
  const total = sections.reduce((sum, x) => sum + weight(x), 0)
  const cols: { section: SitemapSection; i: number }[][] = Array.from({ length: n }, () => [])
  let c = 0
  let acc = 0
  sections.forEach((section, i) => {
    if (c < n - 1 && acc >= (total / n) * (c + 1)) c += 1
    cols[c].push({ section, i })
    acc += weight(section)
  })
  return cols
}

/** HTML-карта сайта (план 09, этап 2): разделы карты 08 и все опубликованные страницы. */
export default async function KartaSajtaPage() {
  const sections = await getSitemapTree()
  return (
    <>
      <Breadcrumbs items={trail('kartaSajta')} />
      <Wrap className={s.page}>
        <h1 className={s.title}>Карта сайта</h1>
        <p className={s.lead}>Все разделы и страницы сайта — по направлениям.</p>
        <div className={s.grid}>
          {columns(sections, 3).map((col, c) => (
            <div key={c} className={s.col}>
              {col.map(({ section, i }) => (
                <section key={section.title} className={s.section} aria-labelledby={`map-${i}`}>
                  <h2 id={`map-${i}`} className={s.sectionTitle}>
                    {section.href ? (
                      <Link href={section.href}>{section.title}</Link>
                    ) : (
                      section.title
                    )}
                  </h2>
                  <ul className={s.list}>
                    {section.links.map((link) => (
                      <li key={link.href + link.name}>
                        <Link href={link.href}>{link.name}</Link>
                        {link.children && link.children.length > 0 && (
                          <ul className={s.sub}>
                            {link.children.map((child) => (
                              <li key={child.href}>
                                <Link href={child.href}>{child.name}</Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ))}
        </div>
      </Wrap>
    </>
  )
}
