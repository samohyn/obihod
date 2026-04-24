/**
 * Библиотека блоков US-3 волна 1.
 *
 * Используется в коллекциях через `type: 'blocks'`.
 * Sa-spec §3, §4 (matrix коллекция × разрешённые блоки).
 */
export { Hero } from './Hero'
export { TextContent } from './TextContent'
export { LeadForm } from './LeadForm'
export { CtaBanner } from './CtaBanner'
export { Faq } from './Faq'

import { Hero } from './Hero'
import { TextContent } from './TextContent'
import { LeadForm } from './LeadForm'
import { CtaBanner } from './CtaBanner'
import { Faq } from './Faq'

import type { Block } from 'payload'

/**
 * Полный набор блоков волны 1 (5 из 15 запланированных в sa.md §3).
 *
 * Передаётся в `blocks: [...allBlocks]` коллекции, либо подмножество
 * через matrix-фильтр.
 */
export const allBlocks: Block[] = [Hero, TextContent, LeadForm, CtaBanner, Faq]
