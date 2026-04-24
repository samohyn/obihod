/**
 * Рендерит финальные PNG-экспорты логотипа Обихода из SVG.
 * Запуск: pnpm tsx scripts/render-logo-exports.ts
 *
 * Источники (SVG master-файлы): ../../agents/brand/logo/*.svg
 * Выходы: превью для ревью + production-ассеты для site/app/.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const LOGO_DIR = resolve(__dirname, '../../agents/brand/logo')
const SITE_APP = resolve(__dirname, '../app')

type Task = { src: string; out: string; size: number; desc: string }

const TASKS: Task[] = [
  // Превью мастер-файлов для обсуждения
  { src: 'master.svg', out: 'master.png', size: 900, desc: 'master preview' },
  { src: 'mark.svg', out: 'mark.png', size: 900, desc: 'mark preview' },
  { src: 'horizontal.svg', out: 'horizontal.png', size: 1200, desc: 'horizontal lockup preview' },
  { src: 'mono.svg', out: 'mono.png', size: 900, desc: 'mono preview' },
  { src: 'inverse.svg', out: 'inverse.png', size: 900, desc: 'inverse preview' },
  { src: 'mark-simple.svg', out: 'mark-simple.png', size: 512, desc: 'simple mark 512px' },

  // Production-ассеты для сайта
  {
    src: 'mark-simple.svg',
    out: 'apple-touch-icon.png',
    size: 180,
    desc: 'apple-touch-icon 180×180',
  },
  { src: 'mark-simple.svg', out: 'icon-192.png', size: 192, desc: 'PWA icon 192' },
  { src: 'mark-simple.svg', out: 'icon-512.png', size: 512, desc: 'PWA icon 512' },
  { src: 'mark.svg', out: 'og-mark.png', size: 1200, desc: 'OG-image mark' },
]

async function main() {
  for (const t of TASKS) {
    const svg = await readFile(resolve(LOGO_DIR, t.src))
    const buf = await sharp(svg, { density: 300 })
      .resize(t.size, t.size, { fit: 'inside' })
      .png()
      .toBuffer()
    const dest = resolve(LOGO_DIR, t.out)
    await writeFile(dest, buf)
    console.log(`✓ ${t.desc}: ${t.out} (${t.size}px)`)
  }

  // Копируем apple-touch-icon и favicon.png в site/app/
  const apple = await readFile(resolve(LOGO_DIR, 'apple-touch-icon.png'))
  await writeFile(resolve(SITE_APP, 'apple-icon.png'), apple)
  console.log(`✓ site/app/apple-icon.png (Next.js 16 convention)`)

  // favicon-replacement — 32×32 PNG (Next.js 16 поддерживает PNG favicon через app/icon.png)
  const fav32 = await sharp(await readFile(resolve(LOGO_DIR, 'mark-simple.svg')), { density: 300 })
    .resize(32, 32, { fit: 'inside' })
    .png()
    .toBuffer()
  await writeFile(resolve(SITE_APP, 'icon.png'), fav32)
  console.log(`✓ site/app/icon.png (32×32, Next.js favicon convention)`)

  console.log('\n✓ Done. Preview files in /agents/brand/logo/, production assets in site/app/')
}

main().catch((err) => {
  console.error('✗ failed:', err)
  process.exit(1)
})
