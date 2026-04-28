/**
 * One-shot: генерация логотип-концептов Обихода через fal.ai.
 * Запуск: pnpm tsx --env-file=.env.local scripts/generate-logo-concepts.ts
 *
 * Сохраняет PNG в ../agents/brand/logo/concepts/fal-variants/
 * и печатает манифест (file → prompt). Одноразовый — не встраиваем в основной
 * fal-generate.ts, потому что use-case разовый (Шаг 1 процесса art.md §2.1).
 *
 * Модель: fal-ai/flux/dev — лучше Schnell по качеству и слегка стабильнее
 * с графикой / текстом / иконками. Nano Banana (Google) в fal-ai/client
 * на момент 2026-04 недоступен как прямой endpoint, Flux Dev — лучший
 * доступный компромисс для mock-концептов логотипов.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { falRun, type FalImageResult } from '../lib/fal/client'

const OUT_DIR = resolve(__dirname, '../../agents/brand/logo/concepts/fal-variants')
const MODEL = 'fal-ai/flux/dev'

type Concept = {
  slug: string
  label: string
  direction: 'A' | 'B' | 'A+B'
  prompt: string
}

const NEG =
  'no photorealistic textures, no 3D rendering, no gradients except flat duo-tone, no shadows, no complex background, no noise, no extra text, no signature, no watermark, no pixel art'

const BRAND =
  'brand colors: deep forest green #2d5a3d, cream #f7f5f0, amber accent #e6a23c, ink black #1c1c1c. Flat vector design, clean geometric shapes, high contrast, printable on work uniform and vehicle, professional service brand stamp feel'

const CONCEPTS: Concept[] = [
  // ── Направление A — 4-в-1 штамп ────────────────────────────────────────
  {
    slug: '01-stamp-circular-detailed',
    label: 'A · Circular stamp, 4 service pictograms',
    direction: 'A',
    prompt: `Logo design, circular seal stamp emblem divided into four equal quadrants by a cross, each quadrant contains a minimal line pictogram: top-left a coniferous tree branch, top-right a snowflake, bottom-left a stack of bricks, bottom-right a refuse bin with arrows. Solid deep forest green outline, cream background, thick confident strokes, geometric, clean. ${BRAND}. Single centered logo on plain white canvas, vector flat style. ${NEG}`,
  },
  {
    slug: '02-stamp-mono-engraved',
    label: 'A · Monochrome engraved stamp',
    direction: 'A',
    prompt: `Logo design, round administrative stamp emblem with four quadrants inside, each showing a simple pictogram (pine needles, snowflake, brick, bin). Engraved monochrome style, black ink on cream paper, bold confident lines, old government stamp aesthetic. Single centered logo, vector flat style. ${NEG}`,
  },
  {
    slug: '03-stamp-minimal-geometric',
    label: 'A · Minimal geometric quadrant mark',
    direction: 'A',
    prompt: `Logo design, minimalist circular mark, cross dividing circle into four sectors, each sector contains one very simple geometric glyph representing: triangle tree, six-point snowflake, stacked rectangle bricks, trapezoid container. Very reduced shapes, only straight lines and single curves, deep forest green on cream. ${BRAND}. Single centered logo on plain white background, vector, flat. ${NEG}`,
  },
  {
    slug: '04-stamp-with-wordmark',
    label: 'A · Full horizontal lockup with Cyrillic wordmark',
    direction: 'A',
    prompt: `Horizontal logo lockup. Left: circular stamp emblem with four quadrants containing tree, snowflake, brick and bin pictograms. Right: bold Cyrillic wordmark "ОБИХОД" in heavy geometric sans-serif typography, uppercase, tight letter spacing. Deep forest green on cream, professional service brand. ${BRAND}. Single lockup centered on plain white canvas, vector flat style. ${NEG}`,
  },
  // ── Направление B — кириллическая О ────────────────────────────────────
  {
    slug: '05-monogram-cyrillic-o-plan',
    label: 'B · Cyrillic "О" monogram with inner courtyard plan',
    direction: 'B',
    prompt: `Logo design, large Cyrillic capital letter "О" in bold geometric sans-serif, inside the letter counter there is a minimalist schematic top-down courtyard plan: a cross of two paths dividing a square, four small glyphs at intersections. Deep forest green letter on cream square background with rounded corners. ${BRAND}. Single centered logo on plain white canvas, vector flat. ${NEG}`,
  },
  {
    slug: '06-monogram-o-square-tile',
    label: 'B · "О" in rounded-square tile (favicon-friendly)',
    direction: 'B',
    prompt: `Logo design, rounded square tile six pixel radius filled with deep forest green, centered white bold Cyrillic capital letter "О" in heavy geometric sans-serif font, very high contrast, reads perfectly at 16 pixels. Clean, professional, app-icon style. ${BRAND}. Single tile centered on plain white canvas, vector flat. ${NEG}`,
  },
  // ── Направление A+B — гибрид ───────────────────────────────────────────
  {
    slug: '07-hybrid-o-with-quadrants',
    label: 'A+B · Cyrillic "О" whose counter is divided into 4 service quadrants',
    direction: 'A+B',
    prompt: `Logo design, large Cyrillic capital letter "О" in bold geometric sans-serif, the inner negative space of the letter is divided by a cross into four quadrants, each quadrant contains a tiny pictogram: coniferous branch, snowflake, brick, refuse bin. Deep forest green on cream, reads both as the letter O and as a four-part service stamp. ${BRAND}. Single centered logo on plain white canvas, vector flat style. ${NEG}`,
  },
  {
    slug: '08-hybrid-full-lockup',
    label: 'A+B · Hybrid mark + horizontal wordmark',
    direction: 'A+B',
    prompt: `Horizontal logo lockup. Left: bold Cyrillic letter "О" whose counter is divided into four quadrants with tiny service pictograms inside (pine branch, snowflake, brick, bin). Right: Cyrillic wordmark "ОБИХОД" in matching heavy geometric sans-serif, uppercase. Deep forest green on cream background, balanced composition. ${BRAND}. Single lockup centered on plain white canvas, vector flat style. ${NEG}`,
  },
]

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const manifest: Array<{ file: string; concept: Concept }> = []

  for (const c of CONCEPTS) {
    console.log(`→ ${c.slug} (${c.direction}) ${c.label}`)
    const t0 = Date.now()
    const result = await falRun<FalImageResult>(MODEL, {
      prompt: c.prompt,
      image_size: 'square_hd', // 1024×1024 — удобно для favicon-downscale
      num_inference_steps: 28,
      num_images: 1,
      enable_safety_checker: true,
    })
    const ms = Date.now() - t0
    const img = result.images?.[0]
    if (!img?.url) {
      console.error(`✗ ${c.slug}: no image returned`, result)
      continue
    }
    const file = join(OUT_DIR, `${c.slug}.png`)
    await download(img.url, file)
    console.log(`✓ ${c.slug}: ${file} (${ms}ms)`)
    manifest.push({ file: `${c.slug}.png`, concept: c })
  }

  const manifestPath = join(OUT_DIR, '_manifest.md')
  const lines = [
    '# fal.ai logo concepts — manifest',
    '',
    `_Generated: ${new Date().toISOString()} · model: ${MODEL} · 1024×1024 PNG_`,
    '',
    'Шаг 2 процесса [team/art.md §2.1](../../../../team/art.md). Черновики для обсуждения — **не финал**.',
    '',
    '| File | Direction | Label |',
    '|---|---|---|',
    ...manifest.map((m) => `| \`${m.file}\` | ${m.concept.direction} | ${m.concept.label} |`),
    '',
    '## Prompts',
    '',
    ...manifest.flatMap((m) => [`### ${m.file}`, '', '```', m.concept.prompt, '```', '']),
  ]
  await writeFile(manifestPath, lines.join('\n'))
  console.log(`\n✓ manifest: ${manifestPath}`)
  console.log(`✓ total: ${manifest.length}/${CONCEPTS.length} concepts`)
}

main().catch((err) => {
  console.error('✗ failed:', err)
  process.exit(1)
})
