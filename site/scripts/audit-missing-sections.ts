/**
 * EPIC-SERVICE-PAGES-UX C5 wave A — audit missing required sections per ADR-0021.
 *
 * Покрывает vyvoz-musora pillar (T2) + sub-services (T3) + pillar-level SD (T4).
 *
 * Запуск:
 *   PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs \\
 *     --env-file=.env.local scripts/audit-missing-sections.ts
 *
 * Output:
 *   1. stdout: per-URL таблица «layer × URL × missing sections»
 *   2. file: specs/EPIC-SERVICE-PAGES-UX/c5-audit-missing-vyvoz-musora.md
 *
 * Read-only: только find() через Payload Local API.
 *
 * Schema-aware: master-template требует 13 секций, но ServiceDistricts blocks[]
 * принимает только 5 типов (Hero/TextContent/LeadForm/CtaBanner/Faq). Audit
 * различает «fillable» (sustained block-type есть в коллекции) vs «non-fillable»
 * (требует расширения schema — backlog для C2.5/C3 follow-up).
 *
 * T3 sub-сервисы живут в массиве `services.subServices[]` — без своих blocks[].
 * Для T3 audit смотрит на наличие `intro` / `body` / `metaTitle` / `metaDescription`
 * как proxy для tldr / process / FAQ / SEO sections.
 */

import { getPayload } from 'payload'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import config from '../payload.config.js'
import {
  masterTemplate,
  type MasterTemplateLayer,
  type MasterTemplateSection,
  type DocumentBlock,
} from '../blocks/master-template'
import { getMissingRequiredSections } from '../lib/master-template/getBlocksForLayer'

// ────────────────────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────────────────────

const PILLAR_SLUG = 'vyvoz-musora'
const REPORT_PATH = resolve(
  __dirname,
  '../../specs/EPIC-SERVICE-PAGES-UX/c5-audit-missing-vyvoz-musora.md',
)

/**
 * Block-types которые поддерживает каждая коллекция в `blockReferences`.
 * Sustained source: site/collections/Services.ts + ServiceDistricts.ts.
 */
const SERVICES_FILLABLE: ReadonlySet<MasterTemplateSection> = new Set([
  'hero',
  'breadcrumbs',
  'tldr',
  'services-grid',
  'mini-case',
  'related-services',
  'cta-banner',
  'faq',
  'lead-form',
  'calculator', // calculator-placeholder slug
])
const SERVICE_DISTRICTS_FILLABLE: ReadonlySet<MasterTemplateSection> = new Set([
  'hero',
  'cta-banner',
  'faq',
  'lead-form',
])

interface AuditRow {
  layer: MasterTemplateLayer
  url: string
  docId: number | string
  collection: string
  presentBlocks: string[]
  missingRequired: MasterTemplateSection[]
  missingFillable: MasterTemplateSection[]
  missingNonFillable: MasterTemplateSection[]
  notes: string[]
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('[audit-missing-sections] Starting…')
  const payload = await getPayload({ config })

  const rows: AuditRow[] = []

  // ─── 1. T2 pillar /vyvoz-musora/ ───
  const pillarFind = await payload.find({
    collection: 'services',
    where: { slug: { equals: PILLAR_SLUG } },
    limit: 1,
    depth: 0,
  })
  if (!pillarFind.docs.length) {
    throw new Error(`Pillar '${PILLAR_SLUG}' не найден.`)
  }
  const pillar = pillarFind.docs[0] as Record<string, unknown> & { id: number }
  const pillarBlocks = (pillar.blocks ?? []) as DocumentBlock[]
  const pillarMissing = getMissingRequiredSections('T2_PILLAR', pillarBlocks)
  rows.push(
    buildRow(
      'T2_PILLAR',
      `/${PILLAR_SLUG}/`,
      pillar.id,
      'services',
      pillarBlocks,
      pillarMissing,
      SERVICES_FILLABLE,
    ),
  )

  // ─── 2. T3 sub /vyvoz-musora/{sub}/ — проверяем intro/body/meta как proxy ───
  const subs = (pillar.subServices ?? []) as Array<{
    slug: string
    title?: string
    intro?: string
    body?: unknown
    metaTitle?: string
    metaDescription?: string
  }>
  for (const sub of subs) {
    const notes: string[] = []
    if (!sub.intro) notes.push('intro отсутствует (proxy для tldr)')
    if (!sub.body) notes.push('body отсутствует (proxy для process / faq / pricing)')
    if (!sub.metaTitle) notes.push('metaTitle отсутствует')
    if (!sub.metaDescription) notes.push('metaDescription отсутствует')
    rows.push({
      layer: 'T3_SUB',
      url: `/${PILLAR_SLUG}/${sub.slug}/`,
      docId: `${pillar.id}#${sub.slug}`,
      collection: 'services.subServices',
      presentBlocks: [
        sub.intro ? 'intro' : '',
        sub.body ? 'body' : '',
        sub.metaTitle ? 'metaTitle' : '',
        sub.metaDescription ? 'metaDescription' : '',
      ].filter(Boolean),
      missingRequired: [], // T3 schema иная — не blocks-based
      missingFillable: [],
      missingNonFillable: [],
      notes,
    })
  }

  // ─── 3. T4 SD /vyvoz-musora/{city}/ — pillar-level (subServiceSlug NULL) ───
  const sdFind = await payload.find({
    collection: 'service-districts',
    where: { service: { equals: pillar.id } },
    limit: 200,
    depth: 1,
    pagination: false,
  })
  for (const doc of sdFind.docs as Array<Record<string, unknown> & { id: number }>) {
    if (doc.subServiceSlug != null && doc.subServiceSlug !== '') {
      // sub-level SD (T4_SD с sub-кастом). Их в wave A не трогаем — sub-level
      // SD рендерится через `/{pillar}/{sub}/{city}/` и имеет другой layer
      // semantics. Пропускаем (документировано в hand-off).
      continue
    }
    const district = doc.district as { slug?: string; nameNominative?: string } | string | number
    const distSlug =
      typeof district === 'object' && district !== null ? (district.slug ?? '?') : String(district)
    const blocks = (doc.blocks ?? []) as DocumentBlock[]
    const missing = getMissingRequiredSections('T4_SD', blocks)
    const notes: string[] = []
    if (!doc.miniCase) notes.push('miniCase отсутствует — publish-gate fail')
    const localFaq = (doc.localFaq ?? []) as unknown[]
    if (localFaq.length < 2) notes.push(`localFaq=${localFaq.length} (минимум 2)`)
    if (!doc.leadParagraph) notes.push('leadParagraph отсутствует — publish-gate fail')

    rows.push(
      buildRow(
        'T4_SD',
        `/${PILLAR_SLUG}/${distSlug}/`,
        doc.id,
        'service-districts',
        blocks,
        missing,
        SERVICE_DISTRICTS_FILLABLE,
        notes,
      ),
    )
  }

  // ─── Render report ───
  const report = renderReport(rows)
  mkdirSync(dirname(REPORT_PATH), { recursive: true })
  writeFileSync(REPORT_PATH, report, 'utf8')
  console.log(`\n[audit-missing-sections] Report → ${REPORT_PATH}`)

  // Print stdout summary
  printSummary(rows)
  process.exit(0)
}

function buildRow(
  layer: MasterTemplateLayer,
  url: string,
  docId: number | string,
  collection: string,
  blocks: readonly DocumentBlock[],
  missing: MasterTemplateSection[],
  fillableSet: ReadonlySet<MasterTemplateSection>,
  notes: string[] = [],
): AuditRow {
  const present = blocks.map((b) => b.blockType)
  const missingFillable = missing.filter((s) => fillableSet.has(s))
  const missingNonFillable = missing.filter((s) => !fillableSet.has(s))
  return {
    layer,
    url,
    docId,
    collection,
    presentBlocks: present,
    missingRequired: missing,
    missingFillable,
    missingNonFillable,
    notes,
  }
}

function printSummary(rows: AuditRow[]): void {
  console.log('\n=== AUDIT SUMMARY ===\n')
  const t2 = rows.filter((r) => r.layer === 'T2_PILLAR')
  const t3 = rows.filter((r) => r.layer === 'T3_SUB')
  const t4 = rows.filter((r) => r.layer === 'T4_SD')
  console.log(`URLs: T2=${t2.length} T3=${t3.length} T4=${t4.length} total=${rows.length}`)
  for (const r of [...t2, ...t3, ...t4]) {
    const fix = r.missingFillable.length
    const block = r.missingNonFillable.length
    const flag =
      fix > 0 ? '[FILL]' : block > 0 ? '[BLOCKED]' : r.notes.length > 0 ? '[NOTES]' : '[OK]'
    console.log(
      `${flag.padEnd(11)} ${r.layer.padEnd(10)} ${r.url.padEnd(50)} ` +
        `fillable=${fix} non-fillable=${block} notes=${r.notes.length}`,
    )
  }
}

function renderReport(rows: AuditRow[]): string {
  const lines: string[] = []
  lines.push('# C5 Audit — missing sections vyvoz-musora pillar')
  lines.push('')
  lines.push(`> Generated: ${new Date().toISOString()}`)
  lines.push(`> Pillar: \`/${PILLAR_SLUG}/\``)
  lines.push(`> Источник логики: ADR-0021 master-template + getMissingRequiredSections()`)
  lines.push('')
  lines.push('## Легенда')
  lines.push('')
  lines.push(
    '- **fillable** — section представлена в `blockReferences` коллекции, можно заполнить через Local API.',
  )
  lines.push(
    '- **non-fillable** — section требует расширения schema (sustained C3 backlog: pricing-block / process / breadcrumbs на T4 / neighbor-districts на T4 / related-services на T4).',
  )
  lines.push(
    '- **notes** — soft-gates (mini-case / localFaq / leadParagraph) — нужны для publishStatus=published.',
  )
  lines.push('')

  // Buckets
  const t2 = rows.filter((r) => r.layer === 'T2_PILLAR')
  const t3 = rows.filter((r) => r.layer === 'T3_SUB')
  const t4 = rows.filter((r) => r.layer === 'T4_SD')

  for (const [layer, bucket] of [
    ['T2_PILLAR', t2],
    ['T3_SUB', t3],
    ['T4_SD', t4],
  ] as const) {
    lines.push(`## ${layer} (${bucket.length})`)
    lines.push('')
    if (!bucket.length) {
      lines.push('_нет URL_')
      lines.push('')
      continue
    }
    lines.push('| URL | doc | present | missing fillable | missing non-fillable | notes |')
    lines.push('|---|---|---|---|---|---|')
    for (const r of bucket) {
      lines.push(
        `| \`${r.url}\` | ${r.docId} | ${r.presentBlocks.length ? r.presentBlocks.join(', ') : '—'} | ${
          r.missingFillable.join(', ') || '—'
        } | ${r.missingNonFillable.join(', ') || '—'} | ${r.notes.join('; ') || '—'} |`,
      )
    }
    lines.push('')
  }

  // Aggregate stats
  lines.push('## Статистика')
  lines.push('')
  const totalFillable = rows.reduce((acc, r) => acc + r.missingFillable.length, 0)
  const totalNonFillable = rows.reduce((acc, r) => acc + r.missingNonFillable.length, 0)
  const urlsWithFillable = rows.filter((r) => r.missingFillable.length > 0).length
  lines.push(`- Total URLs audited: **${rows.length}**`)
  lines.push(`- URLs с missing fillable sections: **${urlsWithFillable}**`)
  lines.push(`- Sustained fillable section-instances missing: **${totalFillable}**`)
  lines.push(
    `- Sustained non-fillable section-instances missing (schema-blocked): **${totalNonFillable}**`,
  )
  lines.push('')
  lines.push('## Master-template required sections per layer')
  lines.push('')
  lines.push('| section | T2_PILLAR | T3_SUB | T4_SD |')
  lines.push('|---|---|---|---|')
  for (const spec of masterTemplate) {
    lines.push(
      `| ${spec.section} | ${spec.presence.T2_PILLAR} | ${spec.presence.T3_SUB} | ${spec.presence.T4_SD} |`,
    )
  }
  lines.push('')
  return lines.join('\n')
}

main().catch((e: unknown) => {
  console.error('[audit-missing-sections] FAIL:', e)
  process.exit(1)
})
