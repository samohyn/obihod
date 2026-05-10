/**
 * Master-template publish-gate для коллекций с `blocks[]`.
 *
 * Реализует EPIC-SERVICE-PAGES-UX C3 — Payload `beforeValidate` hook на
 * service-related коллекциях (Services / ServiceDistricts / B2BPages),
 * валидирующий `blocks[]` против master-template из ADR-0021.
 *
 * Активируется только при `publishStatus === 'published'` (или Payload
 * `_status === 'published'` если коллекция включает alsoCheckPayloadStatus) —
 * draft проходит без гейта. Это additive contract: sustained docs остаются
 * валидными, гейт срабатывает только при публикации.
 *
 * Layer определяется per-collection через `layerResolver(data)`:
 *   - Services      → 'T2_PILLAR'  (sub-services внутри pillar — отдельный AC,
 *                                   blocks[] field на уровне pillar)
 *   - ServiceDistricts → 'T4_SD'   (programmatic SD)
 *   - B2BPages      → 'T2_PILLAR'  (B2B landing — pillar-уровень)
 *
 * Связь с master-template.ts:
 *   `validateBlocksAgainstTemplate(layer, blocks)` → `{ valid, errors[] }`.
 *   При valid=false бросаем `Error` с RU-сообщением (Payload отображает в admin).
 *
 * Sustained Payload v3 hook signature:
 *   `({ data, operation, originalDoc, req }) => data | Promise<data>`.
 *
 * Sa-spec ADR-0021 §«C3 schema reference».
 */

import type { CollectionBeforeValidateHook } from 'payload'

import { validateBlocksAgainstTemplate, type MasterTemplateLayer } from '@/blocks/master-template'

interface MasterTemplateGateOptions {
  /** Имя поля с blocks[] в коллекции (обычно 'blocks'). */
  blocksField?: string
  /**
   * Resolver — какому layer соответствует данный документ. Per-collection
   * fixed (T2_PILLAR / T3_SUB / T4_SD) или dynamic (если коллекция содержит
   * documents разных layer — например, Services с sub-services pages внутри).
   */
  layerResolver: (data: Record<string, unknown>) => MasterTemplateLayer
  /**
   * Если true — гейт активен для status === 'published' (Payload drafts API).
   * False (default): только `publishStatus === 'published'` (custom field).
   */
  alsoCheckPayloadStatus?: boolean
}

/**
 * Builder Payload `beforeValidate` hook'а для master-template enforcement.
 *
 * Использование (Services.ts):
 *
 *   hooks: {
 *     beforeValidate: [
 *       buildMasterTemplateGate({ layerResolver: () => 'T2_PILLAR' }),
 *     ],
 *   }
 */
export function buildMasterTemplateGate(
  options: MasterTemplateGateOptions,
): CollectionBeforeValidateHook {
  const blocksField = options.blocksField ?? 'blocks'
  const alsoCheckPayloadStatus = options.alsoCheckPayloadStatus ?? false

  return async ({ data }) => {
    if (!data) return data

    // Гейт только при публикации (sustained pattern from publish-gate.ts).
    const isPublished =
      data.publishStatus === 'published' || (alsoCheckPayloadStatus && data._status === 'published')

    // Для коллекций без publishStatus (Services / B2BPages — нет custom-status,
    // используют Payload drafts) — fall through на _status проверку. Если оба
    // отсутствуют, считаем что это пилотный draft mode и пропускаем гейт
    // (sustained behavior — не ломаем sustained docs).
    if (!isPublished && !alsoCheckPayloadStatus) return data

    const blocks = data[blocksField]
    if (!Array.isArray(blocks)) return data

    const layer = options.layerResolver(data as Record<string, unknown>)
    const result = validateBlocksAgainstTemplate(
      layer,
      blocks as ReadonlyArray<{ blockType: string }>,
    )

    if (!result.valid) {
      const summary = result.errors
        .slice(0, 5)
        .map((e, i) => `${i + 1}. ${e}`)
        .join(' ')
      const more = result.errors.length > 5 ? ` (и ещё ${result.errors.length - 5})` : ''
      throw new Error(`Master-template validation failed (${layer}, ADR-0021): ${summary}${more}`)
    }

    return data
  }
}
