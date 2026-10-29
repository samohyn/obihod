import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { buildDistrictHubMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'
import { getAllDistricts, getDistrictBySlug } from '@/lib/seo/queries'
import { getPage } from '@/lib/pages'
import { getPageTemplates } from '@/lib/page-templates-server'
import { fillTemplate } from '@/lib/page-templates'

import { DistrictBlocksView } from './DistrictBlocksView'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const districts = await getAllDistricts()
  return districts.map((d: any) => ({ district: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>
}): Promise<Metadata> {
  const { district: districtSlug } = await params
  const [d, uslugi] = await Promise.all([getDistrictBySlug(districtSlug), getPage('uslugi')])
  if (!d || !uslugi) return NOT_FOUND_METADATA
  // Заголовок и описание — по шаблону; robots и canonical — из записи района
  const base = buildDistrictHubMetadata(d as any)
  const t = await getPageTemplates()
  const vars = { 'в районе': (d as unknown as { namePrepositional: string }).namePrepositional }
  const title = fillTemplate(t.districtMetaTitle, vars)
  const description = fillTemplate(t.districtMetaDescription, vars)
  return {
    ...base,
    title: { absolute: title },
    description,
    openGraph: { ...base.openGraph, title, description },
  }
}

/** Район — запись «Районы» + раздел «Услуги» из «Страниц» (lib/geo-pages.ts); нет одного из них — 404. */
export default async function DistrictHub({ params }: { params: Promise<{ district: string }> }) {
  const { district: districtSlug } = await params
  const [district, uslugi] = await Promise.all([getDistrictBySlug(districtSlug), getPage('uslugi')])
  if (!district || !uslugi) notFound()
  return <DistrictBlocksView district={district as never} uslugi={uslugi} />
}
