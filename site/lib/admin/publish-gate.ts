/**
 * Publish-gate builder для коллекций с `blocks[]`.
 *
 * Срабатывает только при `publishStatus === 'published'`. Draft проходит без гейта.
 * Используется в `hooks.beforeValidate`.
 *
 * Sa-spec §5 (правила) + §5.4 (where it lives).
 */

import type { CollectionBeforeValidateHook } from 'payload'
import { publishGateMessages } from './publish-gate-messages'

interface BlockEntry {
  blockType: string
  enabled?: boolean
  body?: unknown
  [key: string]: unknown
}

/**
 * Считает слова в Lexical richText значении.
 *
 * Lexical хранит дерево узлов: `{ root: { children: [{ children: [{ text: '...' }]}]}}`.
 * Простой обход — собираем все строки `text` и считаем разделённые пробелом токены.
 */
function countLexicalWords(value: unknown): number {
  if (!value || typeof value !== 'object') return 0

  let total = 0

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    const obj = node as Record<string, unknown>
    if (typeof obj.text === 'string') {
      total += obj.text.trim().split(/\s+/).filter(Boolean).length
    }
    if (Array.isArray(obj.children)) {
      for (const child of obj.children) walk(child)
    }
    if (obj.root && typeof obj.root === 'object') walk(obj.root)
  }

  walk(value)
  return total
}

interface PublishGateOptions {
  /** Имя поля с blocks[] в коллекции (обычно 'blocks'). */
  blocksField?: string
  /** Если true — гейт также активен для status === 'published' (Payload drafts). */
  alsoCheckPayloadStatus?: boolean
  /** Минимум слов в text-content для публикации. По умолчанию 300. */
  minWords?: number
}

/**
 * Сборщик publish-gate для коллекций с блочной моделью.
 *
 * Не активируется на draft — только при переводе документа в опубликованный статус
 * (через `publishStatus === 'published'` или Payload `_status === 'published'`).
 */
export function buildPublishGate(options: PublishGateOptions = {}): CollectionBeforeValidateHook {
  const blocksField = options.blocksField ?? 'blocks'
  const minWords = options.minWords ?? 300

  return async ({ data, originalDoc }) => {
    if (!data) return data

    // Активация: либо publishStatus=published (наш ServiceDistricts), либо Payload _status=published.
    const isPublishing =
      data.publishStatus === 'published' ||
      (options.alsoCheckPayloadStatus && data._status === 'published')

    if (!isPublishing) return data

    const blocks = (data[blocksField] ?? originalDoc?.[blocksField] ?? []) as BlockEntry[]

    if (!Array.isArray(blocks) || blocks.length === 0) {
      // Пустой blocks[] не блокируем — коллекция может ещё использовать legacy-поля.
      // Гейт по hero/text/contact срабатывает только если хотя бы один блок есть.
      return data
    }

    const enabled = blocks.filter((b) => b?.enabled !== false)

    // Rule 1: ровно один Hero
    const heroCount = enabled.filter((b) => b.blockType === 'hero').length
    if (heroCount !== 1) {
      throw new Error(publishGateMessages.heroExactlyOne(heroCount))
    }

    // Rule 2: ≥ 1 text-content с body ≥ minWords слов
    const textBlocks = enabled.filter((b) => b.blockType === 'text-content')
    const maxWords = textBlocks.reduce((max, b) => Math.max(max, countLexicalWords(b.body)), 0)
    if (maxWords < minWords) {
      throw new Error(publishGateMessages.textMinWords(maxWords))
    }

    // Rule 3: ≥ 1 контактный блок (lead-form или cta-banner)
    const hasContact = enabled.some(
      (b) => b.blockType === 'lead-form' || b.blockType === 'cta-banner',
    )
    if (!hasContact) {
      throw new Error(publishGateMessages.contactRequired)
    }

    return data
  }
}
