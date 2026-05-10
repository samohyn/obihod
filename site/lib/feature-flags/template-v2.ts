/**
 * Feature flag `template_v2` — EPIC-SERVICE-PAGES-UX C4.
 *
 * Per-URL flag для incremental rollout master-template (ADR-0021) без
 * downtime. Default false → sustained legacy rendering.
 *
 * Sources (приоритет сверху вниз):
 *   1. `TEMPLATE_V2_GLOBAL_OVERRIDE` env (`true` | `false`) — testing escape
 *      hatch. Перекрывает doc-level flag для всех URL.
 *   2. Doc-level field `useTemplateV2: boolean` на Services / ServiceDistricts /
 *      B2BPages. Default false (sustained docs не задеваются).
 *
 * Rollout plan (см. specs/EPIC-SERVICE-PAGES-UX/c4-migration-plan.md):
 *   - Phase 0: deploy flag false everywhere.
 *   - Phase 1: enable on staging URL × 1 → qa smoke.
 *   - Phase 2: enable на /vyvoz-musora/ prod (pilot, A/B 7 days в EPIC-D D5).
 *   - Phase 3: extend per pillar (30 URL/нед × 8 нед).
 *
 * Rollback: flip flag за 1 admin click (Payload doc edit → save).
 */

/**
 * Минимальный type для документа с `useTemplateV2` field.
 * Sustained Services / ServiceDistricts / B2BPages могут добавлять любые
 * другие поля — нам важен только этот.
 */
export interface TemplateV2Doc {
  useTemplateV2?: boolean | null
  [key: string]: unknown
}

/**
 * Возвращает enabled state для конкретного документа.
 *
 * Логика:
 *   1. Если env `TEMPLATE_V2_GLOBAL_OVERRIDE` set:
 *      - 'true' → return true (force enable).
 *      - 'false' → return false (force disable).
 *      - другое значение → ignore, fall through на doc-level.
 *   2. Doc-level: `doc.useTemplateV2 === true` → enable, иначе disable.
 *
 * Прозрачно для null / undefined doc (return false — safe legacy).
 */
export function isTemplateV2Enabled(doc: TemplateV2Doc | null | undefined): boolean {
  const override = process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
  if (override === 'true') return true
  if (override === 'false') return false

  if (!doc) return false
  return doc.useTemplateV2 === true
}

/**
 * Дешёвая обёртка для server-side rendering — combine с resolver options.
 *
 * Использование:
 *
 *   const opts = buildResolverOptions(doc)
 *   const blocks = getBlocksForLayer(layer, doc.blocks ?? [], opts)
 */
export function buildResolverOptions(doc: TemplateV2Doc | null | undefined): {
  templateV2: boolean
  fillMissingWithPlaceholder: boolean
} {
  return {
    templateV2: isTemplateV2Enabled(doc),
    fillMissingWithPlaceholder: true,
  }
}
