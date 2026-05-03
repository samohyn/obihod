/**
 * Sec-update Stage 2 W10 + W11 — заменяет TBD-fal.ai placeholder'ы на
 * реальные пути к сгенерированным изображениям (Track B Run 4).
 *
 * Что обновляет:
 *   1) site/content/stage2-w10-sd-batch/*.json (100 SD, кроме _manifest.json):
 *      - heroImageUrl + hero.image.src → /uploads/stage2-w10/sd-<pillar>-<district>-hero.jpg
 *      - mini-case.imageUrl остаётся TBD (defer to W14 cleanup, cost-sensitive)
 *
 *   2) site/content/stage2-w11-cases/*.json (8 cases):
 *      - heroImageUrl + hero.image.src → /uploads/stage2-w11-cases/case-<short-slug>-after.jpg
 *
 *   3) site/content/stage2-w11-b2b/10-kejsy-uk-tszh.json (mini-case refs):
 *      - 4 mini-case items → imageUrl на real cases
 *
 *   4) site/content/stage2-w11-b2b/*.json (PDF → lead-form switch):
 *      - hero CTA с .pdf href → #lead-form anchor + лейбл «Запросить …»
 *      - 4 PDF refs: tarify.pdf, standard-form.pdf, sla.pdf, tender-pack.pdf
 *
 * Cohesion: 4 pillar × 4 districts (16) + 4 avtovyshka × 4 districts (4)
 *           = 20 unique hero shared между sub-сервисами одного pillar.
 *
 * Запуск (idempotent — повторный запуск не ломает):
 *   pnpm tsx scripts/secupdate-stage2-images.ts
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SITE_ROOT = resolve(SCRIPT_DIR, '..')

const W10_DIR = resolve(SITE_ROOT, 'content/stage2-w10-sd-batch')
const W11_CASES_DIR = resolve(SITE_ROOT, 'content/stage2-w11-cases')
const W11_B2B_DIR = resolve(SITE_ROOT, 'content/stage2-w11-b2b')

// ─────────────────────────── W10 SD batch ───────────────────────────
//
// parentSlug → pillar короткий slug для hero filename:
//   vyvoz-musora/<sub>     → vyvoz-musora
//   arboristika/<sub>      → arboristika
//   chistka-krysh/<sub>    → chistka-krysh
//   demontazh/<sub>        → demontazh
//   arenda-tehniki/avtovyshka → avtovyshka

function pillarFromParent(parentSlug: string): string {
  if (parentSlug.startsWith('arenda-tehniki/avtovyshka')) return 'avtovyshka'
  return parentSlug.split('/')[0]
}

function w10HeroPath(pillar: string, districtSlug: string): string {
  return `/uploads/stage2-w10/sd-${pillar}-${districtSlug}-hero.jpg`
}

type SdFixture = {
  parentSlug?: string
  districtSlug?: string
  heroImageUrl?: string
  blocks?: unknown[]
}

function isHeroBlock(b: unknown): b is { blockType: 'hero'; image?: { src?: string } } {
  return typeof b === 'object' && b !== null && (b as { blockType?: unknown }).blockType === 'hero'
}

function updateSdFixture(file: string): { changed: boolean; before: number; after: number } {
  const path = resolve(W10_DIR, file)
  const raw = readFileSync(path, 'utf-8')
  const data = JSON.parse(raw) as SdFixture
  const tbdBefore = (raw.match(/TBD-fal\.ai/g) ?? []).length
  if (!data.parentSlug || !data.districtSlug) {
    return { changed: false, before: tbdBefore, after: tbdBefore }
  }
  const pillar = pillarFromParent(data.parentSlug)
  const heroPath = w10HeroPath(pillar, data.districtSlug)
  data.heroImageUrl = heroPath
  if (Array.isArray(data.blocks)) {
    for (const b of data.blocks) {
      if (isHeroBlock(b) && b.image) {
        b.image.src = heroPath
      }
    }
  }
  const updated = JSON.stringify(data, null, 2) + '\n'
  if (updated === raw) {
    return { changed: false, before: tbdBefore, after: tbdBefore }
  }
  writeFileSync(path, updated)
  const tbdAfter = (updated.match(/TBD-fal\.ai/g) ?? []).length
  return { changed: true, before: tbdBefore, after: tbdAfter }
}

// ────────────────────────── W11 cases ────────────────────────────────
//
// Mapping case file slug → -after.jpg short identifier:
const W11_CASE_AFTER_PATH: Record<string, string> = {
  '01-vyvoz-stroymusora-odincovo-mart':
    '/uploads/stage2-w11-cases/case-stroymusor-odincovo-after.jpg',
  '02-vyvoz-mkd-mytishchi-uk-podpis': '/uploads/stage2-w11-cases/case-uk-mytishchi-after.jpg',
  '03-spil-avariynyy-krasnogorsk': '/uploads/stage2-w11-cases/case-spil-krasnogorsk-after.jpg',
  '04-obrezka-fruktovogo-sada-ramenskoye':
    '/uploads/stage2-w11-cases/case-obrezka-ramenskoye-after.jpg',
  '05-chistka-naledi-mkd-odincovo': '/uploads/stage2-w11-cases/case-naled-odincovo-after.jpg',
  '06-chistka-chastnyy-dom-mytishchi': '/uploads/stage2-w11-cases/case-chistka-mytishchi-after.jpg',
  '07-demontazh-dachi-staraya-krasnogorsk':
    '/uploads/stage2-w11-cases/case-demontazh-dachi-krasnogorsk-after.jpg',
  '08-snos-zabora-zastroyshchik-ramenskoye':
    '/uploads/stage2-w11-cases/case-snos-zabora-ramenskoye-after.jpg',
}

function updateCaseFixture(file: string): { changed: boolean; before: number; after: number } {
  const path = resolve(W11_CASES_DIR, file)
  const raw = readFileSync(path, 'utf-8')
  const data = JSON.parse(raw) as SdFixture
  const tbdBefore = (raw.match(/TBD-fal\.ai/g) ?? []).length
  const key = file.replace(/\.json$/, '')
  const heroPath = W11_CASE_AFTER_PATH[key]
  if (!heroPath) {
    return { changed: false, before: tbdBefore, after: tbdBefore }
  }
  data.heroImageUrl = heroPath
  if (Array.isArray(data.blocks)) {
    for (const b of data.blocks) {
      if (isHeroBlock(b) && b.image) {
        b.image.src = heroPath
      }
    }
  }
  const updated = JSON.stringify(data, null, 2) + '\n'
  if (updated === raw) {
    return { changed: false, before: tbdBefore, after: tbdBefore }
  }
  writeFileSync(path, updated)
  const tbdAfter = (updated.match(/TBD-fal\.ai/g) ?? []).length
  return { changed: true, before: tbdBefore, after: tbdAfter }
}

// ────────────────────────── W11 B2B mini-cases ──────────────────────
//
// 10-kejsy-uk-tszh.json — 4 mini-case items с placeholder href / imageUrl.
// Маппим первые 3 на реальные Run 3 cases (для УК / чистка / снос).
// Четвёртый mini-case — оставляем placeholder (fictional «обрезка ramenskoye»),
// imageUrl ставим на real after-image арбоистики из cases (#04 obrezka).
//
// Формат: items в mini-case блоке. У каждого item — поля title/imageUrl/imageAlt/facts.
// href отсутствует (mini-case в /b2b/kejsy/uk-tszh/ не использует href —
// фактически это «карточки данных», не ссылки). Поэтому добавлять href
// не требуется (см. 09-kejsy-index.json — там ItemWithHref для navigation).
//
// Что обновляем: imageUrl на 4 mini-case → на real -after.jpg cases.

type MiniCaseItem = { imageUrl?: string; title?: string }
type B2bBlock = { blockType?: string; items?: MiniCaseItem[] }

function updateB2bMiniCases(): { changed: boolean; updates: number } {
  const path = resolve(W11_B2B_DIR, '10-kejsy-uk-tszh.json')
  const raw = readFileSync(path, 'utf-8')
  const data = JSON.parse(raw) as { blocks?: B2bBlock[] }
  let updates = 0
  if (Array.isArray(data.blocks)) {
    for (const b of data.blocks) {
      if (b.blockType === 'mini-case' && Array.isArray(b.items)) {
        const refs = [
          '/uploads/stage2-w11-cases/case-uk-mytishchi-after.jpg', // #1 УК Мытищи
          '/uploads/stage2-w11-cases/case-uk-mytishchi-after.jpg', // #2 ТСЖ Одинцово (визуально близко — контейнерная МКД)
          '/uploads/stage2-w11-cases/case-naled-odincovo-after.jpg', // #3 чистка кровель МКД (используем naled)
          '/uploads/stage2-w11-cases/case-obrezka-ramenskoye-after.jpg', // #4 обрезка деревьев МКД
        ]
        for (let i = 0; i < b.items.length && i < refs.length; i++) {
          const item = b.items[i]
          if (item && typeof item.imageUrl === 'string' && item.imageUrl.startsWith('TBD-fal.ai')) {
            item.imageUrl = refs[i]!
            updates++
          }
        }
      }
    }
  }
  if (updates === 0) {
    return { changed: false, updates: 0 }
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
  return { changed: true, updates }
}

// ────────────────────────── W11 B2B PDF → lead-form ────────────────
//
// 4 hero CTA с PDF href меняем на #lead-form (с понятным «Запросить …» label).
// Mailto или sidebar mention сейчас не используются (все 4 — это hero CTA).
// Источник правды brief poseo 2026-05-02: hero CTA → lead-form anchor.

type CtaButton = { label?: string; href?: string }
type HeroBlock = {
  blockType?: string
  ctaPrimary?: CtaButton
  ctaSecondary?: CtaButton
  image?: { src?: string }
}

const PDF_TO_LEAD: Record<string, { label: string }> = {
  '/b2b/uk-tszh/tarify.pdf': { label: 'Запросить тарифы' },
  '/b2b/dogovor/standard-form.pdf': { label: 'Запросить договор' },
  '/b2b/fm-operatoram/sla.pdf': { label: 'Запросить SLA-сетку' },
  '/b2b/goszakaz/tender-pack.pdf': { label: 'Запросить тендерный пакет' },
}

function switchPdfCta(cta: CtaButton | undefined): boolean {
  if (!cta || typeof cta.href !== 'string') return false
  const m = PDF_TO_LEAD[cta.href]
  if (!m) return false
  cta.href = '#lead-form'
  cta.label = m.label
  return true
}

function updateB2bPdfSwitch(): { changed: number; replacements: number } {
  const files = readdirSync(W11_B2B_DIR).filter((f) => f.endsWith('.json'))
  let changed = 0
  let replacements = 0
  for (const f of files) {
    const path = resolve(W11_B2B_DIR, f)
    const raw = readFileSync(path, 'utf-8')
    const data = JSON.parse(raw) as { blocks?: HeroBlock[] }
    let fileReplacements = 0
    if (Array.isArray(data.blocks)) {
      for (const b of data.blocks) {
        if (b.blockType === 'hero') {
          if (switchPdfCta(b.ctaPrimary)) fileReplacements++
          if (switchPdfCta(b.ctaSecondary)) fileReplacements++
        }
      }
    }
    if (fileReplacements > 0) {
      writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
      changed++
      replacements += fileReplacements
    }
  }
  return { changed, replacements }
}

// ────────────────────────── Main ─────────────────────────────────────

function main() {
  console.log('=== Sec-update Stage 2 images ===\n')

  // W10 SD
  const w10Files = readdirSync(W10_DIR).filter((f) => f.endsWith('.json') && f !== '_manifest.json')
  let w10Changed = 0
  let w10TbdBefore = 0
  let w10TbdAfter = 0
  for (const f of w10Files) {
    const r = updateSdFixture(f)
    if (r.changed) w10Changed++
    w10TbdBefore += r.before
    w10TbdAfter += r.after
  }
  console.log(
    `W10 SD: ${w10Changed}/${w10Files.length} updated. TBD-fal.ai: ${w10TbdBefore} → ${w10TbdAfter} (mini-case остаётся TBD).`,
  )

  // W11 cases
  const w11Files = readdirSync(W11_CASES_DIR).filter((f) => f.endsWith('.json'))
  let w11Changed = 0
  let w11TbdBefore = 0
  let w11TbdAfter = 0
  for (const f of w11Files) {
    const r = updateCaseFixture(f)
    if (r.changed) w11Changed++
    w11TbdBefore += r.before
    w11TbdAfter += r.after
  }
  console.log(
    `W11 cases: ${w11Changed}/${w11Files.length} updated. TBD-fal.ai: ${w11TbdBefore} → ${w11TbdAfter}.`,
  )

  // W11 B2B mini-cases
  const b2b = updateB2bMiniCases()
  console.log(`W11 B2B mini-cases (10-kejsy-uk-tszh): ${b2b.updates} mini-case imageUrl replaced.`)

  // W11 B2B PDF → lead-form
  const pdf = updateB2bPdfSwitch()
  console.log(
    `W11 B2B PDF → lead-form: ${pdf.replacements} hero CTA replaced (in ${pdf.changed} files).`,
  )

  console.log('\n=== Done ===')
}

main()
